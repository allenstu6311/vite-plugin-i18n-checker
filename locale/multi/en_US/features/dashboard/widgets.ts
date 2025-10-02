export default {
  // 儀表板標題
  title: 'Dashboard',
  subtitle: 'Welcome back, {name}!',

  // 統計卡片
  statsCards: {
    totalUsers: {
      title: 'Total Users',
      value: '{count}',
      change: '{percent}% from last month',
      trend: 'Up',
      icon: 'users',
      color: '#1890ff',
      format: 'number'
    },
    activeUsers: {
      title: 'Active Users',
      value: '{count}',
      change: '{percent}% from last month',
      trend: 'Down',
      icon: 'user-check',
      color: '#52c41a',
      format: 'number'
    },
    revenue: {
      title: 'Revenue',
      value: '${amount}',
      change: '{percent}% from last month',
      trend: 'Up',
      icon: 'dollar',
      color: '#faad14',
      format: 'currency'
    },
    orders: {
      title: 'Orders',
      value: '{count}',
      change: '{percent}% from last month',
      trend: 'Stable',
      icon: 'shopping-cart',
      color: '#722ed1',
      format: 'number'
    },
    conversion: {
      title: 'Conversion Rate',
      value: '{percent}%',
      change: '{change}% from last month',
      trend: 'Up',
      icon: 'trending-up',
      color: '#13c2c2',
      format: 'percentage'
    },
    bounceRate: {
      title: 'Bounce Rate',
      value: '{percent}%',
      change: '{change}% from last month',
      trend: 'Down',
      icon: 'trending-down',
      color: '#f5222d',
      format: 'percentage'
    }
  },

  // 圖表元件
  charts: {
    userGrowth: {
      title: 'User Growth Trend',
      subtitle: 'User growth over the past 12 months',
      xAxis: 'Time',
      yAxis: 'User Count',
      legend: {
        newUsers: 'New Users',
        activeUsers: 'Active Users',
        totalUsers: 'Total Users',
        returningUsers: 'Returning Users'
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
      title: 'Revenue Analysis',
      subtitle: 'Revenue performance by product line',
      xAxis: 'Month',
      yAxis: 'Revenue (10K)',
      legend: {
        productA: 'Product A',
        productB: 'Product B',
        productC: 'Product C',
        service: 'Service Revenue'
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
      title: 'Activity Statistics',
      subtitle: 'User activity and interaction',
      xAxis: 'Date',
      yAxis: 'Activity Count',
      legend: {
        pageViews: 'Page Views',
        clicks: 'Clicks',
        conversions: 'Conversions',
        downloads: 'Downloads'
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
    title: 'Recent Activity',
    subtitle: 'Latest activities in the system',
    empty: 'No activity records',
    loadMore: 'Load More',
    items: [
      {
        id: 1,
        type: 'user_registered',
        title: 'New User Registration',
        message: 'New user {name} has registered',
        user: { name: 'John Doe', avatar: '/avatars/john.jpg' },
        time: '2 minutes ago',
        priority: 'normal',
        actions: [
          { id: 'view', label: 'View', icon: 'eye' },
          { id: 'approve', label: 'Approve', icon: 'check' }
        ]
      },
      {
        id: 2,
        type: 'order_created',
        title: 'Order Created',
        message: 'Order #{orderId} has been created',
        user: { name: 'Jane Smith', avatar: '/avatars/jane.jpg' },
        time: '15 minutes ago',
        priority: 'high',
        actions: [
          { id: 'view', label: 'View Order', icon: 'eye' },
          { id: 'process', label: 'Process', icon: 'play' }
        ]
      },
      {
        id: 3,
        type: 'payment_received',
        title: 'Payment Received',
        message: 'Payment received ${amount}',
        user: { name: 'Bob Johnson', avatar: '/avatars/bob.jpg' },
        time: '1 hour ago',
        priority: 'high',
        actions: [
          { id: 'view', label: 'View Payment', icon: 'eye' },
          { id: 'confirm', label: 'Confirm', icon: 'check' }
        ]
      },
      {
        id: 4,
        type: 'system_alert',
        title: 'System Alert',
        message: 'CPU usage exceeds 80%',
        user: { name: 'System', avatar: '/avatars/system.jpg' },
        time: '2 hours ago',
        priority: 'critical',
        actions: [
          { id: 'view', label: 'View Details', icon: 'eye' },
          { id: 'resolve', label: 'Resolve', icon: 'tool' }
        ]
      }
    ]
  },

  // 快速操作
  quickActions: {
    title: 'Quick Actions',
    subtitle: 'Quick access to common functions',
    buttons: [
      {
        id: 'addUser',
        label: 'Add User',
        icon: 'user-plus',
        color: '#1890ff',
        description: 'Create new user account',
        shortcut: 'Ctrl+U'
      },
      {
        id: 'createOrder',
        label: 'Create Order',
        icon: 'shopping-cart',
        color: '#52c41a',
        description: 'Create new order',
        shortcut: 'Ctrl+O'
      },
      {
        id: 'generateReport',
        label: 'Generate Report',
        icon: 'file-text',
        color: '#faad14',
        description: 'Generate various reports',
        shortcut: 'Ctrl+R'
      },
      {
        id: 'sendNotification',
        label: 'Send Notification',
        icon: 'bell',
        color: '#722ed1',
        description: 'Send system notification',
        shortcut: 'Ctrl+N'
      },
      {
        id: 'backupData',
        label: 'Backup Data',
        icon: 'database',
        color: '#13c2c2',
        description: 'Backup system data',
        shortcut: 'Ctrl+B'
      },
      {
        id: 'systemSettings',
        label: 'System Settings',
        icon: 'settings',
        color: '#f5222d',
        description: 'Manage system settings',
        shortcut: 'Ctrl+S'
      }
    ]
  },

  // 系統狀態
  systemStatus: {
    title: 'System Status',
    subtitle: 'Status of various services',
    overall: {
      status: 'Normal',
      uptime: '99.9%',
      lastCheck: '2 minutes ago'
    },
    services: [
      {
        name: 'API Service',
        status: 'Normal',
        uptime: '99.9%',
        responseTime: '120ms',
        lastCheck: '1 minute ago',
        health: 'good'
      },
      {
        name: 'Database',
        status: 'Normal',
        uptime: '99.8%',
        responseTime: '45ms',
        lastCheck: '1 minute ago',
        health: 'good'
      },
      {
        name: 'Cache Service',
        status: 'Normal',
        uptime: '99.7%',
        responseTime: '15ms',
        lastCheck: '1 minute ago',
        health: 'good'
      },
      {
        name: 'File Storage',
        status: 'Maintenance',
        uptime: '98.5%',
        responseTime: '200ms',
        lastCheck: '5 minutes ago',
        health: 'warning'
      },
      {
        name: 'Email Service',
        status: 'Error',
        uptime: '95.2%',
        responseTime: '500ms',
        lastCheck: '10 minutes ago',
        health: 'error'
      }
    ]
  },

  // 小工具設定
  widgetSettings: {
    title: 'Widget Settings',
    subtitle: 'Customize dashboard layout',
    layout: {
      title: 'Layout Settings',
      columns: 'Number of columns',
      spacing: 'Spacing',
      density: 'Density'
    },
    widgets: {
      title: 'Available Widgets',
      add: 'Add Widget',
      remove: 'Remove Widget',
      reorder: 'Reorder',
      customize: 'Customize Widget'
    },
    themes: {
      title: 'Theme Settings',
      light: 'Light Theme',
      dark: 'Dark Theme',
      auto: 'Auto Switch'
    }
  }
}
