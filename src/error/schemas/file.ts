export enum FileCheckResult {
    /**
     * 必填欄位未填
     */
    REQUIRED,

    /**
     * 不存在該檔案
     */
    NOT_EXIST,
}

export type FileErrorParams = {
    [FileCheckResult.REQUIRED]: string;
    [FileCheckResult.NOT_EXIST]: string;
};