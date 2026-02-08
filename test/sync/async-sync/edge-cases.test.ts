import { AbnormalType } from '@/abnormal/types';
import { ParserType } from '@/parser/types';
import { syncKeys } from '@/sync';
import * as aiApi from '@/sync/ai/api';
import path from 'path';
import { describe, expect, it, vi } from 'vitest';
import { createLongText, createTempDir, writeText } from '../helper';

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

      const { syncCode } = await syncKeys({
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

      expect(syncCode).toContain('"a": "T1"');
      expect(syncCode).not.toContain('"b":');
      expect(abnormalKeys.b).toBe(AbnormalType.MISS_KEY);
    } finally {
      await cleanup();
      vi.restoreAllMocks();
    }
  });

  it('嵌套物件 - AI 翻譯失敗應恢復 MISS_KEY', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => { });

    vi.spyOn(aiApi, 'getAIResponse').mockResolvedValue({
      success: false,
      data: null,
      error: { code: 'API_ERROR', message: 'Failed' },
    } as any);

    const { dir, cleanup } = await createTempDir();
    try {
      const sourcePath = path.join(dir, 'zh_CN.json');
      const filePath = path.join(dir, 'en_US.json');

      const template = {
        user: {
          profile: {
            name: 'Name',
          },
        },
      };
      const target = {};
      const abnormalKeys: any = {
        user: {
          profile: {
            name: AbnormalType.ADD_KEY,
          },
        },
      };

      await writeText(sourcePath, JSON.stringify(template, null, 2) + '\n');
      await writeText(filePath, JSON.stringify(target, null, 2) + '\n');

      await syncKeys({
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

      // 驗證嵌套的 ADD_KEY 被恢復成 MISS_KEY
      expect(abnormalKeys.user.profile.name).toBe(AbnormalType.MISS_KEY);
    } finally {
      await cleanup();
      vi.restoreAllMocks();
    }
  });

  it('陣列結構 - AI 翻譯失敗應恢復 MISS_KEY', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => { });

    vi.spyOn(aiApi, 'getAIResponse').mockResolvedValue({
      success: false,
      data: null,
      error: { code: 'API_ERROR', message: 'Failed' },
    } as any);

    const { dir, cleanup } = await createTempDir();
    try {
      const sourcePath = path.join(dir, 'zh_CN.json');
      const filePath = path.join(dir, 'en_US.json');

      const template = {
        items: [
          { title: 'Title' },
        ],
      };
      const target = {};
      const abnormalKeys: any = {
        items: [
          { title: AbnormalType.ADD_KEY },
        ],
      };

      await writeText(sourcePath, JSON.stringify(template, null, 2) + '\n');
      await writeText(filePath, JSON.stringify(target, null, 2) + '\n');

      await syncKeys({
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

      // 驗證陣列內的 ADD_KEY 被恢復成 MISS_KEY
      expect(abnormalKeys.items[0].title).toBe(AbnormalType.MISS_KEY);
    } finally {
      await cleanup();
      vi.restoreAllMocks();
    }
  });
});

