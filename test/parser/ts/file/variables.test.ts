import { parseTsCode } from '@/parser/ts';
import { describe, expect, it } from 'vitest';

/**
 * parseTsCode 變數宣告解析測試
 * 測試 parseTsCode 對變數宣告（const、let、var）和 spread 運算子的處理
 */
describe('parseTsCode 變數宣告解析測試', () => {
    it('解析 const 宣告 + spread', () => {
        const code = `
            const common = { save: '儲存', cancel: '取消' };
            export default { ...common, extra: '額外內容' }
        `;
        const result = parseTsCode(code);
        expect(result).toEqual({
            save: '儲存',
            cancel: '取消',
            extra: '額外內容'
        });
    });

    it('解析 let 宣告 + spread', () => {
        const code = `
            let config = { apiUrl: 'https://api.example.com', timeout: 5000 };
            export default { ...config, retry: 3 }
        `;
        const result = parseTsCode(code);
        expect(result).toEqual({
            apiUrl: 'https://api.example.com',
            timeout: 5000,
            retry: 3
        });
    });

    it('解析 var 宣告 + spread', () => {
        const code = `
            var settings = { theme: 'dark', language: 'zh-TW' };
            export default { ...settings, fontSize: 14 }
        `;
        const result = parseTsCode(code);
        expect(result).toEqual({
            theme: 'dark',
            language: 'zh-TW',
            fontSize: 14
        });
    });

    it('解析多個變數宣告', () => {
        const code = `
            const common = { save: '儲存' };
            const forms = { validation: { required: '必填' } };
            export default { ...common, ...forms, extra: '額外內容' }
        `;
        const result = parseTsCode(code);
        expect(result).toEqual({
            save: '儲存',
            validation: { required: '必填' },
            extra: '額外內容'
        });
    });

    it('解析變數引用其他變數', () => {
        const code = `
            const base = { name: 'base', value: 100 };
            const extended = { ...base, extra: 'extended' };
            export default { ...extended, final: 'final' }
        `;
        const result = parseTsCode(code);
        expect(result).toEqual({
            name: 'base',
            value: 100,
            extra: 'extended',
            final: 'final'
        });
    });

    it('邊境：變數宣告但未在 export default 使用', () => {
        const code = `
            const unused = { key: 'value' };
            const used = { active: true };
            export default { ...used, direct: 'direct' }
        `;
        const result = parseTsCode(code);
        expect(result).toEqual({
            active: true,
            direct: 'direct'
        });
    });
});

