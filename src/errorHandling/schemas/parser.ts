export enum TsParserCheckResult {
    /**
     * export default 結構不正確
     */
    INCORRECT_EXPORT_DEFAULT = 'INCORRECT_EXPORT_DEFAULT',
    /**
     * SpreadElement 變數不是 Identifier
     */
    SPREAD_NOT_IDENTIFIER = 'SPREAD_NOT_IDENTIFIER',
    /**
     * SpreadElement 變數不存在
     */
    SPREAD_VARIABLE_NOT_FOUND = 'SPREAD_VARIABLE_NOT_FOUND',
    /**
     * 不支援的 key 類型
     */
    UNSUPPORTED_KEY_TYPE = 'UNSUPPORTED_KEY_TYPE',
    /**
     * 不支援的 value 類型
     */
    UNSUPPORTED_VALUE_TYPE = 'UNSUPPORTED_VALUE_TYPE',
    /**
     * 不支援的陣列元素
     */
    UNSUPPORTED_ARRAY_ELEMENT = 'UNSUPPORTED_ARRAY_ELEMENT',
    /**
     * 不支援的物件屬性
     */
    UNSUPPORTED_OBJECT_PROPERTY = 'UNSUPPORTED_OBJECT_PROPERTY',
    /**
     * 重複的 key
     */
    REAPET_KEY = 'REAPET_KEY',
    /**
     * 重複的變數名稱
     */
    REAPET_VARIABLE_NAME = 'REAPET_VARIABLE_NAME',
}

export const tsErrors = {
    [TsParserCheckResult.INCORRECT_EXPORT_DEFAULT]: () => `export default incorrect`,
    [TsParserCheckResult.SPREAD_NOT_IDENTIFIER]: () => `SpreadElement variable is not an Identifier`,
    [TsParserCheckResult.SPREAD_VARIABLE_NOT_FOUND]: (variable: string) =>
        `SpreadElement variable not found: ${variable}`,
    [TsParserCheckResult.UNSUPPORTED_KEY_TYPE]: (type: string) =>
        `Unsupported key type: ${type}`,
    [TsParserCheckResult.UNSUPPORTED_VALUE_TYPE]: (key: string, valueType: string) =>
        `"${key}" Unsupported value type: ${valueType} this key will not be added to the final i18n list`,
    [TsParserCheckResult.UNSUPPORTED_ARRAY_ELEMENT]: () => `Unsupported array element`,
    [TsParserCheckResult.UNSUPPORTED_OBJECT_PROPERTY]: () => `Unsupported object property`,
    [TsParserCheckResult.REAPET_KEY]: (key: string) => `Repeat key: ${key}`,
    [TsParserCheckResult.REAPET_VARIABLE_NAME]: (variable: string) => `Repeat variable name: ${variable}`,
};
