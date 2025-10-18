import { Rule } from "../abnormal/detector/classify";
import { ParserType, parserTypeList, SupportedParserType } from "../parser/types";
import { Lang, Override } from "../types";

type CustomRule = Rule & {
    abnormalType: string;
    msg?: string
}

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
    extensions: SupportedParserType;
    /**
     * 基準語言代碼，用來當作對照語言
     */
    errorLocale: Lang;
    /**
     * 是否在發現錯誤時立即結束程式
     */
    failOnError: boolean;
    /**
     * 適用模式
     */
    applyMode: 'serve' | 'build' | 'all';
    /**
     * 忽略的檔案
     */
    ignoreFiles: (string | RegExp)[];
    /**
     * 排除指定路徑
     */
    exclude: (string | RegExp)[];
    /**
     * 忽略的key
     */
    ignoreKeys: string[];
    /**
     * 自定義規則
     */
    rules: CustomRule[];
    /**
     * 是否監聽檔案變化
     */
    watch?: boolean;
}

export type I18nCheckerOptionsParams = Override<I18nCheckerOptions,
    {
        errorLocale?: Lang,
        failOnError?: boolean,
        applyMode?: 'serve' | 'build' | 'all',
        ignoreFiles?: (string | RegExp)[],
        exclude?: (string | RegExp)[],
        ignoreKeys?: string[],
        rules?: CustomRule[]
    }>;