export default {
  // 表單標題和描述
  titles: {
    create: 'Create {type}',
    edit: 'Edit {type}',
    view: 'View {type}',
    delete: 'Delete {type}',
    duplicate: 'Duplicate {type}'
  },

  // 基本表單元件
  inputs: {
    text: {
      placeholder: 'Enter {field}',
      required: 'This field is required',
      optional: 'This field is optional',
      search: 'Search {field}...',
      filter: 'Filter {field}...'
    },
    email: {
      placeholder: 'Enter email address',
      invalid: 'Please enter a valid email address',
      alreadyExists: 'This email is already in use',
      required: 'Email is required'
    },
    password: {
      placeholder: 'Enter password',
      confirm: 'Confirm password',
      requirements: {
        minLength: 'At least {min} characters',
        maxLength: 'Maximum {max} characters',
        complexity: 'Must contain uppercase, lowercase, numbers and special characters',
        mismatch: 'Password confirmation does not match',
        tooCommon: 'Password is too common, please choose a more secure password'
      }
    },
    phone: {
      placeholder: 'Enter phone number',
      invalid: 'Please enter a valid phone number',
      format: 'Format: XXX-XXX-XXXX',
      countryCode: 'Country Code'
    },
    url: {
      placeholder: 'Enter URL',
      invalid: 'Please enter a valid URL',
      protocol: 'Please include http:// or https://'
    }
  },

  // 選擇元件
  selects: {
    placeholder: 'Select {field}',
    noOptions: 'No options available',
    loading: 'Loading...',
    search: 'Search options...',
    selectAll: 'Select All',
    deselectAll: 'Deselect All',
    clear: 'Clear selection',
    createNew: 'Create new option',
    maxSelections: 'Maximum {max} selections allowed'
  },

  // 複選框和單選框
  checkboxes: {
    selectAll: 'Select All',
    deselectAll: 'Deselect All',
    indeterminate: 'Partially selected',
    required: 'At least one option must be selected'
  },
  radios: {
    selectOne: 'Please select one option',
    required: 'This field is required'
  },

  // 文字區域
  textarea: {
    placeholder: 'Enter detailed content...',
    maxLength: 'Maximum {max} characters',
    minLength: 'Minimum {min} characters',
    rows: 'Rows',
    resize: 'Resize'
  },

  // 檔案上傳
  upload: {
    dragAndDrop: 'Drag files here or click to select',
    selectFiles: 'Select Files',
    maxFiles: 'Maximum {max} files',
    maxSize: 'File size cannot exceed {size}',
    allowedTypes: 'Supported file types: {types}',
    progress: 'Upload progress: {percent}%',
    success: 'Upload successful',
    error: 'Upload failed',
    retry: 'Retry',
    cancel: 'Cancel',
    remove: 'Remove',
    preview: 'Preview'
  },

  // 日期時間選擇器
  dateTime: {
    date: {
      placeholder: 'Select date',
      format: 'YYYY-MM-DD',
      invalid: 'Please select a valid date',
      minDate: 'Date cannot be earlier than {date}',
      maxDate: 'Date cannot be later than {date}',
      disabled: 'This date is not selectable'
    },
    time: {
      placeholder: 'Select time',
      format: 'HH:mm',
      invalid: 'Please select a valid time',
      minTime: 'Time cannot be earlier than {time}',
      maxTime: 'Time cannot be later than {time}'
    },
    range: {
      placeholder: 'Select date range',
      startDate: 'Start Date',
      endDate: 'End Date',
      invalid: 'Please select a valid date range',
      maxRange: 'Date range cannot exceed {days} days'
    }
  },

  // 表單驗證訊息
  validation: {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    url: 'Please enter a valid URL',
    phone: 'Please enter a valid phone number',
    number: {
      min: 'Value cannot be less than {min}',
      max: 'Value cannot be greater than {max}',
      integer: 'Please enter an integer',
      decimal: 'Please enter a decimal',
      positive: 'Please enter a positive number',
      negative: 'Please enter a negative number'
    },
    string: {
      minLength: 'Length cannot be less than {min} characters',
      maxLength: 'Length cannot exceed {max} characters',
      pattern: 'Format is incorrect',
      alphanumeric: 'Only letters and numbers allowed',
      noSpaces: 'Spaces are not allowed'
    },
    array: {
      minLength: 'At least {min} items required',
      maxLength: 'Maximum {max} items allowed',
      unique: 'Items cannot be duplicated'
    },
    file: {
      maxSize: 'File size cannot exceed {size}',
      allowedTypes: 'Only {types} format files allowed',
      required: 'Please select a file'
    }
  },

  // 表單動作按鈕
  actions: {
    submit: 'Submit',
    save: 'Save',
    cancel: 'Cancel',
    reset: 'Reset',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    duplicate: 'Duplicate',
    export: 'Export',
    import: 'Import',
    preview: 'Preview',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    finish: 'Finish',
    close: 'Close',
    confirm: 'Confirm',
    apply: 'Apply',
    clear: 'Clear',
    refresh: 'Refresh',
    loading: 'Processing...'
  },

  // 表單狀態
  states: {
    loading: 'Loading...',
    saving: 'Saving...',
    submitting: 'Submitting...',
    success: 'Operation successful',
    error: 'Operation failed',
    warning: 'Please note',
    info: 'Information'
  },

  // 表單佈局
  layout: {
    columns: {
      single: 'Single Column',
      double: 'Double Column',
      triple: 'Triple Column',
      auto: 'Auto'
    },
    spacing: {
      compact: 'Compact',
      normal: 'Normal',
      loose: 'Loose'
    },
    alignment: {
      left: 'Left Align',
      center: 'Center',
      right: 'Right Align'
    }
  }
}
