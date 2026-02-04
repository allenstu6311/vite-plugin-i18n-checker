/**
 * 語系工具測試
 * 驗證語系清單解析、規則套用與排除行為
 */
import { I18nCheckerOptions } from '@/config/types';
import { getTotalLang } from '@/helpers/lang';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { describe, expect, it } from 'vitest';

function createTempDir() {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lang-test-'));
    return {
        dir,
        cleanup: () => fs.rmSync(dir, { recursive: true, force: true }),
    };
}

function writeFile(baseDir: string, relativePath: string, content = '{}') {
    const fullPath = path.join(baseDir, relativePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content, 'utf-8');
    return fullPath;
}

function createConfig(localesPath: string, overrides: Partial<I18nCheckerOptions> = {}): I18nCheckerOptions {
    return {
        sourceLocale: 'zh_CN',
        localesPath,
        extensions: 'json',
        failOnError: false,
        applyMode: 'serve',
        include: [],
        exclude: [],
        ignoreKeys: [],
        rules: [],
        watch: false,
        report: {
            dir: 'report',
            retention: 0,
        },
        ...overrides,
    };
}

describe('語系工具測試', () => {
    it('資料夾模式應回傳第一層資料夾名稱清單', () => {
        const { dir, cleanup } = createTempDir();
        try {
            fs.mkdirSync(path.join(dir, 'zh_CN'));
            fs.mkdirSync(path.join(dir, 'en_US'));
            fs.mkdirSync(path.join(dir, 'zh_TW'));

            const result = getTotalLang({
                localesPath: dir,
                extensions: 'json',
                config: createConfig(dir),
            });
            const fileNames = result.map(item => item.fileName).sort();
            const langs = result.map(item => item.lang).sort();

            expect(fileNames).toEqual(['en_US', 'zh_TW']);
            expect(langs).toEqual(['', '']);
        } finally {
            cleanup();
        }
    });

    it('檔案模式應該只回傳符合副檔名的檔案', () => {
        const { dir, cleanup } = createTempDir();
        try {
            writeFile(dir, 'zh_CN.json');
            writeFile(dir, 'en_US.json');
            writeFile(dir, 'zh_TW.json');
            writeFile(dir, 'readme.md', '# doc');

            const result = getTotalLang({
                localesPath: dir,
                extensions: 'json',
                config: createConfig(dir),
            });
            const fileNames = result.map(item => item.fileName).sort();

            expect(fileNames).toEqual(['en_US.json', 'zh_TW.json']);
        } finally {
            cleanup();
        }
    });

    it('邊境：多層資料夾仍只取第一層語系', () => {
        const { dir, cleanup } = createTempDir();
        try {
            fs.mkdirSync(path.join(dir, 'zh_CN'));
            fs.mkdirSync(path.join(dir, 'en_US'));
            fs.mkdirSync(path.join(dir, 'en_US', 'nested', 'deep'), { recursive: true });

            const result = getTotalLang({
                localesPath: dir,
                extensions: 'json',
                config: createConfig(dir),
            });
            const fileNames = result.map(item => item.fileName).sort();

            expect(fileNames).toEqual(['en_US']);
        } finally {
            cleanup();
        }
    });

    it('套用 localeRules 時應該轉換語系代碼', () => {
        const { dir, cleanup } = createTempDir();
        try {
            writeFile(dir, 'zh_CN.json');
            writeFile(dir, 'en_US.json');

            const result = getTotalLang({
                localesPath: dir,
                extensions: 'json',
                config: createConfig(dir, {
                    sync: {
                        useAI: {
                            apiKey: 'mock',
                            provider: 'openai',
                            localeRules: {
                                'en_*.*': 'en',
                            },
                        },
                    },
                }),
            });
            const entry = result.find(item => item.fileName === 'en_US.json');

            expect(entry?.lang).toBe('en');
        } finally {
            cleanup();
        }
    });

    it('邊境：localeRules 不合法應回傳空語系', () => {
        const { dir, cleanup } = createTempDir();
        try {
            writeFile(dir, 'zh_CN.json');
            writeFile(dir, 'bad_US.json');

            const result = getTotalLang({
                localesPath: dir,
                extensions: 'json',
                config: createConfig(dir, {
                    sync: {
                        useAI: {
                            apiKey: 'mock',
                            provider: 'openai',
                            localeRules: {
                                'bad_*.*': 'english',
                            },
                        },
                    },
                }),
            });
            const entry = result.find(item => item.fileName === 'bad_US.json');

            expect(entry?.lang).toBe('');
        } finally {
            cleanup();
        }
    });

    it('邊境：exclude 字串規則應排除檔案', () => {
        const { dir, cleanup } = createTempDir();
        try {
            writeFile(dir, 'zh_CN.json');
            const excludedPath = writeFile(dir, 'es_ES.json');

            const result = getTotalLang({
                localesPath: dir,
                extensions: 'json',
                config: createConfig(dir, {
                    exclude: [excludedPath],
                }),
            });
            const fileNames = result.map(item => item.fileName);

            expect(fileNames).not.toContain('es_ES.json');
        } finally {
            cleanup();
        }
    });

    it('邊境：exclude 正則規則應排除檔案', () => {
        const { dir, cleanup } = createTempDir();
        try {
            writeFile(dir, 'zh_CN.json');
            writeFile(dir, 'zh_TW.json');

            const result = getTotalLang({
                localesPath: dir,
                extensions: 'json',
                config: createConfig(dir, {
                    exclude: [/zh_TW\.json/],
                }),
            });
            const fileNames = result.map(item => item.fileName);

            expect(fileNames).not.toContain('zh_TW.json');
        } finally {
            cleanup();
        }
    });

    it('include 字串規則應只保留指定檔案', () => {
        const { dir, cleanup } = createTempDir();
        try {
            writeFile(dir, 'zh_CN.json');
            const includedPath = writeFile(dir, 'en_US.json');
            writeFile(dir, 'zh_TW.json');

            const result = getTotalLang({
                localesPath: dir,
                extensions: 'json',
                config: createConfig(dir, {
                    include: [includedPath],
                }),
            });
            const fileNames = result.map(item => item.fileName);

            expect(fileNames).toEqual(['en_US.json']);
        } finally {
            cleanup();
        }
    });

    it('include 正則規則應只保留指定檔案', () => {
        const { dir, cleanup } = createTempDir();
        try {
            writeFile(dir, 'zh_CN.json');
            writeFile(dir, 'en_US.json');
            writeFile(dir, 'zh_TW.json');

            const result = getTotalLang({
                localesPath: dir,
                extensions: 'json',
                config: createConfig(dir, {
                    include: [/en_US\.json$/],
                }),
            });
            const fileNames = result.map(item => item.fileName);

            expect(fileNames).toEqual(['en_US.json']);
        } finally {
            cleanup();
        }
    });

    it('include 與 exclude 同時使用時應以 exclude 覆蓋', () => {
        const { dir, cleanup } = createTempDir();
        try {
            writeFile(dir, 'zh_CN.json');
            const includeEnPath = writeFile(dir, 'en_US.json');
            const includeZhPath = writeFile(dir, 'zh_TW.json');

            const result = getTotalLang({
                localesPath: dir,
                extensions: 'json',
                config: createConfig(dir, {
                    include: [includeEnPath, includeZhPath],
                    exclude: [includeEnPath],
                }),
            });
            const fileNames = result.map(item => item.fileName);

            expect(fileNames).toEqual(['zh_TW.json']);
        } finally {
            cleanup();
        }
    });
});
