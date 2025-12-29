<script setup lang="ts">
import type { ArticleRowItem } from '@/apis/article'
import { processAvatarUrl, handleAvatarError } from '@/utils/avatar'
import { computed } from 'vue'
// 子组件定义 Props 接收数据
const props = defineProps<{
  article: ArticleRowItem
}>()

// 剥离HTML标签，生成纯文本摘要
const plainContent = computed(() => {
  const content = props.article.content
  // 剥离HTML标签
  return content.replace(/<[^>]+>/g, '')
})
</script>
<template>
  <van-cell :class="['article-item', 'card']" :to="`/article/${article.id}`" clickable>
    <template #title>
      <div class="head">
        <div class="avatar-container">
          <img :src="processAvatarUrl()" alt="" @error="handleAvatarError" />
        </div>
        <div class="con">
          <p class="title van-ellipsis">{{ article.stem }}</p>

          <p class="other">{{ article.creator }} | {{ article.createdAt }}</p>
        </div>
      </div>
    </template>

    <template #label>
      <div class="body">{{ plainContent }}</div>

      <div class="foot">
        <div><van-icon name="like-o" /> {{ article.likeCount }}</div>
        <div><van-icon name="eye-o" /> {{ article.views }}</div>
      </div>
    </template>
  </van-cell>
</template>

<style lang="scss" scoped>
.article-item {
  border-radius: var(--theme-card-radius);
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  transform: translateY(0);

  &:active {
    transform: translateY(2px) scale(0.99);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  }

  .head {
    display: flex;
    align-items: flex-start;
    .avatar-container {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      background-color: var(--theme-divider);
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .con {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      padding-left: 10px;
      p {
        margin: 0;
        line-height: 1.5;
        &.title {
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          max-width: 100%;
          font-weight: 700;
          font-size: 17px;
          color: var(--theme-text-primary);
          line-height: 1.4;
          margin-bottom: 4px;
        }
        &.other {
          font-size: 12px;
          color: var(--theme-text-secondary);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          line-height: 1.2;
        }
      }
    }
  }
  .body {
    font-size: 15px;
    color: var(--theme-text-primary);
    line-height: 1.6;
    margin-top: 10px;
    width: 100%;
    display: -webkit-box;
    display: box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
    hyphens: auto;
  }
  .foot {
    font-size: 12px;
    color: var(--theme-text-secondary);
    margin-top: 12px;
    display: flex;
    align-items: center;
    gap: 30px;

    & > div {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .van-icon {
      font-size: 14px;
    }
  }
}

:deep(.van-cell) {
  border-radius: var(--theme-card-radius);
  padding: 14px;
  background-color: var(--theme-card);
  overflow: hidden;
  border: none;
}

:deep(.van-cell__value) {
  display: none;
}
</style>
