import http, { setBaseURL, setIsMock } from "./request";
import Taro from "@tarojs/taro";

// 在应用启动时设置API基础URL
// setBaseURL("http://gmonkey.ai:8088/api/v1");
setBaseURL("https://test.qianjunye.com:443/api/v1");
// setBaseURL("http://192.168.189.246:8088/api/v1");

// setIsMock(true)

// 定义用户相关的数据类型
export interface User {
  nick_name: string;
  avatar_url?: string;
  phone?: string;
  wechat_id?: string;
  wechat_avatar_url?: number;
}

export interface LoginParams {
  code: string;
}

export interface LoginResult {
  token: string;
  user?: User;
}

// 定义八字相关的数据类型
export interface BaziParams {
  birth_year: number;
  birth_month: number;
  birth_day: number;
  birth_hour: number;
  is_lunar: boolean;
  sex?: number;
}

export interface PersonalizedGenerateParams extends BaziParams {}

export interface QuickGenerateParams extends BaziParams {}

export interface QuickGenerateByImageParams {
  image_base64: string[];
  bead_info: PersonalizedGenerateResult[];
}

export interface PersonalizedGenerateResult {
  id: string;
  name: string;
  image_url: string;
  color: string;
  wuxing: string;
  english: string;
  bead_diameter: number;
}

export interface PersonalizedGenerate2Params {
  ids: string[];
  context: string;
}

export interface BaziResult {
  // 根据实际返回的数据结构定义
  [key: string]: any;
}

export interface QuickGenerateResult {
  image_url: string;
  bead_image_urls?: string[];
  [key: string]: any;
}

// 用户相关API
export const userApi = {
  // 用户登录 - 跳过认证检查，避免循环依赖
  login: (params: LoginParams) =>
    http.post<LoginResult>("/user/login", params, {
      skipAuth: true,
      showLoading: false,
    }),

  // 获取用户信息
  getUserInfo: () => http.post<User>(`/user/getuserinfo`),

  // 更新用户信息
  updateUser: (data: Partial<User>) =>
    http.post<User>(`/user/updateuserinfo`, data),

  // 用户退出登录
  logout: () => http.post("/auth/logout"),

  getOrderList: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: "查询成功",
          data: {
            total: 200, //总共符合条件的订单数
            page: 1,
            page_size: 2,
            orders: [
              {
                order_uuid: "20250625155842657587",
                order_status: "3",
                price: 999.99,
                created_at: "2025-06-25 15:58:43",
                user_info: {
                  default_contact: 0,
                  nick_name: "微信用户1",
                  phone: 19861129871,
                },
                design_info: {
                  design_id: "17",
                  image_url:
                    "https://zhuluoji.cn-sh2.ufileos.com/user-images-history/user2/20250625154154.590_a973cdf20002585f04e74afb58f227a1.jpg",
                  beads_info: [
                    {
                      bead_diameter: 8,
                      color: "棕色",
                      english: "Yellow Rutilated Quartz 2",
                      function: "增强自信",
                      id: "34",
                      image_url:
                        "https://zhuluoji.cn-sh2.ufileos.com/beads/huyanshi2.png",
                      name: "虎眼石 2",
                      wuxing: "土",
                    },
                  ],
                  beads_number: 1,
                  word_info: {
                    bead_ids_deduplication: [
                      {
                        color: "棕色",
                        english: "Yellow Rutilated Quartz 2",
                        function: "稳定情绪",
                        id: "34",
                        image_url:
                          "https://zhuluoji.cn-sh2.ufileos.com/beads/%E8%99%8E%E7%9C%BC%E7%9F%B32.png",
                        name: "虎眼石 2",
                        wuxing: "土",
                      },
                      {
                        color: "棕色",
                        english: "Yellow Rutilated Quartz 2",
                        function: "增强自信",
                        id: "34",
                        image_url:
                          "https://zhuluoji.cn-sh2.ufileos.com/beads/%E8%99%8E%E7%9C%BC%E7%9F%B32.png",
                        name: "虎眼石 2",
                        wuxing: "土",
                      },
                    ],
                    bracelet_name: "虎眼守护",
                    recommendation_text:
                      "虎眼石手串，土行能量充沛，助你稳定情绪，增强自信，守护平安。",
                  },
                },
              },
            ],
          },
        });
      }, 1000);
    });

    // return http.post("/merchant/getorderlist");
  },
};

// 导出所有API
export default {
  user: userApi,
};
