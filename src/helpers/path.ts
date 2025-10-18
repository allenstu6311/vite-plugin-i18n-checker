import { isFile, isFileReadable } from "../utils"
import { handlePluginError } from "../error"
import { getFileErrorMessage } from "../error"
import { FileCheckResult } from "../error/schemas/file"
import path, { resolve } from "path"
import { I18nCheckerOptionsParams } from "../config/types"

export function resolveSourcePaths(config: I18nCheckerOptionsParams) {
  const { sourceLocale, localesPath, extensions } = config

  // sourceLocale 是檔案，自動加副檔名
  const sourceIsFile = isFile(resolve(localesPath, `${sourceLocale}.${extensions}`))
  const sourceName = sourceLocale + (sourceIsFile ? `.${extensions}` : "")
  const sourcePath = resolve(localesPath, sourceName)

  if (!isFileReadable(sourcePath)) {
    handlePluginError(getFileErrorMessage(FileCheckResult.NOT_EXIST, sourcePath))
  }

  if (!isFileReadable(localesPath)) {
    handlePluginError(getFileErrorMessage(FileCheckResult.NOT_EXIST, localesPath))
  }

  return { sourcePath, sourceName }
}


/**
 * 將任何路徑轉成 UNIX 標準格式（跨平台安全）
 * \\\\ => ////
 */
export function normalizePath(p: string): string {
  return p.split(path.sep).join("/");
}