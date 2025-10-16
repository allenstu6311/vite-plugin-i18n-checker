import { parseTsCode } from '@/parser/ts';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { setGlobalConfig } from '@/config';
import fs from 'fs';
import path from 'path';

describe('parseTsCode 函數測試', () => {
    describe('基本物件解析測試', () => {
        it('解析簡單物件', () => {
            const code = `export default { name: 'test', count: 123, active: true }`;
            const result = parseTsCode(code);
            expect(result).toEqual({
                name: 'test',
                count: 123,
                active: true
            });
        });

        it('解析巢狀物件', () => {
            const code = `
                export default {
                    user: {
                        name: 'John',
                        profile: { email: 'john@example.com' }
                    }
                }
            `;
            const result = parseTsCode(code);
            expect(result).toEqual({
                user: {
                    name: 'John',
                    profile: { email: 'john@example.com' }
                }
            });
        });

        it('解析陣列資料', () => {
            const code = `export default { items: ['a', 'b', 'c'], numbers: [1, 2, 3] }`;
            const result = parseTsCode(code);
            expect(result).toEqual({
                items: ['a', 'b', 'c'],
                numbers: [1, 2, 3]
            });
        });
    });

    describe('變數宣告解析測試', () => {
        it('解析 const 宣告', () => {
            const code = `
                const common = { save: '儲存', cancel: '取消' };
                export default { ...common, extra: '額外內容' }
            `;
            const result = parseTsCode(code);
            expect(result).toEqual({
                save: '儲存',
                cancel: '取消',
                extra: '額外內容'
            });
        });
    });

    describe('函數宣告解析測試', () => {
        it('解析函數宣告', () => {
            const code = `
                function getConfig() {
                    return { apiUrl: 'https://api.example.com' };
                }
                export default { name: 'app' }
            `;
            const result = parseTsCode(code);
            expect(result).toEqual({ name: 'app' });
        });
    });

    describe('Import 測試', () => {
        beforeEach(() => {
            setGlobalConfig({
                localesPath: 'locale/test',
            })

            fs.mkdirSync('locale/test', { recursive: true });
            fs.mkdirSync('locale/test/imported', { recursive: true });
            const sourceFilePath = 'locale/test/zh_CN.ts';
            fs.writeFileSync(sourceFilePath, `export default {}`);
        })

        afterEach(() => {
            const cleanDirs = ['locale/test/imported', 'locale/test'];
            for (const dir of cleanDirs) {
                if (fs.existsSync(dir)) {
                    try {
                        fs.rmSync(dir, { recursive: true, force: true });
                    } catch (err) {
                        console.warn(`⚠️ Failed to remove directory: ${dir}`, err);
                    }
                }
            }
        })

        it('解析 import 基本物件', () => {
            // 創建被 import 的檔案
            const importFilePath = 'locale/test/imported/common.ts';
            const importContent = `export default { save: '儲存', cancel: '取消' }`;

            // 確保目錄存在
            const dir = path.dirname(importFilePath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(importFilePath, importContent);

            const code = `
                import common from './imported/common';
                export default { ...common, extra: '額外內容' }
            `;

            const result = parseTsCode(code);
            expect(result).toEqual({
                save: '儲存',
                cancel: '取消',
                extra: '額外內容'
            });

            // 清理測試檔案
            if (fs.existsSync(importFilePath)) {
                fs.unlinkSync(importFilePath);
            }
        });

        it('解析多個 import', () => {
            // 創建多個被 import 的檔案
            const commonFilePath = 'locale/test/imported/common.ts';
            const formsFilePath = 'locale/test/imported/forms.ts';

            fs.writeFileSync(commonFilePath, `export default { save: '儲存' }`);
            fs.writeFileSync(formsFilePath, `export default { validation: { required: '必填' } }`);

            const code = `
                import common from './imported/common';
                import forms from './imported/forms';
                export default { ...common, ...forms, extra: '額外內容' }
            `;

            const result = parseTsCode(code);
            expect(result).toEqual({
                save: '儲存',
                validation: { required: '必填' },
                extra: '額外內容'
            });

            // 清理測試檔案
            if (fs.existsSync(commonFilePath)) fs.unlinkSync(commonFilePath);
            if (fs.existsSync(formsFilePath)) fs.unlinkSync(formsFilePath);
        });

        it('處理不存在的 import 檔案', () => {
            const code = `
                import nonExistent from './imported/non-existent';
                export default { test: 'value' }
            `;
            expect(parseTsCode(code)).toEqual({});
        });
    });

    describe('邊界情況測試', () => {
        it('處理空物件', () => {
            const result = parseTsCode(`export default {}`);
            expect(result).toEqual({});
        });

        it('處理無效語法', () => {
            expect(() => parseTsCode(`export default { invalid: syntax error }`)).toThrow();
        });
    });
});