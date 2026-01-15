export enum ConfigCheckResult {
    /**
     * 尚未初始化
     */
    NOT_INITIALIZED,
    /**
     * 必填欄位未填
     */
    REQUIRED,
    /**
     * 錯誤訊息顯示語言不支援
     */
    UNSUPPORTED_ERROR_LOCALE,
    /**
     * locale rules pattern 不合法
     */
    INVALID_LOCALE_RULES_PATTERN,
    /**
     * locale rules pattern 為空
     */
    LOCALE_RULES_PATTERN_EMPTY,
    /**
     * locale rules pattern 包含不支援的字元
     */
    LOCALE_RULES_PATTERN_INVALID_CHARS,
    /**
     * locale rules pattern 包含不支援的 glob 語法
     */
    LOCALE_RULES_PATTERN_UNSUPPORTED_GLOB,
    /**
     * locale rules pattern 中的 ** 使用不正確
     */
    LOCALE_RULES_PATTERN_INVALID_DOUBLE_STAR,
    /**
     * locale rules pattern 為純通配符（沒有固定文字）
     */
    LOCALE_RULES_PATTERN_PURE_WILDCARD,
    /**
     * 自訂規則未定義
     */
    CUSTOM_RULE_NOT_DEFINED,
}

export type ConfigErrorParams = {
    [ConfigCheckResult.NOT_INITIALIZED]: () => string;
    [ConfigCheckResult.REQUIRED]: (configKey: string) => string;
    [ConfigCheckResult.UNSUPPORTED_ERROR_LOCALE]: (lang: string) => string;
    [ConfigCheckResult.INVALID_LOCALE_RULES_PATTERN]: (pattern: string) => string;
    [ConfigCheckResult.LOCALE_RULES_PATTERN_EMPTY]: () => string;
    [ConfigCheckResult.LOCALE_RULES_PATTERN_INVALID_CHARS]: (pattern: string) => string;
    [ConfigCheckResult.LOCALE_RULES_PATTERN_UNSUPPORTED_GLOB]: (pattern: string, unsupportedChar: string) => string;
    [ConfigCheckResult.LOCALE_RULES_PATTERN_INVALID_DOUBLE_STAR]: (pattern: string) => string;
    [ConfigCheckResult.LOCALE_RULES_PATTERN_PURE_WILDCARD]: (pattern: string) => string;
    [ConfigCheckResult.CUSTOM_RULE_NOT_DEFINED]: (type: string) => string;
};