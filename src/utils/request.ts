/* 封装axios用于发送请求 */
import axios from 'axios'
import { showFailToast } from 'vant'
import { getStorageToken, removeStorageToken } from './storage'
import router from '@/router/index'

// 创建一个新的axios实例
const request = axios.create({
  baseURL: 'https://interview-api-t.itheima.net/',
  timeout: 20000,
})

// 添加请求拦截器
request.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    const token = getStorageToken()
    if (token) {
      config.headers.Authorization = 'Bearer ' + token
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  },
)

// 添加响应拦截器
request.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    return response.data
  },
  function (error) {
    // 如果有错误响应
    if (error.response) {
      // 401 未登录
      if (error.response.status === 401) {
        // 清除token
        removeStorageToken()
        // 跳转到登录页
        router.push('/login')
        showFailToast('登录过期，请重新登录')
      } else {
        // 提示错误提示
        showFailToast(error.response.data.message)
      }
    }
    // 对响应错误做点什么
    return Promise.reject(error)
  },
)

export default request
