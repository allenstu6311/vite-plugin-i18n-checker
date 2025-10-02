export enum RuntimeCheckResult {
    /**
     * 檢查失敗
     */
    CHECK_FAILED = 'CHECK_FAILED',
}

export type RuntimeErrorParams = {
    [RuntimeCheckResult.CHECK_FAILED]: () => string;
};
