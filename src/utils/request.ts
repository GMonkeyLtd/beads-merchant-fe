import Taro from '@tarojs/taro'

// 定义请求配置接口
export interface RequestConfig {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  data?: any
  header?: Record<string, string>
  timeout?: number
  showLoading?: boolean
  loadingText?: string
  showError?: boolean
  skipAuth?: boolean // 是否跳过认证检查
}

// 定义响应数据接口
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  success: boolean
}

// 默认配置
const defaultConfig = {
  baseURL: '', // 在这里设置你的API基础URL
  timeout: 600000,
  showLoading: false,
  loadingText: '加载中...',
  showError: true,
  isMock: false
}

// 请求拦截器 - 在发送请求前的处理
const requestInterceptor = async (config: RequestConfig) => {
  // 添加通用headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...config.header,
  }

  return {
    ...config,
    header: headers,
    url: defaultConfig.baseURL + config.url,
  }
}

// 响应拦截器 - 处理响应数据
const responseInterceptor = <T>(response: any): Promise<T> => {
  return new Promise((resolve, reject) => {
    const { statusCode, data } = response

    // HTTP状态码检查
    if (statusCode === 200) {
    
        // 没有业务状态码，直接返回data
        resolve(data.data || data)
    } else {
      // 其他HTTP错误
      let errorMessage = '网络请求失败'
      switch (statusCode) {
        case 400:
          errorMessage = '请求参数错误'
          break
        case 403:
          errorMessage = '无权限访问'
          break
        case 404:
          errorMessage = '请求的资源不存在'
          break
        case 500:
          errorMessage = '服务器内部错误'
          break
        case 503:
          errorMessage = '服务暂不可用'
          break
      }
      reject(new Error(errorMessage))
    }
  })
}

// 核心请求函数
const request = async <T = any>(config: RequestConfig): Promise<T> => {
  let retryCount = 0;
  const maxRetries = 1; // 最多重试1次（用于token过期后重新登录）
  const executeRequest = async (): Promise<T> => {
    // 请求前拦截处理
    const finalConfig = await requestInterceptor(config)

    // 显示加载提示
    if (config.showLoading !== false) {
      Taro.showLoading({
        title: config.loadingText || defaultConfig.loadingText,
        mask: true,
      })
    }

    try {
      const response = await Taro.request({
        url: finalConfig.url,
        method: finalConfig.method || 'GET',
        data: finalConfig.data,
        header: finalConfig.header,
        timeout: finalConfig.timeout || defaultConfig.timeout,
      })

      // 隐藏加载提示
      if (config.showLoading !== false) {
        Taro.hideLoading()
      }

      return await responseInterceptor<T>(response)
    } catch (error: any) {
      // 隐藏加载提示
      if (config.showLoading !== false) {
        Taro.hideLoading()
      }

      // 显示错误提示
      if (config.showError !== false) {
        Taro.showToast({
          title: '出错啦～' + JSON.stringify(error),
          icon: 'none',
          duration: 5000,
        })
      }

      throw JSON.stringify(error)+ finalConfig.url
    }
  }
  return await executeRequest();
}

// 封装常用的HTTP方法
export const http = {
  // GET请求
  get: <T = any>(url: string, params?: any, config?: Partial<RequestConfig>): Promise<T> => {
    return request<T>({
      url: params ? `${url}?${new URLSearchParams(params).toString()}` : url,
      method: 'GET',
      ...config,
    })
  },

  // POST请求
  post: <T = any>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<T> => {
    return request<T>({
      url,
      method: 'POST',
      data,
      ...config,
    })
  },

  // PUT请求
  put: <T = any>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<T> => {
    return request<T>({
      url,
      method: 'PUT',
      data,
      ...config,
    })
  },

  // DELETE请求
  delete: <T = any>(url: string, config?: Partial<RequestConfig>): Promise<T> => {
    return request<T>({
      url,
      method: 'DELETE',
      ...config,
    })
  },

  // PATCH请求
  patch: <T = any>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<T> => {
    return request<T>({
      url,
      method: 'PATCH',
      data,
      ...config,
    })
  }
}

// 设置基础URL
export const setBaseURL = (baseURL: string) => {
  defaultConfig.baseURL = baseURL
}

export const setIsMock = (isMock: boolean) => {
  defaultConfig.isMock = isMock
}

// 设置默认配置
export const setDefaultConfig = (config: Partial<typeof defaultConfig>) => {
  Object.assign(defaultConfig, config)
}

// 导出核心请求函数，用于特殊场景
export { request }

// 默认导出
export default http
