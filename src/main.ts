import { createApp } from 'vue'
import { createPinia } from 'pinia'

import 'vant/es/toast/style'

import App from './App.vue'
import router from './router'
import { getCurrentUserId } from './utils/user'

const app = createApp(App)

// 初始化主题
const initTheme = async () => {
  try {
    const userId = await getCurrentUserId()
    const theme = localStorage.getItem(`theme:${userId}`) || 'light'
    document.documentElement.setAttribute('data-theme', theme)
  } catch {
    // 如果获取用户ID失败，使用默认主题
    const theme = localStorage.getItem('theme') || 'light'
    document.documentElement.setAttribute('data-theme', theme)
  }
}

// 应用主题初始化
initTheme()

app.use(createPinia())

app.use(router)

app.mount('#app')
