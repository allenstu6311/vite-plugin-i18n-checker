export default {
  // 基本驗證訊息
  basic: {
    required: '此欄位為必填',
    optional: '此欄位為選填',
    invalid: '格式不正確',
    valid: '格式正確',
    loading: '驗證中...',
    success: '驗證通過',
    error: '驗證失敗'
  },

  // 字串驗證
  string: {
    minLength: '長度不能少於 {min} 個字元',
    maxLength: '長度不能超過 {max} 個字元',
    exactLength: '長度必須為 {length} 個字元',
    pattern: '格式不正確，請檢查輸入內容',
    alphanumeric: '只能包含字母和數字',
    noSpaces: '不能包含空格',
    noSpecialChars: '不能包含特殊字元',
    startsWith: '必須以 {prefix} 開頭',
    endsWith: '必須以 {suffix} 結尾',
    contains: '必須包含 {text}',
    notContains: '不能包含 {text}',
    unique: '此值已存在，請選擇其他值',
    duplicate: '此值重複，請檢查輸入'
  },

  // 數字驗證
  number: {
    min: '數值不能小於 {min}',
    max: '數值不能大於 {max}',
    range: '數值必須在 {min} 到 {max} 之間',
    integer: '請輸入整數',
    decimal: '請輸入小數',
    positive: '請輸入正數',
    negative: '請輸入負數',
    zero: '不能為零',
    notZero: '必須為零',
    even: '必須為偶數',
    odd: '必須為奇數',
    multipleOf: '必須為 {multiple} 的倍數',
    divisibleBy: '必須能被 {divisor} 整除'
  },

  // 電子郵件驗證
  email: {
    invalid: '請輸入有效的電子郵件地址',
    format: '電子郵件格式不正確',
    domain: '不支援的網域',
    disposable: '不允許使用一次性電子郵件',
    alreadyExists: '此電子郵件已被使用',
    notExists: '此電子郵件不存在',
    verification: {
      sent: '驗證郵件已發送',
      expired: '驗證連結已過期',
      invalid: '驗證連結無效',
      success: '電子郵件驗證成功'
    }
  },

  // 密碼驗證
  password: {
    minLength: '密碼至少需要 {min} 個字元',
    maxLength: '密碼最多 {max} 個字元',
    complexity: {
      required: '密碼必須包含大小寫字母、數字和特殊字元',
      uppercase: '必須包含至少一個大寫字母',
      lowercase: '必須包含至少一個小寫字母',
      number: '必須包含至少一個數字',
      special: '必須包含至少一個特殊字元',
      noSpaces: '不能包含空格',
      noUsername: '不能包含使用者名稱',
      noCommon: '不能使用常見密碼'
    },
    confirmation: {
      mismatch: '密碼確認不匹配',
      required: '請確認密碼',
      same: '密碼和確認密碼必須相同'
    },
    strength: {
      weak: '密碼強度：弱',
      medium: '密碼強度：中',
      strong: '密碼強度：強',
      veryStrong: '密碼強度：非常強'
    },
    history: {
      reused: '不能使用最近使用過的密碼',
      maxHistory: '最多保留 {max} 個歷史密碼'
    }
  },

  // 電話號碼驗證
  phone: {
    invalid: '請輸入有效的手機號碼',
    format: '手機號碼格式不正確',
    country: '不支援的國家代碼',
    length: '手機號碼長度不正確',
    area: '不支援的區域代碼',
    verification: {
      sent: '驗證簡訊已發送',
      code: '請輸入驗證碼',
      expired: '驗證碼已過期',
      invalid: '驗證碼無效',
      success: '手機號碼驗證成功'
    }
  },

  // 網址驗證
  url: {
    invalid: '請輸入有效的網址',
    protocol: '請包含 http:// 或 https://',
    domain: '網域名稱不正確',
    path: '路徑格式不正確',
    query: '查詢參數格式不正確',
    fragment: '錨點格式不正確',
    ssl: '必須使用 HTTPS 協議',
    accessible: '網址無法訪問',
    timeout: '網址訪問超時'
  },

  // 日期驗證
  date: {
    invalid: '請輸入有效的日期',
    format: '日期格式不正確',
    min: '日期不能早於 {min}',
    max: '日期不能晚於 {max}',
    range: '日期必須在 {min} 到 {max} 之間',
    past: '不能選擇過去的日期',
    future: '不能選擇未來的日期',
    today: '不能選擇今天',
    notToday: '必須選擇今天',
    weekday: '不能選擇週末',
    weekend: '必須選擇週末',
    businessDay: '必須選擇工作日',
    holiday: '不能選擇假日'
  },

  // 時間驗證
  time: {
    invalid: '請輸入有效的時間',
    format: '時間格式不正確',
    min: '時間不能早於 {min}',
    max: '時間不能晚於 {max}',
    range: '時間必須在 {min} 到 {max} 之間',
    businessHours: '必須在營業時間內',
    afterHours: '營業時間外',
    lunchBreak: '午休時間',
    closed: '休息時間'
  },

  // 檔案驗證
  file: {
    required: '請選擇檔案',
    maxSize: '檔案大小不能超過 {size}',
    minSize: '檔案大小不能少於 {size}',
    maxFiles: '最多只能上傳 {max} 個檔案',
    minFiles: '至少需要上傳 {min} 個檔案',
    allowedTypes: '只允許 {types} 格式的檔案',
    forbiddenTypes: '不允許 {types} 格式的檔案',
    image: {
      dimensions: '圖片尺寸必須在 {minWidth}x{minHeight} 到 {maxWidth}x{maxHeight} 之間',
      aspectRatio: '圖片比例必須為 {ratio}',
      minWidth: '圖片寬度不能少於 {min} 像素',
      maxWidth: '圖片寬度不能超過 {max} 像素',
      minHeight: '圖片高度不能少於 {min} 像素',
      maxHeight: '圖片高度不能超過 {max} 像素'
    },
    virus: {
      detected: '檔案包含病毒，無法上傳',
      scanning: '正在掃描檔案...',
      clean: '檔案掃描通過'
    }
  },

  // 陣列驗證
  array: {
    minLength: '至少需要 {min} 個項目',
    maxLength: '最多只能有 {max} 個項目',
    exactLength: '必須有 {length} 個項目',
    unique: '項目不能重複',
    duplicate: '發現重複項目',
    empty: '陣列不能為空',
    notEmpty: '陣列必須有內容',
    contains: '必須包含 {item}',
    notContains: '不能包含 {item}',
    allValid: '所有項目都必須有效',
    someValid: '至少有一個項目必須有效'
  },

  // 物件驗證
  object: {
    required: '此物件為必填',
    invalid: '物件格式不正確',
    missingFields: '缺少必要欄位：{fields}',
    extraFields: '包含不允許的欄位：{fields}',
    nested: {
      invalid: '巢狀物件格式不正確',
      required: '巢狀物件為必填',
      optional: '巢狀物件為選填'
    }
  },

  // 自訂驗證
  custom: {
    callback: '自訂驗證失敗',
    async: '非同步驗證中...',
    timeout: '驗證超時',
    network: '網路驗證失敗',
    server: '伺服器驗證失敗'
  },

  // 驗證規則組合
  rules: {
    and: '所有條件都必須滿足',
    or: '至少一個條件必須滿足',
    not: '條件不能滿足',
    if: '如果 {condition} 則 {then}',
    unless: '除非 {condition} 否則 {then}',
    when: '當 {field} 為 {value} 時',
    requiredIf: '當 {field} 為 {value} 時此欄位為必填',
    requiredUnless: '除非 {field} 為 {value} 否則此欄位為必填',
    requiredWith: '當 {fields} 存在時此欄位為必填',
    requiredWithAll: '當所有 {fields} 都存在時此欄位為必填',
    requiredWithout: '當 {fields} 不存在時此欄位為必填',
    requiredWithoutAll: '當所有 {fields} 都不存在時此欄位為必填'
  },

  // 驗證狀態
  states: {
    validating: '驗證中...',
    valid: '驗證通過',
    invalid: '驗證失敗',
    pending: '等待驗證',
    skipped: '跳過驗證',
    error: '驗證錯誤',
    success: '驗證成功'
  }
}
