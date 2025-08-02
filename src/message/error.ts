import { Lang } from "@/types";
import { ErrorParams, FileCheckResult } from "./types";
import { messageManager } from ".";

const errorMap: Record<Lang, Record<FileCheckResult, (params?: ErrorParams) => string>> = {
    'zh_CN': {
        [FileCheckResult.REQUIRED]: (param)=>`必填欄位未填: ${param?.fieldName}`,
        [FileCheckResult.NOT_EXIST]: (param)=>`檔案不存在: ${param?.filePath}`,
    },
    'en_US': {
        [FileCheckResult.REQUIRED]: (param)=>`Required field not filled: ${param?.fieldName}`,
        [FileCheckResult.NOT_EXIST]: (param)=>`File not found: ${param?.filePath}`,
    },
}

// 創建錯誤訊息管理器的工廠函數（真正的閉包）
export function createErrorMessageManager(defaultLang: Lang = 'zh_CN') {
    let currentLang = defaultLang

    return {
        setLang(lang: Lang) {
            currentLang = lang
        },
        getMessage(result: FileCheckResult, params?: ErrorParams) {
            return errorMap[currentLang][result](params) || ''
        },
        getMessageWithLang(lang: Lang, result: FileCheckResult, params?: ErrorParams) {
            return errorMap[lang][result] || ''
        }
    }
}
const { setLang, getMessage, getMessageWithLang } = createErrorMessageManager()
export const setCurrentLang = setLang
export const getErrorMessage = getMessage
export const getErrorMessageWithLang = getMessageWithLang

