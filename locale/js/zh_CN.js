export default {
  // 應用程式基本資訊
  app: {
    name: '我的應用程式',
    version: '1.0.0',
    description: '這是一個多語言應用程式'
  },

  // 導航選單
  navigation: {
    home: '首頁',
    about: '關於我們',
    contact: '聯絡我們',
    products: '產品',
    services: '服務',
    blog: '部落格'
  },

  // 使用者相關
  user: {
    profile: {
      title: '個人資料',
      name: '姓名',
      email: '電子郵件',
      phone: '電話',
      address: '地址',
      avatar: '頭像'
    },
    settings: {
      title: '設定',
      language: '語言',
      theme: '主題',
      notifications: '通知',
      privacy: '隱私設定'
    }
  },

  // 儀表板
  dashboard: {
    title: '儀表板',
    welcome: '歡迎回來，{name}！',
    stats: {
      totalUsers: '總用戶數',
      activeUsers: '活躍用戶',
      revenue: '營收',
      orders: '訂單數'
    },
    charts: {
      userGrowth: '用戶成長',
      revenueChart: '營收圖表',
      activityChart: '活動圖表'
    }
  },

  // 表單相關
  forms: {
    labels: {
      firstName: '名字',
      lastName: '姓氏',
      email: '電子郵件',
      password: '密碼',
      confirmPassword: '確認密碼',
      phone: '電話號碼',
      birthday: '生日',
      gender: '性別'
    },
    placeholders: {
      enterName: '請輸入姓名',
      enterEmail: '請輸入電子郵件',
      enterPassword: '請輸入密碼',
      selectGender: '請選擇性別'
    },
    buttons: {
      submit: '提交',
      cancel: '取消',
      save: '儲存',
      reset: '重設'
    }
  },

  // 訊息相關
  messages: {
    success: {
      saved: '資料已儲存',
      deleted: '資料已刪除',
      updated: '資料已更新',
      created: '資料已建立'
    },
    error: {
      required: '此欄位為必填',
      invalidEmail: '請輸入有效的電子郵件',
      passwordMismatch: '密碼確認不匹配',
      networkError: '網路連線錯誤'
    },
    confirm: {
      delete: '確定要刪除這筆資料嗎？',
      logout: '確定要登出嗎？',
      reset: '確定要重設所有設定嗎？'
    }
  }
}