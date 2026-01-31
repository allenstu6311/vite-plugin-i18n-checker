import fs from 'fs/promises';
import os from 'os';
import path from 'path';

export async function createTempDir(prefix = 'i18n-sync-test-') {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), prefix));
  return {
    dir,
    async cleanup() {
      await fs.rm(dir, { recursive: true, force: true });
    },
  };
}

export async function writeText(filePath: string, content: string) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, 'utf-8');
}

export async function readText(filePath: string) {
  return await fs.readFile(filePath, 'utf-8');
}

export function getPlainContent(text: string) {
  return text.replace(/\s+/g, '');
}

export function createLongText(length: number, ch = 'x') {
  return ch.repeat(length);
}

