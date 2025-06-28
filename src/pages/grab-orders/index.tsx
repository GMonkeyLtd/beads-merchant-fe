import { useState, useEffect } from "react";
import { View, Text, Button, Image, ScrollView } from "@tarojs/components";
import Taro, { showToast, showModal } from "@tarojs/taro";
import api from "@/utils/api";
import { formatOrderStatus, OrderStatus } from "@/utils/status";
import { Header, OrderList } from "@/components";
import type { Order as OrderListOrder, DesignInfo } from "@/components";
import "./index.scss";

interface Order {
  id: string;
  orderNo: string;
  status: "等待商家" | "匹配中";
  price: number;
  createTime: string;
  image: string;
  userPhone: string;
  description: string;
  designInfo?: DesignInfo;
}

export default function GrabOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      api.user.getOrderList().then((res: any) => {
        console.log(res.data.orders, "res.data.orders");
        const orderList = res.data.orders
          ?.filter((item) => item.order_status === OrderStatus.Dispatching)
          ?.map((item) => {
            return {
              id: item.order_uuid,
              orderNo: item.order_uuid,
              status: item.order_status,
              price: item.price,
              createTime: item.created_at,
              image: item.design_info?.image_url || "",
              userPhone: item.user_info?.phone || "暂无",
              braceletInfo: item.design_info || {}
            };
          });
        setOrders(orderList);
      });
    } catch (error) {
      showToast({
        title: "加载失败",
        icon: "none",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleGrabOrder = async (order: Order) => {
      try {
        showToast({
          title: "抢单中...",
          icon: "loading",
        });

        // 模拟抢单API调用
        await api.user.grabOrder(order.id);

        showToast({
          title: "抢单成功！",
          icon: "success",
        });

        // 移除已抢的订单
        setOrders((prev) => prev.filter((item) => item.id !== order.id));

        // 跳转到订单管理页面
        Taro.switchTab({
          url: "/pages/order-management/index",
        });
      } catch (error) {
        showToast({
          title: "抢单失败，请重试",
          icon: "none",
        });
      }
  };

  const handleOrderAction = (action: string, order: Order) => {
    if (action === "grab") {
      handleGrabOrder(order);
    } else if (action === "detail") {
      showModal({
        title: '订单详情',
        content: `订单号：${order.orderNo}\n金额：¥${order.price}\n时间：${order.createTime}\n用户：${order.description}`,
        showCancel: false
      })
    }
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedOrder(null);
  };

  const handleGrabFromModal = async () => {
    if (selectedOrder) {
      handleCloseModal();
      await handleGrabOrder(selectedOrder);
    }
  };

  return (
    <View className="grab-orders-container">
      <Header />
      <View className="header">
        <Text className="header-title">抢单广场</Text>
      </View>

      <View>
        <OrderList orders={orders}
          onOrderAction={handleOrderAction}
          onRefresh={loadOrders}
        />
      </View>
    </View>
  );
}
