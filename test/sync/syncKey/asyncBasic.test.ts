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
    ext: ParserType;
    needsAst: boolean;
};

const cases: CaseItem[] = [
    { name: 'json', ext: ParserType.JSON, needsAst: false },
    { name: 'yaml', ext: ParserType.YAML, needsAst: false },
    { name: 'ts', ext: ParserType.TS, needsAst: true },
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

describe('syncKey 非同步基本測試', () => {
    cases.forEach(({ name, ext, needsAst }) => {
        it(`${name} 成功：AI 翻譯補值`, async () => {
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

        it(`${name} 失敗：AI 失敗維持 MISS_KEY`, async () => {
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
