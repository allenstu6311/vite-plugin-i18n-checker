import { AbnormalType } from '@/abnormal/types';
import { diff } from '@/checker/diff';
import { describe, expect, it } from 'vitest';

/**
 * diff 基本比對測試
 * 測試 diff 函數的基本功能，包括相同物件、缺少鍵值、額外鍵值等基本情況
 */
describe('diff 基本比對測試', () => {
  it('完全相同的物件應該返回空結果', () => {
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

  it('檢測結構類型差異', () => {
    const source = { a: 'hello', b: [] };
    const target = { a: 'hello', b: {} };

    const result = diff({ source, target });
    expect(result).toEqual({
      b: AbnormalType.DIFF_STRUCTURE_TYPE
    });
  });

  it('檢測陣列長度差異', () => {
    const source = { items: ['a', 'b', 'c'] };
    const target = { items: ['a', 'b'] };

    const result = diff({ source, target });
    expect(result).toEqual({
      items: AbnormalType.DIFF_ARRAY_LENGTH
    });
  });

  it('邊境：空物件與空陣列比對', () => {
    const source = { empty: {} };
    const target = { empty: [] };

    const result = diff({ source, target });
    expect(result).toEqual({
      empty: AbnormalType.DIFF_STRUCTURE_TYPE
    });
  });
});
