import fs from 'fs';
import path, { resolve } from "path";
import { I18nCheckerOptionsParams } from "../config/types";
import { handleError } from "../errorHandling";
import { FileCheckResult } from "../errorHandling/schemas/file";
import { isFile, isPathExists } from "../utils";

export function resolveSourcePaths(config: I18nCheckerOptionsParams) {
  const { sourceLocale, localesPath, extensions } = config;

  // sourceLocale 是檔案，自動加副檔名
  const sourceIsFile = isFile(resolve(localesPath, `${sourceLocale}.${extensions}`));
  const sourceName = sourceLocale + (sourceIsFile ? `.${extensions}` : "");
  const sourcePath = resolve(localesPath, sourceName);

  if (!isPathExists(sourcePath)) {
    handleError(FileCheckResult.NOT_EXIST, sourcePath);
  }

  if (!isPathExists(localesPath)) {
    handleError(FileCheckResult.NOT_EXIST, localesPath);
  }

  return { sourcePath, sourceName };
}

/**
 * 將任何路徑轉成 UNIX 標準格式（跨平台安全）
 * \\\\ => ////
 */
export function normalizePath(p: string): string {
  return p.split(path.sep).join("/");
}

export function getFileName(filePath: string) {
  return path.basename(filePath);
}

export function extractFolderPath(filePath: string, localePath: string): string {
  const normalizedPath = normalizePath(filePath);
  // C:\Users\user\Desktop\test\locale\multi\en_US\test.ts -> locale\multi\en_US\test.ts
  const relativePath = normalizedPath.replace(normalizePath(process.cwd()) + '/', '');
  // locale\multi\en_US\test.ts -> en_US\test.ts
  return relativePath.replace(normalizePath(localePath) + '/', '');;
}

export async function writeFileEnsureDir(
  filePath: string,
  content: string | Buffer,
  options?: Parameters<typeof fs.promises.writeFile>[2]
) {
  const dir = path.dirname(filePath);

  // 遞迴建立資料夾（等同 mkdir -p）
  await fs.promises.mkdir(dir, { recursive: true });

  // 寫入檔案
  await fs.promises.writeFile(filePath, content, options);
}

// 生成日期時間路徑(YYYY-MM-DD/HHmmss)
export function toDateTimePath(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');

  return `${y}-${m}-${day}/${hh}-${mm}-${ss}`;
}