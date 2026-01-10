import fs from 'fs';
import path, { resolve } from "path";
import { I18nCheckerOptionsParams } from "../config/types";
import { getFileErrorMessage, handlePluginError } from "../error";
import { FileCheckResult } from "../error/schemas/file";
import { isFile, isFileReadable } from "../utils";

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

export function extractLocaleRelativePath(filePath: string): string | null {
  const match = filePath.match(
    /[\\/](?<locale>[a-z]{2}_[A-Z]{2})(?<rest>(?:[\\/].+))$/ // en_US + 後續路徑
  );
  if (!match?.groups) return null;
  const { locale, rest } = match.groups;
  return `${locale}${rest}`;
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