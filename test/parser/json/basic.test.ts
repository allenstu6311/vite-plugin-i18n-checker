import { parseFile } from '@/parser';
import { describe, expect, it } from 'vitest';

/**
 * parseFile JSON 基本物件解析測試
 * 測試 parseFile 對 JSON 格式檔案的基本解析能力
 */
describe('parseFile JSON 基本物件解析測試', () => {
    it('解析簡單物件', () => {
        const jsonCode = `{ "name": "test", "count": 123, "active": true }`;
        const result = parseFile(jsonCode, 'json');
        expect(result).toEqual({
            name: 'test',
            count: 123,
            active: true
        });
    });

    it('解析巢狀物件', () => {
        const jsonCode = `{
            "user": {
                "name": "John",
                "profile": {
                    "email": "john@example.com"
                }
            }
        }`;
        const result = parseFile(jsonCode, 'json');
        expect(result).toEqual({
            user: {
                name: 'John',
                profile: {
                    email: 'john@example.com'
                }
            }
        });
    });

    it('解析陣列資料', () => {
        const jsonCode = `{
            "items": ["a", "b", "c"],
            "numbers": [1, 2, 3]
        }`;
        const result = parseFile(jsonCode, 'json');
        expect(result).toEqual({
            items: ['a', 'b', 'c'],
            numbers: [1, 2, 3]
        });
    });

    it('解析混合基本類型', () => {
        const jsonCode = `{
            "string": "hello",
            "number": 42,
            "boolean": false,
            "nullValue": null,
            "array": ["item1", "item2"],
            "object": {
                "key": "value"
            }
        }`;
        const result = parseFile(jsonCode, 'json');
        expect(result).toEqual({
            string: 'hello',
            number: 42,
            boolean: false,
            nullValue: null,
            array: ['item1', 'item2'],
            object: {
                key: 'value'
            }
        });
    });

    it('解析複雜巢狀結構', () => {
        const jsonCode = `{
            "app": {
                "core": {
                    "config": {
                        "settings": {
                            "theme": "dark"
                        }
                    },
                    "constants": {
                        "status": {
                            "active": "active"
                        }
                    }
                },
                "features": {
                    "dashboard": {
                        "widgets": ["chart", "table"]
                    }
                }
            }
        }`;
        const result = parseFile(jsonCode, 'json');
        expect(result).toEqual({
            app: {
                core: {
                    config: {
                        settings: {
                            theme: 'dark'
                        }
                    },
                    constants: {
                        status: {
                            active: 'active'
                        }
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

    it('解析陣列中巢狀物件', () => {
        const jsonCode = `{
            "categories": [
                {
                    "name": "category1",
                    "items": [
                        { "id": 1, "title": "item1" }
                    ]
                }
            ]
        }`;
        const result = parseFile(jsonCode, 'json');
        expect(result).toEqual({
            categories: [
                {
                    name: 'category1',
                    items: [
                        { id: 1, title: 'item1' }
                    ]
                }
            ]
        });
    });

    it('解析數字鍵值', () => {
        const jsonCode = `{
            "0": "zero",
            "123": "number",
            "999": "large"
        }`;
        const result = parseFile(jsonCode, 'json');
        expect(result).toEqual({
            '0': 'zero',
            '123': 'number',
            '999': 'large'
        });
    });

    it('邊境：空物件處理', () => {
        const result = parseFile('{}', 'json');
        expect(result).toEqual({});
    });
});
