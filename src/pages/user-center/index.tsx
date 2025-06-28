import { useState, useEffect } from 'react'
import { View, Text, Button, Image } from '@tarojs/components'
import Taro, { showToast, showModal } from '@tarojs/taro'
import logo from '@/assets/icons/logo.svg'
import './index.scss'
import api from '@/utils/api'

interface UserInfo {
  name: string
  phone: string
  avatar: string
  balance: number
  token: string
}

export default function UserCenter() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadUserInfo()
  }, [])

  const loadUserInfo = async () => {
    try {
      const storedUserInfo = Taro.getStorageSync('userInfo')
      if (storedUserInfo) {
        api.user.getMerchantInfo().then((res: any) => {
          if (res.code === 200) {
            setUserInfo(res.data)
          }
        })  
      } else {
        // 如果没有用户信息，跳转到登录页
        Taro.navigateTo({
          url: '/pages/login/index'
        })
      }
    } catch (error) {
      showToast({
        title: '加载用户信息失败',
        icon: 'none'
      })
    }
  }

  const handleWechatPay = () => {
    showModal({
      title: '微信支付',
      content: '即将跳转到微信支付页面',
      confirmText: '确定',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          showToast({
            title: '功能开发中...',
            icon: 'none'
          })
        }
      }
    })
  }


  const handleEditProfile = () => {
    showToast({
      title: '功能开发中...',
      icon: 'none'
    })
  }

  const handleLogout = async () => {
    const res = await showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      confirmText: '退出',
      cancelText: '取消'
    })
    
    if (res.confirm) {
      try {
        // 清除存储的用户信息
        Taro.removeStorageSync('userInfo')
        Taro.removeStorageSync('isLoggedIn')
        
        showToast({
          title: '已退出登录',
          icon: 'success'
        })
        
        // 跳转到登录页
        setTimeout(() => {
          Taro.navigateTo({
            url: '/pages/login/index'
          })
        }, 1500)
        
      } catch (error) {
        showToast({
          title: '退出失败',
          icon: 'none'
        })
      }
    }
  }

  const handleOrderHistory = () => {
    Taro.switchTab({
      url: '/pages/order-management/index'
    })
  }

  const handleSettings = () => {
    showToast({
      title: '功能开发中...',
      icon: 'none'
    })
  }

  if (!userInfo) {
    return (
      <View className="profile-container">
        <View className="loading-state">
          <Text className="loading-text">加载中...</Text>
        </View>
      </View>
    )
  }

  return (
    <View className="profile-container">
      <View className="profile-header">
        <View className="user-info">
          <View 
            className="avatar"
            style={{ width: '60px', height: '60px',fontSize: '24px',fontWeight: 'bold',color: '#ffffff',display: 'flex',alignItems: 'center',justifyContent: 'center',borderRadius: '50%' }}
          >
            {userInfo.merchant_name?.slice(0, 1) || "商家"}
          </View>
          <View className="user-details">
            <Text className="user-name">{userInfo.merchant_name}</Text>
            <Text className="user-phone">{userInfo.phone}</Text>
          </View>
          {/* <Button 
            className="edit-btn"
            size="mini"
            onClick={handleEditProfile}
          >
            编辑
          </Button> */}
        </View>
      </View>
      
      <View className="balance-section">
        <View className="balance-card">
          <View className="balance-info">
            <Text className="balance-label">账户余额</Text>
            <Text className="balance-amount">¥{userInfo.balance.toFixed(2)}</Text>
          </View>
          
        </View>
        
        <Button 
          className="wechat-pay-btn"
          onClick={handleWechatPay}
        >
          <Text className="wechat-icon">💳</Text>
          <Text className="wechat-text">微信支付</Text>
        </Button>
      </View>
      
      {/* <View className="menu-section">
        <View className="menu-item" onClick={handleOrderHistory}>
          <View className="menu-info">
            <Text className="menu-icon">📋</Text>
            <Text className="menu-text">订单历史</Text>
          </View>
          <Text className="menu-arrow">›</Text>
        </View>
        
        <View className="menu-item" onClick={handleSettings}>
          <View className="menu-info">
            <Text className="menu-icon">⚙️</Text>
            <Text className="menu-text">设置</Text>
          </View>
          <Text className="menu-arrow">›</Text>
        </View>
        
        <View className="menu-item" onClick={handleLogout}>
          <View className="menu-info">
            <Text className="menu-icon">🚪</Text>
            <Text className="menu-text">退出登录</Text>
          </View>
          <Text className="menu-arrow">›</Text>
        </View>
      </View> */}
    </View>
  )
} 