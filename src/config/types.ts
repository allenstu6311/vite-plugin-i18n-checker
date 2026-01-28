import { Rule } from "../abnormal/detector/classify";
import { SupportedParserType } from "../parser/types";
import { AIProvider } from "../sync/types";
import { Override } from "../types";

type CustomRule = Rule & {
    abnormalType: string;
    msg?: string
}

export type UseAI = {
    apiKey: string;
    provider: AIProvider;
    localeRules: Record<string, string>;
}

export type SyncOptions = {
    autoFill?: boolean;
    autoDelete?: boolean;
    useAI?: UseAI;
    override?: boolean;
    preview?: boolean;
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
     * 是否在發現錯誤時立即結束程式
     */
    failOnError: boolean;
    /**
     * 適用模式
     */
    applyMode: 'serve' | 'build' | 'all';
    /**
     * 包含指定路徑
     */
    include: (string | RegExp)[];
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
    watch: boolean;
    /**
     * 同步模式
     */
    sync?: SyncOptions;
    /**
     * 報告路徑
     */
    reportPath: string;
}

export type I18nCheckerOptionsParams = Override<I18nCheckerOptions,
    {
        failOnError?: boolean,
        applyMode?: 'serve' | 'build' | 'all',
        exclude?: (string | RegExp)[],
        ignoreKeys?: string[],
        rules?: CustomRule[],
        watch?: boolean,
        sync?: SyncOptions
        include?: (string | RegExp)[],
        reportPath?: string,
    }>;