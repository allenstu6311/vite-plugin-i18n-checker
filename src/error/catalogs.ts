import { Lang } from "../types";
import { ConfigCheckResult, ConfigErrorParams } from "./schemas/config";
import { FileCheckResult, FileErrorParams } from "./schemas/file";
import { TsParserCheckResult, TsParserErrorParams } from "./schemas/parser/ts";
import { RuntimeCheckResult, RuntimeErrorParams } from "./schemas/runtime";

export type Catalog<Code extends number | string, Param extends Record<Code, unknown | undefined>> =
    Record<Lang, { [K in Code]: Param[K]; }>;

export const fileErrorMap: Catalog<FileCheckResult, FileErrorParams> = {
    zh_CN: {
        [FileCheckResult.NOT_EXIST]: (filePath: string) => `檔案不存在: ${filePath}`,
        [FileCheckResult.UNSUPPORTED_LANG]: (lang: string) => `不支援的語言: ${lang}`,
        [FileCheckResult.UNSUPPORTED_FILE_TYPE]: (fileType: string) => `不支援的檔案類型: ${fileType}`,
    },
    en_US: {
        [FileCheckResult.NOT_EXIST]: (filePath: string) => `File not found: ${filePath}`,
        [FileCheckResult.UNSUPPORTED_LANG]: (lang: string) => `Unsupported language: ${lang}`,
        [FileCheckResult.UNSUPPORTED_FILE_TYPE]: (fileType: string) => `Unsupported file type: ${fileType}`,
    },
};

export const tsParserErrors: Catalog<TsParserCheckResult, TsParserErrorParams> = {
    zh_CN: {
        [TsParserCheckResult.INCORRECT_EXPORT_DEFAULT]: () => `export default 結構錯誤`,
        [TsParserCheckResult.SPREAD_NOT_IDENTIFIER]: () => `SpreadElement 展開變數不是 Identifier`,
        [TsParserCheckResult.SPREAD_VARIABLE_NOT_FOUND]: (variable) => `找不到展開變數對應的定義: ${variable}`,
        [TsParserCheckResult.UNSUPPORTED_KEY_TYPE]: (type: string) => `ObjectProperty 的 key 類型不支援: ${type}`,
        [TsParserCheckResult.UNSUPPORTED_VALUE_TYPE]: (key: string, valueType: string) => `${key} 的值為非支援型別 ${valueType}此鍵將不會被加入最終語系列表`,
        [TsParserCheckResult.UNSUPPORTED_ARRAY_ELEMENT]: () => `陣列中的元素為非支援型別`,
        [TsParserCheckResult.UNSUPPORTED_OBJECT_PROPERTY]: () => `忽略非 ObjectProperty 類型節點`,
        [TsParserCheckResult.REAPET_KEY]: (key: string) => `重複的 key: ${key}`,
        [TsParserCheckResult.REAPET_VARIABLE_NAME]: (variable: string) => `重複的變數命名: ${variable}`,
    },
    en_US: {
        [TsParserCheckResult.INCORRECT_EXPORT_DEFAULT]: () => `export default incorrect`,
        [TsParserCheckResult.SPREAD_NOT_IDENTIFIER]: () => `SpreadElement variable is not an Identifier`,
        [TsParserCheckResult.SPREAD_VARIABLE_NOT_FOUND]: (variable) => `SpreadElement variable not found: ${variable}`,
        [TsParserCheckResult.UNSUPPORTED_KEY_TYPE]: (type: string) => `Unsupported key type: ${type}`,
        [TsParserCheckResult.UNSUPPORTED_VALUE_TYPE]: (key: string, valueType: string) => `${key} Unsupported value type: ${valueType} this key will not be added to the final i18n list`,
        [TsParserCheckResult.UNSUPPORTED_ARRAY_ELEMENT]: () => `Unsupported array element`,
        [TsParserCheckResult.UNSUPPORTED_OBJECT_PROPERTY]: () => `Unsupported object property`,
        [TsParserCheckResult.REAPET_KEY]: (key: string) => `Repeat key: ${key}`,
        [TsParserCheckResult.REAPET_VARIABLE_NAME]: (variable: string) => `Repeat variable name: ${variable}`,
    }
};

export const configErrorMap: Catalog<ConfigCheckResult, ConfigErrorParams> = {
    zh_CN: {
        [ConfigCheckResult.NOT_INITIALIZED]: () => `尚未初始化`,
        [ConfigCheckResult.REQUIRED]: (configKey: string) => `必填欄位未填: ${configKey}`,
        [ConfigCheckResult.UNSUPPORTED_ERROR_LOCALE]: (lang: string) => `不支援的錯誤訊息顯示語言: ${lang}`,
        [ConfigCheckResult.INVALID_LOCALE_RULES_PATTERN]: (pattern: string) => `locale rules pattern 不合法: ${pattern}`,
        [ConfigCheckResult.LOCALE_RULES_PATTERN_EMPTY]: () => `Pattern 不能為空`,
        [ConfigCheckResult.LOCALE_RULES_PATTERN_INVALID_CHARS]: (pattern: string) =>
            `Pattern "${pattern}" 包含不支援的字元。只允許使用: 字母、數字、底線(_)、橫線(-)、點(.)、斜線(/)、星號(*)`,
        [ConfigCheckResult.LOCALE_RULES_PATTERN_UNSUPPORTED_GLOB]: (pattern: string, unsupportedChar: string) =>
            `Pattern "${pattern}" 包含不支援的 glob 語法 "${unsupportedChar}"。只支援 * 和 ** 通配符`,
        [ConfigCheckResult.LOCALE_RULES_PATTERN_INVALID_DOUBLE_STAR]: (pattern: string) =>
            `Pattern "${pattern}" 中的 ** 使用不正確。** 必須單獨作為路徑段，例如: **/folder/** 或 folder/**`,
        [ConfigCheckResult.LOCALE_RULES_PATTERN_PURE_WILDCARD]: (pattern: string) =>
            `Pattern "${pattern}" 必須包含至少一個固定文字（非通配符的字元）。例如: **/locale/** 而不是 **/*/**`,
        [ConfigCheckResult.CUSTOM_RULE_NOT_DEFINED]: (type: string) => `自訂規則未定義: ${type}`,
    },
    en_US: {
        [ConfigCheckResult.NOT_INITIALIZED]: () => `Not initialized`,
        [ConfigCheckResult.REQUIRED]: (configKey: string) => `Required field not filled: ${configKey}`,
        [ConfigCheckResult.UNSUPPORTED_ERROR_LOCALE]: (lang: string) => `Unsupported error locale: ${lang}`,
        [ConfigCheckResult.INVALID_LOCALE_RULES_PATTERN]: (pattern: string) => `Invalid locale rules pattern: ${pattern}`,
        [ConfigCheckResult.LOCALE_RULES_PATTERN_EMPTY]: () => `Pattern cannot be empty`,
        [ConfigCheckResult.LOCALE_RULES_PATTERN_INVALID_CHARS]: (pattern: string) =>
            `Pattern "${pattern}" contains unsupported characters. Only allowed: letters, numbers, underscore(_), hyphen(-), dot(.), slash(/), asterisk(*)`,
        [ConfigCheckResult.LOCALE_RULES_PATTERN_UNSUPPORTED_GLOB]: (pattern: string, unsupportedChar: string) =>
            `Pattern "${pattern}" contains unsupported glob syntax "${unsupportedChar}". Only * and ** wildcards are supported`,
        [ConfigCheckResult.LOCALE_RULES_PATTERN_INVALID_DOUBLE_STAR]: (pattern: string) =>
            `Pattern "${pattern}" has incorrect ** usage. ** must be a separate path segment, e.g., **/folder/** or folder/**`,
        [ConfigCheckResult.LOCALE_RULES_PATTERN_PURE_WILDCARD]: (pattern: string) =>
            `Pattern "${pattern}" must contain at least one fixed text (non-wildcard character). For example: **/locale/** instead of **/*/**`,
        [ConfigCheckResult.CUSTOM_RULE_NOT_DEFINED]: (type: string) => `Custom rule not defined: ${type}`,
    }
};

export const runtimeErrorMap: Catalog<RuntimeCheckResult, RuntimeErrorParams> = {
    zh_CN: {
        [RuntimeCheckResult.CHECK_FAILED]: () => `檢查失敗，存在未修正的錯誤，請查看上方報告`,
    },
    en_US: {
        [RuntimeCheckResult.CHECK_FAILED]: () => `i18n check failed. See report above for details.`,
    },
};