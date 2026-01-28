export enum RuntimeCheckResult {
    /**
     * i18n 檢查失敗
     */
    CHECK_FAILED = 'CHECK_FAILED',
}

export const runtimeErrors = {
    [RuntimeCheckResult.CHECK_FAILED]: () => `i18n check failed. See report above for details.`,
};
