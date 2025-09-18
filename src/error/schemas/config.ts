export enum ConfigCheckResult {
    /**
     * 尚未初始化
     */
    NOT_INITIALIZED,
}

export type ConfigErrorParams = {
    [ConfigCheckResult.NOT_INITIALIZED]: ()=> string;
};