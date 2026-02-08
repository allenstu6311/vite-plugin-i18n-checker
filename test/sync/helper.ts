import { ParserType, SupportedParserType } from '@/parser/types';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';

// ========== 通用測試輔助函數 ==========

export async function createTempDir(prefix = 'i18n-sync-test-') {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), prefix));
    return {
        dir,
        async cleanup() {
            await fs.rm(dir, { recursive: true, force: true });
        },
    };
}

export async function writeText(filePath: string, content: string) {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content, 'utf-8');
}

export async function readText(filePath: string) {
    return await fs.readFile(filePath, 'utf-8');
}

export function getPlainContent(text: string) {
    return text.replace(/\s+/g, '');
}

export function createLongText(length: number, ch = 'x') {
    return ch.repeat(length);
}

// ========== 多格式測試輔助函數 ==========

/** 測試用的檔案格式列表，新增格式只需修改這裡 */
export const testFormats: SupportedParserType[] = ['json', 'ts', 'yml'];

export function getParserType(format: SupportedParserType): ParserType {
    switch (format) {
        case 'json':
            return ParserType.JSON;
        case 'ts':
            return ParserType.TS;
        case 'yml':
            return ParserType.YAML;
        default:
            return ParserType.JSON;
    }
}

export function serializeContent(format: SupportedParserType, obj: Record<string, any>): string {
    switch (format) {
        case 'json':
            return JSON.stringify(obj, null, 2) + '\n';
        case 'ts':
            return `export default ${JSON.stringify(obj, null, 2)};\n`;
        case 'yml':
            return objectToYaml(obj);
    }
    return '';
}

function objectToYaml(obj: Record<string, any>, indent = 0): string {
    const spaces = '  '.repeat(indent);
    let result = '';

    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            result += `${spaces}${key}:\n${objectToYaml(value, indent + 1)}`;
        } else if (Array.isArray(value)) {
            result += `${spaces}${key}:\n`;
            for (const item of value) {
                if (typeof item === 'object' && item !== null) {
                    const lines = objectToYaml(item, indent + 2).split('\n').filter(Boolean);
                    result += `${spaces}  - ${lines[0].trim()}\n`;
                    for (let i = 1; i < lines.length; i++) {
                        result += `${spaces}    ${lines[i].trim()}\n`;
                    }
                } else {
                    result += `${spaces}  - ${item}\n`;
                }
            }
        } else {
            result += `${spaces}${key}: ${JSON.stringify(value)}\n`;
        }
    }

    return result;
}
