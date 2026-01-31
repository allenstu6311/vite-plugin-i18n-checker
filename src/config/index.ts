import { handleError } from '../errorHandling';
import { ConfigCheckResult } from '../errorHandling/schemas/config';
import { FileCheckResult } from '../errorHandling/schemas/file';
import { toDateTimePath } from '../helpers/path';
import { parserTypeList } from '../parser/types';
import { warning } from '../utils';
import type { I18nCheckerOptions } from './types';
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
    watch: false,
    include: [],
    reportPath: 'i18CheckerReport',
  };

  let globalConfig: I18nCheckerOptions = { ...defaultConfig };

  // 解析配置
  const resolveConfig = (config: I18nCheckerOptions) => {
    const { sourceLocale, localesPath, extensions, sync, reportPath, rules } = config;
    const overrides: Partial<I18nCheckerOptions> = {};

    if ('errorLocale' in config) {
      warning('[Vite-I18n-Checker] `errorLocale` is deprecated and will be removed in the next version. Please remove it from your configuration.');
      delete config.errorLocale;
    }

    if (!sourceLocale) handleError(ConfigCheckResult.REQUIRED, 'source');
    if (!localesPath) handleError(ConfigCheckResult.REQUIRED, 'localesPath');
    if (!parserTypeList.includes(extensions)) handleError(FileCheckResult.UNSUPPORTED_FILE_TYPE, extensions);

    // rules：驗證 shape（CLI 只負責載入；runtime 仍可能因 user code throw）
    if (rules) {
      validateCustomRules(rules);
    }

    if (sync) {
      overrides.sync = {
        preview: sync.preview ?? true,
        ...sync,
      };

      if (sync.useAI?.localeRules) {
        validateLocaleRules(sync.useAI.localeRules);
      }
    }
    overrides.reportPath = `${reportPath}/${toDateTimePath()}`;

    return { ...config, ...overrides };
  };

  return {
    // 設置並驗證配置
    setConfig(config: Partial<I18nCheckerOptions>) {
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


