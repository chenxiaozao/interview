/**
 * 头像URL处理工具函数
 * - 将HTTP URL转换为HTTPS
 * - 提供本地默认头像作为回退
 */

// 默认头像路径
export const DEFAULT_AVATAR = import.meta.env.BASE_URL + '1.png'

/**
 * 处理头像URL，始终返回默认头像
 * @returns 默认头像URL
 */
export const processAvatarUrl = (): string => {
  // 始终返回默认头像
  return DEFAULT_AVATAR
}

/**
 * 处理头像加载错误的函数
 * @param event 图片加载错误事件
 */
export const handleAvatarError = (event: Event): void => {
  const target = event.target as HTMLImageElement
  if (target.src !== DEFAULT_AVATAR) {
    target.src = DEFAULT_AVATAR
  }
}
