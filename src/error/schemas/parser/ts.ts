export enum TsParserCheckResult {
    /**
     * export default 語法錯誤
     */
    INCORRECT_EXPORT_DEFAULT,

    /**
     * SpreadElement 展開變數不是 Identifier
     */
    SPREAD_NOT_IDENTIFIER,

    /**
     * 找不到展開變數對應的定義
     */
    SPREAD_VARIABLE_NOT_FOUND,

    /**
     * ObjectProperty 的 key 類型不支援（非 Identifier 或 StringLiteral）
     */
    UNSUPPORTED_KEY_TYPE,

    /**
     * ObjectProperty 的值為非支援型別
     */
    UNSUPPORTED_VALUE_TYPE,

    /**
     * 陣列中的元素為非支援型別
     */
    UNSUPPORTED_ARRAY_ELEMENT,

    /**
     * 忽略非 ObjectProperty 類型節點
     */
    UNSUPPORTED_OBJECT_PROPERTY,
    /**
     * 重複的 key
     */
    REAPET_KEY,
}

export type TsParserErrorParams = {
    [TsParserCheckResult.INCORRECT_EXPORT_DEFAULT]: undefined;
    [TsParserCheckResult.SPREAD_NOT_IDENTIFIER]: undefined;
    [TsParserCheckResult.SPREAD_VARIABLE_NOT_FOUND]: string;
    [TsParserCheckResult.UNSUPPORTED_KEY_TYPE]: undefined;
    [TsParserCheckResult.UNSUPPORTED_VALUE_TYPE]: string
    [TsParserCheckResult.UNSUPPORTED_ARRAY_ELEMENT]: undefined;
    [TsParserCheckResult.UNSUPPORTED_OBJECT_PROPERTY]: undefined;
    [TsParserCheckResult.REAPET_KEY]: string;
}
