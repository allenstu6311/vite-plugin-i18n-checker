import { extractObjectLiteral } from '@/parser/ts/extract';
import createTsParserState from '@/parser/ts/state';
import * as t from '@babel/types';
import { describe, expect, it } from 'vitest';

/**
 * extract 基本功能測試
 * 測試 extractObjectLiteral 的基本功能，包括基本類型解析、巢狀物件等
 */
describe('extract 基本功能測試', () => {
    it('解析基本物件屬性', () => {
        const state = createTsParserState();
        const objectNode = t.objectExpression([
            t.objectProperty(t.identifier('name'), t.stringLiteral('test')),
            t.objectProperty(t.identifier('count'), t.numericLiteral(123)),
            t.objectProperty(t.identifier('active'), t.booleanLiteral(true)),
            t.objectProperty(t.identifier('data'), t.nullLiteral())
        ]);

        const result = extractObjectLiteral(objectNode, state);
        expect(result).toEqual({
            name: 'test',
            count: 123,
            active: true,
            data: null
        });
    });

    it('解析巢狀物件', () => {
        const state = createTsParserState();
        const objectNode = t.objectExpression([
            t.objectProperty(
                t.identifier('user'),
                t.objectExpression([
                    t.objectProperty(t.identifier('name'), t.stringLiteral('John')),
                    t.objectProperty(t.identifier('age'), t.numericLiteral(25)),
                    t.objectProperty(t.identifier('profile'), t.objectExpression([
                        t.objectProperty(t.identifier('email'), t.stringLiteral('john@example.com'))
                    ]))
                ])
            )
        ]);

        const result = extractObjectLiteral(objectNode, state);
        expect(result).toEqual({
            user: {
                name: 'John',
                age: 25,
                profile: {
                    email: 'john@example.com'
                }
            }
        });
    });

    it('解析字串鍵值', () => {
        const state = createTsParserState();
        const objectNode = t.objectExpression([
            t.objectProperty(t.stringLiteral('key-with-dash'), t.stringLiteral('value')),
            t.objectProperty(t.stringLiteral('key_with_underscore'), t.stringLiteral('value2')),
            t.objectProperty(t.stringLiteral('key.with.dot'), t.stringLiteral('value3'))
        ]);

        const result = extractObjectLiteral(objectNode, state);
        expect(result).toEqual({
            'key-with-dash': 'value',
            'key_with_underscore': 'value2',
            'key.with.dot': 'value3'
        });
    });

    it('解析數字鍵值', () => {
        const state = createTsParserState();
        const objectNode = t.objectExpression([
            t.objectProperty(t.numericLiteral(0), t.stringLiteral('zero')),
            t.objectProperty(t.numericLiteral(123), t.stringLiteral('number')),
            t.objectProperty(t.numericLiteral(999), t.stringLiteral('large'))
        ]);

        const result = extractObjectLiteral(objectNode, state);
        expect(result).toEqual({
            '0': 'zero',
            '123': 'number',
            '999': 'large'
        });
    });

    it('解析混合基本類型', () => {
        const state = createTsParserState();
        const objectNode = t.objectExpression([
            t.objectProperty(t.identifier('string'), t.stringLiteral('hello')),
            t.objectProperty(t.identifier('number'), t.numericLiteral(42)),
            t.objectProperty(t.identifier('boolean'), t.booleanLiteral(false)),
            t.objectProperty(t.identifier('null'), t.nullLiteral()),
            t.objectProperty(t.identifier('array'), t.arrayExpression([
                t.stringLiteral('item1'),
                t.stringLiteral('item2')
            ]))
        ]);

        const result = extractObjectLiteral(objectNode, state);
        expect(result).toEqual({
            string: 'hello',
            number: 42,
            boolean: false,
            null: null,
            array: ['item1', 'item2']
        });
    });

    it('邊境：空物件處理', () => {
        const state = createTsParserState();
        const objectNode = t.objectExpression([]);

        const result = extractObjectLiteral(objectNode, state);
        expect(result).toEqual({});
    });
});
