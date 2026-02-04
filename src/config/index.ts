import { handleError } from '../errorHandling';
import { ConfigCheckResult } from '../errorHandling/schemas/config';
import { FileCheckResult } from '../errorHandling/schemas/file';
import { toDateTimePath } from '../helpers/path';
import { parserTypeList } from '../parser/types';
import { warning } from '../utils';
import { isBoolean, isObject } from '../utils/is';
import type { I18nCheckerOptions, I18nCheckerOptionsParams, SyncOptions } from './types';
import { validateCustomRules, validateLocaleRules } from './validate';

// 使用閉包管理配置狀態和驗證
export function configManager() {
  const defaultConfig: I18nCheckerOptions = {
    sourceLocale: '',
    localesPath: '',
    exclude: [],
    extensions: 'json',
    failOnError: false,
    applyMode: 'serve',
    rules: [],
    ignoreKeys: [],
    watch: true,
    include: [],
    report: {
      dir: 'i18CheckerReport',
      retention: 7,
    },
  };

  let globalConfig: I18nCheckerOptions = { ...defaultConfig };

  // 解析配置
  const resolveConfig = (config: I18nCheckerOptionsParams) => {
    const { sourceLocale, localesPath, extensions, sync, report, rules } = config;
    const overrides: Partial<I18nCheckerOptions> = {};

    if ('errorLocale' in config) {
      warning('[Vite-I18n-Checker] `errorLocale` is deprecated and will be removed in the next version. Please remove it from your configuration.');
      delete config.errorLocale;
    }

    if (!sourceLocale) handleError(ConfigCheckResult.REQUIRED, 'source');
    if (!localesPath) handleError(ConfigCheckResult.REQUIRED, 'localesPath');
    if (!parserTypeList.includes(extensions)) handleError(FileCheckResult.UNSUPPORTED_FILE_TYPE, extensions);
    if (rules) {
      validateCustomRules(rules);
    }

    if (sync) {
      const syncDefaults: SyncOptions = {
        preview: true,
        autoFill: true,
        autoDelete: false,
        override: false,
      };

      const normalized =
        (isBoolean(sync) && sync === true) ? syncDefaults
          : isObject(sync) ? { ...syncDefaults, ...sync }
            : undefined;

      if (normalized) {
        overrides.sync = normalized;
        if (normalized.useAI?.localeRules) validateLocaleRules(normalized.useAI.localeRules);
      }
    }

    const normalizedReport = {
      ...defaultConfig.report,
      ...(report ?? {}),
    };
    overrides.report = {
      ...normalizedReport,
      dir: `${normalizedReport.dir}/${toDateTimePath()}`,
    };

    return { ...config, ...overrides } as I18nCheckerOptions;
  };

  return {
    // 設置並驗證配置
    setConfig(config: Partial<I18nCheckerOptionsParams>) {
      const merged = { ...defaultConfig, ...config };
      globalConfig = resolveConfig(merged);
    },

    // 獲取配置
    getConfig(): I18nCheckerOptions {
      if (!globalConfig) {
        handleError(ConfigCheckResult.NOT_INITIALIZED);
        return defaultConfig;
      }
      return globalConfig;
    },

    // 檢查配置是否已初始化
    isInitialized(): boolean {
      return globalConfig !== null;
    },
  };
}

type ConfigManagerTypes = ReturnType<typeof configManager>;

let manager: ConfigManagerTypes | null = null;

export function initConfigManager() {
  if (!manager) {
    manager = configManager();
  }
  return manager;
}

export const setGlobalConfig = (...args: Parameters<ConfigManagerTypes['setConfig']>) => initConfigManager().setConfig(...args);
export const getGlobalConfig = () => initConfigManager().getConfig();


