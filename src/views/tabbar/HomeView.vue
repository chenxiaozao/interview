<script setup lang="ts">
import ArticleItem from '@/components/ArticleItem.vue'
import { getArticlesAPI, type ArticleRowItem } from '@/apis/article'
import { ref, computed } from 'vue'
import { showToast } from 'vant'

const list = ref<ArticleRowItem[]>([])
const current = ref(1)
const sorter = ref<'weight_desc' | undefined>('weight_desc')
const isloading = ref(false)
const isfinished = ref(false)

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

    if (reqPage === 1) list.value = rows
    else list.value.push(...rows)

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
</script>

<template>
  <div class="home-view">
    <nav class="my-nav van-hairline--bottom">
      <a
        href="#"
        @click.prevent="changSorter('weight_desc')"
        :class="{ active: sorter === 'weight_desc' }"
      >
        推荐
      </a>
      <a href="#" @click.prevent="changSorter(undefined)" :class="{ active: sorter === undefined }">
        最新
      </a>

      <div class="logo">
        <h1 class="logo-text">面经</h1>
      </div>
    </nav>

    <van-list
      class="article-list"
      v-model:loading="isloading"
      :finished="isfinished"
      @load="getArticles"
      finished-text="没有更多了"
    >
      <!-- 最新tab提示文案 -->
      <div v-if="sorter === undefined" class="latest-tip">按发布时间排序（基于已加载数据）</div>
      <ArticleItem v-for="item in displayList" :key="item.id" :article="item" />
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.home-view {
  margin-bottom: 50px;
  margin-top: 44px;
  .my-nav {
    height: 44px;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 999;
    background: #fff;
    display: flex;
    align-items: center;
    > a {
      color: #999;
      font-size: 14px;
      line-height: 44px;
      margin-left: 20px;
      position: relative;
      transition: all 0.3s;
      &::after {
        content: '';
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 0;
        width: 0;
        height: 2px;
        background: #222;
        transition: all 0.3s;
      }
      &.active {
        color: #222;
        &::after {
          width: 14px;
        }
      }
    }
    .logo {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      .logo-text {
        font-size: 18px;
        font-weight: bold;
        color: var(--van-primary-color);
        margin-right: 16px;
        line-height: 44px;
      }
    }
  }
}

.article-item {
  .head {
    display: flex;
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
    }
    .con {
      flex: 1;
      overflow: hidden;
      padding-left: 10px;
      p {
        margin: 0;
        line-height: 1.5;
        &.title {
          width: 280px;
        }
        &.other {
          font-size: 10px;
          color: #999;
        }
      }
    }
  }
  .body {
    font-size: 14px;
    color: #666;
    line-height: 1.6;
    margin-top: 10px;
  }
  .foot {
    font-size: 12px;
    color: #999;
    margin-top: 10px;
  }
}
.latest-tip {
  padding: 12px;
  background-color: #f5f7fa;
  color: #646566;
  font-size: 12px;
  text-align: center;
  border-radius: 4px;
  margin: 12px;
}
</style>
