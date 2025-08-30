export default {
    // 基本字串
    app: {
        name: 'i18n Checker Tool',
        version: '1.0.0',
        description: 'Tool for checking multi-language file integrity'
    },
    
    // 導航
    navigation: {
        home: 'Home',
        settings: 'Settings',
        profile: 'Profile',
        logout: 'Logout'
    },
    
    // 表單
    forms: {
        login: {
            title: 'Login System',
            username: 'Username',
            password: 'Password',
            submit: 'Login',
            forgotPassword: 'Forgot Password?',
            rememberMe: 'Remember Me'
        },
        register: {
            title: 'Register Account',
            email: 'Email',
            confirmPassword: 'Confirm Password',
            terms: 'I agree to the terms of service',
            submit: 'Register'
        }
    },
    
    // 驗證訊息
    validation: {
        required: 'This field is required',
        email: 'Please enter a valid email',
        minLength: 'Minimum {min} characters required',
        maxLength: 'Maximum {max} characters allowed',
        passwordMismatch: 'Passwords do not match'
    },
    
    // 錯誤訊息
    errors: {
        network: 'Network connection error',
        server: 'Server error',
        notFound: 'Resource not found',
        unauthorized: 'Unauthorized access',
        forbidden: 'Access forbidden'
    },
    
    // 成功訊息
    success: {
        saved: 'Saved successfully',
        updated: 'Updated successfully',
        deleted: 'Deleted successfully',
        created: 'Created successfully'
    },
    
    // 陣列資料
    categories: [
        'Technology',
        'Design',
        'Marketing'
        // 故意缺少 'Management'
    ],
    
    // 複雜陣列
    products: [
        {
            id: 1,
            name: 'Product A',
            price: 100,
            tags: ['Popular', 'Recommended']
        },
        {
            id: 2,
            name: 'Product B',
            price: 200,
            tags: ['New', 'Limited']
        },
        {
            id: 3,
            name: 'Product C',
            price: 300,
            tags: ['Premium']
            // 故意缺少一些屬性
        }
    ],
    
    // 設定選項
    settings: {
        language: 'en_US',
        theme: 'light',
        notifications: true,
        autoSave: false,
        advanced: {
            debug: false,
            logLevel: 'info',
            cache: true,
            experimental: true  // 英文特有的設定
        }
    },
    
    // 日期格式
    dateFormats: {
        short: 'MM/DD/YYYY',
        long: 'MMMM DD, YYYY',
        time: 'HH:mm:ss'
    },
    
    // 數字格式
    numberFormats: {
        currency: '${amount}',
        percentage: '{value}%',
        decimal: '{value}'
    },
    
    // 特殊字元測試
    specialChars: {
        quotes: '"Quotes"',
        apostrophe: "Apostrophe'",
        symbols: 'Symbols@#$%^&*()',
        emoji: 'Emoji😀🎉🚀'
    },
    
    // 空值測試
    emptyValues: {
        emptyString: '',
        nullValue: null,
        undefinedValue: undefined,
        emptyArray: [],
        emptyObject: {}
    },
    
    // 英文特有的鍵值
    englishOnly: {
        american: 'American English',
        british: 'British English',
        slang: 'Slang',
        idioms: 'Idioms'
    },
    
    // 額外的英文鍵值（中文沒有的）
    extraKeys: {
        welcome: 'Welcome to our application',
        goodbye: 'Goodbye and see you soon',
        loading: 'Loading...',
        error: 'An error occurred'
    }
}