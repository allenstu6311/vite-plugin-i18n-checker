import { Plugin } from 'vite'
import fs from 'fs'
import type { I18nCheckerOptions, I18nCheckerOptionsParams } from './config/types'
import { isDirectory, isFileReadable } from './utils';
import { resolve } from 'path'
import { setErrorMsgLang, getFileErrorMessage } from './error'
import { FileCheckResult } from './error/schemas/file';
import { parseFile } from './parser/index';
import { error } from './utils';
import { setGlobalConfig } from './config';
import { getFilePaths } from './path';
import { runChecker } from './checker';
import { extraKey, invaildKey, missingKey, processAbnormalKeys } from "./abnormal/processor";
import { generateReport } from './report';

function getTotalLang({
  basePath,
  sourceName,
  extensions,
}: {
  basePath: string,
  sourceName: string,
  extensions: string,
}): string[] {
  if (isDirectory(resolve(basePath, sourceName))) {
    return fs.readdirSync(basePath)
      .filter(file => {
        return isDirectory(resolve(basePath, file)) && file !== sourceName
      })
  }
  return fs.readdirSync(basePath).filter(file => file !== sourceName && file.endsWith(extensions))
}

export default function i18nCheckerPlugin(config: I18nCheckerOptionsParams): Plugin {
  return {
    name: 'vite-plugin-i18n-checker',
    apply: 'serve', // 只在開發模式啟用
    enforce: 'post', // 在大多數 plugin 處理完後執行
    configResolved() {
      setGlobalConfig(config);

      const { source, path, extensions, lang } = config;

      const { sourcePath, basePath, sourceName } = getFilePaths();

      if (lang) {
        setErrorMsgLang(lang)
      }

      // 所有語系(不包含範本檔案)
      const totalLang = getTotalLang({
        basePath,
        sourceName,
        extensions,
      });

      // 檢查所有語系
      totalLang.forEach(lang => {
        const langPath = resolve(path, lang);
        runChecker(langPath)
      })
      // 生成報告
      generateReport()
    }
  }
}

