import { extractObjectLiteral } from '@/parser/ts/extract';
import createTsParserState from '@/parser/ts/state';
import * as t from '@babel/types';
import { describe, expect, it } from 'vitest';

/**
 * extract 複雜情況測試
 * 測試 extractObjectLiteral 對複雜混合情況的處理，包括真實場景、大型結構等
 */
describe('extract 複雜情況測試', () => {
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

    it('處理真實 i18n 檔案結構', () => {
        const state = createTsParserState();
        const commonData = { save: 'Save', cancel: 'Cancel' };
        state.setLocalConst('common', commonData);

        const objectNode = t.objectExpression([
            t.objectProperty(t.identifier('app'), t.objectExpression([
                t.objectProperty(t.identifier('common'), t.identifier('common')),
                t.objectProperty(t.identifier('login'), t.objectExpression([
                    t.objectProperty(t.identifier('title'), t.stringLiteral('Login')),
                    t.objectProperty(t.identifier('username'), t.stringLiteral('Username')),
                    t.objectProperty(t.identifier('password'), t.stringLiteral('Password'))
                ])),
                t.objectProperty(t.identifier('dashboard'), t.objectExpression([
                    t.objectProperty(t.identifier('welcome'), t.stringLiteral('Welcome')),
                    t.objectProperty(t.identifier('stats'), t.arrayExpression([
                        t.stringLiteral('Stat1'),
                        t.stringLiteral('Stat2')
                    ]))
                ]))
            ]))
        ]);

        const result = extractObjectLiteral(objectNode, state);
        expect(result).toEqual({
            app: {
                common: commonData,
                login: {
                    title: 'Login',
                    username: 'Username',
                    password: 'Password'
                },
                dashboard: {
                    welcome: 'Welcome',
                    stats: ['Stat1', 'Stat2']
                }
            }
        });
    });

    it('處理大型物件解析', () => {
        const state = createTsParserState();

        // 建立包含 100 個屬性的物件
        const properties = Array.from({ length: 100 }, (_, i) =>
            t.objectProperty(t.identifier(`key${i}`), t.stringLiteral(`value${i}`))
        );

        const objectNode = t.objectExpression(properties);
        const result = extractObjectLiteral(objectNode, state);

        expect(Object.keys(result)).toHaveLength(100);
        expect(result.key0).toBe('value0');
        expect(result.key99).toBe('value99');
    });

    it('處理錯誤恢復機制', () => {
        const state = createTsParserState();
        const objectNode = t.objectExpression([
            t.objectProperty(t.identifier('valid'), t.stringLiteral('value')),
            t.objectProperty(t.identifier('invalid'), t.conditionalExpression(
                t.booleanLiteral(true),
                t.stringLiteral('true'),
                t.stringLiteral('false')
            )),
            t.objectProperty(t.identifier('another'), t.numericLiteral(123))
        ]);

        const result = extractObjectLiteral(objectNode, state);
        expect(result).toEqual({
            valid: 'value',
            another: 123
        });
    });

    it('性能：大型物件解析', () => {
        const start = performance.now();
        const state = createTsParserState();

        // 建立包含 1000 個屬性的物件
        const properties = Array.from({ length: 1000 }, (_, i) =>
            t.objectProperty(t.identifier(`key${i}`), t.stringLiteral(`value${i}`))
        );

        const objectNode = t.objectExpression(properties);
        const result = extractObjectLiteral(objectNode, state);

        const end = performance.now();
        const duration = end - start;

        expect(duration).toBeLessThan(100); // 應該在 100ms 內完成
        expect(Object.keys(result)).toHaveLength(1000);
    });

    it('邊境：最大複雜度測試', () => {
        const state = createTsParserState();

        // 建立最大複雜度的結構
        const complexData = {
            level1: {
                level2: {
                    level3: {
                        array: [1, 2, 3],
                        object: { key: 'value' }
                    }
                }
            }
        };
        state.setLocalConst('complexVar', complexData);

        const objectNode = t.objectExpression([
            t.objectProperty(t.identifier('name'), t.stringLiteral('test')),
            t.objectProperty(t.identifier('count'), t.numericLiteral(123)),
            t.objectProperty(t.identifier('active'), t.booleanLiteral(true)),
            t.objectProperty(t.identifier('items'), t.arrayExpression([
                t.stringLiteral('item1'),
                t.stringLiteral('item2'),
                t.objectExpression([
                    t.objectProperty(t.identifier('nested'), t.stringLiteral('value'))
                ])
            ])),
            t.objectProperty(t.identifier('nested'), t.objectExpression([
                t.objectProperty(t.identifier('deep'), t.stringLiteral('value')),
                t.objectProperty(t.identifier('array'), t.arrayExpression([
                    t.numericLiteral(1),
                    t.numericLiteral(2)
                ]))
            ])),
            t.objectProperty(t.identifier('complex'), t.identifier('complexVar')),
            t.spreadElement(t.identifier('complexVar'))
        ]);

        const result = extractObjectLiteral(objectNode, state);
        expect(result).toEqual({
            name: 'test',
            count: 123,
            active: true,
            items: ['item1', 'item2', { nested: 'value' }],
            nested: {
                deep: 'value',
                array: [1, 2]
            },
            complex: complexData,
            level1: {
                level2: {
                    level3: {
                        array: [1, 2, 3],
                        object: { key: 'value' }
                    }
                }
            }
        });
    });
});
