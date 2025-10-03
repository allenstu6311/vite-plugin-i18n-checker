import { Lang } from "../types";
import { ConfigCheckResult, ConfigErrorParams } from "./schemas/config";
import { FileCheckResult, FileErrorParams } from "./schemas/file";
import { TsParserCheckResult, TsParserErrorParams } from "./schemas/parser/ts";
import { RuntimeCheckResult, RuntimeErrorParams } from "./schemas/runtime";

export type Catalog<Code extends number | string, Param extends Record<Code, unknown | undefined>> =
    Record<Lang, { [K in Code]: Param[K]; }>;

export const fileErrorMap: Catalog<FileCheckResult, FileErrorParams> = {
    zh_CN: {
        [FileCheckResult.REQUIRED]: (fieldName: string) => `必填欄位未填: ${fieldName}`,
        [FileCheckResult.NOT_EXIST]: (filePath: string) => `檔案不存在: ${filePath}`,
        [FileCheckResult.UNSUPPORTED_LANG]: (lang: string) => `不支援的語言: ${lang}`,
    },
    en_US: {
        [FileCheckResult.REQUIRED]: ( fieldName: string) => `Required field not filled: ${fieldName}`,
        [FileCheckResult.NOT_EXIST]: (filePath: string) => `File not found: ${filePath}`,
        [FileCheckResult.UNSUPPORTED_LANG]: (lang: string) => `Unsupported language: ${lang}`,
    },
};

export const tsParserErrors: Catalog<TsParserCheckResult, TsParserErrorParams> = {
    zh_CN: {
        [TsParserCheckResult.INCORRECT_EXPORT_DEFAULT]: () => `export default 結構錯誤`,
        [TsParserCheckResult.SPREAD_NOT_IDENTIFIER]: () => `SpreadElement 展開變數不是 Identifier`,
        [TsParserCheckResult.SPREAD_VARIABLE_NOT_FOUND]: (variable) => `找不到展開變數對應的定義: ${variable}`,
        [TsParserCheckResult.UNSUPPORTED_KEY_TYPE]: (type: string) => `ObjectProperty 的 key 類型不支援: ${type}`,
        [TsParserCheckResult.UNSUPPORTED_VALUE_TYPE]: (valueType: string) => `ObjectProperty 的值為非支援型別: ${valueType}`,
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
        [TsParserCheckResult.UNSUPPORTED_VALUE_TYPE]: (valueType: string) => `Unsupported value type: ${valueType}`,
        [TsParserCheckResult.UNSUPPORTED_ARRAY_ELEMENT]: () => `Unsupported array element`,
        [TsParserCheckResult.UNSUPPORTED_OBJECT_PROPERTY]: () => `Unsupported object property`,
        [TsParserCheckResult.REAPET_KEY]: (key: string) => `Repeat key: ${key}`,
        [TsParserCheckResult.REAPET_VARIABLE_NAME]: (variable: string) => `Repeat variable name: ${variable}`,
    }
}

export const configErrorMap: Catalog<ConfigCheckResult, ConfigErrorParams> = {
    zh_CN: {
        [ConfigCheckResult.NOT_INITIALIZED]: () => `尚未初始化`,
    },
    en_US: {
        [ConfigCheckResult.NOT_INITIALIZED]: () => `Not initialized`,
    }
}

export const runtimeErrorMap: Catalog<RuntimeCheckResult, RuntimeErrorParams> = {
    zh_CN: {
      [RuntimeCheckResult.CHECK_FAILED]: () => `檢查失敗，存在未修正的錯誤，請查看上方報告`,
    },
    en_US: {
      [RuntimeCheckResult.CHECK_FAILED]: () => `i18n check failed. See report above for details.`,
    },
  };