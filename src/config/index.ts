import type { I18nCheckerOptions } from './types'
import { getConfigErrorMessage, getFileErrorMessage } from '../error'
import { FileCheckResult } from '../error/schemas/file'
import { error } from '../utils'
import { ConfigCheckResult } from '../error/schemas/config';
import { handlePluginError } from '../error';

// 使用閉包管理配置狀態和驗證
export function configManager() {
  const defaultLang = 'en_US'
  const supportedLangs = ['zh_CN', 'en_US']

  let globalConfig: I18nCheckerOptions = {
    sourceLocale: '',
    localesPath: '',
    extensions: '',
    errorLocale: defaultLang,
    failOnError: true,
    applyMode: 'serve',
  }

  // 驗證配置
  const validateConfig = (config: I18nCheckerOptions) => {
    const { sourceLocale, localesPath, errorLocale = '' } = config;
    if (!sourceLocale) handlePluginError(getFileErrorMessage(FileCheckResult.REQUIRED, 'source'))
    if (!localesPath) handlePluginError(getFileErrorMessage(FileCheckResult.REQUIRED, 'localesPath'))
    if (!supportedLangs.includes(errorLocale)) {
      handlePluginError(getFileErrorMessage(FileCheckResult.UNSUPPORTED_LANG, errorLocale))
      config.errorLocale = defaultLang
    }
  }

  return {
    // 設置並驗證配置
    setConfig(config: I18nCheckerOptions) {
      globalConfig = { ...globalConfig, ...config }
      validateConfig(globalConfig)
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

    handleError(message: string) {
      if (globalConfig.failOnError) {
        throw new Error(message)
      } else {
        error(message)
      }
    }
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


