export default {
  pages: [
    'pages/login/index',
    'pages/grab-orders/index',
    'pages/order-management/index',
    'pages/user-center/index'
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
        text: '抢单广场',
        iconPath: 'assets/icons/grab.svg',
        selectedIconPath: 'assets/icons/grab-active.svg'
      },
      {
        pagePath: 'pages/order-management/index',
        text: '订单管理',
        iconPath: 'assets/icons/orders.svg',
        selectedIconPath: 'assets/icons/orders-active.svg'
      },
      {
        pagePath: 'pages/user-center/index',
        text: '个人中心',
        iconPath: 'assets/icons/user-center.svg',
        selectedIconPath: 'assets/icons/user-center-active.svg'
      }
    ]
  }
}
