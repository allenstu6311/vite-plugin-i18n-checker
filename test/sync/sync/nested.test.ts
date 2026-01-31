import { AbnormalType } from '@/abnormal/types';
import { initConfigManager, setGlobalConfig } from '@/config';
import { ParserType } from '@/parser/types';
import { syncKeys } from '@/sync';
import path from 'path';
import { describe, expect, it } from 'vitest';
import { createTempDir, getPlainContent, readText, writeText } from '../_shared/fixtures';

describe('sync（非 AI）nested', () => {
  it('ADD_KEY（nested / override=true）', async () => {
    const { dir, cleanup } = await createTempDir();
    try {
      const sourcePath = path.join(dir, 'zh_CN.ts');
      const filePath = path.join(dir, 'en_US.ts');

      setGlobalConfig({ sourceLocale: 'zh_CN', localesPath: dir, extensions: 'ts' });
      initConfigManager();

      const templateObj = {
        user: {
          name: 'Name',
          profile: {
            email: 'Email',
          },
        },
      };

      const templateCode = `export default ${JSON.stringify(templateObj, null, 2)};\n`;
      await writeText(sourcePath, templateCode);
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
        sync: { override: true },
      });

      // 至少要能補出 user/profile/email 結構
      expect(code).toContain('user');
      expect(code).toContain('profile');
      expect(code).toContain('email');
      expect(await readText(filePath)).toContain('email');
    } finally {
      await cleanup();
    }
  });

  it('ADD_KEY（nested / override=false）', async () => {
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
        sync: { override: false },
      });

      expect(await readText(filePath)).toBe(before);
      expect(abnormalKeys.user.profile.email).toBe(AbnormalType.MISS_KEY);
    } finally {
      await cleanup();
    }
  });

  it('DELETE_KEY（nested / override=true）', async () => {
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
      const templateCode = `export default ${JSON.stringify(templateObj, null, 2)};\n`;

      await writeText(sourcePath, templateCode);
      await writeText(
        filePath,
        `export default {\n  user: { name: "Name", extra: "X" }\n};\n`
      );

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
        sync: { override: true },
      });

      expect(code).not.toContain('extra');
      expect(await readText(filePath)).not.toContain('extra');
    } finally {
      await cleanup();
    }
  });

  it('DELETE_KEY（nested / override=false）', async () => {
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
        sync: { override: false },
      });

      expect(await readText(filePath)).toBe(before);
      expect(abnormalKeys.user.extra).toBe(AbnormalType.EXTRA_KEY);
    } finally {
      await cleanup();
    }
  });

  it('排序（nested）', async () => {
    const { dir, cleanup } = await createTempDir();
    try {
      const sourcePath = path.join(dir, 'zh_CN.ts');
      const filePath = path.join(dir, 'en_US.ts');

      setGlobalConfig({ sourceLocale: 'zh_CN', localesPath: dir, extensions: 'ts' });
      initConfigManager();

      const templateObj = {
        user: {
          a: 'A',
          b: 'B',
          c: 'C',
        },
      };
      const templateCode = `export default ${JSON.stringify(templateObj, null, 2)};\n`;

      await writeText(sourcePath, templateCode);
      await writeText(filePath, 'export default { user: {} };\n');

      // 故意打亂要新增的順序
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
    }
  });
});

