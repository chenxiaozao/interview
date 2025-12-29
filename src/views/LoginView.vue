<script setup lang="ts">
import { loginAPI } from '@/apis/user'
import { setStorageToken } from '@/utils/storage'
import { showLoadingToast, showSuccessToast } from 'vant'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// 表单数据
const username = ref('chenxiaozao')
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
  <div class="login-view page">
    <!-- 品牌区域 -->
    <div class="brand-section">
      <div class="brand-icon">
        <span class="icon-heart"></span>
      </div>
      <h1 class="brand-title">面经</h1>
      <p class="brand-subtitle">发现更好的自己</p>
    </div>

    <!-- 表单 -->
    <van-form @submit="onSubmit" class="login-form card">
      <!-- 输入框 -->
      <van-field
        placeholder="请输入用户名"
        v-model="username"
        name="username"
        :rules="[
          { required: true, message: '请填写用户名' },
          { pattern: /^\w{5,}$/, message: '用户名至少包含5个字符' },
        ]"
        autocomplete="username"
        class="form-field"
      />
      <!-- 密码框 -->
      <van-field
        placeholder="请输入密码"
        v-model="password"
        type="password"
        name="password"
        :rules="[
          { required: true, message: '请填密码' },
          { pattern: /^\w{6,}$/, message: '密码至少包含6个字符' },
        ]"
        autocomplete="current-password"
        class="form-field"
      />
      <div class="form-button">
        <!-- 登录按钮 -->
        <van-button type="primary" block round native-type="submit" class="submit-btn"
          >登录</van-button
        >
      </div>
    </van-form>

    <div class="tips">
      <!-- 路由跳转组件 -->
      <router-link class="tips-link" to="/register">注册账号</router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 80px;
  min-height: 100vh;

  .brand-section {
    text-align: center;
    margin-bottom: 50px;
    padding: 0 20px;

    .brand-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 20px;
      background: linear-gradient(45deg, var(--theme-primary), #ff6b8b);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 24px rgba(254, 44, 85, 0.4);
      animation: pulse 2s infinite;

      .icon-heart {
        font-size: 40px;
        color: white;
        animation: beat 1.5s ease-in-out infinite;
      }
    }

    .brand-title {
      font-size: 44px;
      font-weight: bold;
      color: var(--theme-primary);
      margin: 0;
      text-shadow: 0 2px 8px rgba(254, 44, 85, 0.3);
    }

    .brand-subtitle {
      font-size: 16px;
      color: var(--theme-text-secondary);
      margin-top: 12px;
      font-weight: 500;
    }
  }

  .login-form {
    width: 100%;
    max-width: 400px;
    padding: 32px 24px;
    border-radius: 24px;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
  }

  .form-field {
    margin-bottom: 20px;

    :deep(.van-field__control) {
      font-size: 16px;
      padding: 12px 0;
    }

    :deep(.van-field__input-wrapper) {
      background-color: transparent;
    }

    :deep(.van-cell) {
      border-radius: 12px;
      background-color: rgba(0, 0, 0, 0.03);
      padding: 8px 12px;
    }
  }

  .form-button {
    margin: 32px 0 0 0;
  }

  .submit-btn {
    height: 50px;
    font-size: 17px;
    font-weight: bold;
    border-radius: 25px;
    background: linear-gradient(45deg, var(--theme-primary), #ff6b8b);
    border: none;
    box-shadow: 0 4px 16px rgba(254, 44, 85, 0.4);

    &:active {
      transform: scale(0.96);
      box-shadow: 0 2px 8px rgba(254, 44, 85, 0.3);
    }
  }

  .tips {
    text-align: center;
    margin-top: 28px;

    .tips-link {
      font-size: 15px;
      color: var(--theme-primary);
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 16px;

      &:active {
        background-color: rgba(254, 44, 85, 0.1);
      }
    }
  }
}

// 动画效果
@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.9;
  }
}

@keyframes beat {
  0%,
  100% {
    transform: scale(1);
  }
  14% {
    transform: scale(1.1);
  }
  28% {
    transform: scale(1);
  }
  42% {
    transform: scale(1.1);
  }
  70% {
    transform: scale(1);
  }
}
</style>
