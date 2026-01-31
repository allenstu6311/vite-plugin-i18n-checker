import { AbnormalType } from '@/abnormal/types';
import { ParserType } from '@/parser/types';
import { syncKeys } from '@/sync';
import * as aiApi from '@/sync/ai/api';
import path from 'path';
import { describe, expect, it, vi } from 'vitest';
import { createLongText, createTempDir, writeText } from '../_shared/fixtures';

describe('sync（AI）edge-cases', () => {
  it('多 batch 部分成功/部分失敗', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => { });

    const spy = vi.spyOn(aiApi, 'getAIResponse');
    // 第 1 批成功
    spy.mockResolvedValueOnce({
      success: true,
      data: '{"translations":["T1"]}',
      error: null,
    } as any);
    // 第 2 批失敗
    spy.mockResolvedValueOnce({
      success: false,
      data: null,
      error: { code: 'ECONNABORTED', message: 'timeout', config: { url: 'x', method: 'POST' } },
    } as any);

    const { dir, cleanup } = await createTempDir();
    try {
      const sourcePath = path.join(dir, 'zh_CN.json');
      const filePath = path.join(dir, 'en_US.json');

      // 兩個很長的 value，確保被切成 2 batches
      const template = { a: createLongText(400, 'a'), b: createLongText(400, 'b') };
      const target = {};
      const abnormalKeys: any = { a: AbnormalType.ADD_KEY, b: AbnormalType.ADD_KEY };

      await writeText(sourcePath, JSON.stringify(template, null, 2) + '\n');
      await writeText(filePath, JSON.stringify(target, null, 2) + '\n');

      const code = await syncKeys({
        abnormalKeys,
        template,
        target,
        filePath,
        sourcePath,
        extensions: ParserType.JSON,
        context: {
          lang: 'en_US',
          useAI: {
            apiKey: 'test',
            provider: 'openai',
            localeRules: {},
          },
        },
        sync: { override: true },
      });

      expect(code).toContain('"a": "T1"');
      expect(code).not.toContain('"b":');
      expect(abnormalKeys.b).toBe(AbnormalType.MISS_KEY);
    } finally {
      await cleanup();
      vi.restoreAllMocks();
    }
  });
});

