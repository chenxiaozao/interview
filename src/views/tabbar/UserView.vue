<script setup lang="ts">
import { getUserProfileAPI, logoutAPI, type UserProfile } from '@/apis/user'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showConfirmDialog } from 'vant'
import 'vant/es/dialog/style'

const userProfile = ref<UserProfile>()

const getUserProfile = async () => {
  const res = await getUserProfileAPI()
  userProfile.value = res.data
}

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
    // 跳转到登录页
    router.push('/login')
  } catch (err) {
    console.log(err)
  }
}
</script>

<template>
  <div class="user-page">
    <div class="user">
      <img
        :src="
          userProfile?.avatar ||
          'http://teachoss.itheima.net/heimaQuestionMiniapp/官方默认头像%402x.png'
        "
        alt=""
      />
      <h3>{{ userProfile?.name || userProfile?.username }}</h3>
    </div>

    <van-grid clickable :column-num="3" :border="false">
      <van-grid-item icon="clock-o" text="历史记录" to="/" />
      <van-grid-item icon="bookmark-o" text="我的收藏" to="/collect" />
      <van-grid-item icon="thumb-circle-o" text="我的点赞" to="/like" />
    </van-grid>

    <van-cell-group class="mt20">
      <van-cell title="推荐分享" is-link />
      <van-cell title="意见反馈" is-link />
      <van-cell title="关于我们" is-link />
      <van-cell @click="onLogout" title="退出登录" is-link />
    </van-cell-group>
  </div>
</template>

<style lang="scss" scoped>
.user-page {
  padding: 0 10px;
  background: #f5f5f5;
  height: 100vh;
  .mt20 {
    margin-top: 20px;
  }
  .user {
    display: flex;
    padding: 20px 0;
    align-items: center;
    img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      overflow: hidden;
    }
    h3 {
      margin: 0;
      padding-left: 20px;
      font-size: 18px;
    }
  }
}
</style>
