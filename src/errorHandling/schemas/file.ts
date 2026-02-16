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
    /**
     * 找不到任何有效的語言檔案
     */
    NO_LOCALE_FILES = 'NO_LOCALE_FILES',
}

export const fileErrors = {
    [FileCheckResult.NOT_EXIST]: (filePath: string) => `File not found: ${filePath}`,
    [FileCheckResult.UNSUPPORTED_LANG]: (lang: string) => `Unsupported language: ${lang}`,
    [FileCheckResult.UNSUPPORTED_FILE_TYPE]: (fileType: string) => `Unsupported file type: ${fileType}`,
    [FileCheckResult.NO_LOCALE_FILES]: (path: string) => `No valid locale files found in "${path}". Please check your configuration and ensure that the source locale file exists.`,
};
