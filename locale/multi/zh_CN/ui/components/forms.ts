export default {
  // 表單標題和描述
  titles: {
    create: '新增{type}',
    edit: '編輯{type}',
    view: '檢視{type}',
    delete: '刪除{type}',
    duplicate: '複製{type}'
  },

  // 基本表單元件
  inputs: {
    text: {
      placeholder: '請輸入{field}',
      required: '此欄位為必填',
      optional: '此欄位為選填',
      search: '搜尋{field}...',
      filter: '篩選{field}...'
    },
    email: {
      placeholder: '請輸入電子郵件地址',
      invalid: '請輸入有效的電子郵件地址',
      alreadyExists: '此電子郵件已被使用',
      required: '電子郵件為必填欄位'
    },
    password: {
      placeholder: '請輸入密碼',
      confirm: '請確認密碼',
      requirements: {
        minLength: '至少 {min} 個字元',
        maxLength: '最多 {max} 個字元',
        complexity: '必須包含大小寫字母、數字和特殊字元',
        mismatch: '密碼確認不匹配',
        tooCommon: '密碼過於常見，請選擇更安全的密碼'
      }
    },
    phone: {
      placeholder: '請輸入手機號碼',
      invalid: '請輸入有效的手機號碼',
      format: '格式：09XX-XXX-XXX',
      countryCode: '國家代碼'
    },
    url: {
      placeholder: '請輸入網址',
      invalid: '請輸入有效的網址',
      protocol: '請包含 http:// 或 https://'
    }
  },

  // 選擇元件
  selects: {
    placeholder: '請選擇{field}',
    noOptions: '暫無選項',
    loading: '載入中...',
    search: '搜尋選項...',
    selectAll: '全選',
    deselectAll: '取消全選',
    clear: '清除選擇',
    createNew: '新增新選項',
    maxSelections: '最多可選擇 {max} 個選項'
  },

  // 複選框和單選框
  checkboxes: {
    selectAll: '全選',
    deselectAll: '取消全選',
    indeterminate: '部分選中',
    required: '至少選擇一個選項'
  },
  radios: {
    selectOne: '請選擇一個選項',
    required: '此欄位為必填'
  },

  // 文字區域
  textarea: {
    placeholder: '請輸入詳細內容...',
    maxLength: '最多 {max} 個字元',
    minLength: '至少 {min} 個字元',
    rows: '行數',
    resize: '調整大小'
  },

  // 檔案上傳
  upload: {
    dragAndDrop: '拖拽檔案到此處或點擊選擇',
    selectFiles: '選擇檔案',
    maxFiles: '最多上傳 {max} 個檔案',
    maxSize: '檔案大小不能超過 {size}',
    allowedTypes: '支援的檔案類型：{types}',
    progress: '上傳進度：{percent}%',
    success: '上傳成功',
    error: '上傳失敗',
    retry: '重試',
    cancel: '取消',
    remove: '移除',
    preview: '預覽'
  },

  // 日期時間選擇器
  dateTime: {
    date: {
      placeholder: '選擇日期',
      format: 'YYYY-MM-DD',
      invalid: '請選擇有效的日期',
      minDate: '日期不能早於 {date}',
      maxDate: '日期不能晚於 {date}',
      disabled: '此日期不可選擇'
    },
    time: {
      placeholder: '選擇時間',
      format: 'HH:mm',
      invalid: '請選擇有效的時間',
      minTime: '時間不能早於 {time}',
      maxTime: '時間不能晚於 {time}'
    },
    range: {
      placeholder: '選擇日期範圍',
      startDate: '開始日期',
      endDate: '結束日期',
      invalid: '請選擇有效的日期範圍',
      maxRange: '日期範圍不能超過 {days} 天'
    }
  },

  // 表單驗證訊息
  validation: {
    required: '此欄位為必填',
    email: '請輸入有效的電子郵件地址',
    url: '請輸入有效的網址',
    phone: '請輸入有效的手機號碼',
    number: {
      min: '數值不能小於 {min}',
      max: '數值不能大於 {max}',
      integer: '請輸入整數',
      decimal: '請輸入小數',
      positive: '請輸入正數',
      negative: '請輸入負數'
    },
    string: {
      minLength: '長度不能少於 {min} 個字元',
      maxLength: '長度不能超過 {max} 個字元',
      pattern: '格式不正確',
      alphanumeric: '只能包含字母和數字',
      noSpaces: '不能包含空格'
    },
    array: {
      minLength: '至少需要 {min} 個項目',
      maxLength: '最多只能有 {max} 個項目',
      unique: '項目不能重複'
    },
    file: {
      maxSize: '檔案大小不能超過 {size}',
      allowedTypes: '只允許 {types} 格式的檔案',
      required: '請選擇檔案'
    }
  },

  // 表單動作按鈕
  actions: {
    submit: '提交',
    save: '儲存',
    cancel: '取消',
    reset: '重設',
    delete: '刪除',
    edit: '編輯',
    view: '檢視',
    duplicate: '複製',
    export: '匯出',
    import: '匯入',
    preview: '預覽',
    back: '返回',
    next: '下一步',
    previous: '上一步',
    finish: '完成',
    close: '關閉',
    confirm: '確認',
    apply: '套用',
    clear: '清除',
    refresh: '重新整理',
    loading: '處理中...'
  },

  // 表單狀態
  states: {
    loading: '載入中...',
    saving: '儲存中...',
    submitting: '提交中...',
    success: '操作成功',
    error: '操作失敗',
    warning: '請注意',
    info: '提示資訊'
  },

  // 表單佈局
  layout: {
    columns: {
      single: '單欄',
      double: '雙欄',
      triple: '三欄',
      auto: '自動'
    },
    spacing: {
      compact: '緊湊',
      normal: '標準',
      loose: '寬鬆'
    },
    alignment: {
      left: '左對齊',
      center: '置中',
      right: '右對齊'
    }
  }
}
