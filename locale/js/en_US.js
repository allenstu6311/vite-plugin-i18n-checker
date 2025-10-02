export default {
  // 應用程式基本資訊
  app: {
    name: 'My Application',
    version: '1.0.0',
    description: 'This is a multilingual application'
  },

  // 導航選單
  navigation: {
    home: 'Home',
    about: 'About Us',
    contact: 'Contact',
    products: 'Products',
    services: 'Services',
    blog: 'Blog'
  },

  // 使用者相關
  user: {
    profile: {
      title: 'Profile',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      avatar: 'Avatar'
    },
    settings: {
      title: 'Settings',
      language: 'Language',
      theme: 'Theme',
      notifications: 'Notifications',
      privacy: 'Privacy Settings'
    }
  },

  // 儀表板
  dashboard: {
    title: 'Dashboard',
    welcome: 'Welcome back, {name}!',
    stats: {
      totalUsers: 'Total Users',
      activeUsers: 'Active Users',
      revenue: 'Revenue',
      orders: 'Orders'
    },
    charts: {
      userGrowth: 'User Growth',
      revenueChart: 'Revenue Chart',
      activityChart: 'Activity Chart'
    }
  },

  // 表單相關
  forms: {
    labels: {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      phone: 'Phone Number',
      birthday: 'Birthday',
      gender: 'Gender'
    },
    placeholders: {
      enterName: 'Enter your name',
      enterEmail: 'Enter your email',
      enterPassword: 'Enter your password',
      selectGender: 'Select gender'
    },
    buttons: {
      submit: 'Submit',
      cancel: 'Cancel',
      save: 'Save',
      reset: 'Reset'
    }
  },

  // 訊息相關
  messages: {
    success: {
      saved: 'Data saved successfully',
      deleted: 'Data deleted successfully',
      updated: 'Data updated successfully',
      created: 'Data created successfully'
    },
    error: {
      required: 'This field is required',
      invalidEmail: 'Please enter a valid email address',
      passwordMismatch: 'Password confirmation does not match',
      networkError: 'Network connection error'
    },
    confirm: {
      delete: 'Are you sure you want to delete this item?',
      logout: 'Are you sure you want to logout?',
      reset: 'Are you sure you want to reset all settings?'
    }
  },

  // 額外的 key（在基準語言中沒有）
  // extra: {
  //   newFeature: 'New Feature Available',
  //   beta: 'Beta Version',
  //   comingSoon: 'Coming Soon'
  // }
}