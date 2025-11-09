import { AbnormalType } from '@/abnormal/types';
import { ParserType } from '@/parser/types';
import { syncKeys } from '@/sync';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanupTempFile, createTempFile, hasKey, parseFileContent } from './helper';

/**
 * SpreadElement 測試
 * 測試當 key 來自展開運算符時，無法刪除的情況
 */
describe('SpreadElement 測試', () => {
    const tempFiles: string[] = [];

    afterEach(() => {
        tempFiles.forEach(cleanupTempFile);
        tempFiles.length = 0;
    });

    it('應該能處理來自 SpreadElement 的 key（無法刪除，改回 EXTRA_KEY）', () => {
        // 創建一個包含展開運算符的文件
        const content = `import { objData } from './imported';

export default {
  ...objData,
  localKey: 'local-value'
};`;
        const filePath = createTempFile(content, 'ts');
        tempFiles.push(filePath);

        // 假設 objData 中有 'spreadKey'，我們嘗試刪除它
        // 但因為它來自 SpreadElement，應該無法刪除
        const abnormalKeys = {
            spreadKey: AbnormalType.DELETE_KEY, // 這個 key 來自 ...objData
            localKey: AbnormalType.DELETE_KEY   // 這個 key 是本地定義的
        };
        const template = {};
        const target = {
            spreadKey: 'from-spread', // 這個實際上來自展開
            localKey: 'local-value'
        };

        syncKeys({
            abnormalKeys,
            template,
            target,
            filePath,
            extensions: ParserType.TS
        });

        const result = parseFileContent(filePath, ParserType.TS);
        // localKey 應該被刪除（因為它是本地定義的）
        // spreadKey 可能無法刪除（因為它來自展開），但我們無法直接驗證
        // 這裡主要測試不會拋出錯誤
        expect(hasKey(result, ['localKey'])).toBe(false);
    });

    it('應該能在有 SpreadElement 的情況下添加新 key', () => {
        const content = `import { objData } from './imported';

export default {
  ...objData,
  existing: 'value'
};`;
        const filePath = createTempFile(content, 'ts');
        tempFiles.push(filePath);

        const abnormalKeys = {
            newKey: AbnormalType.ADD_KEY
        };
        const template = {
            existing: 'value',
            newKey: 'new-value'
        };
        const target = {
            existing: 'value'
        };

        syncKeys({
            abnormalKeys,
            template,
            target,
            filePath,
            extensions: ParserType.TS
        });

        const result = parseFileContent(filePath, ParserType.TS);
        expect(hasKey(result, ['newKey'])).toBe(true);
    });

    it('應該能處理混合情況：添加本地 key 和刪除本地 key', () => {
        const content = `export default {
  keep: 'keep-value',
  delete: 'delete-value'
};`;
        const filePath = createTempFile(content, 'ts');
        tempFiles.push(filePath);

        const abnormalKeys = {
            keep: AbnormalType.DELETE_KEY, // 這個不應該刪除，但測試流程
            delete: AbnormalType.DELETE_KEY,
            add: AbnormalType.ADD_KEY
        };
        const template = {
            keep: 'keep-value',
            add: 'add-value'
        };
        const target = {
            keep: 'keep-value',
            delete: 'delete-value'
        };

        syncKeys({
            abnormalKeys,
            template,
            target,
            filePath,
            extensions: ParserType.TS
        });

        const result = parseFileContent(filePath, ParserType.TS);
        expect(hasKey(result, ['add'])).toBe(true);
        expect(hasKey(result, ['delete'])).toBe(false);
    });
});

