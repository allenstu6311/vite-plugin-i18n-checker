import { Lang, Override } from "../types";

export interface I18nCheckerOptions {
    source: string; // 範本檔案或範本資料夾（如 zh_CN.js 或 zh-CN/）
    path: string;   // 其他語系的根路徑（單檔情境與資料夾情境都通用）
    extensions: string; // 支援副檔名
    lang: Lang;
}

export type I18nCheckerOptionsParams = Override<I18nCheckerOptions, { lang?: Lang }>;