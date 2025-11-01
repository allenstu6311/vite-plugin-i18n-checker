import { AbnormalType } from '@/abnormal/types';
import { diff } from '@/checker/diff';
import { describe, expect, it } from 'vitest';

/**
 * diff 邊境情況測試
 * 測試 diff 函數對各種邊境情況的處理，包括空值、特殊字符、極端情況等
 */
describe('diff 邊境情況測試', () => {
  it('null 和 undefined 處理', () => {
    const source = { a: null, b: undefined };
    const target = { a: undefined, b: null };

    const result = diff({ source, target });
    expect(result).toEqual({});
  });

  it('空字串和特殊字符鍵值', () => {
    const source = { '': 'empty key', 'key-with-dash': 'dash', 'key_with_underscore': 'underscore' };
    const target = { '': 'different empty key', 'key-with-dash': 'different dash', 'key_with_underscore': 'different underscore' };

    const result = diff({ source, target });
    expect(result).toEqual({});
  });

  it('數字鍵值處理', () => {
    const source = { '0': 'zero', '123': 'number', '999': 'large number' };
    const target = { '0': 'different zero', '123': 'different number', '999': 'different large number' };

    const result = diff({ source, target });
    expect(result).toEqual({});
  });

  it('函數和類別物件', () => {
    const source = {
      func: () => 'hello',
      obj: new Date('2023-01-01'),
      regex: /test/g
    };
    const target = {
      func: () => 'world',
      obj: new Date('2023-01-02'),
      regex: /test/i
    };

    const result = diff({ source, target });
    expect(result).toEqual({});
  });

  it('日期和正則表達式', () => {
    const source = {
      date: new Date('2023-01-01'),
      regex: /test/g,
      error: new Error('test')
    };
    const target = {
      date: new Date('2023-01-02'),
      regex: /test/i,
      error: new Error('different')
    };

    const result = diff({ source, target });
    expect(result).toEqual({});
  });

  it('邊境：極端深度與寬度測試', () => {
    // 建立極寬的物件（100個屬性）
    const createWideObject = () => {
      const obj: any = {};
      for (let i = 0; i < 100; i++) {
        obj[`key${i}`] = { value: i };
      }
      return obj;
    };

    const source = createWideObject();
    const target = createWideObject();
    // 修改一個屬性
    target.key50 = { value: 50, extra: 'field' };

    const result = diff({ source, target });
    expect(result).toEqual({
      key50: {
        extra: AbnormalType.EXTRA_KEY
      }
    });
  });
});