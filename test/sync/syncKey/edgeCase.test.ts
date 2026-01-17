import { AbnormalType } from '@/abnormal/types';
import * as helpers from '@/helpers';
import { ParserType } from '@/parser/types';
import { syncKeys } from '@/sync';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { describe, expect, it, vi } from 'vitest';

function createTempFiles({
    targetContent,
    sourceContent,
}: {
    targetContent: string;
    sourceContent: string;
}) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sync-edge-'));
    const filePath = path.join(dir, 'target.json');
    const sourcePath = path.join(dir, 'source.json');
    fs.writeFileSync(filePath, targetContent, 'utf-8');
    fs.writeFileSync(sourcePath, sourceContent, 'utf-8');
    return {
        filePath,
        sourcePath,
        cleanup: () => fs.rmSync(dir, { recursive: true, force: true }),
    };
}

describe('syncKey 邊界測試', () => {
    it('空檔案：仍可補值且不拋錯', async () => {
        const abnormalKeys = { title: AbnormalType.ADD_KEY };
        const template = { title: 'Hello' };
        const target = {};
        const { filePath, sourcePath, cleanup } = createTempFiles({
            targetContent: '',
            sourceContent: '{"title":"Hello"}',
        });

        try {
            const result = await syncKeys({
                abnormalKeys,
                template,
                target,
                filePath,
                sourcePath,
                extensions: ParserType.JSON,
                sync: { override: true },
            });

            expect(result).toContain('"title": "Hello"');
        } finally {
            cleanup();
        }
    });

    it('檔案不存在：仍可產出 syncCode', async () => {
        const abnormalKeys = { title: AbnormalType.ADD_KEY };
        const template = { title: 'Hello' };
        const target = {};
        const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sync-edge-'));
        const filePath = path.join(dir, 'missing.json');
        const sourcePath = path.join(dir, 'source.json');
        fs.writeFileSync(sourcePath, '{"title":"Hello"}', 'utf-8');

        try {
            const result = await syncKeys({
                abnormalKeys,
                template,
                target,
                filePath,
                sourcePath,
                extensions: ParserType.JSON,
                sync: { override: false },
            });

            expect(result).toContain('"title": "Hello"');
        } finally {
            fs.rmSync(dir, { recursive: true, force: true });
        }
    });

    it('內容相同：不寫入檔案', async () => {
        const abnormalKeys = { title: AbnormalType.ADD_KEY };
        const template = { title: 'Hello' };
        const target = { title: 'Hello' };
        const { filePath, sourcePath, cleanup } = createTempFiles({
            targetContent: '{"title":"Hello"}',
            sourceContent: '{"title":"Hello"}',
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
                extensions: ParserType.JSON,
                sync: { override: true },
            });
            console.log('result', result);
            expect(result).toContain('"title": "Hello"');
            expect(writeSpy).not.toHaveBeenCalled();
        } finally {
            writeSpy.mockRestore();
            cleanup();
        }
    });

    it('路徑不存在：DELETE_KEY 不影響結果', async () => {
        const abnormalKeys = { missing: AbnormalType.DELETE_KEY };
        const template = { title: 'Hello' };
        const target = { title: 'Hello' };
        const { filePath, sourcePath, cleanup } = createTempFiles({
            targetContent: '{"title":"Hello"}',
            sourceContent: '{"title":"Hello"}',
        });

        try {
            const result = await syncKeys({
                abnormalKeys,
                template,
                target,
                filePath,
                sourcePath,
                extensions: ParserType.JSON,
                sync: { override: true },
            });

            expect(result).toContain('"title": "Hello"');
            expect(result).not.toContain('missing');
        } finally {
            cleanup();
        }
    });
});
