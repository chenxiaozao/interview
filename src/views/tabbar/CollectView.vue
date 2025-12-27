<script setup lang="ts">
import ArticleItem from '@/components/ArticleItem.vue'
import { getArticlesCollectAPI, type ArticleRowItem } from '@/apis/article'
import { ref } from 'vue'

const list = ref<ArticleRowItem[]>([])
const isloading = ref(false)
const isfinished = ref(false)
const page = ref(1)

const getCollectList = async () => {
  // 获取收藏列表API请求
  const res = await getArticlesCollectAPI({ page: page.value })
  if (page.value === 1) {
    // 第一页，替换数据
    list.value = res.data.rows
  } else {
    // 后续页，追加数据
    list.value.push(...res.data.rows)
  }
  // 更新加载状态
  isloading.value = false
  // 更新页码
  page.value++
  // 更新是否加载完成
  if (page.value > res.data.pageTotal) {
    isfinished.value = true
  }
}

getCollectList()
</script>

<template>
  <div class="collect-view">
    <van-nav-bar fixed title="我的收藏" />
    <van-list
      v-model:loading="isloading"
      :finished="isfinished"
      finished-text="没有更多了"
      @load="getCollectList"
    >
      <ArticleItem v-for="item in list" :key="item.id" :article="item" />
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.collect-view {
  margin-bottom: 50px;
  margin-top: 44px;
}
</style>
