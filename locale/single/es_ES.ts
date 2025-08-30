export default {
    // 基本字串
    app: {
        name: 'Herramienta de Verificación i18n',
        version: '1.0.0',
        description: 'Herramienta para verificar la integridad de archivos multiidioma'
    },
    
    // 導航
    navigation: {
        home: 'Inicio',
        settings: 'Configuración',
        profile: 'Perfil',
        logout: 'Cerrar Sesión'
    },
    
    // 表單
    forms: {
        login: {
            title: 'Sistema de Inicio de Sesión',
            username: 'Nombre de Usuario',
            password: 'Contraseña',
            submit: 'Iniciar Sesión',
            forgotPassword: '¿Olvidaste tu contraseña?',
            rememberMe: 'Recordarme'
        },
        register: {
            title: 'Registrar Cuenta',
            email: 'Correo Electrónico',
            confirmPassword: 'Confirmar Contraseña',
            terms: 'Acepto los términos de servicio',
            submit: 'Registrar'
        }
    },
    
    // 驗證訊息
    validation: {
        required: 'Este campo es obligatorio',
        email: 'Por favor ingresa un correo electrónico válido',
        minLength: 'Mínimo {min} caracteres requeridos',
        maxLength: 'Máximo {max} caracteres permitidos',
        passwordMismatch: 'Las contraseñas no coinciden'
    },
    
    // 錯誤訊息
    errors: {
        network: 'Error de conexión de red',
        server: 'Error del servidor',
        notFound: 'Recurso no encontrado',
        unauthorized: 'Acceso no autorizado',
        forbidden: 'Acceso prohibido'
    },
    
    // 成功訊息
    success: {
        saved: 'Guardado exitosamente',
        updated: 'Actualizado exitosamente',
        deleted: 'Eliminado exitosamente',
        created: 'Creado exitosamente'
    },
    
    // 陣列資料
    categories: [
        'Tecnología',
        'Diseño',
        'Marketing',
        'Gestión'
    ],
    
    // 複雜陣列
    products: [
        {
            id: 1,
            name: 'Producto A',
            price: 100,
            tags: ['Popular', 'Recomendado']
        },
        {
            id: 2,
            name: 'Producto B',
            price: 200,
            tags: ['Nuevo', 'Limitado']
        }
    ],
    
    // 設定選項
    settings: {
        language: 'es_ES',
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
        short: 'DD/MM/YYYY',
        long: 'DD de MMMM de YYYY',
        time: 'HH:mm:ss'
    },
    
    // 數字格式
    numberFormats: {
        currency: '€{amount}',
        percentage: '{value}%',
        decimal: '{value}'
    },
    
    // 特殊字元測試
    specialChars: {
        quotes: '"Comillas"',
        apostrophe: "Apostrofe'",
        symbols: 'Símbolos@#$%^&*()',
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
    
    // 西班牙語特有的鍵值
    spanishOnly: {
        castellano: 'Castellano',
        catalan: 'Catalán',
        gallego: 'Gallego',
        euskera: 'Euskera'
    },
    
    // 額外的西班牙語鍵值
    extraSpanishKeys: {
        bienvenido: 'Bienvenido a nuestra aplicación',
        adios: 'Adiós y hasta pronto',
        cargando: 'Cargando...',
        error: 'Ocurrió un error'
    },
    
    // 故意缺少一些鍵值來測試
    // 缺少: chineseOnly, englishOnly, extraKeys
    // 缺少: settings.advanced.experimental
    // 缺少: products[2] (第三個產品)
    
    // 故意添加一些額外的鍵值
    additionalKeys: {
        saludo: '¡Hola!',
        despedida: '¡Hasta luego!',
        gracias: 'Gracias',
        porFavor: 'Por favor'
    }
}
