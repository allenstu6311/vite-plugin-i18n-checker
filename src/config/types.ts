import { Lang, Override } from "../types";

export interface I18nCheckerOptions {
    /**
     * 範本檔案或範本資料夾（如 zh_CN.js 或 zh-CN/）
     */
    sourceLocale: string;
    /**
     * 其他語系的根路徑（單檔情境與資料夾情境都通用）
     */
    localesPath: string; 
    /**
     * 支援副檔名
     */
    extensions: string; 
    /**
     * 基準語言代碼，用來當作對照語言
     */
    errorLocale?: Lang;
    /**
     * 是否在發現錯誤時立即結束程式
     */
    failOnError?: boolean;
    /**
     * 適用模式
     */
    applyMode?: 'serve' | 'build';
}

export type I18nCheckerOptionsParams = Override<I18nCheckerOptions, { errorLocale?: Lang, failOnError?: boolean }>;