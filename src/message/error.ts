import { Lang } from "@/types";
import { FileCheckResult } from "./types";
import { messageManager } from "./index";

const { error } = messageManager()


const errorMap: Record<Lang, Record<FileCheckResult, string>> = {
    'zh_CN': {
        [FileCheckResult.NOT_EXIST]: '檔案不存在',
    },
    'en_US': {
        [FileCheckResult.NOT_EXIST]: 'File not found',
    },
}

// 創建錯誤訊息管理器的工廠函數（真正的閉包）
export function createErrorMessageManager(defaultLang: Lang = 'zh_CN') {
    let currentLang = defaultLang

    return {
        setLang(lang: Lang) {
            currentLang = lang
        },
        getMessage(result: FileCheckResult) {
            error(errorMap[currentLang][result] || '')
        },
        getMessageWithLang(lang: Lang, result: FileCheckResult) {
            error(errorMap[lang][result] || '')
        }
    }
}

// 創建全域實例
// const errorManager = createErrorMessageManager()

// // 導出簡化的 API
// export const setCurrentLang = (lang: Lang) => errorManager.setLang(lang)
// export const getErrorMessage = (result: FileCheckResult) => errorManager.getMessage(result)
// export const getErrorMessageWithLang = (lang: Lang, result: FileCheckResult) => errorManager.getMessageWithLang(lang, result)

// 解構版本（會破壞閉包）
const { setLang, getMessage, getMessageWithLang } = createErrorMessageManager()
export const setCurrentLang = setLang
export const getErrorMessage = getMessage
export const getErrorMessageWithLang = getMessageWithLang

