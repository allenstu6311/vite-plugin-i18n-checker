import { extractObjectLiteral, extractArrayLiteral, extractSpreadElement } from '@/parser/ts/extract';
import { describe, expect, it } from 'vitest';
import createTsParserState from '@/parser/ts/state';
import * as t from '@babel/types';

describe('extract 函數測試', () => {
    describe('extractObjectLiteral 基本測試', () => {
        it('解析基本物件屬性', () => {
            const state = createTsParserState();
            const objectNode = t.objectExpression([
                t.objectProperty(t.identifier('name'), t.stringLiteral('test')),
                t.objectProperty(t.identifier('count'), t.numericLiteral(123))
            ]);

            const result = extractObjectLiteral(objectNode, state);
            expect(result).toEqual({
                name: 'test',
                count: 123
            });
        });

        it('解析巢狀物件', () => {
            const state = createTsParserState();
            const objectNode = t.objectExpression([
                t.objectProperty(
                    t.identifier('user'),
                    t.objectExpression([
                        t.objectProperty(t.identifier('name'), t.stringLiteral('John')),
                        t.objectProperty(t.identifier('age'), t.numericLiteral(25))
                    ])
                )
            ]);

            const result = extractObjectLiteral(objectNode, state);
            expect(result).toEqual({
                user: {
                    name: 'John',
                    age: 25
                }
            });
        });

        it('解析陣列屬性', () => {
            const state = createTsParserState();
            const objectNode = t.objectExpression([
                t.objectProperty(
                    t.identifier('items'),
                    t.arrayExpression([
                        t.stringLiteral('a'),
                        t.stringLiteral('b'),
                        t.stringLiteral('c')
                    ])
                )
            ]);

            const result = extractObjectLiteral(objectNode, state);
            expect(result).toEqual({
                items: ['a', 'b', 'c']
            });
        });

        it('解析布林值和 null', () => {
            const state = createTsParserState();
            const objectNode = t.objectExpression([
                t.objectProperty(t.identifier('active'), t.booleanLiteral(true)),
                t.objectProperty(t.identifier('data'), t.nullLiteral())
            ]);

            const result = extractObjectLiteral(objectNode, state);
            expect(result).toEqual({
                active: true,
                data: null
            });
        });

        it('解析字串鍵值', () => {
            const state = createTsParserState();
            const objectNode = t.objectExpression([
                t.objectProperty(t.stringLiteral('key-with-dash'), t.stringLiteral('value'))
            ]);

            const result = extractObjectLiteral(objectNode, state);
            expect(result).toEqual({
                'key-with-dash': 'value'
            });
        });
    });

    describe('extractObjectLiteral 變數引用測試', () => {
        it('處理本地常數引用', () => {
            const state = createTsParserState();
            const localData = { localKey: 'localValue' };
            state.setLocalConst('localVar', localData);

            const objectNode = t.objectExpression([
                t.objectProperty(t.identifier('data'), t.identifier('localVar'))
            ]);

            const result = extractObjectLiteral(objectNode, state);
            expect(result).toEqual({
                data: localData
            });
        });

        it('處理 import 引用', () => {
            const state = createTsParserState();
            const importData = { importKey: 'importValue' };
            state.setResolvedImport('importedVar', importData);

            const objectNode = t.objectExpression([
                t.objectProperty(t.identifier('data'), t.identifier('importedVar'))
            ]);

            const result = extractObjectLiteral(objectNode, state);
            expect(result).toEqual({
                data: importData
            });
        });

        it('處理 spread 操作符', () => {
            const state = createTsParserState();
            const spreadData = { spreadKey: 'spreadValue' };
            state.setLocalConst('spreadVar', spreadData);

            const objectNode = t.objectExpression([
                t.spreadElement(t.identifier('spreadVar')),
                t.objectProperty(t.identifier('extra'), t.stringLiteral('value'))
            ]);

            const result = extractObjectLiteral(objectNode, state);
            expect(result).toEqual({
                spreadKey: 'spreadValue',
                extra: 'value'
            });
        });
    });

    describe('extractArrayLiteral 測試', () => {
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

        it('處理空陣列', () => {
            const state = createTsParserState();
            const arrayNode = t.arrayExpression([]);

            const result = extractArrayLiteral(arrayNode, state);
            expect(result).toEqual([]);
        });
    });

    describe('extractSpreadElement 測試', () => {
        it('處理本地常數 spread', () => {
            const state = createTsParserState();
            const spreadData = { key1: 'value1', key2: 'value2' };
            state.setLocalConst('spreadVar', spreadData);

            const obj = { existing: {} };
            const identifier = t.identifier('spreadVar');

            extractSpreadElement(identifier, obj, state);

            expect(obj).toEqual({
                existing: {},
                key1: 'value1',
                key2: 'value2'
            });
        });

        it('處理 import 資料 spread', () => {
            const state = createTsParserState();
            const importData = { importKey: 'importValue' };
            state.setResolvedImport('importedVar', importData);

            const obj = {};
            const identifier = t.identifier('importedVar');

            extractSpreadElement(identifier, obj, state);

            expect(obj).toEqual(importData);
        });

        it('處理找不到變數的情況', () => {
            const state = createTsParserState();
            const obj = {};
            const identifier = t.identifier('unknownVar');
            const result = extractSpreadElement(identifier, obj, state);

            // 這個測試會觸發錯誤處理
            expect(result).toBeUndefined();
        });
    });

    describe('邊界情況測試', () => {
        it('處理空物件', () => {
            const state = createTsParserState();
            const objectNode = t.objectExpression([]);
            const result = extractObjectLiteral(objectNode, state);
            expect(result).toEqual({});
        });

        it('處理重複鍵值，只保留第一個', () => {
            const state = createTsParserState();
            const objectNode = t.objectExpression([
                t.objectProperty(t.identifier('key'), t.stringLiteral('value1')),
                t.objectProperty(t.identifier('key'), t.stringLiteral('value2'))
            ]);
            expect(extractObjectLiteral(objectNode, state)).toEqual({"key":"value1"});
        });

        it('處理複雜混合結構', () => {
            const state = createTsParserState();
            const localData = { localKey: 'localValue' };
            state.setLocalConst('localVar', localData);

            const objectNode = t.objectExpression([
                t.objectProperty(t.identifier('name'), t.stringLiteral('test')),
                t.objectProperty(t.identifier('count'), t.numericLiteral(123)),
                t.objectProperty(t.identifier('active'), t.booleanLiteral(true)),
                t.objectProperty(t.identifier('items'), t.arrayExpression([
                    t.stringLiteral('item1'),
                    t.stringLiteral('item2')
                ])),
                t.objectProperty(t.identifier('nested'), t.objectExpression([
                    t.objectProperty(t.identifier('deep'), t.stringLiteral('value'))
                ])),
                t.objectProperty(t.identifier('local'), t.identifier('localVar')),
                t.spreadElement(t.identifier('localVar'))
            ]);

            const result = extractObjectLiteral(objectNode, state);
            expect(result).toEqual({
                name: 'test',
                count: 123,
                active: true,
                items: ['item1', 'item2'],
                nested: {
                    deep: 'value'
                },
                local: localData,
                localKey: 'localValue'
            });
        });
    });
});