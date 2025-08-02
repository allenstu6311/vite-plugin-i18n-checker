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

export type ErrorParams = {
    filePath?: string;
    fieldName?: string;
    lineNumber?: number;
};