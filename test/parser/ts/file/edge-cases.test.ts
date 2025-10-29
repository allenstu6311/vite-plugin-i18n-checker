import { parseTsCode } from '@/parser/ts';
import { describe, expect, it } from 'vitest';

/**
 * parseTsCode 邊界情況測試
 * 測試 parseTsCode 對各種邊界情況和異常情況的處理
 */
describe('parseTsCode 邊界情況測試', () => {
    it('處理無效語法', () => {
        expect(() => parseTsCode(`export default { invalid: syntax error }`)).toThrow();
    });

    it('處理沒有 export default', () => {
        const code = `
            const data = { name: 'test' };
        `;
        const result = parseTsCode(code);
        expect(result).toEqual({});
    });

    it('處理只有註解', () => {
        const code = `
            // 這是一個註解
            /* 這是另一個註解 */
            export default {}
        `;
        const result = parseTsCode(code);
        expect(result).toEqual({});
    });

    it('處理極端深度巢狀', () => {
        const code = `
            export default {
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
            }
        `;
        const result = parseTsCode(code);
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

    it('邊境：空檔案 / 只有空白字元', () => {
        const code = `   \n   \t   \n   `;
        const result = parseTsCode(code);
        expect(result).toEqual({});
    });
});

