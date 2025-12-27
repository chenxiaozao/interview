<script setup lang="ts">
import { registerAPI } from '@/apis/user'
import { showLoadingToast, showSuccessToast } from 'vant'
import { setStorageToken } from '@/utils/storage'
import { ref } from 'vue'

const username = ref('')
const password = ref('')

const onSubmit = async () => {
  // ⏳加载轻提示
  showLoadingToast({
    message: '注册中...',
    forbidClick: true, // 禁用点击
  })

  const res = await registerAPI({
    username: username.value,
    password: password.value,
  })
  setStorageToken(res.data.token)

  // ✅成功轻提示
  showSuccessToast('注册成功')
}
</script>

<template>
  <div class="register-view">
    <!-- 导航栏部分 -->
    <van-nav-bar title="面经注册" />

    <!-- 表单部分 -->
    <van-form @submit="onSubmit">
      <!-- 输入框组件 -->
      <!-- \w 字母数字_  \d 数字0-9 -->
      <van-field
        v-model="username"
        label="用户名"
        placeholder="请输入用户名"
        autocomplete="username"
        :rules="[
          { required: true, message: '请填写用户名' },
          { pattern: /^\w{5,}$/, message: '用户名至少包含5个字符' },
        ]"
        name="username"
      />
      <van-field
        v-model="password"
        type="password"
        label="密码"
        placeholder="请输入密码"
        autocomplete="new-password"
        :rules="[
          { required: true, message: '请填密码' },
          { pattern: /^\w{6,}$/, message: '密码至少包含6个字符' },
        ]"
        name="password"
      />
      <div class="form-button">
        <van-button block type="primary" native-type="submit">注册</van-button>
      </div>
      <div class="tips">
        <router-link class="tips-link" to="/login">有账号，去登录</router-link>
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
