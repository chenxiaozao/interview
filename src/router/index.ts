import { createRouter, createWebHistory } from 'vue-router'
import { getStorageToken } from '@/utils/storage'
import ArticleView from '@/views/ArticleView.vue'
import LayoutView from '@/views/LayoutView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import HomeView from '@/views/tabbar/HomeView.vue'
import CollectView from '@/views/tabbar/CollectView.vue'
import LikeView from '@/views/tabbar/LikeView.vue'
import UserView from '@/views/tabbar/UserView.vue'

const whiteList = ['/login', '/register']
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: LoginView,
      meta: {
        title: '面经登录',
      },
    },
    {
      path: '/register',
      component: RegisterView,
      meta: {
        title: '面经注册',
      },
    },
    {
      path: '/article/:id',
      component: ArticleView,
      meta: {
        title: '文章详情',
      },
    },
    {
      path: '/',
      component: LayoutView,
      redirect: '/home', // 重定向
      // 二级路由
      children: [
        {
          path: 'home',
          component: HomeView,
          meta: {
            title: '面经首页',
          },
        },
        {
          path: 'collect',
          component: CollectView,
          meta: {
            title: '面经收藏',
          },
        },
        {
          path: 'like',
          component: LikeView,
          meta: {
            title: '面经点赞',
          },
        },
        {
          path: 'user',
          component: UserView,
          meta: {
            title: '我的',
          },
        },
      ],
    },
  ],
})
// 前置导航守卫
router.beforeEach((to) => {
  if (to.meta.title) {
    document.title = to.meta.title + ' | 面经'
  }
  const token = getStorageToken()
  if (token) {
    return true
  } else {
    if (whiteList.includes(to.path)) {
      return true
    } else {
      return '/login'
    }
  }
})
export default router
