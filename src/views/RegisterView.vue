<script setup lang="ts">
import { ref } from 'vue'
import { showToast } from 'vant'

// 表单数据
const username = ref('')
const password = ref('')

// 表单校验规则
const usernameRules = [
  { required: true, message: '请填写用户名' },
  { pattern: /^\w{5,}$/, message: '用户名至少包含5个字符' },
]

const passwordRules = [
  { required: true, message: '请填密码' },
  { pattern: /^\w{6,}$/, message: '密码至少包含6个字符' },
]

// 表单提交
const onSubmit = () => {
  console.log('注册信息:', username.value, password.value)
  showToast('注册功能待实现')
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
        :rules="usernameRules"
        name="username"
      />
      <van-field
        v-model="password"
        type="password"
        label="密码"
        placeholder="请输入密码"
        autocomplete="new-password"
        :rules="passwordRules"
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
