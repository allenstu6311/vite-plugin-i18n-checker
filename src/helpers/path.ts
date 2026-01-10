import fs from 'fs';
import micromatch from 'micromatch';
import path, { resolve } from "path";
import { I18nCheckerOptionsParams } from "../config/types";
import { getFileErrorMessage, handlePluginError } from "../error";
import { FileCheckResult } from "../error/schemas/file";
import { isEmptyObject, isFile, isFileReadable } from "../utils";

export function resolveSourcePaths(config: I18nCheckerOptionsParams) {
  const { sourceLocale, localesPath, extensions } = config;

  // sourceLocale 是檔案，自動加副檔名
  const sourceIsFile = isFile(resolve(localesPath, `${sourceLocale}.${extensions}`));
  const sourceName = sourceLocale + (sourceIsFile ? `.${extensions}` : "");
  const sourcePath = resolve(localesPath, sourceName);

  if (!isFileReadable(sourcePath)) {
    handlePluginError(getFileErrorMessage(FileCheckResult.NOT_EXIST, sourcePath));
  }

  if (!isFileReadable(localesPath)) {
    handlePluginError(getFileErrorMessage(FileCheckResult.NOT_EXIST, localesPath));
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

export function getFileName(path: string) {
  return path.split('\\').pop();
}

export function extractLocaleRelativePath(filePath: string, localeRules: Record<string, string>): string | null {
  if (isEmptyObject(localeRules)) return '';
  const normalizedPath = normalizePath(filePath);
  // 轉換成相對於專案根目錄的路徑
  const relativePath = normalizedPath.replace(normalizePath(process.cwd()) + '/', '');

  for (const pattern in localeRules) {
    if (micromatch.isMatch(relativePath, pattern)) {
      const anchor = extractAnchor(pattern);
      if (!anchor) return null;
      const index = relativePath.indexOf(anchor);
      return relativePath.substring(index);
    }
  }
  return null;
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
  const m = d.getMonth() + 1;
  const day = d.getDate();

  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');

  return `${y}-${m}-${day}/${hh}-${mm}-${ss}`;
}

// extractAnchor("**/en_US/**") -> "en_US"
//extractAnchor("locale/*/tests/**") -> "locale"
//extractAnchor("src/**/i18n/**") -> "src"
//extractAnchor("**/locale-*/**") -> "locale-"
function extractAnchor(pattern: string): string | null {
  if (!pattern) return '';
  // 移除開頭的通配符
  const withoutPrefix = pattern.replace(/^(\*\*\/|\*\/)/, '');

  // 按 / 分割
  const segments = withoutPrefix.split('/');

  for (const segment of segments) {
    // 跳過純通配符
    if (segment === '**' || segment === '*' || segment === '') {
      continue;
    }

    // 如果 segment 包含 *，取 * 之前的固定部分
    // 例如：locale-* -> locale-
    const fixedPart = segment.split('*')[0];

    if (fixedPart) {
      return fixedPart;
    }
  }

  return null;
}