import { resolve } from 'path';
import { Plugin } from 'vite';
import { createAbormalManager } from './abnormal/processor';
import { runChecker } from './checker';
import { getGlobalConfig, initConfigManager, setGlobalConfig } from './config';
import type { I18nCheckerOptionsParams } from './config/types';
import { getRuntimeErrorMessage, handlePluginError, initErrorMessageManager } from './error';
import { RuntimeCheckResult } from './error/schemas/runtime';
import { getTotalLang } from './helpers';
import { generateReport, showSuccessMessage } from './report';
import { flushAIErrorSummaries } from './sync/ai';

let lock = false;

export const runFullCheck = async (basePath: string) => {
  if (lock) return;
  lock = true;

  try {
    const config = getGlobalConfig();
    const { localesPath, extensions, failOnError, reportPath } = config;

    const totalLang = getTotalLang({
      localesPath: resolve(basePath, localesPath),
      extensions,
      config
    });
    const abormalManager = createAbormalManager();

    await Promise.all(
      totalLang.map(async item => {
        const { fileName, lang } = item;
        const langPath = resolve(localesPath, fileName);
        await runChecker(langPath, abormalManager, lang);
      })
    );

    // 統一輸出所有語言的 AI 翻譯錯誤報告
    flushAIErrorSummaries();

    const { hasError, hasWarning } = await generateReport(abormalManager, reportPath);

    if (hasError && failOnError) {
      handlePluginError(
        getRuntimeErrorMessage(RuntimeCheckResult.CHECK_FAILED)
      );
    }

    if (!hasError && !hasWarning) {
      showSuccessMessage();
    }
  } finally {
    lock = false;
  }
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