<script setup lang="ts">
import { loginAPI } from '@/apis/user'
import { setStorageToken } from '@/utils/storage'
import { showLoadingToast, showSuccessToast } from 'vant'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// 表单数据
const username = ref('sujiehao')
const password = ref('123456')

// 获取 vue 路由器实例，需要写到 setup 顶级，不能嵌套到其他函数中
const router = useRouter()

// 表单校验规则

// 表单提交
const onSubmit = async () => {
  showLoadingToast({
    message: '登录中...', // 提示文案
    forbidClick: true, // 是否禁止背景点击，防止用户重复登录
  })
  // 调用登录接口
  const res = await loginAPI({
    username: username.value,
    password: password.value,
  })
  // // 登录成功，将 token 持久化存储到本地存储
  // localStorage.setItem('interview-token', res.data.token)
  setStorageToken(res.data.token)
  // 成功轻提示
  showSuccessToast('登录成功')
  // 登录成功后，跳转到首页
  router.push('/home')
}
</script>

<template>
  <div class="login-view">
    <!-- 导航栏 -->
    <van-nav-bar title="面经登录" />
    <!-- 表单 -->
    <van-form @submit="onSubmit">
      <!-- 输入框 -->
      <van-field
        label="用户名"
        placeholder="请输入用户名"
        v-model="username"
        name="username"
        :rules="[
          { required: true, message: '请填写用户名' },
          { pattern: /^\w{5,}$/, message: '用户名至少包含5个字符' },
        ]"
        autocomplete="username"
      />
      <!-- 密码框 -->
      <van-field
        label="密码"
        placeholder="请输入密码"
        v-model="password"
        type="password"
        name="password"
        :rules="[
          { required: true, message: '请填密码' },
          { pattern: /^\w{6,}$/, message: '密码至少包含6个字符' },
        ]"
        autocomplete="current-password"
      />
      <div class="form-button">
        <!-- 登录按钮 -->
        <van-button type="primary" block native-type="submit">登录</van-button>
      </div>
      <div class="tips">
        <!-- 路由跳转组件 -->
        <router-link class="tips-link" to="/register">注册账号</router-link>
      </div>
    </van-form>
  </div>
</template>

<style lang="scss" scoped>
.form-button {
  margin: 16px;
}

.tips {
  text-align: right;
  padding-right: 16px;

  .tips-link {
    font-size: 12px;
    color: #007aff;
  }
}
</style>

