<script setup lang="ts">
import ArticleItem from '@/components/ArticleItem.vue'
import { getArticlesAPI, type ArticleRowItem } from '@/apis/article'
import { ref, computed } from 'vue'
import { showToast } from 'vant'

const list = ref<ArticleRowItem[]>([])
const current = ref(1)
// 从localStorage获取保存的排序状态
const savedSorter = localStorage.getItem('home_sorter')
const sorter = ref<'weight_desc' | undefined>(
  savedSorter === 'undefined'
    ? undefined
    : (savedSorter as 'weight_desc' | undefined) || 'weight_desc',
)
const isloading = ref(false)
const isfinished = ref(false)
const isFirstLoading = ref(true)

// 请求ID，用于确保只有最新的请求结果才会更新UI
let currentRequestId = 0

// 解析createdAt日期，兼容Safari浏览器
const parseCreatedAt = (dateStr: string): number => {
  try {
    // 将YYYY-MM-DD HH:mm:ss格式转换为YYYY/MM/DD HH:mm:ss格式，兼容Safari
    const safariCompatibleDate = dateStr.replace(/-/g, '/')
    return Date.parse(safariCompatibleDate)
  } catch (error) {
    console.error('Failed to parse createdAt:', error)
    return 0
  }
}

// 计算显示列表：最新tab时对已加载数据按createdAt倒序排序
const displayList = computed(() => {
  if (sorter.value === undefined) {
    // 最新tab：对list进行排序，不修改原数组
    return [...list.value].sort((a, b) => {
      const timeA = parseCreatedAt(a.createdAt)
      const timeB = parseCreatedAt(b.createdAt)
      return timeB - timeA // 倒序排列
    })
  }
  // 推荐tab：直接返回原列表（服务端排序）
  return list.value
})

const changSorter = async (value: typeof sorter.value) => {
  // ✅ 点同一个tab不重复请求
  if (sorter.value === value) return

  sorter.value = value
  // 保存排序状态到localStorage
  localStorage.setItem('home_sorter', value === undefined ? 'undefined' : value)
  current.value = 1
  isfinished.value = false
  list.value = []

  // ✅ 让在途请求“过期”
  currentRequestId++

  // ✅ 平滑滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })

  // ✅ 显示切换提示
  showToast(value === 'weight_desc' ? '已切换到推荐' : '已切换到最新')

  // ✅ 这里可以手动置 loading，让 UI 立即反馈（van-list 不一定会立刻触发）
  isloading.value = true
  await getArticles()
}

const getArticles = async () => {
  // ✅ van-list 触发 @load 时会先把 isloading 设为 true
  // 所以这里不要用 “if (isloading) return” 去拦截，否则会死锁
  if (isfinished.value) {
    isloading.value = false
    return
  }

  // ✅ 锁定本次请求的页码和排序，避免 await 后状态变了
  const reqPage = current.value
  const reqSorter = sorter.value

  const requestId = ++currentRequestId

  try {
    // ✅ 关键：严格实现 sorter “传/不传”
    // 最新：params 里根本不出现 sorter 字段
    const params: { pageSize: number; current: number; sorter?: 'weight_desc' } = {
      pageSize: 10,
      current: reqPage,
    }
    if (reqSorter) params.sorter = reqSorter

    const res = await getArticlesAPI(params)

    // ✅ 过期响应丢弃（切换tab时防覆盖）
    if (requestId !== currentRequestId) return

    const rows = res.data.rows ?? []
    const pageTotal = res.data.pageTotal ?? 0

    if (reqPage === 1) {
      list.value = rows
      isFirstLoading.value = false
    } else {
      list.value.push(...rows)
    }

    // ✅ finished / 下一页用 reqPage 计算，别用 await 后的 current.value
    if (reqPage >= pageTotal) {
      isfinished.value = true
    } else {
      current.value = reqPage + 1
    }
  } catch (error) {
    console.error('获取文章列表失败:', error)
  } finally {
    // ✅ 只有最新请求才关闭 loading，避免旧请求把 loading 关掉导致抖动
    if (requestId === currentRequestId) {
      isloading.value = false
    }
  }
}

// 页面初始化时主动加载数据
getArticles()
</script>

<template>
  <div class="home-view page">
    <nav class="my-nav van-hairline--bottom card">
      <span @click="changSorter('weight_desc')" :class="{ active: sorter === 'weight_desc' }">
        推荐
      </span>
      <span @click="changSorter(undefined)" :class="{ active: sorter === undefined }"> 最新 </span>

      <div class="logo">
        <h1 class="logo-text">面经</h1>
      </div>
    </nav>

    <div v-if="isFirstLoading" class="skeleton-container">
      <div v-for="i in 3" :key="i" class="skeleton-item section">
        <div class="head">
          <div class="avatar skeleton"></div>
          <div class="con">
            <div class="title skeleton"></div>
            <div class="other skeleton"></div>
          </div>
        </div>
        <div class="body">
          <div class="line skeleton"></div>
          <div class="line skeleton"></div>
        </div>
        <div class="foot">
          <div class="skeleton"></div>
          <div class="skeleton"></div>
        </div>
      </div>
    </div>

    <van-list
      v-else
      class="article-list"
      v-model:loading="isloading"
      :finished="isfinished"
      @load="getArticles"
      finished-text="没有更多了"
    >
      <ArticleItem v-for="item in displayList" :key="item.id" :article="item" class="section" />
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.home-view {
  margin-bottom: calc(50px + 16px);
  margin-top: 44px;
  .my-nav {
    height: 44px;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 999;
    background: var(--theme-card);
    display: flex;
    align-items: center;
    border-radius: 0;
    overflow: hidden;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);

    > span {
      color: var(--theme-text-secondary);
      font-size: 16px;
      font-weight: 600;
      line-height: 44px;
      margin-left: 20px;
      position: relative;
      transition: all 0.3s;
      cursor: pointer;
      padding: 0 8px;
      border-radius: 0;
      &:active {
        transform: scale(0.95);
        opacity: 0.8;
      }
      &::after {
        content: '';
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 8px;
        width: 0;
        height: 3px;
        background: var(--theme-primary);
        border-radius: 2px;
        transition: all 0.3s;
      }
      &.active {
        color: var(--theme-primary);
        &::after {
          width: 24px;
        }
      }
    }

    .logo {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      .logo-text {
        font-size: 20px;
        font-weight: bold;
        color: var(--theme-primary);
        margin-right: 20px;
        line-height: 44px;
      }
    }
  }

  /* 深色模式下移除导航栏圆角 */
  :global(html[data-theme='dark']) .my-nav {
    border-radius: 0;
  }
}

.article-list {
  padding: 12px 12px 0;
}

.section {
  margin-bottom: 12px;
}

/* 骨架屏样式 */
.skeleton-container {
  padding: 12px 12px 0;
}

.skeleton-item {
  background-color: var(--theme-card);
  border-radius: var(--theme-card-radius);
  padding: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  .head {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 10px;
    }

    .con {
      flex: 1;

      .title {
        width: 70%;
        height: 16px;
        border-radius: 4px;
        margin-bottom: 8px;
      }

      .other {
        width: 40%;
        height: 12px;
        border-radius: 4px;
      }
    }
  }

  .body {
    margin-bottom: 10px;

    .line {
      width: 100%;
      height: 14px;
      border-radius: 4px;
      margin-bottom: 8px;

      &:last-child {
        width: 80%;
      }
    }
  }

  .foot {
    display: flex;
    gap: 20px;

    div {
      width: 40px;
      height: 12px;
      border-radius: 4px;
    }
  }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--theme-divider) 25%,
    var(--theme-background) 50%,
    var(--theme-divider) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
