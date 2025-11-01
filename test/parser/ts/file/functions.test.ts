import { parseTsCode } from '@/parser/ts';
import { describe, expect, it } from 'vitest';

/**
 * parseTsCode 函數宣告解析測試
 * 測試 parseTsCode 對函數宣告的處理（函數應該被忽略，只解析 export default）
 */
describe('parseTsCode 函數宣告解析測試', () => {
    it('函數宣告被忽略，只解析 export default', () => {
        const code = `
            function getConfig() {
                return { apiUrl: 'https://api.example.com' };
            }
            export default { name: 'app' }
        `;
        const result = parseTsCode(code);
        expect(result).toEqual({ name: 'app' });
    });

    it('多個函數宣告被忽略', () => {
        const code = `
            function func1() { return { a: 1 }; }
            function func2() { return { b: 2 }; }
            export default { name: 'test' }
        `;
        const result = parseTsCode(code);
        expect(result).toEqual({ name: 'test' });
    });

    it('函數宣告 + export default 混合', () => {
        const code = `
            function helper() {
                return { help: 'help' };
            }
            export default {
                name: 'app',
                config: { debug: true }
            }
        `;
        const result = parseTsCode(code);
        expect(result).toEqual({
            name: 'app',
            config: { debug: true }
        });
    });

    it('箭頭函數宣告被忽略', () => {
        const code = `
            const getValue = () => ({ value: 123 });
            export default { name: 'app' }
        `;
        const result = parseTsCode(code);
        expect(result).toEqual({ name: 'app' });
    });

    it('邊境：只有函數沒有 export default', () => {
        const code = `
            function getData() {
                return { data: 'value' };
            }
        `;
        const result = parseTsCode(code);
        expect(result).toEqual({});
    });
});

