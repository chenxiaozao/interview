import request from '@/utils/request'

// 3. 请求参数： username 和 password
interface RegisterData {
  username: string
  password: string
}

// 定义后端响应类型
interface ServiceLoginResponse {
  code: number
  message: string
  data: LoginResponse // 注意: data 嵌套 LoginResponse
}

// 登录接口核心数据
interface LoginResponse {
  token: string
  currentAuthority: string
  status: string
  type: string
}

// 用户信息接口
export interface UserProfile {
  id: string
  username: string
  name: string | null
  avatar: string
  createdAt: string
  updatedAt: string
}

// 通用服务器返回格式
interface ServiceResponse<T> {
  code: number
  message: string
  data: T
}

// 注册接口
export const registerAPI = (data: RegisterData) => {
  // 1. 请求方式： post
  // 2. 请求地址： /h5/user/register
  return request.post('/h5/user/register', data)
}

// 登录接口
export const loginAPI = (data: RegisterData): Promise<ServiceLoginResponse> => {
  // 1. 请求方式： post
  // 2. 请求地址： /h5/user/login
  return request.post('/h5/user/login', data)
}

// 获取用户信息
export const getUserProfileAPI = (): Promise<ServiceResponse<UserProfile>> => {
  return request.get('/h5/user/currentUser')
}

// 退出登录接口
export const logoutAPI = () => {
  return request.get('/h5/user/logout')
}
