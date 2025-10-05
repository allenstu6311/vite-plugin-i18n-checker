import { Plugin } from 'vite'
import type { I18nCheckerOptionsParams } from './config/types'
import { resolve } from 'path'
import { getRuntimeErrorMessage, handlePluginError, initErrorMessageManager } from './error'
import { initConfigManager, setGlobalConfig } from './config';
import { runChecker } from './checker';
import { generateReport } from './report';
import { resolveSourcePaths } from './helpers';
import { getTotalLang } from './helpers';
import { RuntimeCheckResult } from './error/schemas/runtime';

export default function vitePluginI18nChecker(config: I18nCheckerOptionsParams): Plugin {
  if (process.env.NODE_ENV === 'test' || process.env.VITEST) {
    return { name: 'vite-plugin-i18n-checker', apply: () => false };
  }
  const { localesPath, extensions, applyMode, failOnError } = config;
  return {
    name: 'vite-plugin-i18n-checker',
    apply: applyMode,
    enforce: 'post',
    configResolved() {
      setGlobalConfig(config);
      initConfigManager();
      initErrorMessageManager();


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
      const { hasError } = generateReport()
      if (hasError && failOnError) {
        handlePluginError(getRuntimeErrorMessage(RuntimeCheckResult.CHECK_FAILED))
      }
    }
  }
}

