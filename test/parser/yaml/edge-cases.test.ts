import { parseFile } from '@/parser';
import { describe, expect, it } from 'vitest';

/**
 * parseFile YAML 邊境情況測試
 * 測試 parseFile 對 YAML 格式的各種邊境情況和異常情況的處理
 */
describe('parseFile YAML 邊境情況測試', () => {
    it('處理極端深度巢狀', () => {
        const yamlCode = `level1:
  level2:
    level3:
      level4:
        level5:
          deep: value`;
        const result = parseFile(yamlCode, 'yaml');
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
        const yamlCode = 'items: []';
        const result = parseFile(yamlCode, 'yaml');
        expect(result).toEqual({
            items: []
        });
    });

    it('處理特殊字符鍵值', () => {
        const yamlCode = `"key-with-dash": value
"key_with_underscore": value
"key.with.dot": value
'key with space': value`;
        const result = parseFile(yamlCode, 'yaml');
        expect(result).toEqual({
            'key-with-dash': 'value',
            'key_with_underscore': 'value',
            'key.with.dot': 'value',
            'key with space': 'value'
        });
    });

    it('處理 unicode 字符', () => {
        const yamlCode = `chinese: 中文
emoji: 😀🎉
symbols: ©®™`;
        const result = parseFile(yamlCode, 'yaml');
        expect(result).toEqual({
            chinese: '中文',
            emoji: '😀🎉',
            symbols: '©®™'
        });
    });

    it('處理引號字串', () => {
        const yamlCode = `double: "say \\"hello\\""
single: 'say "hello"'
literal: |
  This has "quotes" and 'apostrophes'`;
        const result = parseFile(yamlCode, 'yaml');
        expect(result.double).toBe('say "hello"');
        expect(result.single).toBe('say "hello"');
        expect(result.literal).toContain('quotes');
        expect(result.literal).toContain('apostrophes');
    });

    it('處理數字類型', () => {
        const yamlCode = `integer: 42
float: 3.14
negative: -10
scientific: 1e10
octal: 0o10
hex: 0xFF`;
        const result = parseFile(yamlCode, 'yaml');
        expect(result.integer).toBe(42);
        expect(result.float).toBe(3.14);
        expect(result.negative).toBe(-10);
        expect(result.scientific).toBe(10000000000);
    });

    it('處理布林值', () => {
        const yamlCode = `trueValue: true
falseValue: false
yesValue: yes
noValue: no
onValue: on
offValue: off`;
        const result = parseFile(yamlCode, 'yaml');
        expect(result.trueValue).toBe(true);
        expect(result.falseValue).toBe(false);
        expect(result.yesValue).toBe('yes');
        expect(result.noValue).toBe('no');
        expect(result.onValue).toBe('on');
        expect(result.offValue).toBe('off');
    });

    it('處理 null 值', () => {
        const yamlCode = `nullValue: null
empty: ~
emptyString: ""`;
        const result = parseFile(yamlCode, 'yaml');
        expect(result.nullValue).toBe(null);
        expect(result.empty).toBe(null);
        expect(result.emptyString).toBe('');
    });

    it('處理日期時間', () => {
        const yamlCode = `date: 2023-01-01
datetime: 2023-01-01T12:00:00
iso: 2023-01-01T12:00:00Z`;
        const result = parseFile(yamlCode, 'yaml');
        expect(result.date).toBeDefined();
        expect(result.datetime).toBeDefined();
        expect(result.iso).toBeDefined();
    });

    it('處理註解', () => {
        const yamlCode = `# 這是一個註解
key: value  # 行尾註解
# 另一個註解
another: value`;
        const result = parseFile(yamlCode, 'yaml');
        expect(result).toEqual({
            key: 'value',
            another: 'value'
        });
    });

    it('處理錨點和別名', () => {
        const yamlCode = `defaults: &defaults
  host: localhost
  port: 8080

server:
  <<: *defaults
  port: 9090`;
        const result = parseFile(yamlCode, 'yaml');
        expect(result.server).toBeDefined();
        expect(result.server['<<'].host).toBe('localhost');
        expect(result.server.port).toBe(9090);
    });

    it('處理複雜陣列結構', () => {
        const yamlCode = `items:
  - name: item1
    value: 100
  - name: item2
    value: 200
  - [item3, 300]`;
        const result = parseFile(yamlCode, 'yaml');
        expect(result.items).toHaveLength(3);
        expect(result.items[0]).toEqual({ name: 'item1', value: 100 });
        expect(result.items[1]).toEqual({ name: 'item2', value: 200 });
        expect(result.items[2]).toEqual(['item3', 300]);
    });

    it('處理空值字串', () => {
        const yamlCode = `empty: ""
whitespace: "   "
nullValue: null`;
        const result = parseFile(yamlCode, 'yaml');
        expect(result.empty).toBe('');
        expect(result.whitespace).toBe('   ');
        expect(result.nullValue).toBe(null);
    });

    it('邊境：只有註解的 YAML', () => {
        const yamlCode = `# 只有註解
# 沒有實際內容`;
        const result = parseFile(yamlCode, 'yaml');
        expect(result).toEqual(null);
    });
});
