import { Plugin } from 'vite'
import type { I18nCheckerOptionsParams } from './config/types'
import { resolve } from 'path'
import { initErrorMessageManager } from './error'
import { initConfigManager, setGlobalConfig } from './config';
import { runChecker } from './checker';
import { generateReport } from './report';
import { resolveSourcePaths } from './helpers';
import { getTotalLang } from './helpers';

export default function i18nCheckerPlugin(config: I18nCheckerOptionsParams): Plugin {
  return {
    name: 'vite-plugin-i18n-checker',
    apply: 'serve', // 只在開發模式啟用
    enforce: 'post', // 在大多數 plugin 處理完後執行
    configResolved() {
      const { localesPath, extensions } = config;

      initConfigManager();
      initErrorMessageManager();
      setGlobalConfig(config);

      const { sourceName } = resolveSourcePaths(config);
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

