export enum TsParserCheckResult {
    /**
     * export default 不是物件
     */
    EXPORT_DEFAULT_NOT_OBJECT,

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
}

export type TsParserErrorParams = {
    [TsParserCheckResult.EXPORT_DEFAULT_NOT_OBJECT]: undefined;
    [TsParserCheckResult.SPREAD_NOT_IDENTIFIER]: undefined;
    [TsParserCheckResult.SPREAD_VARIABLE_NOT_FOUND]: undefined;
    [TsParserCheckResult.UNSUPPORTED_KEY_TYPE]: undefined;
    [TsParserCheckResult.UNSUPPORTED_VALUE_TYPE]: undefined;
    [TsParserCheckResult.UNSUPPORTED_ARRAY_ELEMENT]: undefined;
    [TsParserCheckResult.UNSUPPORTED_OBJECT_PROPERTY]: undefined;
}
