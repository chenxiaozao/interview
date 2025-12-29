/**
 * 历史记录管理工具
 */
import type { ArticleRowItem } from '@/apis/article'
import { getCurrentUserId } from './user'

// 历史记录存储键名前缀
const HISTORY_KEY_PREFIX = 'interview_history'
// 历史记录最大条数
const HISTORY_MAX_SIZE = 30

// 带浏览时间的历史记录项类型
export interface HistoryItem extends ArticleRowItem {
  viewedAt: string
}

/**
 * 获取历史记录存储键名（带用户ID）
 * @returns 带用户ID的存储键名
 */
const getHistoryKey = async (): Promise<string> => {
  const userId = await getCurrentUserId()
  return `${HISTORY_KEY_PREFIX}:${userId}`
}

/**
 * 添加文章到历史记录
 * @param article 文章数据
 */
export const addHistory = async (article: ArticleRowItem): Promise<void> => {
  try {
    // 获取现有历史记录
    const history = await getHistory()
    
    // 按id去重，将新记录移到最前面
    const filteredHistory = history.filter(item => item.id !== article.id)
    
    // 创建新的历史记录项，添加浏览时间
    const newHistoryItem: HistoryItem = {
      ...article,
      viewedAt: new Date().toISOString()
    }
    
    // 添加到历史记录开头
    filteredHistory.unshift(newHistoryItem)
    
    // 限制历史记录数量
    const limitedHistory = filteredHistory.slice(0, HISTORY_MAX_SIZE)
    
    // 保存到localStorage
    const key = await getHistoryKey()
    localStorage.setItem(key, JSON.stringify(limitedHistory))
  } catch (error) {
    console.error('保存历史记录失败:', error)
  }
}

/**
 * 获取所有历史记录
 * @returns 历史记录数组
 */
export const getHistory = async (): Promise<HistoryItem[]> => {
  try {
    const key = await getHistoryKey()
    const historyJson = localStorage.getItem(key)
    return historyJson ? JSON.parse(historyJson) : []
  } catch (error) {
    console.error('获取历史记录失败:', error)
    return []
  }
}

/**
 * 清空历史记录
 */
export const clearHistory = async (): Promise<void> => {
  try {
    const key = await getHistoryKey()
    localStorage.removeItem(key)
  } catch (error) {
    console.error('清空历史记录失败:', error)
  }
}

/**
 * 根据id删除历史记录
 * @param id 文章id
 */
export const removeHistoryById = async (id: string): Promise<void> => {
  try {
    const history = await getHistory()
    const filteredHistory = history.filter(item => item.id !== id)
    const key = await getHistoryKey()
    localStorage.setItem(key, JSON.stringify(filteredHistory))
  } catch (error) {
    console.error('删除历史记录失败:', error)
  }
}
