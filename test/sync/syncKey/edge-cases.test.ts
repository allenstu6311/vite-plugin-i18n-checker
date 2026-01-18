/**
 * 同步鍵值 邊境測試
 * 驗證極端輸入與特殊狀態下的同步行為
 */
import { AbnormalType } from '@/abnormal/types';
import * as helpers from '@/helpers';
import { ParserType } from '@/parser/types';
import { syncKeys } from '@/sync';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { describe, expect, it, vi } from 'vitest';

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
        return filled ? 'title: Hello' : '{}';
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
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sync-edge-'));
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

describe('同步鍵值 邊境測試', () => {
    cases.forEach(({ name, label, ext, needsAst }) => {
        it(`${label} 邊境：空物件檔案仍可補值且不拋錯`, async () => {
            // 空內容檔案需能正常補值
            const abnormalKeys = { title: AbnormalType.ADD_KEY };
            const template = { title: 'Hello' };
            const target = {};
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

        it(`${label} 邊境：內容相同時不寫入檔案`, async () => {
            // 相同內容不應觸發寫入
            if (needsAst) return;
            const abnormalKeys = { title: AbnormalType.ADD_KEY };
            const template = { title: 'Hello' };
            const target = { title: 'Hello' };
            const { filePath, sourcePath, cleanup } = createTempFiles({
                ext: name,
                targetContent: getPlainContent(name, true),
                sourceContent: getPlainContent(name, true),
            });
            // 判斷函數是否被呼叫
            const writeSpy = vi.spyOn(helpers, 'writeFileEnsureDir').mockResolvedValue();

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
                expect(writeSpy).not.toHaveBeenCalled();
            } finally {
                writeSpy.mockRestore();
                cleanup();
            }
        });

        it(`${label} 邊境：刪除鍵值路徑不存在不影響結果`, async () => {
            // 刪除不存在路徑不應改變結果
            const abnormalKeys = { missing: AbnormalType.DELETE_KEY };
            const template = { title: 'Hello' };
            const target = { title: 'Hello' };
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
