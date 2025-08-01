// 測試閉包解構差異

// 非解構版本（保持閉包）
function createManager() {
    let currentLang = 'zh_CN'
    
    return {
        setLang(lang) {
            currentLang = lang
            console.log('設置語言為:', lang)
        },
        getMessage(result) {
            console.log('當前語言:', currentLang, '結果:', result)
            return `[${currentLang}] ${result}`
        }
    }
}

// 使用非解構版本
console.log('=== 非解構版本 ===')
const manager = createManager()
const setCurrentLang = (lang) => manager.setLang(lang)
const getErrorMessage = (result) => manager.getMessage(result)

setCurrentLang('en_US')
getErrorMessage('NOT_EXIST') // 會使用 'en_US'

// 解構版本（破壞閉包）
console.log('\n=== 解構版本 ===')
const { setLang: setLang2, getMessage: getMessage2 } = createManager()

setLang2('en_US')
getMessage2('NOT_EXIST') // 會使用 'en_US'

// 但如果創建新的解構實例
console.log('\n=== 新的解構實例 ===')
const { setLang: setLang3, getMessage: getMessage3 } = createManager()

setLang3('es_ES')
getMessage3('NOT_EXIST') // 會使用 'es_ES'

// 但原來的實例不會受影響
console.log('\n=== 檢查原實例 ===')
getMessage2('NOT_EXIST') // 仍然使用 'en_US' 