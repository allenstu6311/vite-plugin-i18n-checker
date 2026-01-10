import { getConfigErrorMessage, getFileErrorMessage, handlePluginError } from '../error';
import { ConfigCheckResult } from '../error/schemas/config';
import { FileCheckResult } from '../error/schemas/file';
import { toDateTimePath } from '../helpers/path';
import { parserTypeList } from '../parser/types';
import type { I18nCheckerOptions } from './types';
import { validateLocaleRules } from './validate';

// 使用閉包管理配置狀態和驗證
export function configManager() {
  const defaultLang = 'en_US';
  const supportedLangs = ['zh_CN', 'en_US'];

  let globalConfig: I18nCheckerOptions = {
    sourceLocale: '',
    localesPath: '',
    exclude: [],
    extensions: 'json',
    errorLocale: defaultLang,
    failOnError: false,
    applyMode: 'serve',
    rules: [],
    ignoreKeys: [],
    watch: true,
    include: [],
    reportPath: 'i18CheckerReport',
  };

  // 解析配置
  const resolveConfig = (config: I18nCheckerOptions) => {
    const { sourceLocale, localesPath, errorLocale, extensions, sync, reportPath } = config;
    const overrides: Partial<I18nCheckerOptions> = {};

    if (!sourceLocale) handlePluginError(getFileErrorMessage(FileCheckResult.REQUIRED, 'source'));
    if (!localesPath) handlePluginError(getFileErrorMessage(FileCheckResult.REQUIRED, 'localesPath'));
    if (!parserTypeList.includes(extensions)) handlePluginError(getFileErrorMessage(FileCheckResult.UNSUPPORTED_FILE_TYPE, extensions));
    if (!supportedLangs.includes(errorLocale)) {
      handlePluginError(getFileErrorMessage(FileCheckResult.UNSUPPORTED_LANG, errorLocale));
      overrides.errorLocale = defaultLang;
    }
    if (sync) {
      const { localeRules } = sync;
      overrides.sync = {
        preview: sync.preview ?? true,
        ...sync,
      };

      if (localeRules) {
        validateLocaleRules(localeRules);
      }
    }
    overrides.reportPath = `${reportPath}/${toDateTimePath()}`;

    return { ...config, ...overrides };
  };

  return {
    // 設置並驗證配置
    setConfig(config: Partial<I18nCheckerOptions>) {
      const merged = { ...globalConfig, ...config };
      globalConfig = resolveConfig(merged);
    },

    // 獲取配置
    getConfig(): I18nCheckerOptions {
      if (!globalConfig) handlePluginError(getConfigErrorMessage(ConfigCheckResult.NOT_INITIALIZED));
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


