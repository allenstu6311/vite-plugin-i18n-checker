export default {
  // 基本狀態
  basic: {
    active: '啟用',
    inactive: '停用',
    pending: '待審核',
    suspended: '已暫停',
    deleted: '已刪除',
    archived: '已封存',
    draft: '草稿',
    published: '已發布'
  },

  // 用戶狀態
  user: {
    online: '線上',
    offline: '離線',
    busy: '忙碌',
    away: '離開',
    invisible: '隱身',
    statuses: [
      {
        id: 'online',
        name: '線上',
        color: '#52c41a',
        icon: 'circle',
        description: '用戶目前活躍'
      },
      {
        id: 'offline',
        name: '離線',
        color: '#d9d9d9',
        icon: 'circle',
        description: '用戶已離線'
      },
      {
        id: 'busy',
        name: '忙碌',
        color: '#faad14',
        icon: 'circle',
        description: '用戶忙碌中'
      },
      {
        id: 'away',
        name: '離開',
        color: '#f5222d',
        icon: 'circle',
        description: '用戶暫時離開'
      }
    ]
  },

  // 訂單狀態
  order: {
    pending: '待處理',
    confirmed: '已確認',
    processing: '處理中',
    shipped: '已出貨',
    delivered: '已送達',
    cancelled: '已取消',
    refunded: '已退款',
    statuses: [
      {
        id: 'pending',
        name: '待處理',
        color: '#faad14',
        icon: 'clock-circle',
        description: '訂單等待處理',
        actions: ['confirm', 'cancel'],
        nextStatus: ['confirmed', 'cancelled']
      },
      {
        id: 'confirmed',
        name: '已確認',
        color: '#1890ff',
        icon: 'check-circle',
        description: '訂單已確認',
        actions: ['process', 'cancel'],
        nextStatus: ['processing', 'cancelled']
      },
      {
        id: 'processing',
        name: '處理中',
        color: '#722ed1',
        icon: 'loading',
        description: '訂單處理中',
        actions: ['ship', 'cancel'],
        nextStatus: ['shipped', 'cancelled']
      },
      {
        id: 'shipped',
        name: '已出貨',
        color: '#13c2c2',
        icon: 'truck',
        description: '商品已出貨',
        actions: ['deliver'],
        nextStatus: ['delivered']
      },
      {
        id: 'delivered',
        name: '已送達',
        color: '#52c41a',
        icon: 'check',
        description: '訂單已完成',
        actions: ['refund'],
        nextStatus: ['refunded']
      }
    ]
  },

  // 優先級
  priority: {
    low: '低',
    medium: '中',
    high: '高',
    urgent: '緊急',
    critical: '嚴重',
    levels: [
      {
        id: 'low',
        name: '低',
        color: '#52c41a',
        order: 1,
        escalation: {
          time: 1440,
          notify: [],
          autoAssign: false
        }
      },
      {
        id: 'medium',
        name: '中',
        color: '#faad14',
        order: 2,
        escalation: {
          time: 480,
          notify: ['assignee'],
          autoAssign: false
        }
      },
      {
        id: 'high',
        name: '高',
        color: '#ff7a45',
        order: 3,
        escalation: {
          time: 120,
          notify: ['assignee', 'manager'],
          autoAssign: true
        }
      },
      {
        id: 'urgent',
        name: '緊急',
        color: '#f5222d',
        order: 4,
        escalation: {
          time: 30,
          notify: ['assignee', 'manager', 'admin'],
          autoAssign: true
        }
      },
      {
        id: 'critical',
        name: '嚴重',
        color: '#722ed1',
        order: 5,
        escalation: {
          time: 15,
          notify: ['assignee', 'manager', 'admin', 'cto'],
          autoAssign: true
        }
      }
    ]
  },

  // 通知狀態
  notification: {
    unread: '未讀',
    read: '已讀',
    archived: '已封存',
    deleted: '已刪除',
    types: [
      {
        id: 'info',
        name: '資訊',
        color: '#1890ff',
        icon: 'info-circle',
        sound: false,
        vibration: false
      },
      {
        id: 'success',
        name: '成功',
        color: '#52c41a',
        icon: 'check-circle',
        sound: true,
        vibration: false
      },
      {
        id: 'warning',
        name: '警告',
        color: '#faad14',
        icon: 'exclamation-circle',
        sound: true,
        vibration: true
      },
      {
        id: 'error',
        name: '錯誤',
        color: '#f5222d',
        icon: 'close-circle',
        sound: true,
        vibration: true
      }
    ],
    channels: {
      inApp: {
        name: '應用程式內',
        enabled: true,
        settings: {
          showBadge: true,
          playSound: true,
          vibrate: false,
          autoHide: 5000
        }
      },
      email: {
        name: '電子郵件',
        enabled: true,
        settings: {
          template: 'default',
          priority: 'normal',
          attachments: false
        }
      },
      push: {
        name: '推播通知',
        enabled: true,
        settings: {
          sound: true,
          badge: true,
          vibrate: true,
          priority: 'high'
        }
      },
      sms: {
        name: '簡訊',
        enabled: false,
        settings: {
          provider: 'twilio',
          cost: 0.01,
          maxLength: 160
        }
      }
    }
  },

  // 檔案狀態
  file: {
    uploading: '上傳中',
    uploaded: '已上傳',
    processing: '處理中',
    processed: '已處理',
    failed: '上傳失敗',
    deleted: '已刪除',
    states: [
      {
        id: 'uploading',
        name: '上傳中',
        color: '#1890ff',
        icon: 'upload',
        progress: true,
        cancellable: true
      },
      {
        id: 'uploaded',
        name: '已上傳',
        color: '#52c41a',
        icon: 'check',
        progress: false,
        cancellable: false
      },
      {
        id: 'processing',
        name: '處理中',
        color: '#faad14',
        icon: 'loading',
        progress: true,
        cancellable: false
      },
      {
        id: 'processed',
        name: '已處理',
        color: '#52c41a',
        icon: 'check-circle',
        progress: false,
        cancellable: false
      },
      {
        id: 'failed',
        name: '上傳失敗',
        color: '#f5222d',
        icon: 'close-circle',
        progress: false,
        cancellable: true
      }
    ]
  }
}
