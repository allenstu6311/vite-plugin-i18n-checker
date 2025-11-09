import { getValueByPath } from '@/abnormal/detector/collect';
import { AbnormalType } from '@/abnormal/types';
import { ParserType } from '@/parser/types';
import { syncKeys } from '@/sync';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanupTempFile, createTempFile, hasKey, parseFileContent } from './helper';

/**
 * 多格式同步測試
 * 測試不同文件格式的同步功能
 */
describe('多格式同步測試', () => {
    const tempFiles: string[] = [];

    afterEach(() => {
        tempFiles.forEach(cleanupTempFile);
        tempFiles.length = 0;
    });

    it('應該能處理 TS 格式的嵌套添加和刪除', () => {
        const content = `export default {
            settings: {
                theme: 'dark',
                language: 'en'
            }
        };`;
        const filePath = createTempFile(content, 'ts');
        tempFiles.push(filePath);

        const abnormalKeys = {
            settings: {
                notifications: AbnormalType.ADD_KEY,
                language: AbnormalType.DELETE_KEY
            }
        };
        const template = {
            settings: {
                theme: 'dark',
                notifications: true
            }
        };
        const target = {
            settings: {
                theme: 'dark',
                language: 'en'
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
        expect(hasKey(result, ['settings', 'notifications'])).toBe(true);
        expect(hasKey(result, ['settings', 'language'])).toBe(false);
        expect(hasKey(result, ['settings', 'theme'])).toBe(true);
    });

    it('應該能處理 JS 格式', () => {
        const content = `export default {
  name: 'test',
  value: 123
};`;
        const filePath = createTempFile(content, 'js');
        tempFiles.push(filePath);

        const abnormalKeys = {
            email: AbnormalType.ADD_KEY
        };
        const template = {
            name: 'test',
            value: 123,
            email: 'test@example.com'
        };
        const target = {
            name: 'test',
            value: 123
        };

        syncKeys({
            abnormalKeys,
            template,
            target,
            filePath,
            extensions: ParserType.JS
        });

        const result = parseFileContent(filePath, ParserType.JS);
        expect(hasKey(result, ['email'])).toBe(true);
        expect(getValueByPath(result, ['email'])).toBe('test@example.com');
    });

    it('應該能處理 JSON 格式的嵌套操作', () => {
        const content = JSON.stringify({
            user: {
                name: 'John',
                age: 25
            }
        }, null, 2);
        const filePath = createTempFile(content, 'json');
        tempFiles.push(filePath);

        const abnormalKeys = {
            user: {
                email: AbnormalType.ADD_KEY,
                age: AbnormalType.DELETE_KEY
            }
        };
        const template = {
            user: {
                name: 'John',
                email: 'john@example.com'
            }
        };
        const target = {
            user: {
                name: 'John',
                age: 25
            }
        };

        syncKeys({
            abnormalKeys,
            template,
            target,
            filePath,
            extensions: ParserType.JSON
        });

        const result = parseFileContent(filePath, ParserType.JSON);
        expect(hasKey(result, ['user', 'email'])).toBe(true);
        expect(hasKey(result, ['user', 'age'])).toBe(false);
        expect(hasKey(result, ['user', 'name'])).toBe(true);
    });

    it('應該能處理 YAML 格式的嵌套操作', () => {
        const content = `user:
  name: John
  age: 25`;
        const filePath = createTempFile(content, 'yaml');
        tempFiles.push(filePath);

        const abnormalKeys = {
            user: {
                email: AbnormalType.ADD_KEY
            }
        };
        const template = {
            user: {
                name: 'John',
                age: 25,
                email: 'john@example.com'
            }
        };
        const target = {
            user: {
                name: 'John',
                age: 25
            }
        };

        syncKeys({
            abnormalKeys,
            template,
            target,
            filePath,
            extensions: ParserType.YAML
        });

        const result = parseFileContent(filePath, ParserType.YAML);
        expect(hasKey(result, ['user', 'email'])).toBe(true);
        expect(getValueByPath(result, ['user', 'email'])).toBe('john@example.com');
    });

    it('應該能處理多種基本類型的值', () => {
        const content = `export default {
  string: 'hello',
  number: 42
};`;
        const filePath = createTempFile(content, 'ts');
        tempFiles.push(filePath);

        const abnormalKeys = {
            boolean: AbnormalType.ADD_KEY,
            nullValue: AbnormalType.ADD_KEY,
            array: AbnormalType.ADD_KEY
        };
        const template = {
            string: 'hello',
            number: 42,
            boolean: true,
            nullValue: null,
            array: ['item1', 'item2']
        };
        const target = {
            string: 'hello',
            number: 42
        };

        syncKeys({
            abnormalKeys,
            template,
            target,
            filePath,
            extensions: ParserType.TS
        });

        const result = parseFileContent(filePath, ParserType.TS);
        expect(hasKey(result, ['boolean'])).toBe(true);
        expect(getValueByPath(result, ['boolean'])).toBe(true);
        expect(hasKey(result, ['nullValue'])).toBe(true);
        expect(getValueByPath(result, ['nullValue'])).toBe(null);
        expect(hasKey(result, ['array'])).toBe(true);
        expect(getValueByPath(result, ['array'])).toEqual(['item1', 'item2']);
    });
});

