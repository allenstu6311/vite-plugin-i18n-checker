import type { I18nCheckerOptions, I18nCheckerOptionsParams } from './types'
import { getConfigErrorMessage, getFileErrorMessage } from '../error'
import { FileCheckResult } from '../error/schemas/file'
import { error } from '../utils'
import { ConfigCheckResult } from '../error/schemas/config'

// 使用閉包管理配置狀態和驗證
export function configManager() {
  // 私有變數
  let globalConfig: I18nCheckerOptions = {
    source: '',
    localesPath: '',
    extensions: '',
    outputLang: 'en_US',
    failOnError: true,
  }

  // 驗證配置
  const validateConfig = (config: I18nCheckerOptionsParams) => {
    const { source, localesPath } = config
    if (!source) handlePluginError(getFileErrorMessage(FileCheckResult.REQUIRED, 'source'))
    if (!localesPath) handlePluginError(getFileErrorMessage(FileCheckResult.REQUIRED, 'localesPath'))
  }

  return {
    // 設置並驗證配置
    setConfig(config: I18nCheckerOptionsParams) {
      validateConfig(config)
      globalConfig = { ...globalConfig, ...config }
    },

    // 獲取配置
    getConfig(): I18nCheckerOptions {
      if (!globalConfig) {
        handlePluginError(getConfigErrorMessage(ConfigCheckResult.NOT_INITIALIZED))
      }
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

const { setConfig, getConfig, handleError } = configManager()
export const setGlobalConfig = setConfig
export const getGlobalConfig = getConfig
export const handlePluginError = handleError

