<script setup lang="ts"></script>

<template>
  <!-- 路由视图 -->
  <router-view />
</template>

<!-- /* style 注意这里不能用 scoped */ -->
<style>
/* 亮色主题 */
html[data-theme='light'] {
  /* 自定义主题变量 */
  --theme-primary: #fe2c55;
  --theme-background: #f6f7f9;
  --theme-card: #fff;
  --theme-text-primary: #111;
  --theme-text-secondary: #8a8f98;
  --theme-divider: #eee;
  --theme-card-radius: 18px;
  --theme-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  /* 覆盖 Vant 变量 */
  --van-primary-color: var(--theme-primary);
  --van-text-color: var(--theme-text-primary);
  --van-text-color-2: var(--theme-text-secondary);
  --van-background: var(--theme-background);
  --van-background-2: var(--theme-card);
  --van-border-color: var(--theme-divider);
  --van-nav-bar-background: var(--theme-card);
  --van-nav-bar-title-color: var(--theme-text-primary);
  --van-nav-bar-text-color: var(--theme-text-primary);
  --van-nav-bar-arrow-color: var(--theme-text-primary);
  --van-list-background: var(--theme-background);
  --van-cell-background: var(--theme-card);
}

/* 暗色主题 */
html[data-theme='dark'] {
  /* 自定义主题变量 */
  --theme-primary: #fe2c55;
  --theme-background: #0b0b0f;
  --theme-card: #15161a;
  --theme-text-primary: #f5f5f7;
  --theme-text-secondary: #9aa0a6;
  --theme-divider: #2a2b31;
  --theme-card-radius: 18px;
  --theme-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

  /* 覆盖 Vant 变量 */
  --van-primary-color: var(--theme-primary);
  --van-text-color: var(--theme-text-primary);
  --van-text-color-2: var(--theme-text-secondary);
  --van-background: var(--theme-background);
  --van-background-2: var(--theme-card);
  --van-border-color: var(--theme-divider);
  --van-popup-background: var(--theme-card);
  --van-cell-background: var(--theme-card);
  --van-nav-bar-background: var(--theme-card);
  --van-nav-bar-title-color: var(--theme-text-primary);
  --van-nav-bar-text-color: var(--theme-text-primary);
  --van-nav-bar-arrow-color: var(--theme-text-primary);
  --van-button-background: var(--theme-card);
  --van-list-background: var(--theme-background);
  --van-empty-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><circle cx="60" cy="60" r="50" fill="%232a2b31"/><text x="60" y="65" font-size="20" text-anchor="middle" fill="%239aa0a6">空</text></svg>');
}

/* 全局导航栏样式 */
.van-nav-bar {
  border-radius: 0;
  box-shadow: none;
  border-bottom: 1px solid var(--theme-divider);
}

/* 确保深色模式下导航栏没有圆角 */
html[data-theme='dark'] .van-nav-bar {
  border-bottom-color: var(--theme-divider);
}

/* 全局溢出控制 */
html,
body {
  width: 100%;
  overflow-x: hidden;
}

#app {
  max-width: 480px;
  margin: 0 auto;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
}

/* 全局通用样式 */
.page {
  background-color: var(--theme-background);
  padding: 16px;
  min-height: 100vh;
}

.card {
  background-color: var(--theme-card);
  border-radius: var(--theme-card-radius);
  overflow: hidden;
  box-shadow: var(--theme-shadow);
  transition: all 0.3s ease;
  border: none;
}

.section {
  margin-bottom: 16px;
}

/* 微交互效果 */
.logout-btn:active,
.van-button:active {
  transform: scale(0.98);
  transition: transform 0.1s;
}
</style>
