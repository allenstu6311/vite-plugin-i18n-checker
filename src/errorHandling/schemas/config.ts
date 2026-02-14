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
    /**
     * report 欄位型態錯誤
     */
    REPORT_INVALID = 'REPORT_INVALID',
    /**
     * 報告時間格式錯誤
     */
    REPORT_TIME_INVALID = 'REPORT_TIME_INVALID',
}

export const configErrors = {
    [ConfigCheckResult.REQUIRED]: (key: string) => `Required field not filled: ${key}`,
    [ConfigCheckResult.NOT_INITIALIZED]: () => `Not initialized`,
    [ConfigCheckResult.CUSTOM_RULE_NOT_DEFINED]: (type: string) => `Custom rule not defined: ${type}`,
    [ConfigCheckResult.RULES_INVALID_TYPE]: (receivedType: string) =>
        `Invalid rules config: expected an array, got "${receivedType}"`,
    [ConfigCheckResult.RULE_INVALID_ITEM]: (index: number, field: string, expected: string, received: string) =>
        `Invalid rule at index ${index}: field "${field}" expected ${expected}, got "${received}"`,
    [ConfigCheckResult.UNSUPPORTED_OPTION]: (option: string) => `Unsupported option: ${option}`,
    [ConfigCheckResult.REPORT_INVALID]: (value: string) => `Invalid report config: expected object, got "${value}"`,
    [ConfigCheckResult.REPORT_TIME_INVALID]: (value: string) => `Invalid report time format: "${value}". Expected number of days.`,
};