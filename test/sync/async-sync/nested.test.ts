import { AbnormalType } from '@/abnormal/types';
import { ParserType } from '@/parser/types';
import { syncKeys } from '@/sync';
import * as aiApi from '@/sync/ai/api';
import { describe, expect, it, vi } from 'vitest';
import path from 'path';
import { createTempDir, getPlainContent, readText, writeText } from '../_shared/fixtures';
import { initConfigManager, setGlobalConfig } from '@/config';

describe('sync（AI）nested', () => {
  it('ADD_KEY（nested / override=true）', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});

    vi.spyOn(aiApi, 'getAIResponse').mockResolvedValue({
      success: true,
      data: '{"translations":["Translated Email"]}',
      error: null,
    } as any);

    const { dir, cleanup } = await createTempDir();
    try {
      const sourcePath = path.join(dir, 'zh_CN.ts');
      const filePath = path.join(dir, 'en_US.ts');

      setGlobalConfig({ sourceLocale: 'zh_CN', localesPath: dir, extensions: 'ts' });
      initConfigManager();

      const templateObj = {
        user: {
          profile: {
            email: 'Email',
          },
        },
      };

      await writeText(sourcePath, `export default ${JSON.stringify(templateObj, null, 2)};\n`);
      await writeText(filePath, 'export default {};\n');

      const abnormalKeys = {
        user: {
          profile: {
            email: AbnormalType.ADD_KEY,
          },
        },
      };

      const code = await syncKeys({
        abnormalKeys,
        template: templateObj,
        target: {},
        filePath,
        sourcePath,
        extensions: ParserType.TS,
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

      expect(code).toContain('Translated Email');
      expect(await readText(filePath)).toContain('Translated Email');
    } finally {
      await cleanup();
      vi.restoreAllMocks();
    }
  });

  it('ADD_KEY（nested / override=false）', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});

    vi.spyOn(aiApi, 'getAIResponse').mockResolvedValue({
      success: true,
      data: '{"translations":["Translated Email"]}',
      error: null,
    } as any);

    const { dir, cleanup } = await createTempDir();
    try {
      const sourcePath = path.join(dir, 'zh_CN.ts');
      const filePath = path.join(dir, 'en_US.ts');

      setGlobalConfig({ sourceLocale: 'zh_CN', localesPath: dir, extensions: 'ts' });
      initConfigManager();

      const templateObj = {
        user: {
          profile: {
            email: 'Email',
          },
        },
      };

      await writeText(sourcePath, `export default ${JSON.stringify(templateObj, null, 2)};\n`);
      await writeText(filePath, 'export default {};\n');
      const before = await readText(filePath);

      const abnormalKeys: any = {
        user: {
          profile: {
            email: AbnormalType.ADD_KEY,
          },
        },
      };

      await syncKeys({
        abnormalKeys,
        template: templateObj,
        target: {},
        filePath,
        sourcePath,
        extensions: ParserType.TS,
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
      expect(abnormalKeys.user.profile.email).toBe(AbnormalType.MISS_KEY);
    } finally {
      await cleanup();
      vi.restoreAllMocks();
    }
  });

  it('DELETE_KEY（nested / override=true）', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});

    vi.spyOn(aiApi, 'getAIResponse').mockResolvedValue({
      success: true,
      data: '{"translations":["X"]}',
      error: null,
    } as any);

    const { dir, cleanup } = await createTempDir();
    try {
      const sourcePath = path.join(dir, 'zh_CN.ts');
      const filePath = path.join(dir, 'en_US.ts');

      setGlobalConfig({ sourceLocale: 'zh_CN', localesPath: dir, extensions: 'ts' });
      initConfigManager();

      const templateObj = {
        user: {
          name: 'Name',
        },
      };

      await writeText(sourcePath, `export default ${JSON.stringify(templateObj, null, 2)};\n`);
      await writeText(filePath, `export default {\n  user: { name: "Name", extra: "X" }\n};\n`);

      const abnormalKeys = {
        user: {
          extra: AbnormalType.DELETE_KEY,
        },
      };

      const code = await syncKeys({
        abnormalKeys,
        template: templateObj,
        target: {},
        filePath,
        sourcePath,
        extensions: ParserType.TS,
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

      expect(code).not.toContain('extra');
      expect(await readText(filePath)).not.toContain('extra');
    } finally {
      await cleanup();
      vi.restoreAllMocks();
    }
  });

  it('DELETE_KEY（nested / override=false）', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});

    vi.spyOn(aiApi, 'getAIResponse').mockResolvedValue({
      success: true,
      data: '{"translations":["X"]}',
      error: null,
    } as any);

    const { dir, cleanup } = await createTempDir();
    try {
      const sourcePath = path.join(dir, 'zh_CN.ts');
      const filePath = path.join(dir, 'en_US.ts');

      setGlobalConfig({ sourceLocale: 'zh_CN', localesPath: dir, extensions: 'ts' });
      initConfigManager();

      const templateObj = {
        user: {
          name: 'Name',
        },
      };

      await writeText(sourcePath, `export default ${JSON.stringify(templateObj, null, 2)};\n`);
      await writeText(filePath, `export default {\n  user: { name: "Name", extra: "X" }\n};\n`);
      const before = await readText(filePath);

      const abnormalKeys: any = {
        user: {
          extra: AbnormalType.DELETE_KEY,
        },
      };

      await syncKeys({
        abnormalKeys,
        template: templateObj,
        target: {},
        filePath,
        sourcePath,
        extensions: ParserType.TS,
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
      expect(abnormalKeys.user.extra).toBe(AbnormalType.EXTRA_KEY);
    } finally {
      await cleanup();
      vi.restoreAllMocks();
    }
  });

  it('排序（nested）', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});

    vi.spyOn(aiApi, 'getAIResponse').mockResolvedValue({
      success: true,
      data: '{"translations":["A","B","C"]}',
      error: null,
    } as any);

    const { dir, cleanup } = await createTempDir();
    try {
      const sourcePath = path.join(dir, 'zh_CN.ts');
      const filePath = path.join(dir, 'en_US.ts');

      setGlobalConfig({ sourceLocale: 'zh_CN', localesPath: dir, extensions: 'ts' });
      initConfigManager();

      const templateObj = {
        user: {
          a: 'a',
          b: 'b',
          c: 'c',
        },
      };

      await writeText(sourcePath, `export default ${JSON.stringify(templateObj, null, 2)};\n`);
      await writeText(filePath, 'export default { user: {} };\n');

      const abnormalKeys = {
        user: {
          c: AbnormalType.ADD_KEY,
          a: AbnormalType.ADD_KEY,
          b: AbnormalType.ADD_KEY,
        },
      };

      const code = await syncKeys({
        abnormalKeys,
        template: templateObj,
        target: {},
        filePath,
        sourcePath,
        extensions: ParserType.TS,
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
      const userStart = plain.indexOf('user:{');
      const userEnd = plain.indexOf('}', userStart + 6);
      const userBlock = plain.slice(userStart, userEnd);

      expect(userBlock.indexOf('a:')).toBeLessThan(userBlock.indexOf('b:'));
      expect(userBlock.indexOf('b:')).toBeLessThan(userBlock.indexOf('c:'));
    } finally {
      await cleanup();
      vi.restoreAllMocks();
    }
  });
});

