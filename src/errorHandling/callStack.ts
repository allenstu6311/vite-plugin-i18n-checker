/**
 * 提取並格式化調用位置信息
 * @returns 調用位置數組，每個元素為函數名，例如：['resolveSourcePaths()', 'getTotalLang()', 'runI18nPipeline()']
 */
function formatCallerLocation(stackLines: string[]): string[] {
    // 過濾出項目內部的調用（排除 node_modules）
    const projectStack = stackLines
        .slice(3) // 前兩行是 Error title 和 handleError 本身，跳過
        .filter(line =>
            !line.includes('node_modules') &&
            line.includes('at ')
        );

    if (projectStack.length === 0) return [];

    // 提取前 3 個調用位置，提供調用鏈上下文
    const locations = projectStack.slice(0, 3).map(line => {
        const callerLine = line.trim();

        // 處理多種格式的 stack trace
        // 1. 標準格式: at functionName (filePath:line:column)
        // 2. Vite 編譯格式: at functionName (file:///path/to/file.timestamp-xxx.mjs:line:column)
        const match = callerLine.match(/at\s+(?:(.+?)\s+)?\((.+?):(\d+):(\d+)\)/);

        if (match) {
            const [, funcName] = match;

            // 在開發模式下，Vite 會編譯所有代碼到臨時文件
            // 由於沒有 source maps，我們只能顯示函數名
            // 這比顯示錯誤的文件路徑更有意義
            if (funcName) {
                return `${funcName}()`;
            }
        }

        // 如果無法匹配，嘗試簡單的函數名提取
        const simpleMatch = callerLine.match(/at\s+(\w+)/);
        if (simpleMatch) {
            return `${simpleMatch[1]}()`;
        }

        return null;
    }).filter(Boolean) as string[];

    return locations;
}

/**
 * 捕獲當前調用棧並格式化
 * @returns 調用位置數組
 */
export function captureCallStack(): string[] {
    if (process.env.NODE_ENV === 'production') return [];
    const stack = new Error().stack;
    const stackLines = stack?.split('\n') || [];
    return formatCallerLocation(stackLines);
}

/**
 * 將消息與調用棧信息組合
 * @returns 格式化後的完整消息
 * @example
 * // 輸入: message = "File not found", callStack = ["foo()", "bar()"]
 * // 輸出:
 * // File not found
 * //   └─ Called from: foo()
 * //   └─ Called from: bar()
 */
export function appendCallStack(message: string, callStack: string[]): string {
    if (callStack.length === 0) return message;

    const stackLines = callStack.map((loc, index) => {
        const prefix = index === 0 ? `${message}\n  └─ Called from:` : '  └─ Called from:';
        return index === 0 ? `${prefix} ${loc}` : `${prefix} ${loc}`;
    });

    return stackLines.join('\n');
}
