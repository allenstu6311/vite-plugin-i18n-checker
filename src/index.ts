import { resolve } from 'path';
import { Plugin } from 'vite';
import { runChecker } from './checker';
import { getGlobalConfig, initConfigManager, setGlobalConfig } from './config';
import type { I18nCheckerOptionsParams } from './config/types';
import { getRuntimeErrorMessage, handlePluginError, initErrorMessageManager } from './error';
import { RuntimeCheckResult } from './error/schemas/runtime';
import { getTotalLang } from './helpers';
import { generateReport, showSuccessMessage } from './report';

export const runFullCheck = (basePath: string) => {
  console.clear();
  const { localesPath, extensions, failOnError } = getGlobalConfig();
  // 所有語系(不包含範本檔案)
  const totalLang = getTotalLang({
    localesPath: resolve(basePath, localesPath),
    extensions,
  });

  // 檢查所有語系
  totalLang.forEach(lang => {
    const langPath = resolve(localesPath, lang);
    runChecker(langPath);
  });

  // 生成報告
  const { hasError, hasWarning } = generateReport();
  if (hasError && failOnError) handlePluginError(getRuntimeErrorMessage(RuntimeCheckResult.CHECK_FAILED));
  // 如果沒有錯誤和警告，則顯示成功訊息
  if (!hasError && !hasWarning) showSuccessMessage();
};

export default function vitePluginI18nChecker(config: I18nCheckerOptionsParams): Plugin {
  if (process.env.NODE_ENV === 'test' || process.env.VITEST) {
    return { name: 'vite-plugin-i18n-checker', apply: () => false };
  }

  setGlobalConfig(config);
  const { applyMode, watch } = getGlobalConfig();
  let root = process.cwd();

  return {
    name: 'vite-plugin-i18n-checker',
    apply: applyMode === 'all' ? undefined : applyMode,
    enforce: 'post',
    configResolved(config) {
      initConfigManager();
      initErrorMessageManager();
      runFullCheck(config.root);
      root = config.root;
    },
    handleHotUpdate() {
      if (watch) {
        setGlobalConfig(config);
        runFullCheck(root);
      }
    }
  };
}