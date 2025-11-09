import { getValueByPath } from '@/abnormal/detector/collect';
import { AbnormalType } from '@/abnormal/types';
import { ParserType } from '@/parser/types';
import { syncKeys } from '@/sync';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanupTempFile, createTempFile, hasKey, parseFileContent } from './helper';

/**
 * sync 基本功能測試
 * 測試添加和刪除 key 的基本功能
 */
describe('sync 基本功能測試', () => {
    const tempFiles: string[] = [];

    afterEach(() => {
        // 清理所有臨時文件
        tempFiles.forEach(cleanupTempFile);
        tempFiles.length = 0;
    });

    it('應該能在 TS 文件中添加頂層 key', () => {
        const content = `export default {
            name: 'test',
            age: 25
        };`;
        const filePath = createTempFile(content, 'ts');
        tempFiles.push(filePath);

        const abnormalKeys = {
            email: AbnormalType.ADD_KEY
        };
        const template = {
            name: 'test',
            age: 25,
            email: 'test@example.com'
        };
        const target = {
            name: 'test',
            age: 25
        };

        syncKeys({
            abnormalKeys,
            template,
            target,
            filePath,
            extensions: ParserType.TS
        });

        const result = parseFileContent(filePath, ParserType.TS);
        expect(hasKey(result, ['email'])).toBe(true);
        expect(getValueByPath(result, ['email'])).toBe('test@example.com');
    });

    it('應該能在 TS 文件中刪除頂層 key', () => {
        const content = `export default {
            name: 'test',
            age: 25,
            extra: 'to-be-deleted'
        };`;
        const filePath = createTempFile(content, 'ts');
        tempFiles.push(filePath);

        const abnormalKeys = {
            extra: AbnormalType.DELETE_KEY
        };
        const template = {
            name: 'test',
            age: 25
        };
        const target = {
            name: 'test',
            age: 25,
            extra: 'to-be-deleted'
        };

        syncKeys({
            abnormalKeys,
            template,
            target,
            filePath,
            extensions: ParserType.TS
        });

        const result = parseFileContent(filePath, ParserType.TS);
        expect(hasKey(result, ['extra'])).toBe(false);
        expect(hasKey(result, ['name'])).toBe(true);
        expect(hasKey(result, ['age'])).toBe(true);
    });

    it('應該能在 TS 文件中添加嵌套 key', () => {
        const content = `export default {
            user: {
                name: 'John',
                age: 25
            }
        };`;
        const filePath = createTempFile(content, 'ts');
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
            extensions: ParserType.TS
        });

        const result = parseFileContent(filePath, ParserType.TS);
        expect(hasKey(result, ['user', 'email'])).toBe(true);
        expect(getValueByPath(result, ['user', 'email'])).toBe('john@example.com');
    });

    it('應該能在 TS 文件中刪除嵌套 key', () => {
        const content = `export default {
            user: {
                name: 'John',
                age: 25,
                extra: 'to-be-deleted'
            }
        };`;
        const filePath = createTempFile(content, 'ts');
        tempFiles.push(filePath);

        const abnormalKeys = {
            user: {
                extra: AbnormalType.DELETE_KEY
            }
        };
        const template = {
            user: {
                name: 'John',
                age: 25
            }
        };
        const target = {
            user: {
                name: 'John',
                age: 25,
                extra: 'to-be-deleted'
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
        expect(hasKey(result, ['user', 'extra'])).toBe(false);
        expect(hasKey(result, ['user', 'name'])).toBe(true);
        expect(hasKey(result, ['user', 'age'])).toBe(true);
    });

    it('應該能在 JSON 文件中添加頂層 key', () => {
        const content = JSON.stringify({
            name: 'test',
            age: 25
        }, null, 2);
        const filePath = createTempFile(content, 'json');
        tempFiles.push(filePath);

        const abnormalKeys = {
            email: AbnormalType.ADD_KEY
        };
        const template = {
            name: 'test',
            age: 25,
            email: 'test@example.com'
        };
        const target = {
            name: 'test',
            age: 25
        };

        syncKeys({
            abnormalKeys,
            template,
            target,
            filePath,
            extensions: ParserType.JSON
        });

        const result = parseFileContent(filePath, ParserType.JSON);
        expect(hasKey(result, ['email'])).toBe(true);
        expect(getValueByPath(result, ['email'])).toBe('test@example.com');
    });

    it('應該能在 JSON 文件中刪除頂層 key', () => {
        const content = JSON.stringify({
            name: 'test',
            age: 25,
            extra: 'to-be-deleted'
        }, null, 2);
        const filePath = createTempFile(content, 'json');
        tempFiles.push(filePath);

        const abnormalKeys = {
            extra: AbnormalType.DELETE_KEY
        };
        const template = {
            name: 'test',
            age: 25
        };
        const target = {
            name: 'test',
            age: 25,
            extra: 'to-be-deleted'
        };

        syncKeys({
            abnormalKeys,
            template,
            target,
            filePath,
            extensions: ParserType.JSON
        });

        const result = parseFileContent(filePath, ParserType.JSON);
        expect(hasKey(result, ['extra'])).toBe(false);
        expect(hasKey(result, ['name'])).toBe(true);
        expect(hasKey(result, ['age'])).toBe(true);
    });

    it('應該能在 YAML 文件中添加頂層 key', () => {
        const content = `name: test
age: 25`;
        const filePath = createTempFile(content, 'yaml');
        tempFiles.push(filePath);

        const abnormalKeys = {
            email: AbnormalType.ADD_KEY
        };
        const template = {
            name: 'test',
            age: 25,
            email: 'test@example.com'
        };
        const target = {
            name: 'test',
            age: 25
        };

        syncKeys({
            abnormalKeys,
            template,
            target,
            filePath,
            extensions: ParserType.YAML
        });

        const result = parseFileContent(filePath, ParserType.YAML);
        expect(hasKey(result, ['email'])).toBe(true);
        expect(getValueByPath(result, ['email'])).toBe('test@example.com');
    });

    it('應該能在 YAML 文件中刪除頂層 key', () => {
        const content = `name: test
age: 25
extra: to-be-deleted`;
        const filePath = createTempFile(content, 'yaml');
        tempFiles.push(filePath);

        const abnormalKeys = {
            extra: AbnormalType.DELETE_KEY
        };
        const template = {
            name: 'test',
            age: 25
        };
        const target = {
            name: 'test',
            age: 25,
            extra: 'to-be-deleted'
        };

        syncKeys({
            abnormalKeys,
            template,
            target,
            filePath,
            extensions: ParserType.YAML
        });

        const result = parseFileContent(filePath, ParserType.YAML);
        expect(hasKey(result, ['extra'])).toBe(false);
        expect(hasKey(result, ['name'])).toBe(true);
        expect(hasKey(result, ['age'])).toBe(true);
    });
});

