export default {
  // 應用程式基本資訊
  app: {
    name: '我的應用程式',
    version: '1.0.0',
    description: '這是一個多語言應用程式',
    author: '開發團隊',
    license: 'MIT',
    environment: 'production'
  },

  // 資料庫配置
  database: {
    host: 'localhost',
    port: 5432,
    name: 'myapp',
    username: 'admin',
    password: 'secret',
    ssl: true,
    pool: {
      min: 2,
      max: 10,
      idle: 10000
    }
  },

  // 功能清單
  features: [
    '多語言支援',
    '響應式設計',
    '即時通知',
    '資料匯出',
    '權限管理',
    'API 整合',
    '快取機制'
  ],

  // 設定選項
  settings: {
    debug: true,
    logLevel: 'info',
    maxFileSize: '10MB',
    allowedFormats: ['jpg', 'png', 'pdf', 'docx', 'xlsx'],
    themes: [
      { id: 'light', name: '淺色主題' },
      { id: 'dark', name: '深色主題' },
      { id: 'auto', name: '自動切換' }
    ],
    languages: [
      { code: 'zh_CN', name: '繁體中文' },
      { code: 'en_US', name: 'English' },
      { code: 'es_ES', name: 'Español' }
    ]
  },

  // API 端點
  api: {
    baseUrl: 'https://api.example.com',
    version: 'v1',
    endpoints: {
      auth: '/auth',
      users: '/users',
      products: '/products',
      orders: '/orders'
    },
    timeout: 30000,
    retries: 3
  }
}
