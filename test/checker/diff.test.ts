import { diff } from '@/checker/diff';
import { beforeEach, describe, expect, it } from 'vitest';
import { AbnormalType } from '@/abnormal/types';
import { setGlobalConfig } from '@/config';

describe('diff 函數測試', () => {
    describe('基本比對測試', () => {
        it('相同物件應該返回空結果', () => {
            const source = { a: 'hello', b: 'world' };
            const target = { a: 'hello', b: 'world' };

            const result = diff({ source, target });
            expect(result).toEqual({});
        });

        it('檢測缺少的鍵值', () => {
            const source = { a: 'hello', b: 'world', c: 'test' };
            const target = { a: 'hello', b: 'world' };

            const result = diff({ source, target });
            expect(result).toEqual({
                c: AbnormalType.MISS_KEY
            });
        });

        it('檢測額外的鍵值', () => {
            const source = { a: 'hello', b: 'world' };
            const target = { a: 'hello', b: 'world', c: 'extra' };

            const result = diff({ source, target });
            expect(result).toEqual({
                c: AbnormalType.EXTRA_KEY
            });
        });

        it('檢測結構類型差異（陣列與物件）', () => {
            const source = { a: 'hello', b: [] };
            const target = { a: 'hello', b: {} };

            const result = diff({ source, target });
            expect(result).toEqual({
                b: AbnormalType.DIFF_STRUCTURE_TYPE
            });
        });

        it('原始值類型差異不會被檢測', () => {
            const source = { a: 'hello', b: 123 };
            const target = { a: 'hello', b: 'world' };

            const result = diff({ source, target });
            expect(result).toEqual({});
        });
    });

    describe('陣列比對測試', () => {
        it('檢測陣列長度差異', () => {
            const source = { items: ['a', 'b', 'c'] };
            const target = { items: ['a', 'b'] };

            const result = diff({ source, target });
            expect(result).toEqual({
                items: AbnormalType.DIFF_ARRAY_LENGTH
            });
        });

        it('陣列內容相同應該正常', () => {
            const source = { items: ['a', 'b', 'c'] };
            const target = { items: ['a', 'b', 'c'] };

            const result = diff({ source, target });
            expect(result).toEqual({});
        });

        it('陣列中物件內容差異', () => {
            const source = {
                items: [
                    { id: 1, name: 'item1' },
                    { id: 2, name: 'item2' }
                ]
            };
            const target = {
                items: [
                    { id: 1, name: 'item1' },
                    { id: 2, name: 'item2', extra: 'field' }
                ]
            };

            const result = diff({ source, target });
            expect(result).toEqual({
                items: [
                    {},
                    { extra: AbnormalType.EXTRA_KEY }
                ]
            });
        });
    });

    describe('巢狀結構測試', () => {
        it('深層巢狀物件比對', () => {
            const source = {
                level1: {
                    level2: {
                        level3: {
                            value: 'test'
                        }
                    }
                }
            };
            const target = {
                level1: {
                    level2: {
                        level3: {
                            value: 'test',
                            extra: 'field'
                        }
                    }
                }
            };

            const result = diff({ source, target });
            expect(result).toEqual({
                level1: {
                    level2: {
                        level3: {
                            extra: AbnormalType.EXTRA_KEY
                        }
                    }
                }
            });
        });

        it('巢狀陣列中的物件比對', () => {
            const source = {
                categories: [
                    {
                        name: 'category1',
                        items: [
                            { id: 1, title: 'item1' }
                        ]
                    }
                ]
            };
            const target = {
                categories: [
                    {
                        name: 'category1',
                        items: [
                            { id: 1, title: 'item1', description: 'desc' }
                        ]
                    }
                ]
            };

            const result = diff({ source, target });
            expect(result).toEqual({
                categories: [
                    {
                        items: [
                            { description: AbnormalType.EXTRA_KEY }
                        ]
                    }
                ]
            });
        });
    });

    describe('邊界情況測試', () => {
        it('空物件比對', () => {
            const source = {};
            const target = {};

            const result = diff({ source, target });
            expect(result).toEqual({});
        });

        it('空陣列比對', () => {
            const source = { items: [] };
            const target = { items: [] };

            const result = diff({ source, target });
            expect(result).toEqual({});
        });

    });

    describe('複雜混合情況測試', () => {
        it('多種異常同時存在', () => {
            const source = {
                missing: 'value',
                structureDiff: [], // 陣列
                arrayDiff: [1, 2, 3],
                nested: {
                    normal: 'value',
                    missingNested: 'value'
                }
            };
            const target = {
                structureDiff: {}, // 物件
                arrayDiff: [1, 2],
                extra: 'value',
                nested: {
                    normal: 'value',
                    extraNested: 'value'
                }
            };

            const result = diff({ source, target });
            expect(result).toEqual({
                missing: AbnormalType.MISS_KEY,
                structureDiff: AbnormalType.DIFF_STRUCTURE_TYPE,
                arrayDiff: AbnormalType.DIFF_ARRAY_LENGTH,
                extra: AbnormalType.EXTRA_KEY,
                nested: {
                    missingNested: AbnormalType.MISS_KEY,
                    extraNested: AbnormalType.EXTRA_KEY
                }
            });
        });

        it('i18n 翻譯檔案典型場景', () => {
            const source = {
                common: {
                    save: '儲存',
                    cancel: '取消',
                    confirm: '確認'
                },
                login: {
                    title: '登入',
                    username: '使用者名稱',
                    password: '密碼'
                },
                errors: [
                    '錯誤訊息1',
                    '錯誤訊息2'
                ]
            };
            const target = {
                common: {
                    save: 'Save',
                    cancel: 'Cancel',
                    confirm: 'Confirm',
                    delete: 'Delete' // 額外的鍵值
                },
                login: {
                    title: 'Login',
                    username: 'Username'
                    // 缺少 password
                },
                errors: [
                    'Error message 1'
                    // 陣列長度不同
                ]
            };

            const result = diff({ source, target });
            expect(result).toEqual({
                common: {
                    delete: AbnormalType.EXTRA_KEY
                },
                login: {
                    password: AbnormalType.MISS_KEY
                },
                errors: AbnormalType.DIFF_ARRAY_LENGTH
            });
        });
    });

    describe('加入自定義Rules測試', () => {
        beforeEach(() => {
            setGlobalConfig({
                rules: [
                    {
                        abnormalType: 'custom',
                        check: (ctx) => ctx.key === 'theme',
                        msg: '不可輸入theme當key'
                    }
                ]
            });
        });
        it('是否顯示自定義Rules type', () => {
            const source = {
                theme: 'a'
            };
            const target = {
                theme: 'b'
            };

            const result = diff({ source, target });
            expect(result).toEqual({
                theme: 'custom'
            });
        })
    })

    describe('ignoreKeys測試', () => {
        beforeEach(() => {
            setGlobalConfig({
                ignoreKeys: ['ignore']
            });
        });
        
        it('是否確實忽略', () => {
            const source = {
                a: 'a',
                ignore: 'key'
            };
            const target = {
                a: 'b'
            }

            const result = diff({ source, target });
            expect(result).toEqual({});
        });

        it('忽略多個鍵值', () => {
            setGlobalConfig({
                ignoreKeys: ['ignore1', 'ignore2', 'ignore3']
            });

            const source = {
                a: 'a',
                ignore1: 'value1',
                ignore2: 'value2',
                ignore3: 'value3',
                b: 'b'
            };
            const target = {
                a: 'different',
                b: 'different'
            };

            const result = diff({ source, target });
            expect(result).toEqual({});
        });

        it('忽略空字串鍵值', () => {
            setGlobalConfig({
                ignoreKeys: ['']
            });

            const source = {
                '': 'empty key',
                normal: 'normal value'
            };
            const target = {
                normal: 'different value'
            };

            const result = diff({ source, target });
            expect(result).toEqual({});
        });

        it('忽略特殊字符鍵值', () => {
            setGlobalConfig({
                ignoreKeys: ['key-with-dash', 'key_with_underscore', 'key.with.dots']
            });

            const source = {
                'key-with-dash': 'dash value',
                'key_with_underscore': 'underscore value',
                'key.with.dots': 'dots value',
                normal: 'normal value'
            };
            const target = {
                normal: 'different value'
            };

            const result = diff({ source, target });
            expect(result).toEqual({});
        });

        it('忽略數字鍵值', () => {
            setGlobalConfig({
                ignoreKeys: ['123', '0']
            });

            const source = {
                '123': 'number key',
                '0': 'zero key',
                normal: 'normal value'
            };
            const target = {
                normal: 'different value'
            };

            const result = diff({ source, target });
            expect(result).toEqual({});
        });

        it('部分忽略的情況', () => {
            setGlobalConfig({
                ignoreKeys: ['ignore']
            });

            const source = {
                a: 'a',
                ignore: 'ignored',
                b: 'b'
            };
            const target = {
                a: 'different',
                b: 'different',
                c: 'new key'
            };

            const result = diff({ source, target });
            expect(result).toEqual({
                c: AbnormalType.EXTRA_KEY
            });
        });

        it('忽略鍵值不存在的情況', () => {
            setGlobalConfig({
                ignoreKeys: ['nonexistent']
            });

            const source = {
                a: 'a',
                b: 'b'
            };
            const target = {
                a: 'different',
                b: 'different'
            };

            const result = diff({ source, target });
            expect(result).toEqual({});
        });

        it('忽略鍵值為空陣列的情況', () => {
            setGlobalConfig({
                ignoreKeys: []
            });

            const source = {
                a: 'a',
                b: 'b'
            };
            const target = {
                a: 'different',
                b: 'different'
            };

            const result = diff({ source, target });
            expect(result).toEqual({});
        });

        it('忽略鍵值包含重複值的情況', () => {
            setGlobalConfig({
                ignoreKeys: ['ignore', 'ignore', 'ignore']
            });

            const source = {
                a: 'a',
                ignore: 'ignored'
            };
            const target = {
                a: 'different'
            };

            const result = diff({ source, target });
            expect(result).toEqual({});
        });

        it('忽略鍵值大小寫敏感測試', () => {
            setGlobalConfig({
                ignoreKeys: ['Ignore']
            });

            const source = {
                a: 'a',
                ignore: 'lowercase',
                Ignore: 'uppercase'
            };
            const target = {
                a: 'different'
            };

            const result = diff({ source, target });
            expect(result).toEqual({
                ignore: AbnormalType.MISS_KEY
            });
        });
    })
});
