export default {
  // 儀表板標題
  title: '儀表板',
  subtitle: '歡迎回來，{name}！',

  // 統計卡片
  statsCards: {
    totalUsers: {
      title: '總用戶數',
      value: '{count}',
      change: '較上月 {percent}%',
      trend: '上升',
      icon: 'users',
      color: '#1890ff',
      format: 'number'
    },
    activeUsers: {
      title: '活躍用戶',
      value: '{count}',
      change: '較上月 {percent}%',
      trend: '下降',
      icon: 'user-check',
      color: '#52c41a',
      format: 'number'
    },
    revenue: {
      title: '營收',
      value: '${amount}',
      change: '較上月 {percent}%',
      trend: '上升',
      icon: 'dollar',
      color: '#faad14',
      format: 'currency'
    },
    orders: {
      title: '訂單數',
      value: '{count}',
      change: '較上月 {percent}%',
      trend: '持平',
      icon: 'shopping-cart',
      color: '#722ed1',
      format: 'number'
    },
    conversion: {
      title: '轉換率',
      value: '{percent}%',
      change: '較上月 {change}%',
      trend: '上升',
      icon: 'trending-up',
      color: '#13c2c2',
      format: 'percentage'
    },
    bounceRate: {
      title: '跳出率',
      value: '{percent}%',
      change: '較上月 {change}%',
      trend: '下降',
      icon: 'trending-down',
      color: '#f5222d',
      format: 'percentage'
    }
  },

  // 圖表元件
  charts: {
    userGrowth: {
      title: '用戶成長趨勢',
      subtitle: '過去 12 個月的用戶成長情況',
      xAxis: '時間',
      yAxis: '用戶數',
      legend: {
        newUsers: '新用戶',
        activeUsers: '活躍用戶',
        totalUsers: '總用戶',
        returningUsers: '回訪用戶'
      },
      dataPoints: [
        { month: '2023-01', newUsers: 1200, activeUsers: 800, totalUsers: 5000, returningUsers: 600 },
        { month: '2023-02', newUsers: 1350, activeUsers: 920, totalUsers: 6350, returningUsers: 720 },
        { month: '2023-03', newUsers: 1500, activeUsers: 1100, totalUsers: 7850, returningUsers: 850 },
        { month: '2023-04', newUsers: 1650, activeUsers: 1250, totalUsers: 9500, returningUsers: 980 },
        { month: '2023-05', newUsers: 1800, activeUsers: 1400, totalUsers: 11300, returningUsers: 1120 },
        { month: '2023-06', newUsers: 1950, activeUsers: 1550, totalUsers: 13250, returningUsers: 1280 }
      ]
    },
    revenueChart: {
      title: '營收分析',
      subtitle: '各產品線的營收表現',
      xAxis: '月份',
      yAxis: '營收 (萬元)',
      legend: {
        productA: '產品 A',
        productB: '產品 B',
        productC: '產品 C',
        service: '服務收入'
      },
      dataPoints: [
        { month: '2023-01', productA: 50, productB: 30, productC: 20, service: 15 },
        { month: '2023-02', productA: 55, productB: 35, productC: 25, service: 18 },
        { month: '2023-03', productA: 60, productB: 40, productC: 30, service: 22 },
        { month: '2023-04', productA: 65, productB: 45, productC: 35, service: 25 },
        { month: '2023-05', productA: 70, productB: 50, productC: 40, service: 28 },
        { month: '2023-06', productA: 75, productB: 55, productC: 45, service: 32 }
      ]
    },
    activityChart: {
      title: '活動統計',
      subtitle: '用戶活動和互動情況',
      xAxis: '日期',
      yAxis: '活動數',
      legend: {
        pageViews: '頁面瀏覽',
        clicks: '點擊數',
        conversions: '轉換數',
        downloads: '下載數'
      },
      dataPoints: [
        { date: '2023-06-01', pageViews: 1200, clicks: 300, conversions: 45, downloads: 120 },
        { date: '2023-06-02', pageViews: 1350, clicks: 350, conversions: 52, downloads: 135 },
        { date: '2023-06-03', pageViews: 1500, clicks: 400, conversions: 60, downloads: 150 },
        { date: '2023-06-04', pageViews: 1650, clicks: 450, conversions: 68, downloads: 165 },
        { date: '2023-06-05', pageViews: 1800, clicks: 500, conversions: 75, downloads: 180 }
      ]
    }
  },

  // 最近活動
  recentActivity: {
    title: '最近活動',
    subtitle: '系統中的最新動態',
    empty: '暫無活動記錄',
    loadMore: '載入更多',
    items: [
      {
        id: 1,
        type: 'user_registered',
        title: '新用戶註冊',
        message: '新用戶 {name} 已註冊',
        user: { name: '張三', avatar: '/avatars/zhang.jpg' },
        time: '2 分鐘前',
        priority: 'normal',
        actions: [
          { id: 'view', label: '檢視', icon: 'eye' },
          { id: 'approve', label: '核准', icon: 'check' }
        ]
      },
      {
        id: 2,
        type: 'order_created',
        title: '訂單建立',
        message: '訂單 #{orderId} 已建立',
        user: { name: '李四', avatar: '/avatars/li.jpg' },
        time: '15 分鐘前',
        priority: 'high',
        actions: [
          { id: 'view', label: '檢視訂單', icon: 'eye' },
          { id: 'process', label: '處理', icon: 'play' }
        ]
      },
      {
        id: 3,
        type: 'payment_received',
        title: '付款收到',
        message: '收到付款 ${amount}',
        user: { name: '王五', avatar: '/avatars/wang.jpg' },
        time: '1 小時前',
        priority: 'high',
        actions: [
          { id: 'view', label: '檢視付款', icon: 'eye' },
          { id: 'confirm', label: '確認', icon: 'check' }
        ]
      },
      {
        id: 4,
        type: 'system_alert',
        title: '系統警告',
        message: 'CPU 使用率超過 80%',
        user: { name: '系統', avatar: '/avatars/system.jpg' },
        time: '2 小時前',
        priority: 'critical',
        actions: [
          { id: 'view', label: '檢視詳情', icon: 'eye' },
          { id: 'resolve', label: '解決', icon: 'tool' }
        ]
      }
    ]
  },

  // 快速操作
  quickActions: {
    title: '快速操作',
    subtitle: '常用功能快速入口',
    buttons: [
      {
        id: 'addUser',
        label: '新增用戶',
        icon: 'user-plus',
        color: '#1890ff',
        description: '建立新的用戶帳號',
        shortcut: 'Ctrl+U'
      },
      {
        id: 'createOrder',
        label: '建立訂單',
        icon: 'shopping-cart',
        color: '#52c41a',
        description: '建立新的訂單',
        shortcut: 'Ctrl+O'
      },
      {
        id: 'generateReport',
        label: '產生報表',
        icon: 'file-text',
        color: '#faad14',
        description: '產生各種統計報表',
        shortcut: 'Ctrl+R'
      },
      {
        id: 'sendNotification',
        label: '發送通知',
        icon: 'bell',
        color: '#722ed1',
        description: '發送系統通知',
        shortcut: 'Ctrl+N'
      },
      {
        id: 'backupData',
        label: '備份資料',
        icon: 'database',
        color: '#13c2c2',
        description: '備份系統資料',
        shortcut: 'Ctrl+B'
      },
      {
        id: 'systemSettings',
        label: '系統設定',
        icon: 'settings',
        color: '#f5222d',
        description: '管理系統設定',
        shortcut: 'Ctrl+S'
      }
    ]
  },

  // 系統狀態
  systemStatus: {
    title: '系統狀態',
    subtitle: '各項服務的運行狀態',
    overall: {
      status: '正常',
      uptime: '99.9%',
      lastCheck: '2 分鐘前'
    },
    services: [
      {
        name: 'API 服務',
        status: '正常',
        uptime: '99.9%',
        responseTime: '120ms',
        lastCheck: '1 分鐘前',
        health: 'good'
      },
      {
        name: '資料庫',
        status: '正常',
        uptime: '99.8%',
        responseTime: '45ms',
        lastCheck: '1 分鐘前',
        health: 'good'
      },
      {
        name: '快取服務',
        status: '正常',
        uptime: '99.7%',
        responseTime: '15ms',
        lastCheck: '1 分鐘前',
        health: 'good'
      },
      {
        name: '檔案儲存',
        status: '維護中',
        uptime: '98.5%',
        responseTime: '200ms',
        lastCheck: '5 分鐘前',
        health: 'warning'
      },
      {
        name: '郵件服務',
        status: '異常',
        uptime: '95.2%',
        responseTime: '500ms',
        lastCheck: '10 分鐘前',
        health: 'error'
      }
    ]
  },

  // 小工具設定
  widgetSettings: {
    title: '小工具設定',
    subtitle: '自訂儀表板佈局',
    layout: {
      title: '佈局設定',
      columns: '欄位數',
      spacing: '間距',
      density: '密度'
    },
    widgets: {
      title: '可用小工具',
      add: '新增小工具',
      remove: '移除小工具',
      reorder: '重新排序',
      customize: '自訂小工具'
    },
    themes: {
      title: '主題設定',
      light: '淺色主題',
      dark: '深色主題',
      auto: '自動切換'
    }
  }
}
