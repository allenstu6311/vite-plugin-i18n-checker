import { AbnormalType } from '@/abnormal/types';
import { initConfigManager, setGlobalConfig } from '@/config';
import { syncKeys } from '@/sync';
import path from 'path';
import { describe, expect, it } from 'vitest';
import {
  createTempDir,
  getParserType,
  getPlainContent,
  readText,
  serializeContent,
  testFormats,
  writeText,
} from '../helper';

describe.each(testFormats)('sync（非 AI）basic [%s]', (format) => {
  it('ADD_KEY（override=true）', async () => {
    const { dir, cleanup } = await createTempDir();
    try {
      const ext = format;
      const sourcePath = path.join(dir, `zh_CN.${ext}`);
      const filePath = path.join(dir, `en_US.${ext}`);

      setGlobalConfig({ sourceLocale: 'zh_CN', localesPath: dir, extensions: ext });
      initConfigManager();

      const template = { a: 'A', b: 'B' };
      const target = { a: 'A' };
      const abnormalKeys = { b: AbnormalType.ADD_KEY };

      await writeText(sourcePath, serializeContent(format, template));
      await writeText(filePath, serializeContent(format, target));

      const { syncCode } = await syncKeys({
        abnormalKeys,
        template,
        target,
        filePath,
        sourcePath,
        extensions: getParserType(format),
        sync: { override: true },
      });

      expect(syncCode).toContain('b');
      expect(syncCode).toContain('B');
      const result = await readText(filePath);
      expect(result).toContain('b');
      expect(result).toContain('B');
    } finally {
      await cleanup();
    }
  });

  it('ADD_KEY（override=false）', async () => {
    const { dir, cleanup } = await createTempDir();
    try {
      const ext = format;
      const sourcePath = path.join(dir, `zh_CN.${ext}`);
      const filePath = path.join(dir, `en_US.${ext}`);

      setGlobalConfig({ sourceLocale: 'zh_CN', localesPath: dir, extensions: ext });
      initConfigManager();

      const template = { a: 'A' };
      const target = {};
      const abnormalKeys: any = { a: AbnormalType.ADD_KEY };

      await writeText(sourcePath, serializeContent(format, template));
      await writeText(filePath, serializeContent(format, target));
      const before = await readText(filePath);

      await syncKeys({
        abnormalKeys,
        template,
        target,
        filePath,
        sourcePath,
        extensions: getParserType(format),
        sync: { override: false },
      });

      expect(await readText(filePath)).toBe(before);
      expect(abnormalKeys.a).toBe(AbnormalType.MISS_KEY);
    } finally {
      await cleanup();
    }
  });

  it('DELETE_KEY（override=true）', async () => {
    const { dir, cleanup } = await createTempDir();
    try {
      const ext = format;
      const sourcePath = path.join(dir, `zh_CN.${ext}`);
      const filePath = path.join(dir, `en_US.${ext}`);

      setGlobalConfig({ sourceLocale: 'zh_CN', localesPath: dir, extensions: ext });
      initConfigManager();

      const template = { a: 'A' };
      const target = { a: 'A', b: 'B' };
      const abnormalKeys = { b: AbnormalType.DELETE_KEY };

      await writeText(sourcePath, serializeContent(format, template));
      await writeText(filePath, serializeContent(format, target));

      const { syncCode } = await syncKeys({
        abnormalKeys,
        template,
        target,
        filePath,
        sourcePath,
        extensions: getParserType(format),
        sync: { override: true },
      });

      expect(syncCode).not.toContain('b');
      expect(await readText(filePath)).not.toContain('b');
    } finally {
      await cleanup();
    }
  });

  it('DELETE_KEY（override=false）', async () => {
    const { dir, cleanup } = await createTempDir();
    try {
      const ext = format;
      const sourcePath = path.join(dir, `zh_CN.${ext}`);
      const filePath = path.join(dir, `en_US.${ext}`);

      setGlobalConfig({ sourceLocale: 'zh_CN', localesPath: dir, extensions: ext });
      initConfigManager();

      const template = { a: 'A' };
      const target = { a: 'A', b: 'B' };
      const abnormalKeys: any = { b: AbnormalType.DELETE_KEY };

      await writeText(sourcePath, serializeContent(format, template));
      await writeText(filePath, serializeContent(format, target));
      const before = await readText(filePath);

      await syncKeys({
        abnormalKeys,
        template,
        target,
        filePath,
        sourcePath,
        extensions: getParserType(format),
        sync: { override: false },
      });

      expect(await readText(filePath)).toBe(before);
      expect(abnormalKeys.b).toBe(AbnormalType.EXTRA_KEY);
    } finally {
      await cleanup();
    }
  });

  it('排序（flat）', async () => {
    const { dir, cleanup } = await createTempDir();
    try {
      const ext = format;
      const sourcePath = path.join(dir, `zh_CN.${ext}`);
      const filePath = path.join(dir, `en_US.${ext}`);

      setGlobalConfig({ sourceLocale: 'zh_CN', localesPath: dir, extensions: ext });
      initConfigManager();

      const template = { a: 'A', b: 'B', c: 'C' };
      const target = {};
      // 故意用不同順序建立 abnormalKeys（只驗證 key 順序，不驗證 value 對應）
      const abnormalKeys = { c: AbnormalType.ADD_KEY, a: AbnormalType.ADD_KEY, b: AbnormalType.ADD_KEY };

      await writeText(sourcePath, serializeContent(format, template));
      await writeText(filePath, serializeContent(format, target));

      const { syncCode } = await syncKeys({
        abnormalKeys,
        template,
        target,
        filePath,
        sourcePath,
        extensions: getParserType(format),
        sync: { override: true },
      });

      const plain = getPlainContent(syncCode);
      // 驗證 key 順序：a 在 b 之前，b 在 c 之前
      expect(plain.indexOf('a')).toBeLessThan(plain.indexOf('b'));
      expect(plain.indexOf('b')).toBeLessThan(plain.indexOf('c'));
    } finally {
      await cleanup();
    }
  });
});
