import { Lang } from "@/types";

export interface I18nCheckerOptions {
    source: string; // 範本檔案或範本資料夾（如 zh_CN.js 或 zh-CN/）
    path: string;   // 其他語系的根路徑（單檔情境與資料夾情境都通用）
    recursive?: boolean; // optional，預設 true，如果 source 是資料夾就自動啟用
    extensions: string; // 支援副檔名
    mode?: 'single' | 'directory',
    ignore?: string[]; //忽略檢查不報錯
    autoFill?: boolean; //自動補key(base有, target沒有)
    autoDelete?: boolean //自動刪除(base沒有, target有)
    lang?: Lang;
}