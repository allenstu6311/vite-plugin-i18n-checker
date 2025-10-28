import { AbnormalType } from '@/abnormal/types';
import { diff } from '@/checker/diff';
import { describe, expect, it } from 'vitest';

/**
 * diff 巢狀結構測試
 * 測試 diff 函數對深層巢狀物件的處理，包括多層巢狀、混合結構等
 */
describe('diff 巢狀結構測試', () => {
  it('三層巢狀物件比對', () => {
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

  it('深層巢狀物件缺少鍵值', () => {
    const source = {
      level1: {
        level2: {
          level3: {
            level4: {
              value: 'deep value',
              missing: 'field'
            }
          }
        }
      }
    };
    const target = {
      level1: {
        level2: {
          level3: {
            level4: {
              value: 'different deep value'
            }
          }
        }
      }
    };

    const result = diff({ source, target });
    expect(result).toEqual({
      level1: {
        level2: {
          level3: {
            level4: {
              missing: AbnormalType.MISS_KEY
            }
          }
        }
      }
    });
  });

  it('陣列中巢狀物件比對', () => {
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

  it('混合巢狀結構測試', () => {
    const source = {
      app: {
        config: {
          settings: ['setting1', 'setting2'],
          themes: {
            dark: { primary: '#000', secondary: '#333' },
            light: { primary: '#fff', secondary: '#ccc' }
          }
        }
      }
    };
    const target = {
      app: {
        config: {
          settings: ['setting1', 'setting2', 'setting3'], // 陣列長度不同
          themes: {
            dark: { primary: '#000', secondary: '#333' },
            light: { primary: '#fff', secondary: '#ccc', accent: '#f00' } // 額外鍵值
          }
        }
      }
    };

    const result = diff({ source, target });
    expect(result).toEqual({
      app: {
        config: {
          settings: AbnormalType.DIFF_ARRAY_LENGTH,
          themes: {
            light: {
              accent: AbnormalType.EXTRA_KEY
            }
          }
        }
      }
    });
  });

  it('大型巢狀結構測試', () => {
    // 建立一個大型巢狀結構
    const createDeepObject = (depth: number): any => {
      if (depth <= 0) return 'leaf';
      return {
        level: depth,
        children: createDeepObject(depth - 1)
      };
    };

    const source = createDeepObject(10);
    const target = createDeepObject(10);

    const result = diff({ source, target });
    expect(result).toEqual({});
  });

  it('邊境：極深巢狀結構（10層）', () => {
    const createDeepObject = (depth: number): any => {
      if (depth <= 0) return 'leaf';
      return {
        level: depth,
        children: createDeepObject(depth - 1)
      };
    };

    const source = createDeepObject(10);
    const target = {
      level: 10,
      children: {
        level: 9,
        children: {
          level: 8,
          children: {
            level: 7,
            children: {
              level: 6,
              children: {
                level: 5,
                children: {
                  level: 4,
                  children: {
                    level: 3,
                    children: {
                      level: 2,
                      children: {
                        level: 1,
                        children: 'leaf',
                        extra: 'field' // 額外鍵值
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    };

    const result = diff({ source, target });
    expect(result).toEqual({
      children: {
        children: {
          children: {
            children: {
              children: {
                children: {
                  children: {
                    children: {
                      children: {
                        extra: AbnormalType.EXTRA_KEY
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
  });
});
