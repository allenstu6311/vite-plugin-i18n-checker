export enum RuntimeCheckResult {
    /**
     * i18n 檢查失敗
     */
    CHECK_FAILED = 'CHECK_FAILED',
    /**
     * 自訂規則執行失敗（rule.check throw）
     */
    CUSTOM_RULE_EXECUTION_FAILED = 'CUSTOM_RULE_EXECUTION_FAILED',
    /**
     * 自訂規則回傳值不合法（必須是 boolean）
     */
    CUSTOM_RULE_INVALID_RETURN = 'CUSTOM_RULE_INVALID_RETURN',
}

export const runtimeErrors = {
    [RuntimeCheckResult.CHECK_FAILED]: () => `i18n check failed. See report above for details.`,
    [RuntimeCheckResult.CUSTOM_RULE_EXECUTION_FAILED]: (abnormalType: string, reason: string) =>
        `Custom rule execution failed (abnormalType: ${abnormalType}). Reason: ${reason}`,
    [RuntimeCheckResult.CUSTOM_RULE_INVALID_RETURN]: (abnormalType: string, receivedType: string) =>
        `Custom rule must return boolean (abnormalType: ${abnormalType}). Got "${receivedType}"`,
};
