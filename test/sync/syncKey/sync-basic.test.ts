/**
 * 同步鍵值 基本測試
 * 驗證同步補值與刪除鍵值的基本行為
 */
import { AbnormalType } from '@/abnormal/types';
import { ParserType } from '@/parser/types';
import { syncKeys } from '@/sync';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { describe, expect, it } from 'vitest';

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
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sync-basic-'));
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

describe('同步鍵值 基本測試', () => {
    cases.forEach(({ name, label, ext, needsAst }) => {
        it(`${label} 成功：由範本補值新增鍵`, async () => {
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
                    sync: { override: true },
                });

                expect(result).toContain('title');
                expect(result).toContain('Hello');
            } finally {
                cleanup();
            }
        });

        it(`${label} 成功：刪除鍵值可移除已存在項`, async () => {
            const template = {};
            const target = { extra: 'X' };
            const abnormalKeys = { extra: AbnormalType.DELETE_KEY };

            const { filePath, sourcePath, cleanup } = createTempFiles({
                ext: name,
                targetContent: needsAst ? 'export default { extra: "X" }' : '{"extra":"X"}',
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
                    sync: { override: true },
                });

                expect(result).not.toContain('extra');
            } finally {
                cleanup();
            }
        });

        it(`${label} 失敗：刪除鍵值路徑不存在不影響內容`, async () => {
            const template = { title: 'Hello' };
            const target = { title: 'Hello' };
            const abnormalKeys = { missing: AbnormalType.DELETE_KEY };

            const { filePath, sourcePath, cleanup } = createTempFiles({
                ext: name,
                targetContent: needsAst ? getCodeContent(true) : getPlainContent(name, true),
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
                    sync: { override: true },
                });

                expect(result).toContain('title');
                expect(result).toContain('Hello');
                expect(result).not.toContain('missing');
            } finally {
                cleanup();
            }
        });
    });
});
