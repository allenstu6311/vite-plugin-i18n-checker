export enum FileCheckResult {
    /**
     * 必填欄位未填
     */
    REQUIRED = 'REQUIRED',

    /**
     * 不存在該檔案
     */
    NOT_EXIST = 'NOT_EXIST',
    /**
     * 不支援檔案類型
     */
    // UNSUPPORTED_FILE_TYPE,
}

export type FileErrorParams = {
    [FileCheckResult.REQUIRED]: (fieldName: string) => string;
    [FileCheckResult.NOT_EXIST]: (filePath: string) => string;
    // [FileCheckResult.UNSUPPORTED_FILE_TYPE]: string;
};