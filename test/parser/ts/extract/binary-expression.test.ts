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
 * - 不支援的 operator
 * - 不支援的子節點型別（確保 key 仍存在，不誤判為 MISS_KEY）
 */
describe('resolveBinaryExpression 單元測試', () => {
    it('string + string → 串接結果', () => {
        const state = createTsParserState();
        const node = t.binaryExpression(
            '+',
            t.stringLiteral('hello'),
            t.stringLiteral(' world'),
        );

        const result = resolveBinaryExpression(node, state);

        expect(result).toBe('hello world');
    });

    it('非 + operator（如 -）→ 回傳空字串', () => {
        const state = createTsParserState();
        const node = t.binaryExpression(
            '-',
            t.stringLiteral('a'),
            t.stringLiteral('b'),
        );

        const result = resolveBinaryExpression(node, state);

        expect(result).toBe('');
    });

    it('子節點含不支援型別（CallExpression）→ 回傳空字串', () => {
        const state = createTsParserState();
        // 'prefix' + someFunction()
        const node = t.binaryExpression(
            '+',
            t.stringLiteral('prefix'),
            t.callExpression(t.identifier('someFunction'), []),
        );

        const result = resolveBinaryExpression(node, state);

        expect(result).toBe('');
    });
});

describe('BinaryExpression 整合測試（透過 extractObjectLiteral）', () => {
    it('value 為 string + string → 正確串接', () => {
        const state = createTsParserState();
        const objectNode = t.objectExpression([
            t.objectProperty(
                t.identifier('greeting'),
                t.binaryExpression('+', t.stringLiteral('Hello'), t.stringLiteral(' World')),
            ),
        ]);

        const result = extractObjectLiteral(objectNode, state);

        expect(result).toEqual({ greeting: 'Hello World' });
    });

    it('value 為不支援的 BinaryExpression → key 仍存在（值為空字串），不誤判為 MISS_KEY', () => {
        const state = createTsParserState();
        // 'prefix' + someFunction()  ← CallExpression 不支援
        const objectNode = t.objectExpression([
            t.objectProperty(
                t.identifier('dynamic'),
                t.binaryExpression(
                    '+',
                    t.stringLiteral('prefix'),
                    t.callExpression(t.identifier('fn'), []),
                ),
            ),
            t.objectProperty(t.identifier('other'), t.stringLiteral('ok')),
        ]);

        const result = extractObjectLiteral(objectNode, state);

        // key 必須存在（值為空字串），避免 checker 誤報 MISS_KEY
        expect(result).toHaveProperty('dynamic');
        expect(result.dynamic).toBe('');
        // 其他 key 不受影響
        expect(result.other).toBe('ok');
    });

    it('三層 string + string + string 串接（巢狀 BinaryExpression）', () => {
        const state = createTsParserState();
        // 'a' + 'b' + 'c' 在 AST 中是 (('a' + 'b') + 'c')
        const innerNode = t.binaryExpression('+', t.stringLiteral('a'), t.stringLiteral('b'));
        const outerNode = t.binaryExpression('+', innerNode, t.stringLiteral('c'));

        const objectNode = t.objectExpression([
            t.objectProperty(t.identifier('concat'), outerNode),
        ]);

        const result = extractObjectLiteral(objectNode, state);

        expect(result).toEqual({ concat: 'abc' });
    });
});

describe('BinaryExpression 真實程式碼整合測試（透過 parseTsCode）', () => {
    it('export default 含 string + string 串接', () => {
        const code = `
            const prefix = 'Hello';
            export default {
                greeting: prefix + ' World',
            }
        `;
        // prefix 是 Identifier，會被 Identifier resolver 解成變數名稱 'prefix'，
        // 再透過 resolveVariableReference 解析為 'Hello'
        // 此測試驗證 BinaryExpression 在真實解析流程中能正確串接
        const result = parseTsCode(code);
        expect(result).toEqual({ greeting: 'Hello World' });
    });
});
