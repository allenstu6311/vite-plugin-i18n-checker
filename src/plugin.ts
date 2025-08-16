import { Plugin } from 'vite'
import fs from 'fs'
import type { I18nCheckerOptions } from './config/types'
import { isDirectory, isFileReadable } from './utils/is';
import { resolve } from 'path'
import { setCurrentLang, getFileErrorMessage } from './error'
import { FileCheckResult } from './error/schemas/file/types';
import { parseFile } from './parser/index';
import { error } from './utils';
import { setGlobalConfig } from './config';
import { getFilePaths } from './path';
import { runChecker } from './checker';

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
      .filter(file => isDirectory(resolve(basePath, file)) && file !== sourceName)
  }
  return fs.readdirSync(basePath).filter(file => file !== sourceName && file.endsWith(extensions))
}

export default function i18nCheckerPlugin(config: I18nCheckerOptions): Plugin {
  return {
    name: 'vite-plugin-i18n-checker',
    apply: 'serve', // 只在開發模式啟用
    enforce: 'post', // 在大多數 plugin 處理完後執行
    configResolved() {

      setGlobalConfig(config);

      const { source, path, recursive, extensions, ignore, autoFill, autoDelete, mode, lang } = config;

      const { sourcePath, basePath, sourceName } = getFilePaths();

      if (lang) {
        setCurrentLang(lang)
      }

      // 所有語系(不包含範本檔案)
      const totalLang = getTotalLang({
        basePath,
        sourceName,
        extensions,
      });

      // // 遞迴檢查
      // function runValidate(sourcePath: string, filePath: string) {
      //   const shouldRecursive = isDirectory(filePath) && recursive;
      //   if (shouldRecursive) {
      //     fs.readdirSync(filePath).forEach(file => {
      //       runValidate(resolve(sourcePath, file), resolve(filePath, file))
      //     })
      //   } else if (filePath.endsWith(extensions)) {


      //     if (!isFileReadable(sourcePath)) {
      //       const message = getFileErrorMessage(FileCheckResult.NOT_EXIST, sourcePath)
      //       error(message)
      //     }
      //     const sourcefile = fs.readFileSync(sourcePath, 'utf-8');
      //     const file = fs.readFileSync(filePath, 'utf-8');
      //     console.log('parseFile', parseFile(sourcefile, extensions))

      //     // parseFile(sourcefile, extensions)
      //     // console.log('parseFile', parseFile)
      //     // console.log('filePath', filePath)
      //     // 執行比對邏輯

      //   }
      // }

      // 檢查所有語系
      totalLang.forEach(lang => {
        const langPath = resolve(path, lang);
        runChecker(langPath)
      })
    }
  }
}

