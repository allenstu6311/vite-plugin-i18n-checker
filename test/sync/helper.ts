import { parseFile } from '@/parser';
import fs from 'fs';
import os from 'os';
import path from 'path';


/**
 * 創建臨時文件
 */
export function createTempFile(content: string, ext: string): string {
    const tempDir = os.tmpdir();
    const fileName = `i18n-test-${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    const filePath = path.join(tempDir, fileName);
    fs.writeFileSync(filePath, content, 'utf-8');
    return filePath;
}

/**
 * 讀取並解析文件（驗證結果）
 */
export function parseFileContent(filePath: string, ext: string): Record<string, any> {
    const content = fs.readFileSync(filePath, 'utf-8');
    return parseFile(content, ext);
}

/**
 * 清理臨時文件
 */
export function cleanupTempFile(filePath: string): void {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    } catch (error) {
        // 忽略清理錯誤
    }
}

/**
 * 驗證 key 是否存在於物件中
 */
export function hasKey(obj: Record<string, any>, pathStack: (string | number)[]): boolean {
    let current = obj;
    for (let i = 0; i < pathStack.length; i++) {
        const key = pathStack[i];
        if (current[key] === undefined) {
            return false;
        }
        if (i < pathStack.length - 1) {
            current = current[key];
        }
    }
    return true;
}
