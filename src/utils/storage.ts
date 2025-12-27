// token 持久化存储的标识
const TOKEN_KEY = 'interview_token'

// 存储 token
export const setStorageToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token)
}

// 获取 token
export const getStorageToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY)
}

// 移除 token
export const removeStorageToken = (): void => {
  localStorage.removeItem(TOKEN_KEY)
}
