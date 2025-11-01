import { extractArrayLiteral } from '@/parser/ts/extract';
import createTsParserState from '@/parser/ts/state';
import * as t from '@babel/types';
import { describe, expect, it } from 'vitest';

/**
 * extract 陣列處理測試
 * 測試 extractArrayLiteral 對各種陣列的處理，包括基本類型、物件、巢狀陣列等
 */
describe('extract 陣列處理測試', () => {
    it('解析字串陣列', () => {
        const state = createTsParserState();
        const arrayNode = t.arrayExpression([
            t.stringLiteral('a'),
            t.stringLiteral('b'),
            t.stringLiteral('c')
        ]);

        const result = extractArrayLiteral(arrayNode, state);
        expect(result).toEqual(['a', 'b', 'c']);
    });

    it('解析數字陣列', () => {
        const state = createTsParserState();
        const arrayNode = t.arrayExpression([
            t.numericLiteral(1),
            t.numericLiteral(2),
            t.numericLiteral(3)
        ]);

        const result = extractArrayLiteral(arrayNode, state);
        expect(result).toEqual([1, 2, 3]);
    });

    it('解析物件陣列', () => {
        const state = createTsParserState();
        const arrayNode = t.arrayExpression([
            t.objectExpression([
                t.objectProperty(t.identifier('id'), t.numericLiteral(1)),
                t.objectProperty(t.identifier('name'), t.stringLiteral('item1'))
            ]),
            t.objectExpression([
                t.objectProperty(t.identifier('id'), t.numericLiteral(2)),
                t.objectProperty(t.identifier('name'), t.stringLiteral('item2'))
            ])
        ]);

        const result = extractArrayLiteral(arrayNode, state);
        expect(result).toEqual([
            { id: 1, name: 'item1' },
            { id: 2, name: 'item2' }
        ]);
    });

    it('解析巢狀陣列', () => {
        const state = createTsParserState();
        const arrayNode = t.arrayExpression([
            t.arrayExpression([
                t.numericLiteral(1),
                t.numericLiteral(2)
            ]),
            t.arrayExpression([
                t.numericLiteral(3),
                t.numericLiteral(4)
            ])
        ]);

        const result = extractArrayLiteral(arrayNode, state);
        expect(result).toEqual([
            [1, 2],
            [3, 4]
        ]);
    });

    it('解析混合類型陣列', () => {
        const state = createTsParserState();
        const arrayNode = t.arrayExpression([
            t.stringLiteral('string'),
            t.numericLiteral(123),
            t.booleanLiteral(true),
            t.nullLiteral(),
            t.objectExpression([
                t.objectProperty(t.identifier('key'), t.stringLiteral('value'))
            ]),
            t.arrayExpression([
                t.stringLiteral('nested')
            ])
        ]);

        const result = extractArrayLiteral(arrayNode, state);
        expect(result).toEqual([
            'string',
            123,
            true,
            null,
            { key: 'value' },
            ['nested']
        ]);
    });

    it('邊境：大型陣列處理', () => {
        const state = createTsParserState();
        const largeArray = Array.from({ length: 1000 }, (_, i) => t.numericLiteral(i));
        const arrayNode = t.arrayExpression(largeArray);

        const result = extractArrayLiteral(arrayNode, state);
        expect(result).toHaveLength(1000);
        expect(result[0]).toBe(0);
        expect(result[999]).toBe(999);
    });
});
