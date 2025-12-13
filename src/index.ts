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

let lock = false;

export const runFullCheck = async (basePath: string) => {
  if (lock) return;
  lock = true;

  try {
    const { localesPath, extensions, failOnError } = getGlobalConfig();

    const totalLang = getTotalLang({
      localesPath: resolve(basePath, localesPath),
      extensions,
    });

    const abormalManager = createAbormalManager();

    await Promise.all(
      totalLang.map(async item => {
        const { fileName, lang } = item;
        const langPath = resolve(localesPath, fileName);
        await runChecker(langPath, abormalManager, lang);
      })
    );

    const { hasError, hasWarning } = generateReport(abormalManager);

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