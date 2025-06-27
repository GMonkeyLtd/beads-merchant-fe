import { useState, useEffect } from 'react'
import { View, Text, Button, Image, ScrollView } from '@tarojs/components'
import Taro, { showToast, showModal } from '@tarojs/taro'
import './index.scss'
import api from '@/utils/api'
import { formatOrderStatus } from '@/utils/status'

interface Order {
  id: string
  orderNo: string
  status: '等待商家' | '匹配中'
  price: number
  createTime: string
  image: string
  description: string
}

interface MaterialItem {
  name: string
  spec: string
  quantity: number
}

export default function GrabOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const loadOrders = async () => {
    setLoading(true)
    try {
      // 模拟API调用
      api.user.getOrderList().then(res => {
        console.log(res.data.orders, 'res.data.orders')
        setOrders(res.data.orders)
      })
    } catch (error) {
      showToast({
        title: '加载失败',
        icon: 'none'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, []);

  const handleGrabOrder = async (order: Order) => {
    const res = await showModal({
      title: '确认抢单',
      content: `确定要抢订单 ${order.orderNo} 吗？`,
      confirmText: '立即抢单',
      cancelText: '取消'
    })
    
    if (res.confirm) {
      try {
        showToast({
          title: '抢单中...',
          icon: 'loading'
        })
        
        // 模拟抢单API调用
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        showToast({
          title: '抢单成功！',
          icon: 'success'
        })
        
        // 移除已抢的订单
        setOrders(prev => prev.filter(item => item.id !== order.id))
        
        // 跳转到订单管理页面
        setTimeout(() => {
          Taro.switchTab({
            url: '/pages/order-management/index'
          })
        }, 1500)
        
      } catch (error) {
        showToast({
          title: '抢单失败，请重试',
          icon: 'none'
        })
      }
    }
  }

  const handleOrderDetail = (order: Order) => {
    setSelectedOrder(order)
    setShowDetailModal(true)
  }

  const handleCloseDetail = () => {
    setShowDetailModal(false)
    setSelectedOrder(null)
  }

  const handleGrabFromDetail = async () => {
    if (selectedOrder) {
      handleCloseDetail()
      await handleGrabOrder(selectedOrder)
    }
  }

  // 模拟材料清单数据
  const getMaterialList = (order: Order): MaterialItem[] => {
    return [
      { name: '水晶弹力线', spec: '透明', quantity: 1 },
      { name: '粉水晶', spec: '8mm', quantity: 12 },
      { name: '海蓝宝', spec: '8mm', quantity: 6 }
    ]
  }

  return (
    <View className="grab-orders-container">
      <View className="header">
        <Text className="header-title">抢单广场</Text>
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
            <Text className="empty-text">暂无可抢订单</Text>
          </View>
        ) : (
          orders.map(order => (
            <View key={order.order_uuid} className="order-card">
              <View className="order-header">
                <View className="order-status">
                  <View className="status-tag">
                    <Text className="status-text">{formatOrderStatus(order.order_status)}</Text>
                  </View>
                  <Text className="order-no">订单号：{order.order_uuid}</Text>
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
              
              <View className="order-actions">
                <Button
                  className="grab-btn"
                  onClick={() => handleGrabOrder(order)}
                >
                  立即抢单
                </Button>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* 明细弹窗 */}
      {showDetailModal && selectedOrder && (
        <View className="detail-modal-overlay" onClick={handleCloseDetail}>
          <View className="detail-modal" onClick={(e) => e.stopPropagation()}>
            {/* 弹窗头部 */}
            <View className="modal-header">
              <View className="order-info-header">
                <Text className="order-number">订单号：{selectedOrder.orderNo}</Text>
                <View className="copy-icon">
                  <Image 
                    className="copy-img"
                    src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEzLjMzMzMgNkgxMkM5LjA1MzMzIDYgNi42NjY2NyA4LjM4NjY3IDYuNjY2NjcgMTEuMzMzM1YxMkM2LjY2NjY3IDEzLjEwNDcgNy4yMjg2NyAxMy42NjY3IDggMTMuNjY2N0gxMy4zMzMzQzE0LjEwNDcgMTMuNjY2NyAxNC42NjY3IDEzLjEwNDcgMTQuNjY2NyAxMlY3LjMzMzMzQzE0LjY2NjcgNi41NjIgMTQuMTA0NyA2IDEzLjMzMzMgNloiIGZpbGw9InJnYmEoMzEsIDIzLCAzNCwgMC40KSIvPgo8cGF0aCBkPSJNMTAuNjY2NyA2VjQuNjY2NjdDMTAuNjY2NyAzLjE5MzkzIDkuNDczMDcgMiA4IDJIMi42NjY2N0MxLjE5MzkzIDIgMCAzLjE5MzkzIDAgNC42NjY2N1YxMEMwIDExLjQ3MzEgMS4xOTM5MyAxMi42NjY3IDIuNjY2NjcgMTIuNjY2N0g0VjExLjMzMzNIMi42NjY2N0MxLjkyOTMzIDExLjMzMzMgMS4zMzMzMyAxMC43MzczIDEuMzMzMzMgMTBWNC42NjY2N0MxLjMzMzMzIDMuOTI5MzMgMS45MjkzMyAzLjMzMzMzIDIuNjY2NjcgMy4zMzMzM0g4QzguNzM3MzMgMy4zMzMzMyA5LjMzMzMzIDMuOTI5MzMgOS4zMzMzMyA0LjY2NjY3VjZIMTAuNjY2N1oiIGZpbGw9InJnYmEoMzEsIDIzLCAzNCwgMC40KSIvPgo8L3N2Zz4K"
                    mode="aspectFit"
                  />
                </View>
              </View>
              <Button className="close-btn" onClick={handleCloseDetail}>
                <View className="close-icon">
                  <View className="close-line close-line-1"></View>
                  <View className="close-line close-line-2"></View>
                </View>
              </Button>
            </View>

            {/* 分割线 */}
            <View className="modal-divider"></View>

            {/* 商品信息 */}
            <View className="product-info">
              <Image 
                className="product-image"
                src={selectedOrder.image}
                mode="aspectFill"
              />
              <View className="product-details">
                <View className="product-name-section">
                  <Text className="product-name">{selectedOrder.description}</Text>
                  <Text className="product-code">NO.0001</Text>
                </View>
                <Text className="product-quantity">数量：24颗</Text>
              </View>
              <View className="budget-section">
                <Text className="budget-text">预算：不限</Text>
              </View>
            </View>

            {/* 材料清单 */}
            <View className="material-list">
              <View className="material-header">
                <Text className="header-name">名称</Text>
                <Text className="header-spec">尺寸/规格</Text>
                <Text className="header-quantity">数量</Text>
              </View>
              <View className="material-items">
                {getMaterialList(selectedOrder).map((item, index) => (
                  <View 
                    key={index} 
                    className={`material-item ${index % 2 === 0 ? 'even' : 'odd'}`}
                  >
                    <Text className="item-name">{item.name}</Text>
                    <Text className="item-spec">{item.spec}</Text>
                    <Text className="item-quantity">x{item.quantity}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* 分割线 */}
            <View className="modal-divider"></View>

            {/* 抢单按钮 */}
            <Button className="grab-btn-modal" onClick={handleGrabFromDetail}>
              立即抢单
            </Button>
          </View>
        </View>
      )}
    </View>
  )
} 