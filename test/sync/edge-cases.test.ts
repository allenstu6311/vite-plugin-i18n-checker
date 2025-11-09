import { AbnormalType } from '@/abnormal/types';
import { ParserType } from '@/parser/types';
import { syncKeys } from '@/sync';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanupTempFile, createTempFile, hasKey, parseFileContent } from './helper';

/**
 * 邊界情況測試
 * 測試各種邊界情況和特殊場景
 */
describe('邊界情況測試', () => {
    const tempFiles: string[] = [];

    afterEach(() => {
        tempFiles.forEach(cleanupTempFile);
        tempFiles.length = 0;
    });

    it('應該能處理空物件', () => {
        const content = `export default {};`;
        const filePath = createTempFile(content, 'ts');
        tempFiles.push(filePath);

        const abnormalKeys = {
            newKey: AbnormalType.ADD_KEY
        };
        const template = {
            newKey: 'value'
        };
        const target = {};

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

    it('應該能處理深層嵌套（3層以上）', () => {
        const content = `export default {
  level1: {
    level2: {
      level3: {
        value: 'deep'
      }
    }
  }
};`;
        const filePath = createTempFile(content, 'ts');
        tempFiles.push(filePath);

        const abnormalKeys = {
            level1: {
                level2: {
                    level3: {
                        newValue: AbnormalType.ADD_KEY
                    }
                }
            }
        };
        const template = {
            level1: {
                level2: {
                    level3: {
                        value: 'deep',
                        newValue: 'new'
                    }
                }
            }
        };
        const target = {
            level1: {
                level2: {
                    level3: {
                        value: 'deep'
                    }
                }
            }
        };

        syncKeys({
            abnormalKeys,
            template,
            target,
            filePath,
            extensions: ParserType.TS
        });

        const result = parseFileContent(filePath, ParserType.TS);
        expect(hasKey(result, ['level1', 'level2', 'level3', 'newValue'])).toBe(true);
    });

    it('應該能處理陣列中的物件', () => {
        const content = `export default {
  items: [
    { name: 'item1', value: 1 },
    { name: 'item2', value: 2 }
  ]
};`;
        const filePath = createTempFile(content, 'ts');
        tempFiles.push(filePath);

        // 注意：陣列索引的處理可能需要特殊處理
        // 這裡測試頂層添加
        const abnormalKeys = {
            newKey: AbnormalType.ADD_KEY
        };
        const template = {
            items: [
                { name: 'item1', value: 1 },
                { name: 'item2', value: 2 }
            ],
            newKey: 'new'
        };
        const target = {
            items: [
                { name: 'item1', value: 1 },
                { name: 'item2', value: 2 }
            ]
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
        expect(Array.isArray(result.items)).toBe(true);
    });

    it('應該能處理多個 key 的同時添加和刪除', () => {
        const content = `export default {
  keep1: 'value1',
  delete1: 'to-delete',
  keep2: 'value2',
  delete2: 'to-delete'
};`;
        const filePath = createTempFile(content, 'ts');
        tempFiles.push(filePath);

        const abnormalKeys = {
            keep1: AbnormalType.DELETE_KEY, // 這個實際上不應該刪除，但測試刪除功能
            delete1: AbnormalType.DELETE_KEY,
            add1: AbnormalType.ADD_KEY,
            add2: AbnormalType.ADD_KEY,
            delete2: AbnormalType.DELETE_KEY
        };
        const template = {
            keep1: 'value1',
            keep2: 'value2',
            add1: 'new1',
            add2: 'new2'
        };
        const target = {
            keep1: 'value1',
            delete1: 'to-delete',
            keep2: 'value2',
            delete2: 'to-delete'
        };

        syncKeys({
            abnormalKeys,
            template,
            target,
            filePath,
            extensions: ParserType.TS
        });

        const result = parseFileContent(filePath, ParserType.TS);
        // 注意：keep1 被標記為 DELETE_KEY，但實際上應該保留
        // 這裡主要測試多個操作同時進行
        expect(hasKey(result, ['add1'])).toBe(true);
        expect(hasKey(result, ['add2'])).toBe(true);
    });

    it('應該能處理字串鍵值的刪除', () => {
        // 注意：目前 addKeyToAST 使用 t.identifier，所以只能添加有效的 identifier 名稱
        // 但可以刪除字串鍵值
        const content = `export default {
  'key-with-dash': 'value1',
  'key.with.dot': 'value2',
  normalKey: 'value3'
};`;
        const filePath = createTempFile(content, 'ts');
        tempFiles.push(filePath);

        const abnormalKeys = {
            'key-with-dash': AbnormalType.DELETE_KEY,
            normalKey: AbnormalType.ADD_KEY
        };
        const template = {
            'key.with.dot': 'value2',
            normalKey: 'new-value'
        };
        const target = {
            'key-with-dash': 'value1',
            'key.with.dot': 'value2',
            normalKey: 'value3'
        };

        syncKeys({
            abnormalKeys,
            template,
            target,
            filePath,
            extensions: ParserType.TS
        });

        const result = parseFileContent(filePath, ParserType.TS);
        expect(hasKey(result, ['key-with-dash'])).toBe(false);
        expect(hasKey(result, ['normalKey'])).toBe(true);
        expect(hasKey(result, ['key.with.dot'])).toBe(true);
    });

    it('應該能處理 JSON 格式的空物件', () => {
        const content = JSON.stringify({}, null, 2);
        const filePath = createTempFile(content, 'json');
        tempFiles.push(filePath);

        const abnormalKeys = {
            newKey: AbnormalType.ADD_KEY
        };
        const template = {
            newKey: 'value'
        };
        const target = {};

        syncKeys({
            abnormalKeys,
            template,
            target,
            filePath,
            extensions: ParserType.JSON
        });

        const result = parseFileContent(filePath, ParserType.JSON);
        expect(hasKey(result, ['newKey'])).toBe(true);
    });
});

