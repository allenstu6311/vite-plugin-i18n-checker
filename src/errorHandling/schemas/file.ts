export enum FileCheckResult {
    /**
     * 檔案不存在
     */
    NOT_EXIST = 'NOT_EXIST',
    /**
     * 不支援的語言
     */
    UNSUPPORTED_LANG = 'UNSUPPORTED_LANG',
    /**
     * 不支援的檔案類型
     */
    UNSUPPORTED_FILE_TYPE = 'UNSUPPORTED_FILE_TYPE',
}

export const fileErrors = {
    [FileCheckResult.NOT_EXIST]: (filePath: string) => `File not found: ${filePath}`,
    [FileCheckResult.UNSUPPORTED_LANG]: (lang: string) => `Unsupported language: ${lang}`,
    [FileCheckResult.UNSUPPORTED_FILE_TYPE]: (fileType: string) => `Unsupported file type: ${fileType}`,
};
