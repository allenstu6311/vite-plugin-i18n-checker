import { Plugin } from 'vite'
import fs from 'fs'
import type { I18nCheckerOptions } from './types'
import { isDirectory, isFileReadable } from './checker/utils';
import { resolve } from 'path'
import { setCurrentLang, getErrorMessage } from './message/error'
import { FileCheckResult } from './message/types';

export default function i18nCheckerPlugin(config: I18nCheckerOptions): Plugin {
  return {
    name: 'vite-plugin-i18n-checker',
    apply: 'serve', // 只在開發模式啟用
    enforce: 'post', // 在大多數 plugin 處理完後執行
    configResolved() {
      const { source, path, recursive, extensions, ignore, autoFill, autoDelete, mode, lang } = config;

      if (!source || !path) {
        throw new Error('source and path are required')
      }
      
      // 設置當前語言，如果沒有指定則使用預設值
      if (lang) {
        setCurrentLang(lang)
      }
      
      const sourceName = source + (mode === 'single' ? '.ts' : '')
      const sourcePath = resolve(path, sourceName); // 範本檔案
      const basePath = resolve(path); // 其他語系的根路徑
      console.log('sourcePath', sourcePath)
      console.log('basePath', basePath)
      
      function getTotalLang(sourcePath: string, basePath: string): string[] {
        if(isDirectory(resolve(basePath, source))){
          return fs.readdirSync(basePath)
            .filter(file => isDirectory(resolve(basePath, file)) && file !== sourceName)
        }
        return fs.readdirSync(basePath).filter(file => file !== sourceName && file.endsWith(extensions))
      }

      // 所有語系(不包含範本檔案)
      const totalLang = getTotalLang(sourcePath, basePath);
      console.log('totalLang', totalLang)


      // 遞迴檢查
      function runValidate(sourcePath: string, filePath: string) {
        const shouldRecursive = isDirectory(filePath) && recursive;
        if (shouldRecursive) {
          fs.readdirSync(filePath).forEach(file => {
            runValidate(resolve(sourcePath, file), resolve(filePath, file))
          })
        } else if(filePath.endsWith(extensions)){
    

          if(!isFileReadable(sourcePath)){
            getErrorMessage(FileCheckResult.NOT_EXIST)
            return;
          }
          const sourcefile = fs.readFileSync(sourcePath, 'utf-8');
          const file = fs.readFileSync(filePath, 'utf-8');
          // console.log('sourcefile', sourcefile)
          // console.log('file', file)
          // 執行比對邏輯
          // 現在可以直接使用 getErrorMessage 而不需要傳遞 lang 參數
          // 例如：getErrorMessage(FileCheckResult.NOT_EXIST)
        }
      }

      // 檢查所有語系
      totalLang.forEach(lang => {
        const langPath = resolve(path, lang);
        runValidate(sourcePath, langPath)
      })
    }
  }
}

