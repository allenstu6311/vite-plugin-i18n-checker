export default {
  // 狀態常數
  status: {
    active: 'Active',
    inactive: 'Inactive',
    pending: 'Pending Review',
    suspended: 'Suspended',
    // deleted: 'Deleted',  // 缺少這個 key
    archived: 'Archived',
    draft: 'Draft',
    published: 'Published'
  },

  // 角色和權限
  roles: {
    superAdmin: {
      name: 'Super Administrator',
      description: 'Has all permissions',
      permissions: ['*'],
      level: 100
    },
    admin: {
      name: 'Administrator',
      description: 'Has most permissions',
      permissions: ['read', 'write', 'delete', 'admin', 'export', 'import', 'audit'],
      level: 90
    },
    manager: {
      name: 'Manager',
      description: 'Team management permissions',
      permissions: ['read', 'write', 'export', 'team_manage'],
      level: 80
    },
    user: {
      name: 'User',
      description: 'Basic usage permissions',
      permissions: ['read', 'write'],
      level: 50
    },
    guest: {
      name: 'Guest',
      description: 'View-only permissions',
      permissions: ['read'],
      level: 10
    }
  },

  // 優先級和嚴重程度
  priorities: {
    critical: {
      name: 'Critical',
      color: '#ff4d4f',
      order: 1,
      escalation: {
        time: 30, // 分鐘
        notify: ['admin', 'manager']
      }
    },
    high: {
      name: 'High',
      color: '#ff7a45',
      order: 2,
      escalation: {
        time: 120,
        notify: ['manager']
      }
    },
    medium: {
      name: 'Medium',
      color: '#faad14',
      order: 3,
      escalation: {
        time: 480,
        notify: []
      }
    },
    low: {
      name: 'Low',
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
        name: 'Email',
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
        name: 'Push Notification',
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
        name: 'SMS',
        icon: 'message',
        enabled: false,
        provider: 'twilio',
        cost: 0.01
      },
      {
        id: 'inApp',
        name: 'In-App',
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
        name: 'Full Format',
        format: 'YYYY-MM-DD HH:mm:ss',
        example: '2024-01-15 14:30:25'
      },
      {
        id: 'date',
        name: 'Date Format',
        format: 'YYYY-MM-DD',
        example: '2024-01-15'
      },
      {
        id: 'time',
        name: 'Time Format',
        format: 'HH:mm:ss',
        example: '14:30:25'
      },
      {
        id: 'relative',
        name: 'Relative Time',
        format: 'relative',
        example: '2 hours ago'
      }
    ],
    timezones: [
      { id: 'Asia/Taipei', name: 'Taipei Time', offset: '+08:00' },
      { id: 'UTC', name: 'Coordinated Universal Time', offset: '+00:00' },
      { id: 'America/New_York', name: 'New York Time', offset: '-05:00' },
      { id: 'Europe/London', name: 'London Time', offset: '+00:00' }
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
