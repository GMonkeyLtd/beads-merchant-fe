import { PropsWithChildren } from 'react'
import Taro, { useLaunch } from '@tarojs/taro'

import './app.scss'

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log('App launched.')
    
    // 检查登录状态
    const isLoggedIn = Taro.getStorageSync('isLoggedIn')
    const userInfo = Taro.getStorageSync('userInfo')
    
    if (!isLoggedIn || !userInfo) {
      // 如果未登录，跳转到登录页
      Taro.navigateTo({
        url: '/pages/login/index'
      })
    }
  })

  // children 是将要会渲染的页面
  return children
}
  


export default App
