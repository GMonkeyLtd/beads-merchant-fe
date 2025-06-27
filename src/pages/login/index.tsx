import { useState } from 'react'
import { View, Input, Button, Text, Image } from '@tarojs/components'
import Taro, { navigateTo, showToast } from '@tarojs/taro'
import Logo from '@/assets/icons/logo.svg'
import { Header } from '../../components'
import './index.scss'

export default function Login() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!phone) {
      showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return
    }
    
    if (!password) {
      showToast({
        title: '请输入密码',
        icon: 'none'
      })
      return
    }

    const phoneReg = /^1[3-9]\d{9}$/
    if (!phoneReg.test(phone)) {
      showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return
    }

    setLoading(true)
    
    try {
      // 模拟登录API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 保存登录状态
      const userInfo = {
        phone,
        token: 'mock_token_' + Date.now(),
        name: '商家用户',
        avatar: '',
        balance: 1580.50
      }
      
      // 存储用户信息
      Taro.setStorageSync('userInfo', userInfo)
      Taro.setStorageSync('isLoggedIn', true)
      
      showToast({
        title: '登录成功',
        icon: 'success'
      })
      
      // 跳转到抢单广场
      setTimeout(() => {
        navigateTo({
          url: '/pages/grab-orders/index'
        })
      }, 1500)
      
    } catch (error) {
      showToast({
        title: '登录失败，请重试',
        icon: 'none'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="login-page">
    <Header title="商家管理后台" />
    <View className="login-container">
      <View className="login-header">
        <Text className="login-title">商家管理后台</Text>
        <Text className="login-subtitle">请使用手机号登录</Text>
      </View>
      
      <View className="login-form">
        <View className="form-item">
          <Input
            className="form-input"
            type="number"
            placeholder="请输入手机号"
            value={phone}
            onInput={(e) => setPhone(e.detail.value)}
            maxlength={11}
          />
        </View>
        
        <View className="form-item">
          <Input
            className="form-input"
            password
            placeholder="请输入密码"
            value={password}
            onInput={(e) => setPassword(e.detail.value)}
          />
        </View>
        
        <Button
          className="login-btn"
          onClick={handleLogin}
          loading={loading}
          disabled={loading}
        >
          {loading ? '登录中...' : '登录'}
        </Button>
      </View>
      
      <View className="login-footer">
        <Text className="footer-text">没有账号？请联系管理员注册</Text>
      </View>
    </View>
    </View>
  )
} 
