import { resolve } from "path";
import { Plugin } from "vite";
import { createAbnormalManager } from "./abnormal/processor";
import { runChecker } from "./checker";
import {
  getGlobalConfig,
  isRequiredFieldsMissing,
  setGlobalConfig,
} from "./config";
import type { I18nCheckerOptionsParams } from "./config/types";
import { handleError } from "./errorHandling";
import { ConfigCheckResult } from "./errorHandling/schemas/config";
import { FileCheckResult } from "./errorHandling/schemas/file";
import { RuntimeCheckResult } from "./errorHandling/schemas/runtime";
import { getTotalLang } from "./helpers";
import { parserTypeList } from "./parser/types";
import {
  cleanupReports,
  outputKeyCheckReport,
  showSuccessMessage,
} from "./report";
import { error } from "./utils";

let lock = false;

export const runI18nPipeline = async (basePath: string) => {
  if (lock) return;
  lock = true;

  try {
    const config = getGlobalConfig();
    const { sourceLocale, localesPath, extensions, failOnError, report } =
      config;
    // 檢查必填欄位是否缺少
    if (isRequiredFieldsMissing()) {
      if (!sourceLocale) handleError(ConfigCheckResult.REQUIRED, "source");
      if (!localesPath) handleError(ConfigCheckResult.REQUIRED, "localesPath");
      if (!parserTypeList.includes(extensions))
        handleError(FileCheckResult.UNSUPPORTED_FILE_TYPE, extensions);
      return;
    }

    // 清理過期報告
    await cleanupReports(report.dir, report.retention);

    const totalLang = getTotalLang({
      localesPath: resolve(basePath, localesPath),
      extensions,
      config,
    });

    if (totalLang.length === 0) {
      handleError(
        FileCheckResult.NO_LOCALE_FILES,
        resolve(basePath, localesPath),
      );
      return;
    }
    const abnormalManager = createAbnormalManager();

    await Promise.all(
      totalLang.map(async (fileName) => {
        const langPath = resolve(basePath, localesPath, fileName);
        await runChecker(langPath, abnormalManager);
      }),
    );

    // 從 abnormalManager 判斷結果
    const hasError = abnormalManager.hasError();
    const hasWarning = abnormalManager.hasWarning();

    // 產生報告（純輸出）
    await outputKeyCheckReport(abnormalManager, report.dir);

    if (hasError) {
      error(
        `Please check the detailed report at "${process.cwd()}/${report.dir}"`,
      );
      if (failOnError) {
        handleError(RuntimeCheckResult.CHECK_FAILED);
      }
    }
    if (!hasError && !hasWarning) showSuccessMessage();
  } finally {
    lock = false;
  }
};

export default function vitePluginI18nChecker(
  config: I18nCheckerOptionsParams,
): Plugin {
  if (process.env.NODE_ENV === "test" || process.env.VITEST) {
    return { name: "vite-plugin-i18n-checker", apply: () => false };
  }

  setGlobalConfig(config);
  const { applyMode, watch } = config;
  let root = process.cwd();

  return {
    name: "vite-plugin-i18n-checker",
    apply: applyMode === "all" ? undefined : applyMode,
    enforce: "post",
    configResolved(config) {
      root = config.root;
    },
    buildStart() {
      runI18nPipeline(root);
    },
    handleHotUpdate() {
      if (watch) {
        setGlobalConfig(config);
        runI18nPipeline(root);
      }
    },
  };
}
