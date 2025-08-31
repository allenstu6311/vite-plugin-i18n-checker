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
  localesPath,
  sourceName,
  extensions,
}: {
  localesPath: string,
  sourceName: string,
  extensions: string,
}): string[] {
  if (isDirectory(resolve(localesPath, sourceName))) {
    return fs.readdirSync(localesPath)
      .filter(file => {
        return isDirectory(resolve(localesPath, file)) && file !== sourceName
      })
  }
  return fs.readdirSync(localesPath).filter(file => file !== sourceName && file.endsWith(extensions))
}

export default function i18nCheckerPlugin(config: I18nCheckerOptionsParams): Plugin {
  return {
    name: 'vite-plugin-i18n-checker',
    apply: 'serve', // 只在開發模式啟用
    enforce: 'post', // 在大多數 plugin 處理完後執行
    configResolved() {
      setGlobalConfig(config);

      const { source, localesPath, extensions, outputLang } = config;

      const { sourcePath, sourceName } = getFilePaths();

      if (outputLang) {
        setErrorMsgLang(outputLang)
      }

      // 所有語系(不包含範本檔案)
      const totalLang = getTotalLang({
        localesPath,
        sourceName,
        extensions,
      });

      // 檢查所有語系
      totalLang.forEach(lang => {
        const langPath = resolve(localesPath, lang);
        runChecker(langPath)
      })
      // 生成報告
      generateReport()
    }
  }
}

