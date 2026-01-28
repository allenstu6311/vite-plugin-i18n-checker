export enum SyncCheckResult {
    /**
     * 寫入檔案失敗
     */
    WRITE_FILE_FAILED = 'WRITE_FILE_FAILED',
    /**
     * AI 回傳不是有效 JSON
     */
    AI_INVALID_JSON = 'AI_INVALID_JSON',
    /**
     * AI provider 不存在或不支援
     */
    AI_UNKNOWN_PROVIDER = 'AI_UNKNOWN_PROVIDER',
    /**
     * AST 不支援的 value 類型
     */
    AST_UNSUPPORTED_VALUE_TYPE = 'AST_UNSUPPORTED_VALUE_TYPE',
}

export const syncErrors = {
    [SyncCheckResult.WRITE_FILE_FAILED]: (filePath: string, reason?: string) =>
        `Error writing file: ${filePath}${reason ? ` - ${reason}` : ''}`,
    [SyncCheckResult.AI_INVALID_JSON]: (text?: string) =>
        `AI returned invalid JSON${text ? `: ${text}` : ''}`,
    [SyncCheckResult.AI_UNKNOWN_PROVIDER]: (provider: string) => `Unknown provider: ${provider}`,
    [SyncCheckResult.AST_UNSUPPORTED_VALUE_TYPE]: (valueType: string) => `Unsupported value type: ${valueType}`,
};

