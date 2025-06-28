import { useState, useEffect, useMemo } from "react";
import { View, Text, Button, Image, ScrollView } from "@tarojs/components";
import Taro, { showToast, showModal, makePhoneCall } from "@tarojs/taro";
import "./index.scss";
import { Header, OrderList } from "@/components";
import api from "@/utils/api";
import { OrderStatus } from "@/utils/status";

interface Order {
  id: string;
  orderNo: string;
  status: "已接单" | "已完成" | "已取消";
  price: number;
  createTime: string;
  image: string;
  userPhone: string;
  description: string;
}

type TabType = "进行中" | "已完成" | "已取消";

export default function OrderManagement() {
  const [activeTab, setActiveTab] = useState<TabType>("进行中");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const loadOrders = async () => {
    console.log("loadOrders");
    setLoading(true);
    Taro.showLoading();
    try {
      // 模拟API调用
      api.user.getOrderList().then((res: any) => {
        console.log(res.data.orders, "res.data.orders");
        const orderList = res.data.orders?.map((item) => {
          return {
            id: item.order_uuid,
            orderNo: item.order_uuid,
            status: item.order_status,
            price: item.price,
            createTime: item.created_at,
            image: item.design_info?.image_url || "",
            userPhone: item.user_info?.phone || "暂无",
            braceletInfo: item.design_info || {},
            userInfo: item.user_info || {},
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
      Taro.hideLoading();
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const currentOrders = useMemo(
    () => {
      if (activeTab === "进行中") {
        return orders.filter((item) => item.status as OrderStatus === OrderStatus.InService);
      } else if (activeTab === "已完成") {
        return orders.filter((item) => item.status as OrderStatus === OrderStatus.Completed);
      } else if (activeTab === "已取消") {
        return orders.filter((item) => [OrderStatus.Cancelled, OrderStatus.MerchantCancel].includes(item.status as OrderStatus));
      }
    },
    [orders, activeTab]
  );

  return (
    <View className="order-management-container">
      <Header />
      <View className="tabs-container">
        {(["进行中", "已完成", "已取消"] as TabType[]).map((tab) => (
          <View
            key={tab}
            className={`tab-item ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            <Text className="tab-text">{tab}</Text>
          </View>
        ))}
      </View>

      <OrderList orders={currentOrders || []} loading={loading} onRefresh={loadOrders} />
    </View>
  );
}
