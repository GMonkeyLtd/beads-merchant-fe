import { useState, useEffect } from 'react'
import { View, Text, Button, Image, ScrollView } from '@tarojs/components'
import Taro, { showToast, showModal, makePhoneCall } from '@tarojs/taro'
import './index.scss'

interface Order {
  id: string
  orderNo: string
  status: '已接单' | '已完成' | '已取消'
  price: number
  createTime: string
  image: string
  userPhone: string
  description: string
}

type TabType = '进行中' | '已完成' | '已取消'

export default function OrderManagement() {
  const [activeTab, setActiveTab] = useState<TabType>('进行中')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadOrders()
  }, [activeTab])

  const loadOrders = async () => {
    setLoading(true)
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const mockOrders: Order[] = [
        {
          id: '1',
          orderNo: 'ADX2333',
          status: '已接单',
          price: 299.00,
          createTime: '2025-04-08 14:27:39',
          image: 'https://via.placeholder.com/80x80',
          userPhone: '13812345678',
          description: '**** 121 231'
        },
        {
          id: '2',
          orderNo: 'ADX2334',
          status: '已接单',
          price: 199.00,
          createTime: '2025-04-08 14:30:15',
          image: 'https://via.placeholder.com/80x80',
          userPhone: '13987654321',
          description: '**** xaasd12'
        }
      ]
      
      // 根据当前标签过滤订单
      const filteredOrders = mockOrders.filter(order => {
        if (activeTab === '进行中') return order.status === '已接单'
        if (activeTab === '已完成') return order.status === '已完成'
        if (activeTab === '已取消') return order.status === '已取消'
        return false
      })
      
      setOrders(filteredOrders)
    } catch (error) {
      showToast({
        title: '加载失败',
        icon: 'none'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCallUser = async (phone: string) => {
    try {
      await makePhoneCall({
        phoneNumber: phone
      })
    } catch (error) {
      showToast({
        title: '拨号失败',
        icon: 'none'
      })
    }
  }

  const handleAddWechat = (order: Order) => {
    showModal({
      title: '添加微信',
      content: `请添加用户微信：${order.description}`,
      showCancel: false
    })
  }

  const handleCancelOrder = async (order: Order) => {
    const res = await showModal({
      title: '确认退单',
      content: `确定要退订单 ${order.orderNo} 吗？`,
      confirmText: '确认退单',
      cancelText: '取消'
    })
    
    if (res.confirm) {
      try {
        showToast({
          title: '退单中...',
          icon: 'loading'
        })
        
        // 模拟退单API调用
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        showToast({
          title: '退单成功',
          icon: 'success'
        })
        
        // 更新订单状态
        setOrders(prev => prev.map(item => 
          item.id === order.id 
            ? { ...item, status: '已取消' as const }
            : item
        ))
        
        // 如果当前在进行中标签，移除该订单
        if (activeTab === '进行中') {
          setOrders(prev => prev.filter(item => item.id !== order.id))
        }
        
      } catch (error) {
        showToast({
          title: '退单失败，请重试',
          icon: 'none'
        })
      }
    }
  }

  const handleCompleteOrder = async (order: Order) => {
    const res = await showModal({
      title: '确认完成',
      content: `确定完成订单 ${order.orderNo} 吗？`,
      confirmText: '确认完成',
      cancelText: '取消'
    })
    
    if (res.confirm) {
      try {
        showToast({
          title: '处理中...',
          icon: 'loading'
        })
        
        // 模拟完成订单API调用
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        showToast({
          title: '订单已完成',
          icon: 'success'
        })
        
        // 更新订单状态
        setOrders(prev => prev.map(item => 
          item.id === order.id 
            ? { ...item, status: '已完成' as const }
            : item
        ))
        
        // 如果当前在进行中标签，移除该订单
        if (activeTab === '进行中') {
          setOrders(prev => prev.filter(item => item.id !== order.id))
        }
        
      } catch (error) {
        showToast({
          title: '操作失败，请重试',
          icon: 'none'
        })
      }
    }
  }

  const handleOrderDetail = (order: Order) => {
    showModal({
      title: '订单详情',
      content: `订单号：${order.orderNo}\n金额：¥${order.price}\n时间：${order.createTime}\n用户：${order.description}`,
      showCancel: false
    })
  }

  return (
    <View className="order-management-container">
      <View className="tabs-container">
        {(['进行中', '已完成', '已取消'] as TabType[]).map(tab => (
          <View
            key={tab}
            className={`tab-item ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            <Text className="tab-text">{tab}</Text>
          </View>
        ))}
      </View>
      
      <ScrollView
        className="orders-list"
        scrollY
        refresherEnabled
        refresherTriggered={loading}
        onRefresherRefresh={loadOrders}
      >
        {orders.length === 0 && !loading ? (
          <View className="empty-state">
            <Text className="empty-text">暂无{activeTab}订单</Text>
          </View>
        ) : (
          orders.map(order => (
            <View key={order.id} className="order-card">
              <View className="order-header">
                <View className="order-status">
                  <View className="status-tag">
                    <Text className="status-text">{order.status}</Text>
                  </View>
                  <Text className="order-no">订单号：{order.orderNo}</Text>
                </View>
                <Button 
                  className="detail-btn"
                  size="mini"
                  onClick={() => handleOrderDetail(order)}
                >
                  明细
                </Button>
              </View>
              
              <View className="order-content">
                <View className="order-info">
                  <Image 
                    className="order-image"
                    src={order.image}
                    mode="aspectFill"
                  />
                  <View className="order-details">
                    <Text className="order-desc">{order.description}</Text>
                    <Text className="order-time">{order.createTime}</Text>
                  </View>
                </View>
                <Text className="order-price">¥{order.price.toFixed(2)}</Text>
              </View>
              
              <View className="order-divider"></View>
              
              {activeTab === '进行中' && (
                <View className="order-actions">
                  <View className="action-buttons">
                    <Button
                      className="call-btn"
                      onClick={() => handleCallUser(order.userPhone)}
                    >
                      📞 联系用户
                    </Button>
                    <Button
                      className="cancel-btn"
                      onClick={() => handleCancelOrder(order)}
                    >
                      退单
                    </Button>
                  </View>
                  <Button
                    className="complete-btn"
                    onClick={() => handleCompleteOrder(order)}
                  >
                    完成订单
                  </Button>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  )
} 