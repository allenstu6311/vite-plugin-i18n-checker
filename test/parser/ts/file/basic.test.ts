import { parseTsCode } from '@/parser/ts';
import { describe, expect, it } from 'vitest';

/**
 * parseTsCode 基本物件解析測試
 * 測試 parseTsCode 對基本物件結構的解析能力
 */
describe('parseTsCode 基本物件解析測試', () => {
    it('解析簡單物件', () => {
        const code = `export default { name: 'test', count: 123, active: true }`;
        const result = parseTsCode(code);
        expect(result).toEqual({
            name: 'test',
            count: 123,
            active: true
        });
    });

    it('解析巢狀物件', () => {
        const code = `
            export default {
                user: {
                    name: 'John',
                    profile: { email: 'john@example.com' }
                }
            }
        `;
        const result = parseTsCode(code);
        expect(result).toEqual({
            user: {
                name: 'John',
                profile: { email: 'john@example.com' }
            }
        });
    });

    it('解析陣列資料', () => {
        const code = `export default { items: ['a', 'b', 'c'], numbers: [1, 2, 3] }`;
        const result = parseTsCode(code);
        expect(result).toEqual({
            items: ['a', 'b', 'c'],
            numbers: [1, 2, 3]
        });
    });

    it('解析混合基本類型', () => {
        const code = `
            export default {
                string: 'hello',
                number: 42,
                boolean: false,
                nullValue: null,
                array: ['item1', 'item2'],
                object: { key: 'value' }
            }
        `;
        const result = parseTsCode(code);
        expect(result).toEqual({
            string: 'hello',
            number: 42,
            boolean: false,
            nullValue: null,
            array: ['item1', 'item2'],
            object: { key: 'value' }
        });
    });

    it('解析複雜巢狀結構', () => {
        const code = `
            export default {
                app: {
                    core: {
                        config: {
                            settings: { theme: 'dark' }
                        },
                        constants: {
                            status: { active: 'active' }
                        }
                    },
                    features: {
                        dashboard: {
                            widgets: ['chart', 'table']
                        }
                    }
                }
            }
        `;
        const result = parseTsCode(code);
        expect(result).toEqual({
            app: {
                core: {
                    config: {
                        settings: { theme: 'dark' }
                    },
                    constants: {
                        status: { active: 'active' }
                    }
                },
                features: {
                    dashboard: {
                        widgets: ['chart', 'table']
                    }
                }
            }
        });
    });

    it('邊境：空物件處理', () => {
        const result = parseTsCode(`export default {}`);
        expect(result).toEqual({});
    });
});

