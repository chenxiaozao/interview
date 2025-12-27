<script setup lang="ts">
import ArticleItem from '@/components/ArticleItem.vue'
import { getArticlesAPI, type ArticleRowItem } from '@/apis/article'
import { ref } from 'vue'

const list = ref<ArticleRowItem[]>([])
const current = ref(1)
const sorter = ref<'weight_desc' | undefined>('weight_desc')
const changSorter = async (value: typeof sorter.value) => {
  sorter.value = value
  current.value = 1
  isFinished.value = false
  isLoading.value = true
  await getArticles()
}
const isLoading = ref(false)
const isFinished = ref(false)

const getArticles = async () => {
  const res = await getArticlesAPI({
    pageSize: 10,
    current: current.value,
    sorter: sorter.value,
  })
  if (current.value === 1) {
    // 如果是第一页，直接赋值
    list.value = res.data.rows
  } else {
    // 如果不是第一页，追加数据
    list.value.push(...res.data.rows)
  }
  // 更新加载标记
  isLoading.value = false
  // 增加页码
  current.value++
  // 判断是否数据已加载完毕
  if (current.value > res.data.pageTotal) {
    isFinished.value = true
  }
}

// 无需主动调用了，van-list 组件会自动加载第一页数据
// getArticles()
</script>

<template>
  <div class="home-view">
    <!-- 顶部导航栏 -->
    <nav class="my-nav van-hairline--bottom">
      <a
        @click="changSorter('weight_desc')"
        :class="{ active: sorter === 'weight_desc' }"
        href="javascript:;"
        >推荐</a
      >
      <a
        @click="changSorter(undefined)"
        :class="{ active: sorter === undefined }"
        href="javascript:;"
        >最新</a
      >
      <div class="logo">
        <h1 class="logo-text">面经</h1>
      </div>
    </nav>

    <!-- 文章列表 -->
    <van-list
      class="article-list"
      v-model:loading="isLoading"
      :finished="isFinished"
      @load="getArticles"
      finished-text="没有更多了"
    >
      <!-- 文章列表项 -->
      <ArticleItem v-for="item in list" :key="item.id" :article="item" />
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
</style>
