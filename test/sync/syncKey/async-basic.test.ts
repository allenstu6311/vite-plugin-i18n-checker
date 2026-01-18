/**
 * 同步鍵值 非同步基本測試
 * 驗證自動翻譯補值與失敗回退行為
 */
import { AbnormalType } from '@/abnormal/types';
import { ParserType } from '@/parser/types';
import { syncKeys } from '@/sync';
import * as aiApi from '@/sync/ai/api';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { afterEach, describe, expect, it, vi } from 'vitest';

type CaseItem = {
    name: string;
    label: string;
    ext: ParserType;
    needsAst: boolean;
};

const cases: CaseItem[] = [
    { name: 'json', label: '格式一', ext: ParserType.JSON, needsAst: false },
    { name: 'yaml', label: '格式二', ext: ParserType.YAML, needsAst: false },
    { name: 'ts', label: '格式三', ext: ParserType.TS, needsAst: true },
];

function getPlainContent(ext: string, filled: boolean) {
    if (ext === 'yml' || ext === 'yaml') {
        return filled ? 'title: Hello' : '';
    }
    return filled ? '{"title":"Hello"}' : '{}';
}

function getCodeContent(filled: boolean) {
    return filled ? 'export default { title: "Hello" }' : 'export default {}';
}

function createTempFiles({
    ext,
    targetContent,
    sourceContent,
}: {
    ext: string;
    targetContent: string;
    sourceContent: string;
}) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sync-async-'));
    const filePath = path.join(dir, `target.${ext}`);
    const sourcePath = path.join(dir, `source.${ext}`);
    fs.writeFileSync(filePath, targetContent, 'utf-8');
    fs.writeFileSync(sourcePath, sourceContent, 'utf-8');
    return {
        filePath,
        sourcePath,
        cleanup: () => fs.rmSync(dir, { recursive: true, force: true }),
    };
}

afterEach(() => {
    vi.restoreAllMocks();
});

describe('同步鍵值 非同步基本測試', () => {
    cases.forEach(({ name, label, ext, needsAst }) => {
        it(`${label} 成功：自動翻譯補值`, async () => {
            vi.spyOn(aiApi, 'getAIResponse').mockResolvedValue({
                success: true,
                data: {
                    choices: [{ message: { content: '{"translations":["你好"]}' } }],
                },
                error: null,
            });

            const template = { title: 'Hello' };
            const target = {};
            const abnormalKeys = { title: AbnormalType.ADD_KEY };

            const { filePath, sourcePath, cleanup } = createTempFiles({
                ext: name,
                targetContent: needsAst ? getCodeContent(false) : getPlainContent(name, false),
                sourceContent: needsAst ? getCodeContent(true) : getPlainContent(name, true),
            });

            try {
                const result = await syncKeys({
                    abnormalKeys,
                    template,
                    target,
                    filePath,
                    sourcePath,
                    extensions: ext,
                    context: {
                        lang: 'zh_TW',
                        useAI: {
                            provider: 'openai',
                            apiKey: 'mock',
                            localeRules: {},
                        },
                    },
                    sync: { override: true },
                });
                expect(result).toContain('title');
                expect(result).toContain('你好');
            } finally {
                cleanup();
            }
        });

        it(`${label} 失敗：自動翻譯失敗仍維持缺少鍵值`, async () => {
            vi.spyOn(aiApi, 'getAIResponse').mockResolvedValue({
                success: false,
                data: null,
                error: { code: 500, message: 'fail' },
            });

            const template = { title: 'Hello' };
            const target = {};
            const abnormalKeys = { title: AbnormalType.ADD_KEY };

            const { filePath, sourcePath, cleanup } = createTempFiles({
                ext: name,
                targetContent: needsAst ? getCodeContent(false) : getPlainContent(name, false),
                sourceContent: needsAst ? getCodeContent(true) : getPlainContent(name, true),
            });

            try {
                const result = await syncKeys({
                    abnormalKeys,
                    template,
                    target,
                    filePath,
                    sourcePath,
                    extensions: ext,
                    context: {
                        lang: 'zh_TW',
                        useAI: {
                            provider: 'openai',
                            apiKey: 'mock',
                            localeRules: {},
                        },
                    },
                    sync: { override: true },
                });

                expect(result).not.toContain('title');
                expect(abnormalKeys.title).toBe(AbnormalType.MISS_KEY);
            } finally {
                cleanup();
            }
        });
    });
});
