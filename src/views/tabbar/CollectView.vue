<script setup lang="ts">
import ArticleItem from '@/components/ArticleItem.vue'
import { getArticlesCollectAPI, type ArticleRowItem } from '@/apis/article'
import { ref } from 'vue'

const list = ref<ArticleRowItem[]>([])
const isloading = ref(false)
const isfinished = ref(false)
const page = ref(1)

const getCollectList = async () => {
  try {
    const res = await getArticlesCollectAPI({ page: page.value })
    if (page.value === 1) {
      // 如果是第一页，直接赋值
      list.value = res.data.rows
    } else {
      // 如果不是第一页，追加数据并去重
      const existingIds = new Set(list.value.map(item => item.id))
      const uniqueRows = res.data.rows.filter(item => !existingIds.has(item.id))
      list.value.push(...uniqueRows)
    }
    // 更新加载标记
    isloading.value = false
    // 增加页码
    page.value++
    // 判断是否数据已加载完毕
    if (page.value > res.data.pageTotal) {
      isfinished.value = true
    }
  } finally {
    isloading.value = false
  }
}
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
