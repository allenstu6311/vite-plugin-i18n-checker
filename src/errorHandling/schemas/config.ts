export enum ConfigCheckResult {
    /**
     * 未初始化
     */
    NOT_INITIALIZED = 'NOT_INITIALIZED',
    /**
     * 必須填寫
     */
    REQUIRED = 'REQUIRED',
    /**
     * 空字串
     */
    LOCALE_RULES_PATTERN_EMPTY = 'LOCALE_RULES_PATTERN_EMPTY',
    /**
     * 包含不支援的字元
     */
    LOCALE_RULES_PATTERN_INVALID_CHARS = 'LOCALE_RULES_PATTERN_INVALID_CHARS',
    /**
     * 包含不支援的 glob 語法
     */
    LOCALE_RULES_PATTERN_UNSUPPORTED_GLOB = 'LOCALE_RULES_PATTERN_UNSUPPORTED_GLOB',
    /**
     * 包含不支援的 double star
     */
    LOCALE_RULES_PATTERN_INVALID_DOUBLE_STAR = 'LOCALE_RULES_PATTERN_INVALID_DOUBLE_STAR',
    /**
     * 包含不支援的 pure wildcard
     */
    LOCALE_RULES_PATTERN_PURE_WILDCARD = 'LOCALE_RULES_PATTERN_PURE_WILDCARD',
    /**
     * 自訂義規則未定義
     */
    CUSTOM_RULE_NOT_DEFINED = 'CUSTOM_RULE_NOT_DEFINED',
    /**
     * rules 必須是陣列
     */
    RULES_INVALID_TYPE = 'RULES_INVALID_TYPE',
    /**
     * rules item 格式不正確
     */
    RULE_INVALID_ITEM = 'RULE_INVALID_ITEM',
    /**
     * 包含不支援的選項
     */
    UNSUPPORTED_OPTION = 'UNSUPPORTED_OPTION',
}

export const configErrors = {
    [ConfigCheckResult.REQUIRED]: (key: string) => `Required field not filled: ${key}`,
    [ConfigCheckResult.NOT_INITIALIZED]: () => `Not initialized`,
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
    [ConfigCheckResult.RULES_INVALID_TYPE]: (receivedType: string) =>
        `Invalid rules config: expected an array, got "${receivedType}"`,
    [ConfigCheckResult.RULE_INVALID_ITEM]: (index: number, field: string, expected: string, received: string) =>
        `Invalid rule at index ${index}: field "${field}" expected ${expected}, got "${received}"`,
    [ConfigCheckResult.UNSUPPORTED_OPTION]: (option: string) => `Unsupported option: ${option}`,
};