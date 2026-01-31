import { AbnormalType } from '@/abnormal/types';
import { ParserType } from '@/parser/types';
import { syncKeys } from '@/sync';
import path from 'path';
import { describe, expect, it } from 'vitest';
import { createTempDir, getPlainContent, readText, writeText } from '../_shared/fixtures';

describe('sync（非 AI）basic', () => {
  it('ADD_KEY（override=true）', async () => {
    const { dir, cleanup } = await createTempDir();
    try {
      const sourcePath = path.join(dir, 'zh_CN.json');
      const filePath = path.join(dir, 'en_US.json');

      const template = { a: 'A', b: 'B' };
      const target = { a: 'A' };
      const abnormalKeys = { b: AbnormalType.ADD_KEY };

      await writeText(sourcePath, JSON.stringify(template, null, 2) + '\n');
      await writeText(filePath, JSON.stringify(target, null, 2) + '\n');

      const code = await syncKeys({
        abnormalKeys,
        template,
        target,
        filePath,
        sourcePath,
        extensions: ParserType.JSON,
        sync: { override: true },
      });

      expect(code).toContain('"b": "B"');
      expect(await readText(filePath)).toContain('"b": "B"');
    } finally {
      await cleanup();
    }
  });

  it('ADD_KEY（override=false）', async () => {
    const { dir, cleanup } = await createTempDir();
    try {
      const sourcePath = path.join(dir, 'zh_CN.json');
      const filePath = path.join(dir, 'en_US.json');

      const template = { a: 'A' };
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
      const sourcePath = path.join(dir, 'zh_CN.json');
      const filePath = path.join(dir, 'en_US.json');

      const template = { a: 'A' };
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
        sync: { override: true },
      });

      expect(code).not.toContain('"b":');
      expect(await readText(filePath)).not.toContain('"b":');
    } finally {
      await cleanup();
    }
  });

  it('DELETE_KEY（override=false）', async () => {
    const { dir, cleanup } = await createTempDir();
    try {
      const sourcePath = path.join(dir, 'zh_CN.json');
      const filePath = path.join(dir, 'en_US.json');

      const template = { a: 'A' };
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
      const sourcePath = path.join(dir, 'zh_CN.json');
      const filePath = path.join(dir, 'en_US.json');

      const template = { a: 'A', b: 'B', c: 'C' };
      const target = {};
      // 故意用不同順序建立 abnormalKeys（只驗證 key 順序，不驗證 value 對應）
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
        sync: { override: true },
      });

      const plain = getPlainContent(code);
      expect(plain.indexOf('"a"')).toBeLessThan(plain.indexOf('"b"'));
      expect(plain.indexOf('"b"')).toBeLessThan(plain.indexOf('"c"'));
    } finally {
      await cleanup();
    }
  });
});

