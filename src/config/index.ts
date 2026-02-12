import { handleError } from '../errorHandling';
import { ConfigCheckResult } from '../errorHandling/schemas/config';
import { toDateTimePath } from '../helpers/path';
import { warning } from '../utils';
import type { I18nCheckerOptions, I18nCheckerOptionsParams } from './types';
import { validateCustomRules } from './validate';

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
    watch: false,
    include: [],
    report: {
      dir: 'i18CheckerReport',
      retention: 7,
    },
  };

  let globalConfig: I18nCheckerOptions = { ...defaultConfig };

  // 解析配置
  const resolveConfig = (config: I18nCheckerOptionsParams) => {
    const { report, rules } = config;
    const overrides: Partial<I18nCheckerOptions> = {};

    if ('errorLocale' in config) {
      warning('[Vite-I18n-Checker] `errorLocale` is deprecated and will be removed in the next version. Please remove it from your configuration.');
      delete config.errorLocale;
    }
    if (rules) {
      validateCustomRules(rules);
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

    // 必填欄位缺少
    isRequiredFieldsMissing(): boolean {
      return !globalConfig.sourceLocale || !globalConfig.localesPath || !globalConfig.extensions;
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
export const isRequiredFieldsMissing = () => initConfigManager().isRequiredFieldsMissing();


