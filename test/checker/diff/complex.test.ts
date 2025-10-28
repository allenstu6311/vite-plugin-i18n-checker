import { AbnormalType } from '@/abnormal/types';
import { diff } from '@/checker/diff';
import { describe, expect, it } from 'vitest';

/**
 * diff 複雜情況測試
 * 測試 diff 函數對複雜混合情況的處理，包括多種異常同時存在、真實場景等
 */
describe('diff 複雜情況測試', () => {
  it('多種異常同時存在', () => {
    const source = {
      a: 'hello',
      b: 'world',
      c: 'test',
      d: [],
      e: { nested: 'value' }
    };
    const target = {
      a: 'hello',
      f: 'extra',
      d: {},
      e: { nested: 'value', extra: 'field' }
    };

    const result = diff({ source, target });
    expect(result).toEqual({
      b: AbnormalType.MISS_KEY,
      c: AbnormalType.MISS_KEY,
      f: AbnormalType.EXTRA_KEY,
      d: AbnormalType.DIFF_STRUCTURE_TYPE,
      e: {
        extra: AbnormalType.EXTRA_KEY
      }
    });
  });

  it('真實 i18n 翻譯檔案場景', () => {
    const source = {
      app: {
        common: {
          save: '儲存',
          cancel: '取消',
          confirm: '確認'
        },
        login: {
          title: '登入',
          username: '使用者名稱',
          password: '密碼',
          submit: '提交'
        },
        dashboard: {
          welcome: '歡迎',
          stats: ['統計1', '統計2', '統計3']
        }
      }
    };
    const target = {
      app: {
        common: {
          save: 'Save',
          cancel: 'Cancel',
          confirm: 'Confirm',
          delete: 'Delete' // 額外鍵值
        },
        login: {
          title: 'Login',
          username: 'Username',
          password: 'Password'
          // 缺少 submit
        },
        dashboard: {
          welcome: 'Welcome',
          stats: ['Stat1', 'Stat2'] // 陣列長度不同
        }
      }
    };

    const result = diff({ source, target });
    expect(result).toEqual({
      app: {
        common: {
          delete: AbnormalType.EXTRA_KEY
        },
        login: {
          submit: AbnormalType.MISS_KEY
        },
        dashboard: {
          stats: AbnormalType.DIFF_ARRAY_LENGTH
        }
      }
    });
  });

  it('複雜混合結構', () => {
    const source = {
      users: [
        {
          id: 1,
          profile: {
            name: 'John',
            settings: {
              theme: 'dark',
              notifications: ['email', 'sms']
            }
          }
        }
      ],
      config: {
        api: {
          baseUrl: 'https://api.example.com',
          timeout: 5000
        }
      }
    };
    const target = {
      users: [
        {
          id: 1,
          profile: {
            name: 'John',
            settings: {
              theme: 'dark',
              notifications: ['email'], // 陣列長度不同
              language: 'en' // 額外鍵值
            }
          }
        }
      ],
      config: {
        api: {
          baseUrl: 'https://api.example.com'
          // 缺少 timeout
        },
        cache: { // 額外鍵值
          enabled: true
        }
      }
    };

    const result = diff({ source, target });
    expect(result).toEqual({
      users: [
        {
          profile: {
            settings: {
              notifications: AbnormalType.DIFF_ARRAY_LENGTH,
              language: AbnormalType.EXTRA_KEY
            }
          }
        }
      ],
      config: {
        api: {
          timeout: AbnormalType.MISS_KEY
        },
        cache: AbnormalType.EXTRA_KEY
      }
    });
  });

  it('性能相關的大型結構', () => {
    const source = {
      data: Array.from({ length: 100 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
        metadata: {
          tags: Array.from({ length: 10 }, (_, j) => `tag${j}`),
          config: {
            enabled: true,
            settings: Array.from({ length: 5 }, (_, k) => `setting${k}`)
          }
        }
      }))
    };
    const target = {
      data: Array.from({ length: 99 }, (_, i) => ({ // 長度不同
        id: i,
        name: `Item ${i}`,
        metadata: {
          tags: Array.from({ length: 10 }, (_, j) => `tag${j}`),
          config: {
            enabled: true,
            settings: Array.from({ length: 5 }, (_, k) => `setting${k}`)
          }
        }
      }))
    };

    const result = diff({ source, target });
    expect(result).toEqual({
      data: AbnormalType.DIFF_ARRAY_LENGTH
    });
  });

  it('錯誤處理的複雜情況', () => {
    const source = {
      valid: { key: 'value' },
      nullValue: null,
      undefinedValue: undefined,
      emptyArray: [],
      emptyObject: {}
    };
    const target = {
      valid: { key: 'value' },
      nullValue: null,
      undefinedValue: undefined,
      emptyArray: [],
      emptyObject: {},
      extra: 'field'
    };

    const result = diff({ source, target });
    expect(result).toEqual({
      extra: AbnormalType.EXTRA_KEY
    });
  });

  it('邊境：最大複雜度測試', () => {
    // 建立最大複雜度的結構
    const createComplexStructure = () => {
      const structure: any = {};

      // 多層巢狀
      structure.level1 = {};
      structure.level1.level2 = {};
      structure.level1.level2.level3 = {};
      structure.level1.level2.level3.level4 = {};
      structure.level1.level2.level3.level4.level5 = {
        array: Array.from({ length: 50 }, (_, i) => i),
        object: {
          key1: 'value1',
          key2: 'value2',
          key3: 'value3'
        }
      };

      // 陣列中混合物件
      structure.mixedArray = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        data: {
          items: Array.from({ length: 10 }, (_, j) => `item${j}`),
          config: {
            enabled: true,
            settings: Array.from({ length: 5 }, (_, k) => `setting${k}`)
          }
        }
      }));

      return structure;
    };

    const source = createComplexStructure();
    const target = createComplexStructure();

    // 修改最深層的一個屬性
    target.level1.level2.level3.level4.level5.object.key4 = 'value4';

    const result = diff({ source, target });
    expect(result).toEqual({
      level1: {
        level2: {
          level3: {
            level4: {
              level5: {
                object: {
                  key4: AbnormalType.EXTRA_KEY
                }
              }
            }
          }
        }
      }
    });
  });
});