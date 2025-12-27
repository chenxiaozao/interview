import request from '@/utils/request'

// 获取面经列表参数
export interface ArticlesParams {
  current?: number
  keyWord?: string
  pageSize?: number
  sorter?: string
  stem?: string
}

// 通用服务器返回格式
export interface ServiceResponse<T> {
  code: number
  message: string
  data: T // T 表示变化的类型(泛型)
}

// 获取面经列表返回数据
export interface ArticlesResponse {
  current: number
  pageSize: number
  pageTotal: number
  rows: ArticleRowItem[] // 文章列表
  total: number
}

// 文章列表项
export interface ArticleRowItem {
  id: string
  avatar: string
  collectFlag: number
  content: string
  createdAt: string
  creator: string
  likeCount: number
  likeFlag: number
  stem: string
  views: number
}

// 获取面经列表
export const getArticlesAPI = (
  params: ArticlesParams,
): Promise<ServiceResponse<ArticlesResponse>> => {
  return request.get('/h5/interview/query', {
    params: {
      current: params.current || 1, // 当前页
      pageSize: params.pageSize || 10, // 每页条数
      sorter: params.sorter, // 排序字段 =>  传"weight_desc" 获取 推荐， "不传" 获取 最新
    },
  })
}

export const getArticleDetailAPI = (id: string): Promise<ServiceResponse<ArticleRowItem>> => {
  return request.get('h5/interview/show', {
    params: {
      id: id,
    },
  })
}

export const updateLikeAPI = (id: string) => {
  return request.post('h5/interview/opt', {
    id: id,
    optType: 1,
  })
}

export const updateCollectAPI = (id: string) => {
  return request.post('h5/interview/opt', {
    id: id,
    optType: 2,
  })
}

// 获取操作列表参数
export interface OptListParams {
  page?: number
  pageSize?: number
  optType?: number
}

// 获取操作列表返回数据
export interface OptListResponse {
  rows: ArticleRowItem[]
  pageTotal: number
  total: number
}

// 获取喜欢列表
export const getArticlesLikeAPI = (
  params: OptListParams,
): Promise<ServiceResponse<OptListResponse>> => {
  return request.get('/h5/interview/opt/list', {
    params: {
      page: params.page, // 当前页
      pageSize: params.pageSize || 5, // 可选
      optType: 1, // 表示喜欢
    },
  })
}

// 获取收藏列表
export const getArticlesCollectAPI = (
  params: OptListParams,
): Promise<ServiceResponse<OptListResponse>> => {
  return request.get('/h5/interview/opt/list', {
    params: {
      page: params.page || 1, // 当前页
      pageSize: params.pageSize || 5, // 每页条数
      optType: 2, // 操作类型: 1->点赞, 2->收藏
    },
  })
}
