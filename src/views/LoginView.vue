<script setup lang="ts">
import { ref } from 'vue'
import { showToast } from 'vant'

// 表单数据
const username = ref('')
const password = ref('')

// 表单校验规则
const usernameRules = [
  { required: true, message: '请输入用户名' },
  { pattern: /\w{5,}/, message: '用户名至少包含5个字符' },
]

const passwordRules = [
  { required: true, message: '请输入密码' },
  { pattern: /\w{6,}/, message: '密码至少包含6个字符' },
]

// 表单提交
const onSubmit = () => {
  console.log('提交登录表单', { username: username.value, password: password.value })
  showToast('登录功能待实现')
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
        :rules="usernameRules"
        autocomplete="username"
      />
      <!-- 密码框 -->
      <van-field
        label="密码"
        placeholder="请输入密码"
        v-model="password"
        type="password"
        name="password"
        :rules="passwordRules"
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
