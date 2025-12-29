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
    // 后续页，追加数据并去重
    const existingIds = new Set(list.value.map((item) => item.id))
    const uniqueRows = res.data.rows.filter((item) => !existingIds.has(item.id))
    list.value.push(...uniqueRows)
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
  <div class="like-view page">
    <van-nav-bar fixed title="我的喜欢" />

    <div v-if="isloading && list.length === 0" class="skeleton-container">
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
      finished-text="没有更多了"
      @load="getLikeList"
    >
      <ArticleItem v-for="item in list" :key="item.id" :article="item" class="section" />

      <!-- 空状态 -->
      <div v-if="list.length === 0" class="empty-state">
        <van-empty description="暂无喜欢的内容" image-size="100px" />
      </div>
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
/* 骨架屏样式 */
.skeleton-container {
  padding: 12px 12px 0;
}

.skeleton-item {
  background-color: var(--theme-card);
  border-radius: var(--theme-card-radius);
  padding: 14px;
  box-shadow: var(--theme-shadow);

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

/* 空状态样式 */
.empty-state {
  padding: 40px 0;
  text-align: center;
}
</style>

<style lang="scss" scoped>
.like-view {
  margin-bottom: calc(50px + 16px);
  margin-top: 44px;
}

.article-list {
  padding: 12px 12px 0;
}

.section {
  margin-bottom: 12px;
}
</style>
