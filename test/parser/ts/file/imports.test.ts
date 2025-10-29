import { setGlobalConfig } from '@/config';
import { parseTsCode } from '@/parser/ts';
import fs from 'fs';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

/**
 * parseTsCode Import 解析測試
 * 測試 parseTsCode 對 import 語句的處理，包括遞迴解析和檔案系統操作
 */
describe('parseTsCode Import 解析測試', () => {
    beforeEach(() => {
        setGlobalConfig({
            localesPath: 'locale/test',
        });

        fs.mkdirSync('locale/test', { recursive: true });
        fs.mkdirSync('locale/test/imported', { recursive: true });
        const sourceFilePath = 'locale/test/zh_CN.ts';
        fs.writeFileSync(sourceFilePath, `export default {}`);
    });

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
    });

    it('解析基本 import + spread', () => {
        const importFilePath = 'locale/test/imported/common.ts';
        const importContent = `export default { save: '儲存', cancel: '取消' }`;

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

        if (fs.existsSync(importFilePath)) {
            fs.unlinkSync(importFilePath);
        }
    });

    it('解析多個 import', () => {
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

        if (fs.existsSync(commonFilePath)) fs.unlinkSync(commonFilePath);
        if (fs.existsSync(formsFilePath)) fs.unlinkSync(formsFilePath);
    });

    it('解析巢狀 import（import 的檔案又 import）', () => {
        const baseFilePath = 'locale/test/imported/base.ts';
        const commonFilePath = 'locale/test/imported/common.ts';

        fs.writeFileSync(baseFilePath, `export default { base: 'baseValue' }`);
        fs.writeFileSync(commonFilePath, `
            import base from './base';
            export default { ...base, common: 'commonValue' }
        `);

        const code = `
            import common from './imported/common';
            export default { ...common, main: 'mainValue' }
        `;

        const result = parseTsCode(code);
        expect(result).toEqual({
            base: 'baseValue',
            common: 'commonValue',
            main: 'mainValue'
        });

        if (fs.existsSync(baseFilePath)) fs.unlinkSync(baseFilePath);
        if (fs.existsSync(commonFilePath)) fs.unlinkSync(commonFilePath);
    });

    it('解析相對路徑 import', () => {
        const deepFilePath = 'locale/test/imported/deep/file.ts';
        const deepDir = path.dirname(deepFilePath);

        if (!fs.existsSync(deepDir)) {
            fs.mkdirSync(deepDir, { recursive: true });
        }
        fs.writeFileSync(deepFilePath, `export default { deep: 'deepValue' }`);

        const code = `
            import deep from './imported/deep/file';
            export default { ...deep, main: 'mainValue' }
        `;

        const result = parseTsCode(code);
        expect(result).toEqual({
            deep: 'deepValue',
            main: 'mainValue'
        });

        if (fs.existsSync(deepFilePath)) {
            fs.unlinkSync(deepFilePath);
            fs.rmdirSync(deepDir);
        }
    });

    it('解析 import 的檔案有變數宣告', () => {
        const importedFilePath = 'locale/test/imported/with-vars.ts';

        fs.writeFileSync(importedFilePath, `
            const local = { localKey: 'localValue' };
            export default { ...local, imported: 'importedValue' }
        `);

        const code = `
            import imported from './imported/with-vars';
            export default { ...imported, main: 'mainValue' }
        `;

        const result = parseTsCode(code);
        expect(result).toEqual({
            localKey: 'localValue',
            imported: 'importedValue',
            main: 'mainValue'
        });

        if (fs.existsSync(importedFilePath)) {
            fs.unlinkSync(importedFilePath);
        }
    });

    it('邊境：處理不存在的 import 檔案', () => {
        const code = `
            import nonExistent from './imported/non-existent';
            export default { test: 'value' }
        `;
        const result = parseTsCode(code);
        expect(result).toEqual({});
    });
});

