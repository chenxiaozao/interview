<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { getHistory, clearHistory, removeHistoryById, type HistoryItem } from '@/utils/history'
import { showSuccessToast, showConfirmDialog } from 'vant'
import ArticleItem from '@/components/ArticleItem.vue'
import type { ArticleRowItem } from '@/apis/article'

// 历史记录列表
const historyList = ref<HistoryItem[]>([])
// 加载状态
const loading = ref(false)

// 获取历史记录
const loadHistory = async () => {
  loading.value = true
  try {
    // 从localStorage获取历史记录
    historyList.value = await getHistory()
  } catch (error) {
    console.error('加载历史记录失败:', error)
  } finally {
    loading.value = false
  }
}

// 清空历史记录
const handleClearHistory = () => {
  showConfirmDialog({
    title: '确认清空',
    message: '确定要清空所有浏览历史吗？',
  })
    .then(async () => {
      // 确认清空
      await clearHistory()
      historyList.value = []
      showSuccessToast('历史记录已清空')
    })
    .catch(() => {
      // 取消操作
    })
}

// 删除单条历史记录
const handleRemoveHistory = async (id: string) => {
  await removeHistoryById(id)
  // 更新本地列表
  historyList.value = historyList.value.filter((item) => item.id !== id)
  showSuccessToast('已删除')
}

// 格式化时间
const formatTime = (timeString: string) => {
  const date = new Date(timeString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) {
    return '刚刚'
  } else if (diffMins < 60) {
    return `${diffMins}分钟前`
  } else if (diffHours < 24) {
    return `${diffHours}小时前`
  } else {
    return `${diffDays}天前`
  }
}

// 页面加载时获取历史记录
onMounted(() => {
  loadHistory()
})
</script>

<template>
  <div class="history-page page">
    <van-nav-bar fixed title="最近浏览" />
    <div class="content">
      <div class="header card" v-if="historyList.length > 0">
        <span class="title">浏览记录</span>
        <van-button size="small" type="primary" round @click="handleClearHistory">清空</van-button>
      </div>

      <div v-if="loading && historyList.length === 0" class="skeleton-container">
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

      <div v-else-if="historyList.length === 0" class="empty">
        <van-empty description="暂无浏览记录" image-size="100px" />
      </div>

      <div v-else class="history-list">
        <div v-for="item in historyList" :key="item.id" class="history-item">
          <ArticleItem :article="item as ArticleRowItem" class="section" />
          <div class="history-info">
            <span class="view-time">{{ formatTime(item.viewedAt) }}</span>
            <van-icon name="delete-o" class="delete-btn" @click="handleRemoveHistory(item.id)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.history-page {
  margin-bottom: calc(50px + 16px);
  margin-top: 44px;
  min-height: calc(100vh - 44px - 50px - 16px);
  background-color: var(--theme-background);

  .content {
    padding: 12px 12px 0;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    margin-bottom: 16px;
    border-bottom: 1px solid var(--theme-divider);

    .title {
      font-size: 16px;
      font-weight: bold;
      color: var(--theme-text-primary);
    }
  }

  /* 骨架屏样式 */
  .skeleton-container {
    padding: 0;
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

  .empty {
    padding: 50px 0;
  }

  .history-list {
    .history-item {
      margin-bottom: 12px;

      .history-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid var(--theme-divider);

        .view-time {
          font-size: 12px;
          color: var(--theme-text-secondary);
        }

        .delete-btn {
          font-size: 16px;
          color: var(--theme-text-secondary);
          cursor: pointer;

          &:active {
            color: var(--theme-primary);
            transform: scale(0.95);
            transition: all 0.1s;
          }
        }
      }
    }
  }
}
</style>
