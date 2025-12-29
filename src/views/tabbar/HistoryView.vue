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
  <div class="history-page">
    <van-nav-bar left-text="" left-arrow fixed title="最近浏览" />
    <div class="content">
      <div class="header" v-if="historyList.length > 0">
        <span class="title">浏览记录</span>
        <span class="clear" @click="handleClearHistory">清空</span>
      </div>

      <div v-if="loading" class="loading">
        <van-loading type="spinner" size="30px" />
      </div>

      <div v-else-if="historyList.length === 0" class="empty">
        <van-empty description="暂无浏览记录" image-size="100px" />
      </div>

      <div v-else class="history-list">
        <div v-for="item in historyList" :key="item.id" class="history-item">
          <ArticleItem :article="item as ArticleRowItem" />
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
  padding-top: 44px;
  min-height: 100vh;
  background-color: #f8f8f8;

  .content {
    padding: 0 15px;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 0;
    border-bottom: 1px solid #eee;

    .title {
      font-size: 16px;
      font-weight: bold;
    }

    .clear {
      font-size: 14px;
      color: #1989fa;
      cursor: pointer;
    }
  }

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
  }

  .empty {
    padding: 50px 0;
  }

  .history-list {
    .history-item {
      background-color: #fff;
      border-radius: 8px;
      margin-bottom: 10px;
      padding: 10px;

      .history-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid #f0f0f0;

        .view-time {
          font-size: 12px;
          color: #999;
        }

        .delete-btn {
          font-size: 16px;
          color: #999;
          cursor: pointer;

          &:hover {
            color: #ff4444;
          }
        }
      }
    }
  }
}
</style>
