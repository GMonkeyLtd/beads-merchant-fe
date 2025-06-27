export default {
  pages: [
    'pages/login/index',
    'pages/grab-orders/index',
    'pages/order-management/index',
    'pages/profile/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '商家管理后台',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#999',
    selectedColor: '#FF8800',
    backgroundColor: '#fff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/grab-orders/index',
        text: '抢单广场'
      },
      {
        pagePath: 'pages/order-management/index',
        text: '订单管理'
      },
      {
        pagePath: 'pages/profile/index',
        text: '个人中心'
      }
    ]
  }
}
