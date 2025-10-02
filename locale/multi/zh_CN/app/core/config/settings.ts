export default {
  // 應用程式基本配置
  app: {
    name: '我的應用程式',
    version: '1.0.0',
    environment: 'production',
    debug: true,
    features: {
      enabled: ['multilingual', 'responsive', 'notifications', 'analytics'],
      disabled: ['beta', 'experimental'],
      modules: [
        {
          id: 'userManagement',
          name: '用戶管理',
          version: '2.1.0',
          dependencies: ['auth', 'permissions'],
          config: {
            allowBulkActions: true,
            enableAuditLog: true,
            maxUsersPerPage: 50,
            roles: ['admin', 'manager', 'user', 'guest'],
            permissions: {
              create: ['admin', 'manager'],
              read: ['admin', 'manager', 'user'],
              update: ['admin', 'manager'],
              delete: ['admin'],
              export: ['admin', 'manager']
            }
          }
        },
        {
          id: 'dashboard',
          name: '儀表板',
          version: '1.5.0',
          dependencies: ['analytics', 'charts'],
          config: {
            defaultWidgets: ['stats', 'charts', 'recentActivity'],
            refreshInterval: 30000,
            enableRealTime: true,
            themes: ['light', 'dark', 'auto'],
            layouts: [
              { id: 'grid', name: '網格佈局', columns: 4 },
              { id: 'list', name: '清單佈局', columns: 1 },
              { id: 'mixed', name: '混合佈局', columns: 2 }
            ]
          }
        }
      ]
    }
  },

  // 資料庫配置
  database: {
    primary: {
      host: 'localhost',
      port: 5432,
      name: 'myapp_primary',
      credentials: {
        username: 'admin',
        password: 'secret123',
        ssl: true
      },
      pool: {
        min: 2,
        max: 10,
        idle: 10000,
        acquire: 30000
      },
      replication: {
        enabled: true,
        readReplicas: [
          { host: 'replica1.example.com', port: 5432, weight: 1 },
          { host: 'replica2.example.com', port: 5432, weight: 2 }
        ]
      }
    },
    cache: {
      redis: {
        host: 'localhost',
        port: 6379,
        password: 'redis123',
        db: 0,
        ttl: 3600,
        clusters: [
          { host: 'redis1.example.com', port: 6379 },
          { host: 'redis2.example.com', port: 6379 },
          { host: 'redis3.example.com', port: 6379 }
        ]
      }
    }
  },

  // API 配置
  api: {
    baseUrl: 'https://api.example.com',
    version: 'v1',
    timeout: 30000,
    retries: 3,
    rateLimit: {
      windowMs: 900000,
      max: 100,
      skipSuccessfulRequests: true,
      skipFailedRequests: false
    },
    endpoints: {
      auth: {
        login: '/auth/login',
        logout: '/auth/logout',
        refresh: '/auth/refresh',
        register: '/auth/register',
        forgotPassword: '/auth/forgot-password',
        resetPassword: '/auth/reset-password'
      },
      users: {
        list: '/users',
        create: '/users',
        update: '/users/{id}',
        delete: '/users/{id}',
        profile: '/users/{id}/profile',
        avatar: '/users/{id}/avatar',
        permissions: '/users/{id}/permissions'
      },
      products: {
        list: '/products',
        create: '/products',
        update: '/products/{id}',
        delete: '/products/{id}',
        categories: '/products/categories',
        search: '/products/search',
        filters: '/products/filters'
      }
    },
    middleware: [
      { 
        name: 'cors', 
        enabled: true, 
        options: { 
          origin: ['https://app.example.com', 'https://admin.example.com'],
          credentials: true,
          methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
          allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
        }
      },
      { 
        name: 'rateLimit', 
        enabled: true, 
        options: { 
          windowMs: 900000, 
          max: 100,
          message: 'Too many requests from this IP'
        }
      },
      { 
        name: 'auth', 
        enabled: true, 
        options: { 
          secret: 'jwt-secret-key',
          expiresIn: '24h',
          algorithms: ['HS256']
        }
      },
      { 
        name: 'logging', 
        enabled: true, 
        options: { 
          level: 'info',
          format: 'combined',
          skip: false
        }
      }
    ]
  },

  // 國際化配置
  i18n: {
    defaultLocale: 'zh_CN',
    supportedLocales: [
      { 
        code: 'zh_CN', 
        name: '繁體中文', 
        flag: '🇹🇼',
        rtl: false,
        dateFormat: 'YYYY年MM月DD日',
        timeFormat: 'HH:mm:ss',
        currency: 'TWD',
        numberFormat: {
          decimal: '.',
          thousands: ',',
          precision: 2
        }
      },
      { 
        code: 'en_US', 
        name: 'English', 
        flag: '🇺🇸',
        rtl: false,
        dateFormat: 'MM/DD/YYYY',
        timeFormat: 'h:mm:ss A',
        currency: 'USD',
        numberFormat: {
          decimal: '.',
          thousands: ',',
          precision: 2
        }
      },
      { 
        code: 'es_ES', 
        name: 'Español', 
        flag: '🇪🇸',
        rtl: false,
        dateFormat: 'DD/MM/YYYY',
        timeFormat: 'HH:mm:ss',
        currency: 'EUR',
        numberFormat: {
          decimal: ',',
          thousands: '.',
          precision: 2
        }
      }
    ],
    fallbackLocale: 'en_US',
    loadPath: '/locales/{{lng}}/{{ns}}.json',
    saveMissing: true,
    missingKeyHandler: null
  }
}
