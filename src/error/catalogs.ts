import { ConfigCheckResult, ConfigErrorParams } from "./schemas/config";
import { FileCheckResult, FileErrorParams } from "./schemas/file";
import { TsParserCheckResult, TsParserErrorParams } from "./schemas/parser/ts";
import { Catalog } from "./schemas/shared/types";

export const fileErrorMap: Catalog<FileCheckResult, FileErrorParams> = {
    zh_CN: {
        [FileCheckResult.REQUIRED]: (fieldName: string) => `必填欄位未填: ${fieldName}`,
        [FileCheckResult.NOT_EXIST]: (filePath: string) => `檔案不存在: ${filePath}`,
        [FileCheckResult.NOT_READABLE]: () => `檔案不存在`,
    },
    en_US: {
        [FileCheckResult.REQUIRED]: (fieldName: string) => `Required field not filled: ${fieldName}`,
        [FileCheckResult.NOT_EXIST]: (filePath: string) => `File not found: ${filePath}`,
        [FileCheckResult.NOT_READABLE]: () => `File not found`,
    },
};

export const tsParserErrors: Catalog<TsParserCheckResult, TsParserErrorParams> = {
    zh_CN: {
        [TsParserCheckResult.INCORRECT_EXPORT_DEFAULT]: () => `export default 結構錯誤`,
        [TsParserCheckResult.SPREAD_NOT_IDENTIFIER]: () => `SpreadElement 展開變數不是 Identifier`,
        [TsParserCheckResult.SPREAD_VARIABLE_NOT_FOUND]: () => `找不到展開變數對應的定義`,
        [TsParserCheckResult.UNSUPPORTED_KEY_TYPE]: () => `ObjectProperty 的 key 類型不支援（非 Identifier 或 StringLiteral）`,
        [TsParserCheckResult.UNSUPPORTED_VALUE_TYPE]: (valueType: string) => `ObjectProperty 的值為非支援型別: ${valueType}`,
        [TsParserCheckResult.UNSUPPORTED_ARRAY_ELEMENT]: () => `陣列中的元素為非支援型別`,
        [TsParserCheckResult.UNSUPPORTED_OBJECT_PROPERTY]: () => `忽略非 ObjectProperty 類型節點`,
    },
    en_US: {
        [TsParserCheckResult.INCORRECT_EXPORT_DEFAULT]: () => `export default incorrect`,
        [TsParserCheckResult.SPREAD_NOT_IDENTIFIER]: () => `SpreadElement variable is not an Identifier`,
        [TsParserCheckResult.SPREAD_VARIABLE_NOT_FOUND]: () => `SpreadElement variable not found`,
        [TsParserCheckResult.UNSUPPORTED_KEY_TYPE]: () => `Unsupported key type (not Identifier or StringLiteral)`,
        [TsParserCheckResult.UNSUPPORTED_VALUE_TYPE]: (valueType: string) => `Unsupported value type: ${valueType}`,
        [TsParserCheckResult.UNSUPPORTED_ARRAY_ELEMENT]: () => `Unsupported array element`,
        [TsParserCheckResult.UNSUPPORTED_OBJECT_PROPERTY]: () => `Unsupported object property`,
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