export default {
    // 基本字串
    app: {
        name: '語系檢查工具',
        version: '1.0.0',
        description: '用於檢查多語系檔案完整性的工具'
    },
    
    // 導航
    navigation: {
        home: '首頁',
        settings: '設定',
        profile: '個人資料',
        logout: '登出'
    },
    
    // 表單
    forms: {
        login: {
            title: '登入系統',
            username: '帳號',
            password: '密碼',
            submit: '登入',
            forgotPassword: '忘記密碼？',
            rememberMe: '記住我'
        },
        register: {
            title: '註冊帳號',
            email: '電子郵件',
            confirmPassword: '確認密碼',
            terms: '我同意服務條款',
            submit: '註冊'
        }
    },
    
    // 驗證訊息
    validation: {
        required: '此欄位為必填',
        email: '請輸入有效的電子郵件',
        minLength: '最少需要 {min} 個字元',
        maxLength: '最多只能 {max} 個字元',
        passwordMismatch: '密碼不一致'
    },
    
    // 錯誤訊息
    errors: {
        network: '網路連線錯誤',
        server: '伺服器錯誤',
        notFound: '找不到資源',
        unauthorized: '未授權存取',
        forbidden: '禁止存取'
    },
    
    // 成功訊息
    success: {
        saved: '儲存成功',
        updated: '更新成功',
        deleted: '刪除成功',
        created: '建立成功'
    },
    
    // 陣列資料
    categories: [
        '技術',
        '設計',
        '行銷',
        '管理'
    ],
    
    // 複雜陣列
    products: [
        {
            id: 1,
            name: '產品A',
            price: 100,
            tags: ['熱門', '推薦']
        },
        {
            id: 2,
            name: '產品B',
            price: 200,
            tags: ['新品', '限量']
        }
    ],
    
    // 設定選項
    settings: {
        language: 'zh_CN',
        theme: 'light',
        notifications: true,
        autoSave: false,
        advanced: {
            debug: false,
            logLevel: 'info',
            cache: true
        }
    },
    
    // 日期格式
    dateFormats: {
        short: 'YYYY/MM/DD',
        long: 'YYYY年MM月DD日',
        time: 'HH:mm:ss'
    },
    
    // 數字格式
    numberFormats: {
        currency: 'NT$ {amount}',
        percentage: '{value}%',
        decimal: '{value}'
    },
    
    // 特殊字元測試
    specialChars: {
        quotes: '「引號」',
        apostrophe: "撇號'",
        symbols: '符號@#$%^&*()',
        emoji: '表情😀🎉🚀'
    },
    
    // 空值測試
    emptyValues: {
        emptyString: '',
        nullValue: null,
        undefinedValue: undefined,
        emptyArray: [],
        emptyObject: {}
    },
    
    // 中文特有的鍵值
    chineseOnly: {
        traditional: '繁體中文',
        simplified: '簡體中文',
        pinyin: '拼音',
        stroke: '筆畫'
    }
}