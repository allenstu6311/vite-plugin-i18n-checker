import { extractObjectLiteral } from '@/parser/ts/extract';
import createTsParserState from '@/parser/ts/state';
import * as t from '@babel/types';
import { describe, expect, it } from 'vitest';

/**
 * extract 邊境情況測試
 * 測試 extractObjectLiteral 對各種邊境情況的處理，包括重複鍵值、特殊字符等
 */
describe('extract 邊境情況測試', () => {
    it('處理重複鍵值', () => {
        const state = createTsParserState();
        const objectNode = t.objectExpression([
            t.objectProperty(t.identifier('key'), t.stringLiteral('value1')),
            t.objectProperty(t.identifier('key'), t.stringLiteral('value2'))
        ]);

        const result = extractObjectLiteral(objectNode, state);
        expect(result).toEqual({ key: 'value1' }); // 只保留第一個
    });

    it('處理特殊字符鍵值', () => {
        const state = createTsParserState();
        const objectNode = t.objectExpression([
            t.objectProperty(t.stringLiteral('key-with-dash'), t.stringLiteral('value1')),
            t.objectProperty(t.stringLiteral('key_with_underscore'), t.stringLiteral('value2')),
            t.objectProperty(t.stringLiteral('key.with.dot'), t.stringLiteral('value3')),
            t.objectProperty(t.stringLiteral('key[with]brackets'), t.stringLiteral('value4'))
        ]);

        const result = extractObjectLiteral(objectNode, state);
        expect(result).toEqual({
            'key-with-dash': 'value1',
            'key_with_underscore': 'value2',
            'key.with.dot': 'value3',
            'key[with]brackets': 'value4'
        });
    });

    it('處理模板字面值', () => {
        const state = createTsParserState();
        const objectNode = t.objectExpression([
            t.objectProperty(t.identifier('template'), t.templateLiteral([
                t.templateElement({ raw: 'Hello ', cooked: 'Hello ' }),
                t.templateElement({ raw: '!', cooked: '!' })
            ], [
                t.identifier('name')
            ]))
        ]);

        const result = extractObjectLiteral(objectNode, state);
        expect(result).toEqual({
            template: 'Hello ' // 只取第一個 quasi 的值
        });
    });

    it('處理不支援的節點類型', () => {
        const state = createTsParserState();
        const objectNode = t.objectExpression([
            t.objectProperty(t.identifier('key'), t.conditionalExpression(
                t.booleanLiteral(true),
                t.stringLiteral('true'),
                t.stringLiteral('false')
            ))
        ]);

        const result = extractObjectLiteral(objectNode, state);
        expect(result).toEqual({});
    });

    it('邊境：極端深度巢狀', () => {
        const state = createTsParserState();

        // 建立 10 層深度的巢狀物件
        let nestedNode: t.Node = t.stringLiteral('deep');
        for (let i = 0; i < 10; i++) {
            nestedNode = t.objectExpression([
                t.objectProperty(t.identifier(`level${i}`), nestedNode)
            ]);
        }

        const objectNode = t.objectExpression([
            t.objectProperty(t.identifier('deep'), nestedNode)
        ]);

        const result = extractObjectLiteral(objectNode, state);
        expect(result).toHaveProperty('deep');
        expect(result.deep).toHaveProperty('level9');
    });
});
