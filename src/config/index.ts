import type { I18nCheckerOptions, I18nCheckerOptionsParams } from './types'
import { getConfigErrorMessage, getFileErrorMessage } from '../error'
import { FileCheckResult } from '../error/schemas/file'
import { error } from '../utils'
import { ConfigCheckResult } from '../error/schemas/config';
import { handlePluginError } from '../error';
import { ParserType, parserTypeList } from '../parser/types';

// 使用閉包管理配置狀態和驗證
export function configManager() {
  const defaultLang = 'en_US'
  const supportedLangs = ['zh_CN', 'en_US']

  let globalConfig: I18nCheckerOptions = {
    sourceLocale: '',
    localesPath: '',
    exclude: [],
    extensions: 'json',
    errorLocale: defaultLang,
    failOnError: false,
    applyMode: 'serve',
    rules: [],
    ignoreFiles: [],
    ignoreKeys: [],
    watch: true,
  }

  // 驗證配置
  const validateConfig = (config: I18nCheckerOptions) => {
    const { sourceLocale, localesPath, errorLocale, extensions, ignoreFiles } = config;
    const overrides: Partial<I18nCheckerOptions> = {};

    if (!sourceLocale) handlePluginError(getFileErrorMessage(FileCheckResult.REQUIRED, 'source'))
    if (!localesPath) handlePluginError(getFileErrorMessage(FileCheckResult.REQUIRED, 'localesPath'))
    if (!parserTypeList.includes(extensions)) handlePluginError(getFileErrorMessage(FileCheckResult.UNSUPPORTED_FILE_TYPE, extensions))
    if (!supportedLangs.includes(errorLocale)) {
      handlePluginError(getFileErrorMessage(FileCheckResult.UNSUPPORTED_LANG, errorLocale))
      overrides.errorLocale = defaultLang;
    }
    // 兼容性處理 ignoreFiles(未來可能拋棄)
    if (ignoreFiles.length > 0) overrides.exclude = ignoreFiles;
    return { ...config, ...overrides }
  }

  return {
    // 設置並驗證配置
    setConfig(config: Partial<I18nCheckerOptions>) {
      const merged = { ...globalConfig, ...config }
      console.log('merged',merged);
      globalConfig = validateConfig(merged);
    },

    // 獲取配置
    getConfig(): I18nCheckerOptions {
      if (!globalConfig) handlePluginError(getConfigErrorMessage(ConfigCheckResult.NOT_INITIALIZED))
      return globalConfig
    },

    // 檢查配置是否已初始化
    isInitialized(): boolean {
      return globalConfig !== null
    },
  }
}

type ConfigManagerTypes = ReturnType<typeof configManager>;

let manager: ConfigManagerTypes | null = null

export function initConfigManager() {
  if (!manager) {
    manager = configManager()
  }
  return manager
}

export const setGlobalConfig = (...args: Parameters<ConfigManagerTypes['setConfig']>) => initConfigManager().setConfig(...args);
export const getGlobalConfig = () => initConfigManager().getConfig();


