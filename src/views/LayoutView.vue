<template>
  <div class="layout-page">
    <!-- 二级路由视口，这里加载 children 配置的路由 -->
    <router-view />
    <!-- van-tabbar 添加 route 属性开启路由切换模式 -->
    <van-tabbar route class="douyin-tabbar">
      <!-- to 跳转页面 -->
      <van-tabbar-item icon="notes-o" to="/home">面经</van-tabbar-item>
      <van-tabbar-item icon="star-o" to="/collect">收藏</van-tabbar-item>
      <van-tabbar-item icon="clock-o" to="/history">历史</van-tabbar-item>
      <van-tabbar-item icon="like-o" to="/like">喜欢</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/user">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<style lang="scss" scoped>
.layout-page {
  position: relative;
  min-height: 100vh;
  padding-bottom: 50px;
}

.douyin-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background-color: var(--theme-card);
  border-top: 1px solid var(--theme-divider);
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  z-index: 999;
  
  // 抖音风格的TabBar样式
  .van-tabbar-item {
    &.van-tabbar-item--active {
      .van-tabbar-item__icon {
        transform: scale(1.1);
        transition: transform 0.2s ease;
      }
      .van-tabbar-item__text {
        color: var(--theme-primary);
        font-weight: 700;
      }
    }
    
    .van-tabbar-item__icon {
      font-size: 22px;
      margin-bottom: 2px;
    }
    
    .van-tabbar-item__text {
      font-size: 11px;
      color: var(--theme-text-secondary);
      transition: color 0.2s ease;
    }
  }
}
</style>
