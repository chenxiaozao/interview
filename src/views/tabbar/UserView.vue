<script setup lang="ts">
import { getUserProfileAPI, logoutAPI, type UserProfile } from '@/apis/user'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { showConfirmDialog } from 'vant'
import 'vant/es/dialog/style'
import { processAvatarUrl, handleAvatarError } from '@/utils/avatar'
import { clearUserProfileCache, getCurrentUserId } from '@/utils/user'

const userProfile = ref<UserProfile>()
// 先尝试从localStorage获取初始值
const getInitialDarkMode = async (): Promise<boolean> => {
  try {
    const userId = await getCurrentUserId()
    const savedTheme = localStorage.getItem(`theme:${userId}`)
    return savedTheme === 'dark'
  } catch {
    return false
  }
}
const darkMode = ref<boolean>(false)

// 初始化用户主题设置
const initTheme = async () => {
  const isDarkMode = await getInitialDarkMode()
  darkMode.value = isDarkMode
  // 同时确保document的data-theme属性与darkMode一致
  document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
}

const getUserProfile = async () => {
  const res = await getUserProfileAPI()
  userProfile.value = res.data
}

// 先初始化主题，再获取用户信息
initTheme()
getUserProfile()

const router = useRouter()
const onLogout = async () => {
  try {
    // 二次确认弹窗
    await showConfirmDialog({
      closeOnClickOverlay: true,
      title: '退出登录',
      message: '确定要退出登录吗？',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    })
    await logoutAPI()
    // 退出登录后，清空用户信息
    userProfile.value = undefined
    // 清除用户信息缓存
    clearUserProfileCache()
    // 跳转到登录页
    router.push('/login')
  } catch (err) {
    console.log(err)
  }
}

// 深色模式切换 - 使用watch监听
watch(
  () => darkMode.value,
  async (newValue: boolean) => {
    const theme = newValue ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', theme)
    const userId = await getCurrentUserId()
    localStorage.setItem(`theme:${userId}`, theme)
  },
  { immediate: true },
)
</script>

<template>
  <div class="user-page page">
    <div class="user card">
      <div class="avatar-container">
        <img :src="processAvatarUrl()" alt="" @error="handleAvatarError" />
      </div>
      <h3 class="user-name">{{ userProfile?.name || userProfile?.username }}</h3>
    </div>

    <van-grid clickable :column-num="4" :border="false" class="section">
      <van-grid-item class="grid-item" icon="home-o" text="面经主页" to="/home" />
      <van-grid-item class="grid-item" icon="bookmark-o" text="我的收藏" to="/collect" />
      <van-grid-item class="grid-item" icon="clock-o" text="历史记录" to="/history" />
      <van-grid-item class="grid-item" icon="thumb-circle-o" text="我的点赞" to="/like" />
    </van-grid>

    <van-cell-group class="card section">
      <van-cell class="menu-item" title="推荐分享" is-link />
      <van-cell class="menu-item" title="意见反馈" is-link />
      <van-cell class="menu-item" title="关于我们" is-link />
      <van-cell class="menu-item" title="深色模式">
        <template #right-icon>
          <van-switch v-model="darkMode" size="24px" active-color="var(--theme-primary)" />
        </template>
      </van-cell>
    </van-cell-group>

    <!-- 退出登录按钮 - 危险操作区 -->
    <div class="logout-section section">
      <van-button type="danger" block round @click="onLogout" class="logout-btn"
        >退出登录</van-button
      >
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-page {
  height: 100vh;
  display: flex;
  flex-direction: column;

  .user {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 20px;
    margin-bottom: 12px;

    .avatar-container {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      overflow: hidden;
      background-color: var(--theme-divider);
      margin-bottom: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      border: 3px solid var(--theme-card);

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .user-name {
      margin: 0;
      font-size: 22px;
      font-weight: bold;
      color: var(--theme-text-primary);
    }
  }

  .grid-item {
    &:active {
      transform: scale(0.95);
      opacity: 0.8;
    }
  }

  .menu-item {
    &:active {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }

  :deep(.van-cell-group) {
    background: transparent;

    .van-cell {
      background-color: var(--theme-card);
      border-radius: 18px;
      margin-bottom: 12px;
      overflow: hidden;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  :deep(.van-grid-item__icon) {
    font-size: 32px;
    color: var(--theme-primary);
    margin-bottom: 8px;
  }

  :deep(.van-grid-item__text) {
    font-size: 14px;
    color: var(--theme-text-primary);
    font-weight: 500;
  }

  .logout-section {
    margin-top: 16px;
    padding: 0 12px;

    .logout-btn {
      height: 48px;
      font-size: 16px;
      font-weight: 500;
      border-radius: 12px;
      background-color: #ff4444;
      border: none;
      color: white;
      width: 100%;
      display: block;
      box-shadow: 0 4px 12px rgba(255, 68, 68, 0.3);
      transition: all 0.3s ease;

      &:active {
        transform: scale(0.98);
        opacity: 0.8;
        box-shadow: 0 2px 8px rgba(255, 68, 68, 0.4);
      }
    }
  }
}
</style>
