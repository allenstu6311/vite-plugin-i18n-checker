import { parseTsCode } from '@/parser/ast';
import { extractObjectLiteral, resolveBinaryExpression } from '@/parser/ast/extract';
import createTsParserState from '@/parser/ast/state';
import * as t from '@babel/types';
import { describe, expect, it } from 'vitest';

/**
 * BinaryExpression 解析測試
 *
 * 測試 resolveBinaryExpression 的行為：
 * - 正常的 string + string 串接
 * - 任何無法解析的情境（不支援的 operator / 子節點型別）→ key 仍存在，值為空字串，不誤判為 MISS_KEY
 */
describe('resolveBinaryExpression 單元測試', () => {
    it('string + string → 串接結果', () => {
        const state = createTsParserState();
        const node = t.binaryExpression('+', t.stringLiteral('hello'), t.stringLiteral(' world'));

        expect(resolveBinaryExpression(node, state)).toBe('hello world');
    });

    it('空字串 + 字串 → 仍正確串接', () => {
        const state = createTsParserState();
        const node = t.binaryExpression('+', t.stringLiteral(''), t.stringLiteral('hello'));

        expect(resolveBinaryExpression(node, state)).toBe('hello');
    });

    it('非 + operator（-）→ 兩側皆為字串時仍串接', () => {
        const state = createTsParserState();
        const node = t.binaryExpression('-', t.stringLiteral('a'), t.stringLiteral('b'));

        expect(resolveBinaryExpression(node, state)).toBe('ab');
    });

    it('子節點含不支援型別（CallExpression）→ 回傳空字串', () => {
        const state = createTsParserState();
        const node = t.binaryExpression(
            '+',
            t.stringLiteral('prefix'),
            t.callExpression(t.identifier('fn'), []),
        );

        expect(resolveBinaryExpression(node, state)).toBe('');
    });
});

describe('BinaryExpression 整合測試（透過 extractObjectLiteral）', () => {
    it('string + string → 正確串接', () => {
        const state = createTsParserState();
        const objectNode = t.objectExpression([
            t.objectProperty(
                t.identifier('greeting'),
                t.binaryExpression('+', t.stringLiteral('Hello'), t.stringLiteral(' World')),
            ),
        ]);

        expect(extractObjectLiteral(objectNode, state)).toEqual({ greeting: 'Hello World' });
    });

    it('空字串 + 空字串 → key 存在且值為空字串', () => {
        const state = createTsParserState();
        const objectNode = t.objectExpression([
            t.objectProperty(
                t.identifier('empty'),
                t.binaryExpression('+', t.stringLiteral(''), t.stringLiteral('')),
            ),
        ]);

        expect(extractObjectLiteral(objectNode, state)).toEqual({ empty: '' });
    });

    it('非 + operator（-）→ 兩側皆為字串時仍串接，其他 key 不受影響', () => {
        const state = createTsParserState();
        const objectNode = t.objectExpression([
            t.objectProperty(
                t.identifier('sub'),
                t.binaryExpression('-', t.stringLiteral('a'), t.stringLiteral('b')),
            ),
            t.objectProperty(t.identifier('other'), t.stringLiteral('ok')),
        ]);

        expect(extractObjectLiteral(objectNode, state)).toEqual({ sub: 'ab', other: 'ok' });
    });

    it('不支援子節點（CallExpression）→ key 仍存在，值為空字串，不誤判為 MISS_KEY', () => {
        const state = createTsParserState();
        const objectNode = t.objectExpression([
            t.objectProperty(
                t.identifier('dynamic'),
                t.binaryExpression('+', t.stringLiteral('prefix'), t.callExpression(t.identifier('fn'), [])),
            ),
            t.objectProperty(t.identifier('other'), t.stringLiteral('ok')),
        ]);

        expect(extractObjectLiteral(objectNode, state)).toEqual({ dynamic: '', other: 'ok' });
    });

    it('三層 string + string + string 串接（巢狀 BinaryExpression）', () => {
        const state = createTsParserState();
        // 'a' + 'b' + 'c' 在 AST 中是 (('a' + 'b') + 'c')
        const inner = t.binaryExpression('+', t.stringLiteral('a'), t.stringLiteral('b'));
        const outer = t.binaryExpression('+', inner, t.stringLiteral('c'));
        const objectNode = t.objectExpression([
            t.objectProperty(t.identifier('concat'), outer),
        ]);

        expect(extractObjectLiteral(objectNode, state)).toEqual({ concat: 'abc' });
    });

    it('Identifier（已宣告變數）+ string → 正確解析變數後串接', () => {
        const state = createTsParserState();
        state.setLocalConst('prefix', 'Hello');
        const objectNode = t.objectExpression([
            t.objectProperty(
                t.identifier('msg'),
                t.binaryExpression('+', t.identifier('prefix'), t.stringLiteral(' World')),
            ),
        ]);

        expect(extractObjectLiteral(objectNode, state)).toEqual({ msg: 'Hello World' });
    });
});

describe('BinaryExpression 真實程式碼整合測試（透過 parseTsCode）', () => {
    it('export default 含 string + string 串接', () => {
        const code = `
            const prefix = 'Hello';
            export default {
                greeting: prefix + ' World',
                bye: 'Good' + 'bye',
            }
        `;

        expect(parseTsCode(code)).toEqual({ greeting: 'Hello World', bye: 'Goodbye' });
    });
});
