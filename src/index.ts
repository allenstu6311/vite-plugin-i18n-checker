import { resolve } from 'path';
import { Plugin } from 'vite';
import { createAbormalManager } from './abnormal/processor';
import { runChecker } from './checker';
import { getGlobalConfig, initConfigManager, setGlobalConfig } from './config';
import type { I18nCheckerOptionsParams } from './config/types';
import { handleError } from './errorHandling';
import { RuntimeCheckResult } from './errorHandling/schemas/runtime';
import { getTotalLang } from './helpers';
import { cleanupReports, outputKeyCheckReport, showSuccessMessage } from './report';
import { flushAIErrorSummaries } from './sync/ai';

let lock = false;

export const runI18nPipeline = async (basePath: string) => {
  if (lock) return;
  lock = true;

  try {
    const config = getGlobalConfig();
    const { localesPath, extensions, failOnError, report } = config;

    // 清理過期報告
    await cleanupReports(report.dir, report.retention);

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

    // 從 abormalManager 判斷結果
    const hasError = abormalManager.hasError();
    const hasWarning = abormalManager.hasWarning();

    // 產生報告（純輸出）
    await outputKeyCheckReport(abormalManager, report.dir);

    if (hasError && failOnError) handleError(RuntimeCheckResult.CHECK_FAILED);
    if (!hasError && !hasWarning) showSuccessMessage();
  } finally {
    lock = false;
  }
};



export default function vitePluginI18nChecker(config: I18nCheckerOptionsParams): Plugin {
  if (process.env.NODE_ENV === 'test' || process.env.VITEST) {
    return { name: 'vite-plugin-i18n-checker', apply: () => false };
  }

  setGlobalConfig(config);
  const { applyMode, watch } = config;
  let root = process.cwd();

  return {
    name: 'vite-plugin-i18n-checker',
    apply: applyMode === 'all' ? undefined : applyMode,
    enforce: 'post',
    configResolved(config) {
      initConfigManager();
      runI18nPipeline(config.root);
      root = config.root;
    },
    handleHotUpdate() {
      if (watch) {
        setGlobalConfig(config);
        runI18nPipeline(root);
      }
    }
  };
}