import { isFile, isFileReadable } from "../utils"
import { handlePluginError } from "../error"
import { getFileErrorMessage } from "../error"
import { FileCheckResult } from "../error/schemas/file"
import { resolve } from "path"
import { I18nCheckerOptions, I18nCheckerOptionsParams } from "../config/types"

export function resolveSourcePaths(config: I18nCheckerOptionsParams) {
  const { baseLocale, localesPath, extensions } = config

  // baseLocale 是檔案，自動加副檔名
  const sourceIsFile = isFile(resolve(localesPath, `${baseLocale}.${extensions}`))
  const sourceName = baseLocale + (sourceIsFile ? `.${extensions}` : "")
  const sourcePath = resolve(localesPath, sourceName)

  if (!isFileReadable(sourcePath)) {
    handlePluginError(getFileErrorMessage(FileCheckResult.NOT_EXIST, sourcePath))
  }

  if (!isFileReadable(localesPath)) {
    handlePluginError(getFileErrorMessage(FileCheckResult.NOT_EXIST, localesPath))
  }

  return { sourcePath, sourceName }
}
