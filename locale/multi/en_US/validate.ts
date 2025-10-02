export default {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  password: {
    minLength: 'Password must be at least 8 characters',
    complexity: 'Password must contain uppercase, lowercase, numbers and special characters',
    // mismatch: 'Password confirmation does not match'  // 缺少這個 key
  },
  phone: 'Please enter a valid phone number',
  url: 'Please enter a valid URL',
  date: 'Please enter a valid date',
  number: {
    min: 'Value cannot be less than {min}',
    max: 'Value cannot be greater than {max}',
    integer: 'Please enter an integer'
  },
  file: {
    maxSize: 'File size cannot exceed {size}MB',
    allowedTypes: 'Only {types} format files are allowed',
    required: 'Please select a file'
  },
  array: {
    minLength: 'At least {min} items required',
    maxLength: 'Maximum {max} items allowed'
  }
}