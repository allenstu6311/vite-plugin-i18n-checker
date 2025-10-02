export default {
  // 狀態常數
  status: {
    active: '啟用',
    inactive: '停用',
    pending: '待審核',
    suspended: '已暫停',
    deleted: '已刪除',
    archived: '已封存',
    draft: '草稿',
    published: '已發布'
  },

  // 角色和權限
  roles: {
    superAdmin: {
      name: '超級管理員',
      description: '擁有所有權限',
      permissions: ['*'],
      level: 100
    },
    admin: {
      name: '管理員',
      description: '擁有大部分權限',
      permissions: ['read', 'write', 'delete', 'admin', 'export', 'import', 'audit'],
      level: 90
    },
    manager: {
      name: '經理',
      description: '管理團隊權限',
      permissions: ['read', 'write', 'export', 'team_manage'],
      level: 80
    },
    user: {
      name: '一般使用者',
      description: '基本使用權限',
      permissions: ['read', 'write'],
      level: 50
    },
    guest: {
      name: '訪客',
      description: '僅檢視權限',
      permissions: ['read'],
      level: 10
    }
  },

  // 優先級和嚴重程度
  priorities: {
    critical: {
      name: '嚴重',
      color: '#ff4d4f',
      order: 1,
      escalation: {
        time: 30, // 分鐘
        notify: ['admin', 'manager']
      }
    },
    high: {
      name: '高',
      color: '#ff7a45',
      order: 2,
      escalation: {
        time: 120,
        notify: ['manager']
      }
    },
    medium: {
      name: '中',
      color: '#faad14',
      order: 3,
      escalation: {
        time: 480,
        notify: []
      }
    },
    low: {
      name: '低',
      color: '#52c41a',
      order: 4,
      escalation: {
        time: 1440,
        notify: []
      }
    }
  },

  // 通知類型配置
  notifications: {
    types: [
      {
        id: 'email',
        name: '電子郵件',
        icon: 'mail',
        enabled: true,
        templates: {
          welcome: 'welcome_email',
          passwordReset: 'password_reset',
          orderConfirmation: 'order_confirmation'
        }
      },
      {
        id: 'push',
        name: '推播通知',
        icon: 'bell',
        enabled: true,
        platforms: ['web', 'mobile'],
        settings: {
          sound: true,
          vibration: true,
          badge: true
        }
      },
      {
        id: 'sms',
        name: '簡訊',
        icon: 'message',
        enabled: false,
        provider: 'twilio',
        cost: 0.01
      },
      {
        id: 'inApp',
        name: '應用程式內',
        icon: 'notification',
        enabled: true,
        persistence: 7 // 天
      }
    ],
    channels: {
      marketing: ['email', 'push'],
      security: ['email', 'sms'],
      system: ['inApp', 'email'],
      user: ['push', 'inApp']
    }
  },

  // 檔案類型和限制
  fileTypes: {
    images: {
      extensions: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp'],
      maxSize: '5MB',
      dimensions: {
        maxWidth: 4096,
        maxHeight: 4096,
        minWidth: 100,
        minHeight: 100
      },
      compression: {
        quality: 85,
        format: 'webp'
      }
    },
    documents: {
      extensions: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'],
      maxSize: '10MB',
      security: {
        scanForViruses: true,
        allowMacros: false
      }
    },
    archives: {
      extensions: ['zip', 'rar', '7z', 'tar', 'gz', 'bz2'],
      maxSize: '50MB',
      extraction: {
        maxFiles: 1000,
        maxDepth: 10
      }
    },
    media: {
      video: {
        extensions: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'],
        maxSize: '100MB',
        codecs: ['h264', 'h265', 'vp9']
      },
      audio: {
        extensions: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a'],
        maxSize: '20MB',
        bitrates: [128, 192, 256, 320]
      }
    }
  },

  // 日期和時間格式
  dateTime: {
    formats: [
      {
        id: 'full',
        name: '完整格式',
        format: 'YYYY年MM月DD日 HH:mm:ss',
        example: '2024年01月15日 14:30:25'
      },
      {
        id: 'date',
        name: '日期格式',
        format: 'YYYY-MM-DD',
        example: '2024-01-15'
      },
      {
        id: 'time',
        name: '時間格式',
        format: 'HH:mm:ss',
        example: '14:30:25'
      },
      {
        id: 'relative',
        name: '相對時間',
        format: 'relative',
        example: '2小時前'
      }
    ],
    timezones: [
      { id: 'Asia/Taipei', name: '台北時間', offset: '+08:00' },
      { id: 'UTC', name: '協調世界時', offset: '+00:00' },
      { id: 'America/New_York', name: '紐約時間', offset: '-05:00' },
      { id: 'Europe/London', name: '倫敦時間', offset: '+00:00' }
    ]
  },

  // 系統限制
  limits: {
    users: {
      maxPerPage: 100,
      maxBulkOperations: 1000,
      maxConcurrentSessions: 5
    },
    files: {
      maxUploadSize: '100MB',
      maxFilesPerUpload: 50,
      maxStoragePerUser: '1GB'
    },
    api: {
      rateLimit: {
        requests: 1000,
        window: 3600, // 秒
        burst: 100
      },
      timeout: 30000,
      maxRetries: 3
    }
  }
}
