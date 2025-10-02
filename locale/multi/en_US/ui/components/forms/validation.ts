export default {
  // 基本驗證訊息
  basic: {
    required: 'This field is required',
    optional: 'This field is optional',
    invalid: 'Invalid format',
    valid: 'Valid format',
    loading: 'Validating...',
    success: 'Validation passed',
    error: 'Validation failed'
  },

  // 字串驗證
  string: {
    minLength: 'Length cannot be less than {min} characters',
    maxLength: 'Length cannot exceed {max} characters',
    exactLength: 'Length must be exactly {length} characters',
    pattern: 'Invalid format, please check your input',
    alphanumeric: 'Only letters and numbers allowed',
    noSpaces: 'Spaces are not allowed',
    noSpecialChars: 'Special characters are not allowed',
    startsWith: 'Must start with {prefix}',
    endsWith: 'Must end with {suffix}',
    contains: 'Must contain {text}',
    notContains: 'Cannot contain {text}',
    unique: 'This value already exists, please choose another',
    duplicate: 'This value is duplicated, please check your input'
  },

  // 數字驗證
  number: {
    min: 'Value cannot be less than {min}',
    max: 'Value cannot be greater than {max}',
    range: 'Value must be between {min} and {max}',
    integer: 'Please enter an integer',
    decimal: 'Please enter a decimal',
    positive: 'Please enter a positive number',
    negative: 'Please enter a negative number',
    zero: 'Cannot be zero',
    notZero: 'Must be zero',
    even: 'Must be an even number',
    odd: 'Must be an odd number',
    multipleOf: 'Must be a multiple of {multiple}',
    divisibleBy: 'Must be divisible by {divisor}'
  },

  // 電子郵件驗證
  email: {
    invalid: 'Please enter a valid email address',
    format: 'Invalid email format',
    domain: 'Unsupported domain',
    disposable: 'Disposable email addresses are not allowed',
    alreadyExists: 'This email is already in use',
    notExists: 'This email does not exist',
    verification: {
      sent: 'Verification email sent',
      expired: 'Verification link expired',
      invalid: 'Invalid verification link',
      success: 'Email verification successful'
    }
  },

  // 密碼驗證
  password: {
    minLength: 'Password must be at least {min} characters',
    maxLength: 'Password cannot exceed {max} characters',
    complexity: {
      required: 'Password must contain uppercase, lowercase, numbers and special characters',
      uppercase: 'Must contain at least one uppercase letter',
      lowercase: 'Must contain at least one lowercase letter',
      number: 'Must contain at least one number',
      special: 'Must contain at least one special character',
      noSpaces: 'Cannot contain spaces',
      noUsername: 'Cannot contain username',
      noCommon: 'Cannot use common passwords'
    },
    confirmation: {
      mismatch: 'Password confirmation does not match',
      required: 'Please confirm password',
      same: 'Password and confirmation must be the same'
    },
    strength: {
      weak: 'Password strength: Weak',
      medium: 'Password strength: Medium',
      strong: 'Password strength: Strong',
      veryStrong: 'Password strength: Very Strong'
    },
    history: {
      reused: 'Cannot reuse recently used passwords',
      maxHistory: 'Maximum {max} password history retained'
    }
  },

  // 電話號碼驗證
  phone: {
    invalid: 'Please enter a valid phone number',
    format: 'Invalid phone number format',
    country: 'Unsupported country code',
    length: 'Invalid phone number length',
    area: 'Unsupported area code',
    verification: {
      sent: 'Verification SMS sent',
      code: 'Please enter verification code',
      expired: 'Verification code expired',
      invalid: 'Invalid verification code',
      success: 'Phone number verification successful'
    }
  },

  // 網址驗證
  url: {
    invalid: 'Please enter a valid URL',
    protocol: 'Please include http:// or https://',
    domain: 'Invalid domain name',
    path: 'Invalid path format',
    query: 'Invalid query parameter format',
    fragment: 'Invalid fragment format',
    ssl: 'Must use HTTPS protocol',
    accessible: 'URL is not accessible',
    timeout: 'URL access timeout'
  },

  // 日期驗證
  date: {
    invalid: 'Please enter a valid date',
    format: 'Invalid date format',
    min: 'Date cannot be earlier than {min}',
    max: 'Date cannot be later than {max}',
    range: 'Date must be between {min} and {max}',
    past: 'Cannot select past dates',
    future: 'Cannot select future dates',
    today: 'Cannot select today',
    notToday: 'Must select today',
    weekday: 'Cannot select weekends',
    weekend: 'Must select weekends',
    businessDay: 'Must select business days',
    holiday: 'Cannot select holidays'
  },

  // 時間驗證
  time: {
    invalid: 'Please enter a valid time',
    format: 'Invalid time format',
    min: 'Time cannot be earlier than {min}',
    max: 'Time cannot be later than {max}',
    range: 'Time must be between {min} and {max}',
    businessHours: 'Must be within business hours',
    afterHours: 'After business hours',
    lunchBreak: 'Lunch break time',
    closed: 'Closed hours'
  },

  // 檔案驗證
  file: {
    required: 'Please select a file',
    maxSize: 'File size cannot exceed {size}',
    minSize: 'File size cannot be less than {size}',
    maxFiles: 'Maximum {max} files allowed',
    minFiles: 'At least {min} files required',
    allowedTypes: 'Only {types} format files allowed',
    forbiddenTypes: '{types} format files not allowed',
    image: {
      dimensions: 'Image dimensions must be between {minWidth}x{minHeight} and {maxWidth}x{maxHeight}',
      aspectRatio: 'Image aspect ratio must be {ratio}',
      minWidth: 'Image width cannot be less than {min} pixels',
      maxWidth: 'Image width cannot exceed {max} pixels',
      minHeight: 'Image height cannot be less than {min} pixels',
      maxHeight: 'Image height cannot exceed {max} pixels'
    },
    virus: {
      detected: 'File contains virus, cannot upload',
      scanning: 'Scanning file...',
      clean: 'File scan passed'
    }
  },

  // 陣列驗證
  array: {
    minLength: 'At least {min} items required',
    maxLength: 'Maximum {max} items allowed',
    exactLength: 'Must have exactly {length} items',
    unique: 'Items cannot be duplicated',
    duplicate: 'Duplicate items found',
    empty: 'Array cannot be empty',
    notEmpty: 'Array must have content',
    contains: 'Must contain {item}',
    notContains: 'Cannot contain {item}',
    allValid: 'All items must be valid',
    someValid: 'At least one item must be valid'
  },

  // 物件驗證
  object: {
    required: 'This object is required',
    invalid: 'Invalid object format',
    missingFields: 'Missing required fields: {fields}',
    extraFields: 'Contains disallowed fields: {fields}',
    nested: {
      invalid: 'Invalid nested object format',
      required: 'Nested object is required',
      optional: 'Nested object is optional'
    }
  },

  // 自訂驗證
  custom: {
    callback: 'Custom validation failed',
    async: 'Async validation in progress...',
    timeout: 'Validation timeout',
    network: 'Network validation failed',
    server: 'Server validation failed'
  },

  // 驗證規則組合
  rules: {
    and: 'All conditions must be met',
    or: 'At least one condition must be met',
    not: 'Condition must not be met',
    if: 'If {condition} then {then}',
    unless: 'Unless {condition} then {then}',
    when: 'When {field} is {value}',
    requiredIf: 'This field is required when {field} is {value}',
    requiredUnless: 'This field is required unless {field} is {value}',
    requiredWith: 'This field is required when {fields} exist',
    requiredWithAll: 'This field is required when all {fields} exist',
    requiredWithout: 'This field is required when {fields} do not exist',
    requiredWithoutAll: 'This field is required when all {fields} do not exist'
  },

  // 驗證狀態
  states: {
    validating: 'Validating...',
    valid: 'Validation passed',
    invalid: 'Validation failed',
    pending: 'Pending validation',
    skipped: 'Validation skipped',
    error: 'Validation error',
    success: 'Validation successful'
  }
}
