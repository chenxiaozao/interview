<script lang="ts" setup>
import {
  getArticleDetailAPI,
  updateCollectAPI,
  updateLikeAPI,
  type ArticleRowItem,
} from '@/apis/article'
import { showSuccessToast, showToast } from 'vant'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { processAvatarUrl, handleAvatarError } from '@/utils/avatar'
import { addHistory } from '@/utils/history'
// 获取页面路由
const route = useRoute()
// 获取路由参数 id
const id = route.params.id
// 文章详情
const article = ref<ArticleRowItem>()

// 获取文章详情
const getArticleDetail = async () => {
  // 调用获取文章详情接口
  const res = await getArticleDetailAPI(id as string)
  // 保存文章数据
  article.value = res.data
  // 添加到浏览历史
  if (res.data) {
    await addHistory(res.data)
  }
}

getArticleDetail()

const toggleLike = async () => {
  if (!article.value) return
  article.value.likeFlag = article.value.likeFlag === 1 ? 0 : 1
  await updateLikeAPI(article.value.id)
  if (article.value.likeFlag) {
    article.value.likeCount++
    showSuccessToast('点赞成功')
  } else {
    article.value.likeCount--
    showToast('取消点赞')
  }
}

const toggleCollect = async () => {
  if (!article.value) return
  article.value.collectFlag = article.value.collectFlag === 1 ? 0 : 1
  await updateCollectAPI(article.value.id)
  if (article.value.collectFlag === 1) {
    showSuccessToast('收藏成功')
  } else {
    showToast('取消收藏')
  }
}
</script>

<template>
  <div class="detail-page">
    <van-nav-bar left-text="返回" left-arrow @click-left="$router.back()" fixed title="面经详情" />
    <header class="header">
      <h1 class="article-title">{{ article?.stem }}</h1>
      <p>
        {{ article?.createdAt }} | {{ article?.views }} 浏览量 | {{ article?.likeCount }} 点赞数
      </p>
      <p>
        <img :src="processAvatarUrl()" alt="" @error="handleAvatarError" />
        <span>{{ article?.creator }}</span>
      </p>
    </header>

    <main class="body" v-html="article?.content"></main>

    <div class="opt">
      <van-icon
        @click="toggleCollect"
        :class="{ active: article?.collectFlag === 1 }"
        name="star-o"
      />
      <van-icon @click="toggleLike" :class="{ active: article?.likeFlag === 1 }" name="like-o" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.detail-page {
  margin-top: 44px;
  padding: 0 15px;
  background-color: var(--theme-background);
  min-height: 100vh;
  color: var(--theme-text-primary);

  // 确保v-html内容也有正确的背景色
  .body {
    background-color: var(--theme-background);

    // 确保v-html中的所有元素都继承正确的文本颜色
    * {
      color: var(--theme-text-primary) !important;
    }
  }
  .header {
    .article-title {
      font-size: 24px;
      display: block;
      max-width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: var(--theme-text-primary);
      font-weight: bold;
    }
    p {
      color: var(--theme-text-secondary);
      font-size: 12px;
      display: flex;
      align-items: center;
    }
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
    }
  }
  .body {
    font-size: 16px;
    line-height: 1.8;
    margin-top: 15px;
    margin-bottom: 100px;
    color: var(--theme-text-primary);

    /* 确保v-html内容中的文本也有合适的对比度 */
    * {
      color: inherit;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      color: var(--theme-text-primary);
      margin: 16px 0;
    }

    p {
      margin: 12px 0;
    }

    a {
      color: var(--theme-primary);
    }
  }

  .opt {
    position: fixed;
    bottom: 100px;
    right: 0;
    > .van-icon {
      margin-right: 20px;
      background: var(--theme-card);
      width: 40px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      border-radius: 50%;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      font-size: 18px;
      color: var(--theme-text-primary);
      &.active {
        background: #fec635;
        color: #fff;
      }
    }
  }
}
</style>
