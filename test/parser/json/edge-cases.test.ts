import { parseFile } from '@/parser';
import { describe, expect, it } from 'vitest';

/**
 * parseFile JSON 邊境情況測試
 * 測試 parseFile 對 JSON 格式的各種邊境情況和異常情況的處理
 */
describe('parseFile JSON 邊境情況測試', () => {
    it('處理無效 JSON 語法', () => {
        expect(() => parseFile('{ invalid: json }', 'json')).toThrow();
    });

    it('處理缺少引號的鍵值', () => {
        expect(() => parseFile('{ name: "test" }', 'json')).toThrow();
    });

    it('處理未閉合的物件', () => {
        expect(() => parseFile('{ "name": "test"', 'json')).toThrow();
    });

    it('處理未閉合的陣列', () => {
        expect(() => parseFile('{ "items": [1, 2, 3', 'json')).toThrow();
    });

    it('處理極端深度巢狀', () => {
        const jsonCode = `{
            "level1": {
                "level2": {
                    "level3": {
                        "level4": {
                            "level5": {
                                "deep": "value"
                            }
                        }
                    }
                }
            }
        }`;
        const result = parseFile(jsonCode, 'json');
        expect(result).toEqual({
            level1: {
                level2: {
                    level3: {
                        level4: {
                            level5: {
                                deep: 'value'
                            }
                        }
                    }
                }
            }
        });
    });

    it('處理空陣列', () => {
        const jsonCode = '{"items": []}';
        const result = parseFile(jsonCode, 'json');
        expect(result).toEqual({
            items: []
        });
    });

    it('處理特殊字符', () => {
        const jsonCode = `{
            "key-with-dash": "value",
            "key_with_underscore": "value",
            "key.with.dot": "value",
            "key with space": "value"
        }`;
        const result = parseFile(jsonCode, 'json');
        expect(result).toEqual({
            'key-with-dash': 'value',
            'key_with_underscore': 'value',
            'key.with.dot': 'value',
            'key with space': 'value'
        });
    });

    it('處理 unicode 字符', () => {
        const jsonCode = `{
            "chinese": "中文",
            "emoji": "😀🎉",
            "symbols": "©®™"
        }`;
        const result = parseFile(jsonCode, 'json');
        expect(result).toEqual({
            chinese: '中文',
            emoji: '😀🎉',
            symbols: '©®™'
        });
    });

    it('處理轉義字符', () => {
        const jsonCode = `{
            "newline": "line1\\nline2",
            "tab": "col1\\tcol2",
            "quote": "say \\"hello\\"",
            "backslash": "path\\\\to\\\\file"
        }`;
        const result = parseFile(jsonCode, 'json');
        expect(result).toEqual({
            newline: 'line1\nline2',
            tab: 'col1\tcol2',
            quote: 'say "hello"',
            backslash: 'path\\to\\file'
        });
    });

    it('處理數字類型', () => {
        const jsonCode = `{
            "integer": 42,
            "float": 3.14,
            "negative": -10,
            "scientific": 1e10
        }`;
        const result = parseFile(jsonCode, 'json');
        expect(result).toEqual({
            integer: 42,
            float: 3.14,
            negative: -10,
            scientific: 10000000000
        });
    });

    it('處理布林值和 null', () => {
        const jsonCode = `{
            "trueValue": true,
            "falseValue": false,
            "nullValue": null
        }`;
        const result = parseFile(jsonCode, 'json');
        expect(result).toEqual({
            trueValue: true,
            falseValue: false,
            nullValue: null
        });
    });

    it('邊境：只有空白字元', () => {
        expect(() => parseFile('   \n   \t   \n   ', 'json')).toThrow();
    });

    it('邊境：完全空白', () => {
        expect(() => parseFile('', 'json')).toThrow();
    });

    it('處理大型陣列', () => {
        const largeArray = Array.from({ length: 1000 }, (_, i) => i).join(',');
        const jsonCode = `{"numbers": [${largeArray}]}`;
        const result = parseFile(jsonCode, 'json');
        expect(result.numbers).toHaveLength(1000);
        expect(result.numbers[0]).toBe(0);
        expect(result.numbers[999]).toBe(999);
    });
});
