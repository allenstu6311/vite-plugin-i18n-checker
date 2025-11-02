import { parseFile } from '@/parser';
import { describe, expect, it } from 'vitest';

/**
 * parseFile YAML 基本物件解析測試
 * 測試 parseFile 對 YAML 格式檔案的基本解析能力
 */
describe('parseFile YAML 基本物件解析測試', () => {
    it('解析簡單物件', () => {
        const yamlCode = `name: test
count: 123
active: true`;
        const result = parseFile(yamlCode, 'yaml');
        expect(result).toEqual({
            name: 'test',
            count: 123,
            active: true
        });
    });

    it('解析巢狀物件', () => {
        const yamlCode = `user:
  name: John
  profile:
    email: john@example.com`;
        const result = parseFile(yamlCode, 'yaml');
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
        const yamlCode = `items:
  - a
  - b
  - c
numbers:
  - 1
  - 2
  - 3`;
        const result = parseFile(yamlCode, 'yaml');
        expect(result).toEqual({
            items: ['a', 'b', 'c'],
            numbers: [1, 2, 3]
        });
    });

    it('解析混合基本類型', () => {
        const yamlCode = `string: hello
number: 42
boolean: false
nullValue: null
array:
  - item1
  - item2
object:
  key: value`;
        const result = parseFile(yamlCode, 'yaml');
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
        const yamlCode = `app:
  core:
    config:
      settings:
        theme: dark
    constants:
      status:
        active: active
  features:
    dashboard:
      widgets:
        - chart
        - table`;
        const result = parseFile(yamlCode, 'yaml');
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
        const yamlCode = `categories:
  - name: category1
    items:
      - id: 1
        title: item1`;
        const result = parseFile(yamlCode, 'yaml');
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

    it('解析行內陣列語法', () => {
        const yamlCode = `items: [a, b, c]
numbers: [1, 2, 3]`;
        const result = parseFile(yamlCode, 'yaml');
        expect(result).toEqual({
            items: ['a', 'b', 'c'],
            numbers: [1, 2, 3]
        });
    });

    it('解析行內物件語法', () => {
        const yamlCode = `user: {name: John, age: 25}`;
        const result = parseFile(yamlCode, 'yaml');
        expect(result).toEqual({
            user: {
                name: 'John',
                age: 25
            }
        });
    });

    it('解析多行字串', () => {
        const yamlCode = `description: |
  This is a
  multi-line
  string`;
        const result = parseFile(yamlCode, 'yaml');
        expect(result.description).toBe('This is a\nmulti-line\nstring\n');
    });

    it('解析摺疊字串', () => {
        const yamlCode = `description: >
  This is a
  folded
  string`;
        const result = parseFile(yamlCode, 'yaml');
        expect(result.description).toBe('This is a folded string\n');
    });

    it('邊境：空物件處理', () => {
        const result = parseFile('', 'yaml');
        expect(result).toEqual(null);
    });

    it('邊境：只包含空白字元的 YAML', () => {
        const result = parseFile('   \n   \t   \n   ', 'yaml');
        expect(result).toEqual(null);
    });
});
