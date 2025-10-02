export default {
  // 基本狀態
  basic: {
    active: 'Active',
    inactive: 'Inactive',
    pending: 'Pending Review',
    suspended: 'Suspended',
    // deleted: 'Deleted',  // 缺少這個 key
    archived: 'Archived',
    draft: 'Draft',
    published: 'Published'
  },

  // 用戶狀態
  user: {
    online: 'Online',
    offline: 'Offline',
    busy: 'Busy',
    away: 'Away',
    invisible: 'Invisible',
    statuses: [
      {
        id: 'online',
        name: 'Online',
        color: '#52c41a',
        icon: 'circle',
        description: 'User is currently active'
      },
      {
        id: 'offline',
        name: 'Offline',
        color: '#d9d9d9',
        icon: 'circle',
        description: 'User is offline'
      },
      {
        id: 'busy',
        name: 'Busy',
        color: '#faad14',
        icon: 'circle',
        description: 'User is busy'
      },
      {
        id: 'away',
        name: 'Away',
        color: '#f5222d',
        icon: 'circle',
        description: 'User is temporarily away'
      }
    ]
  },

  // 訂單狀態
  order: {
    pending: 'Pending',
    confirmed: 'Confirmed',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    refunded: 'Refunded',
    statuses: [
      {
        id: 'pending',
        name: 'Pending',
        color: '#faad14',
        icon: 'clock-circle',
        description: 'Order waiting for processing',
        actions: ['confirm', 'cancel'],
        nextStatus: ['confirmed', 'cancelled']
      },
      {
        id: 'confirmed',
        name: 'Confirmed',
        color: '#1890ff',
        icon: 'check-circle',
        description: 'Order has been confirmed',
        actions: ['process', 'cancel'],
        nextStatus: ['processing', 'cancelled']
      },
      {
        id: 'processing',
        name: 'Processing',
        color: '#722ed1',
        icon: 'loading',
        description: 'Order is being processed',
        actions: ['ship', 'cancel'],
        nextStatus: ['shipped', 'cancelled']
      },
      {
        id: 'shipped',
        name: 'Shipped',
        color: '#13c2c2',
        icon: 'truck',
        description: 'Products have been shipped',
        actions: ['deliver'],
        nextStatus: ['delivered']
      },
      {
        id: 'delivered',
        name: 'Delivered',
        color: '#52c41a',
        icon: 'check',
        description: 'Order has been completed',
        actions: ['refund'],
        nextStatus: ['refunded']
      }
    ]
  },

  // 優先級
  priority: {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent',
    critical: 'Critical',
    levels: [
      {
        id: 'low',
        name: 'Low',
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
        name: 'Medium',
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
        name: 'High',
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
        name: 'Urgent',
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
        name: 'Critical',
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
    unread: 'Unread',
    read: 'Read',
    archived: 'Archived',
    deleted: 'Deleted',
    types: [
      {
        id: 'info',
        name: 'Information',
        color: '#1890ff',
        icon: 'info-circle',
        sound: false,
        vibration: false
      },
      {
        id: 'success',
        name: 'Success',
        color: '#52c41a',
        icon: 'check-circle',
        sound: true,
        vibration: false
      },
      {
        id: 'warning',
        name: 'Warning',
        color: '#faad14',
        icon: 'exclamation-circle',
        sound: true,
        vibration: true
      },
      {
        id: 'error',
        name: 'Error',
        color: '#f5222d',
        icon: 'close-circle',
        sound: true,
        vibration: true
      }
    ],
    channels: {
      inApp: {
        name: 'In-App',
        enabled: true,
        settings: {
          showBadge: true,
          playSound: true,
          vibrate: false,
          autoHide: 5000
        }
      },
      email: {
        name: 'Email',
        enabled: true,
        settings: {
          template: 'default',
          priority: 'normal',
          attachments: false
        }
      },
      push: {
        name: 'Push Notification',
        enabled: true,
        settings: {
          sound: true,
          badge: true,
          vibrate: true,
          priority: 'high'
        }
      },
      sms: {
        name: 'SMS',
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
    uploading: 'Uploading',
    uploaded: 'Uploaded',
    processing: 'Processing',
    processed: 'Processed',
    failed: 'Upload Failed',
    deleted: 'Deleted',
    states: [
      {
        id: 'uploading',
        name: 'Uploading',
        color: '#1890ff',
        icon: 'upload',
        progress: true,
        cancellable: true
      },
      {
        id: 'uploaded',
        name: 'Uploaded',
        color: '#52c41a',
        icon: 'check',
        progress: false,
        cancellable: false
      },
      {
        id: 'processing',
        name: 'Processing',
        color: '#faad14',
        icon: 'loading',
        progress: true,
        cancellable: false
      },
      {
        id: 'processed',
        name: 'Processed',
        color: '#52c41a',
        icon: 'check-circle',
        progress: false,
        cancellable: false
      },
      {
        id: 'failed',
        name: 'Upload Failed',
        color: '#f5222d',
        icon: 'close-circle',
        progress: false,
        cancellable: true
      }
    ]
  }
}
