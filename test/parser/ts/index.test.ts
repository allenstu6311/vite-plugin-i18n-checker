import fs from 'fs';
import { parseTsCode } from '../../../src/parser/ts';
import { beforeEach, describe, expect, it } from 'vitest';
import { getGlobalConfig, setGlobalConfig } from '@/config';


describe('parseTsCode', () => {
    beforeEach(() => {
        setGlobalConfig({
            baseLocale: 'zh_CN',
            localesPath: 'locale/js',
            extensions: 'js',
            outputLang: 'zh_CN',
        });
    });

    it('should parse js code', () => {
        setGlobalConfig({ localesPath: 'locale/test', extensions: 'ts' })
        const code = fs.readFileSync('./locale/test/zh_CN.js', 'utf-8');
        const result = parseTsCode(code);
        expect(result).toEqual({
            save: '儲存',
            cancel: '取消',
            confirm: '確認',
            delete: '刪除',
            forms: {
                validation: {
                    placeholders: {
                        username: '請輸入使用者名稱',
                        password: '請輸入密碼'
                    }
                },
                categories: ['技術', '設計', '行銷']
            },
            name: '小明',
            age: 28,
            country: 'Taiwan',
            active: true,
        })
    });

    it('should parse ts code', () => {
        setGlobalConfig({ localesPath: 'locale/test', extensions: 'ts' })

        const code = fs.readFileSync('./locale/test/zh_CN.ts', 'utf-8');
        const result = parseTsCode(code);
        expect(result).toEqual({
            save: '儲存',
            cancel: '取消',
            confirm: '確認',
            delete: '刪除',
            forms: {
                validation: {
                    placeholders: {
                        username: '請輸入使用者名稱',
                        password: '請輸入密碼'
                    }
                },
                categories: ['技術', '設計', '行銷']
            },
            name: '小明',
            age: 28,
            country: 'Taiwan',
            active: true,
        })
    })
});
