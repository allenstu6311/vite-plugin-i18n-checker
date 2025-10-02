export default {
  required: '此欄位為必填',
  email: '請輸入有效的電子郵件',
  password: {
    minLength: '密碼至少需要 8 個字元',
    complexity: '密碼必須包含大小寫字母、數字和特殊字元',
    mismatch: '密碼確認不匹配'
  },
  phone: '請輸入有效的手機號碼',
  url: '請輸入有效的網址',
  date: '請輸入有效的日期',
  number: {
    min: '數值不能小於 {min}',
    max: '數值不能大於 {max}',
    integer: '請輸入整數'
  },
  file: {
    maxSize: '檔案大小不能超過 {size}MB',
    allowedTypes: '只允許 {types} 格式的檔案',
    required: '請選擇檔案'
  },
  array: {
    minLength: '至少需要 {min} 個項目',
    maxLength: '最多只能有 {max} 個項目'
  }
}