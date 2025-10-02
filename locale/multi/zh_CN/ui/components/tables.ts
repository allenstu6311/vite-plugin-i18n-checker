export default {
  // 表格標題和描述
  titles: {
    dataTable: '資料表格',
    userList: '用戶列表',
    productList: '產品列表',
    orderList: '訂單列表',
    reportTable: '報表表格'
  },

  // 表格狀態
  states: {
    loading: '載入中...',
    empty: '暫無資料',
    error: '載入失敗',
    noResults: '沒有找到符合條件的資料',
    retry: '重試',
    refresh: '重新整理'
  },

  // 分頁控制
  pagination: {
    total: '共 {total} 筆資料',
    page: '第 {page} 頁，共 {totalPages} 頁',
    itemsPerPage: '每頁顯示',
    goToPage: '跳轉到第',
    pageLabel: '頁',
    first: '首頁',
    last: '末頁',
    previous: '上一頁',
    next: '下一頁',
    jump: '跳轉',
    showing: '顯示第 {start} 到 {end} 筆，共 {total} 筆'
  },

  // 排序控制
  sorting: {
    sortBy: '排序依據',
    ascending: '升序',
    descending: '降序',
    unsorted: '未排序',
    multiSort: '多欄排序',
    clearSort: '清除排序'
  },

  // 篩選控制
  filters: {
    title: '篩選條件',
    search: '搜尋',
    clear: '清除篩選',
    apply: '套用篩選',
    reset: '重設篩選',
    advanced: '進階篩選',
    quickFilters: '快速篩選',
    dateRange: '日期範圍',
    status: '狀態',
    category: '分類',
    tags: '標籤',
    custom: '自訂篩選'
  },

  // 欄位配置
  columns: {
    id: 'ID',
    name: '名稱',
    title: '標題',
    description: '描述',
    email: '電子郵件',
    phone: '電話',
    status: '狀態',
    role: '角色',
    createdAt: '建立時間',
    updatedAt: '更新時間',
    lastLogin: '最後登入',
    actions: '操作',
    select: '選擇',
    index: '序號'
  },

  // 操作按鈕
  actions: {
    view: '檢視',
    edit: '編輯',
    delete: '刪除',
    duplicate: '複製',
    export: '匯出',
    import: '匯入',
    download: '下載',
    upload: '上傳',
    share: '分享',
    archive: '封存',
    restore: '還原',
    approve: '核准',
    reject: '拒絕',
    activate: '啟用',
    deactivate: '停用',
    suspend: '暫停',
    unsuspend: '取消暫停'
  },

  // 批量操作
  bulkActions: {
    title: '批量操作',
    selectAll: '全選',
    deselectAll: '取消全選',
    selected: '已選擇 {count} 個項目',
    selectPage: '選擇本頁',
    selectAllPages: '選擇所有頁面',
    clearSelection: '清除選擇',
    actions: [
      {
        id: 'bulkDelete',
        label: '批量刪除',
        icon: 'trash',
        confirm: '確定要刪除選中的 {count} 個項目嗎？'
      },
      {
        id: 'bulkExport',
        label: '批量匯出',
        icon: 'download',
        confirm: '確定要匯出選中的 {count} 個項目嗎？'
      },
      {
        id: 'bulkUpdate',
        label: '批量更新',
        icon: 'edit',
        confirm: '確定要更新選中的 {count} 個項目嗎？'
      },
      {
        id: 'bulkArchive',
        label: '批量封存',
        icon: 'archive',
        confirm: '確定要封存選中的 {count} 個項目嗎？'
      }
    ]
  },

  // 表格設定
  settings: {
    title: '表格設定',
    columns: {
      title: '顯示欄位',
      show: '顯示',
      hide: '隱藏',
      reset: '重設為預設',
      customize: '自訂欄位'
    },
    density: {
      title: '密度',
      compact: '緊湊',
      normal: '標準',
      comfortable: '舒適'
    },
    height: {
      title: '高度',
      auto: '自動',
      fixed: '固定',
      maxHeight: '最大高度'
    },
    sticky: {
      title: '固定設定',
      header: '固定表頭',
      columns: '固定欄位',
      left: '左側固定',
      right: '右側固定'
    }
  },

  // 資料類型顯示
  dataTypes: {
    text: {
      ellipsis: '...',
      expand: '展開',
      collapse: '收合',
      copy: '複製',
      search: '搜尋內容'
    },
    number: {
      format: {
        currency: '貨幣格式',
        percentage: '百分比格式',
        decimal: '小數格式',
        integer: '整數格式'
      }
    },
    date: {
      format: {
        full: '完整日期時間',
        date: '日期',
        time: '時間',
        relative: '相對時間'
      },
      relative: {
        now: '現在',
        minutesAgo: '{count} 分鐘前',
        hoursAgo: '{count} 小時前',
        daysAgo: '{count} 天前',
        weeksAgo: '{count} 週前',
        monthsAgo: '{count} 個月前',
        yearsAgo: '{count} 年前'
      }
    },
    status: {
      active: '啟用',
      inactive: '停用',
      pending: '待審核',
      approved: '已核准',
      rejected: '已拒絕',
      suspended: '已暫停',
      archived: '已封存'
    },
    boolean: {
      true: '是',
      false: '否',
      yes: '是',
      no: '否',
      enabled: '啟用',
      disabled: '停用'
    }
  },

  // 表格工具列
  toolbar: {
    search: {
      placeholder: '搜尋表格內容...',
      clear: '清除搜尋',
      advanced: '進階搜尋'
    },
    filters: {
      active: '有 {count} 個篩選條件',
      clear: '清除所有篩選',
      apply: '套用篩選'
    },
    view: {
      list: '清單檢視',
      grid: '網格檢視',
      card: '卡片檢視',
      table: '表格檢視'
    },
    density: {
      compact: '緊湊',
      normal: '標準',
      comfortable: '舒適'
    },
    refresh: '重新整理',
    exportData: '匯出',
    settings: '設定'
  },

  // 表格選單
  contextMenu: {
    copyText: '複製',
    copyValue: '複製值',
    copyRow: '複製行',
    copyColumn: '複製欄位',
    editItem: '編輯',
    deleteItem: '刪除',
    duplicateItem: '複製項目',
    viewItem: '檢視',
    shareItem: '分享',
    exportItem: '匯出',
    print: '列印'
  },

  // 表格載入狀態
  loading: {
    skeleton: '載入中...',
    spinner: '載入中...',
    progress: '載入進度：{percent}%',
    message: '正在載入資料，請稍候...'
  },

  // 表格錯誤處理
  errors: {
    network: '網路連線錯誤',
    server: '伺服器錯誤',
    permission: '權限不足',
    notFound: '找不到資料',
    timeout: '請求逾時',
    unknown: '未知錯誤',
    retry: '重試',
    contact: '聯絡技術支援'
  }
}
