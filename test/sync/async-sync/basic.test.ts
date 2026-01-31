import { AbnormalType } from '@/abnormal/types';
import { ParserType } from '@/parser/types';
import { syncKeys } from '@/sync';
import * as aiApi from '@/sync/ai/api';
import { describe, expect, it, vi } from 'vitest';
import path from 'path';
import { createTempDir, getPlainContent, readText, writeText } from '../_shared/fixtures';

describe('sync（AI）basic', () => {
  it('ADD_KEY（override=true）', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});

    vi.spyOn(aiApi, 'getAIResponse').mockImplementation(async (input: string[]) => {
      return {
        success: true,
        data: JSON.stringify({ translations: input.map(v => String(v).toUpperCase()) }),
        error: null,
      } as any;
    });

    const { dir, cleanup } = await createTempDir();
    try {
      const sourcePath = path.join(dir, 'zh_CN.json');
      const filePath = path.join(dir, 'en_US.json');

      const template = { a: 'a' };
      const target = {};
      const abnormalKeys = { a: AbnormalType.ADD_KEY };

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

      expect(code).toContain('"a": "A"');
      expect(await readText(filePath)).toContain('"a": "A"');
    } finally {
      await cleanup();
      vi.restoreAllMocks();
    }
  });

  it('ADD_KEY（override=false）', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});

    vi.spyOn(aiApi, 'getAIResponse').mockImplementation(async (input: string[]) => {
      return {
        success: true,
        data: JSON.stringify({ translations: input.map(v => String(v).toUpperCase()) }),
        error: null,
      } as any;
    });

    const { dir, cleanup } = await createTempDir();
    try {
      const sourcePath = path.join(dir, 'zh_CN.json');
      const filePath = path.join(dir, 'en_US.json');

      const template = { a: 'a' };
      const target = {};
      const abnormalKeys: any = { a: AbnormalType.ADD_KEY };

      await writeText(sourcePath, JSON.stringify(template, null, 2) + '\n');
      await writeText(filePath, JSON.stringify(target, null, 2) + '\n');
      const before = await readText(filePath);

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
        sync: { override: false },
      });

      expect(await readText(filePath)).toBe(before);
      expect(abnormalKeys.a).toBe(AbnormalType.MISS_KEY);
    } finally {
      await cleanup();
      vi.restoreAllMocks();
    }
  });

  it('DELETE_KEY（override=true）', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});

    // DELETE_KEY 不需要 AI，但在 async-sync 情境仍要保證功能正常
    vi.spyOn(aiApi, 'getAIResponse').mockImplementation(async (input: string[]) => {
      return {
        success: true,
        data: JSON.stringify({ translations: input.map(v => String(v).toUpperCase()) }),
        error: null,
      } as any;
    });

    const { dir, cleanup } = await createTempDir();
    try {
      const sourcePath = path.join(dir, 'zh_CN.json');
      const filePath = path.join(dir, 'en_US.json');

      const template = { a: 'a' };
      const target = { a: 'A', b: 'B' };
      const abnormalKeys = { b: AbnormalType.DELETE_KEY };

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

      expect(code).not.toContain('"b":');
      expect(await readText(filePath)).not.toContain('"b":');
    } finally {
      await cleanup();
      vi.restoreAllMocks();
    }
  });

  it('DELETE_KEY（override=false）', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});

    vi.spyOn(aiApi, 'getAIResponse').mockImplementation(async (input: string[]) => {
      return {
        success: true,
        data: JSON.stringify({ translations: input.map(v => String(v).toUpperCase()) }),
        error: null,
      } as any;
    });

    const { dir, cleanup } = await createTempDir();
    try {
      const sourcePath = path.join(dir, 'zh_CN.json');
      const filePath = path.join(dir, 'en_US.json');

      const template = { a: 'a' };
      const target = { a: 'A', b: 'B' };
      const abnormalKeys: any = { b: AbnormalType.DELETE_KEY };

      await writeText(sourcePath, JSON.stringify(template, null, 2) + '\n');
      await writeText(filePath, JSON.stringify(target, null, 2) + '\n');
      const before = await readText(filePath);

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
        sync: { override: false },
      });

      expect(await readText(filePath)).toBe(before);
      expect(abnormalKeys.b).toBe(AbnormalType.EXTRA_KEY);
    } finally {
      await cleanup();
      vi.restoreAllMocks();
    }
  });

  it('排序（flat）', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});

    // 依照 input 順序回傳翻譯，避免被 abnormalKeys 的遍歷順序影響 key/value 對應
    vi.spyOn(aiApi, 'getAIResponse').mockImplementation(async (input: string[]) => {
      return {
        success: true,
        data: JSON.stringify({ translations: input.map(v => String(v).toUpperCase()) }),
        error: null,
      } as any;
    });

    const { dir, cleanup } = await createTempDir();
    try {
      const sourcePath = path.join(dir, 'zh_CN.json');
      const filePath = path.join(dir, 'en_US.json');

      const template = { a: 'a', b: 'b', c: 'c' };
      const target = {};
      const abnormalKeys = { c: AbnormalType.ADD_KEY, a: AbnormalType.ADD_KEY, b: AbnormalType.ADD_KEY };

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

      const plain = getPlainContent(code);
      expect(plain.indexOf('"a"')).toBeLessThan(plain.indexOf('"b"'));
      expect(plain.indexOf('"b"')).toBeLessThan(plain.indexOf('"c"'));
    } finally {
      await cleanup();
      vi.restoreAllMocks();
    }
  });
});

