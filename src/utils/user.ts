/**
 * 用户相关工具函数
 */
import { getUserProfileAPI, type UserProfile } from '@/apis/user'
import { getStorageToken } from './storage'

// 用户信息缓存
let userProfileCache: UserProfile | null = null

/**
 * 获取当前用户ID
 * @returns 用户ID，如果未登录返回'guest'
 */
export const getCurrentUserId = async (): Promise<string> => {
  // 如果有缓存的用户信息，直接返回
  if (userProfileCache) {
    return userProfileCache.id
  }

  // 检查是否有登录token
  const token = getStorageToken()
  if (!token) {
    // 未登录用户使用guest
    return 'guest'
  }

  try {
    // 获取用户信息
    const res = await getUserProfileAPI()
    userProfileCache = res.data
    return userProfileCache.id
  } catch (error) {
    console.error('获取用户信息失败:', error)
    // 获取失败时使用guest
    return 'guest'
  }
}

/**
 * 清除用户信息缓存
 * 用于登出等场景
 */
export const clearUserProfileCache = (): void => {
  userProfileCache = null
}
