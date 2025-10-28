import { AbnormalType } from '@/abnormal/types';
import { diff } from '@/checker/diff';
import { describe, expect, it } from 'vitest';

/**
 * diff 陣列比對測試
 * 測試 diff 函數對陣列的處理，包括長度差異、內容比對、巢狀陣列等
 */
describe('diff 陣列比對測試', () => {
  it('陣列長度差異檢測', () => {
    const source = { items: ['a', 'b', 'c'] };
    const target = { items: ['a', 'b'] };

    const result = diff({ source, target });
    expect(result).toEqual({
      items: AbnormalType.DIFF_ARRAY_LENGTH
    });
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
        { id: 2 } // 缺少 name
      ]
    };

    const result = diff({ source, target });
    expect(result).toEqual({
      items: [
        {},
        { name: AbnormalType.MISS_KEY }
      ]
    });
  });

  it('巢狀陣列比對', () => {
    const source = {
      matrix: [
        [1, 2, 3],
        [4, 5, 6]
      ]
    };
    const target = {
      matrix: [
        [1, 2, 3],
        [4, 5] // 長度不同
      ]
    };

    const result = diff({ source, target });
    expect(result).toEqual({
      matrix: [
        {},
        AbnormalType.DIFF_ARRAY_LENGTH
      ]
    });
  });

  it('陣列與物件混合測試', () => {
    const source = {
      data: {
        items: ['a', 'b', 'c'],
        metadata: {
          count: 3,
          tags: ['tag1', 'tag2']
        }
      }
    };
    const target = {
      data: {
        items: ['a', 'b'], // 長度不同
        metadata: {
          count: 3,
          tags: ['tag1', 'tag2', 'tag3'] // 長度不同
        }
      }
    };

    const result = diff({ source, target });
    expect(result).toEqual({
      data: {
        items: AbnormalType.DIFF_ARRAY_LENGTH,
        metadata: {
          tags: AbnormalType.DIFF_ARRAY_LENGTH
        }
      }
    });
  });

  it('大型陣列測試', () => {
    const source = { items: Array.from({ length: 1000 }, (_, i) => i) };
    const target = { items: Array.from({ length: 999 }, (_, i) => i) };

    const result = diff({ source, target });
    expect(result).toEqual({
      items: AbnormalType.DIFF_ARRAY_LENGTH
    });
  });

  it('邊境：空陣列與單元素陣列', () => {
    const source = { items: [] };
    const target = { items: ['single'] };

    const result = diff({ source, target });
    expect(result).toEqual({
      items: AbnormalType.DIFF_ARRAY_LENGTH
    });
  });
});
