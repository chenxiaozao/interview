<script setup lang="ts">
import ArticleItem from '@/components/ArticleItem.vue'
import { getArticlesLikeAPI, type ArticleRowItem } from '@/apis/article'
import { ref } from 'vue'

const list = ref<ArticleRowItem[]>([])
const isloading = ref(false)
const isfinished = ref(false)
const page = ref(1)

const getLikeList = async () => {
  // 获取喜欢列表API请求
  const res = await getArticlesLikeAPI({ page: page.value })
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

getLikeList()
</script>

<template>
  <div class="like-view">
    <van-nav-bar fixed title="我的喜欢" />
    <van-list
      v-model:loading="isloading"
      :finished="isfinished"
      finished-text="没有更多了"
      @load="getLikeList"
    >
      <ArticleItem v-for="item in list" :key="item.id" :article="item" />
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.like-view {
  margin-bottom: 50px;
  margin-top: 44px;
}
</style>
