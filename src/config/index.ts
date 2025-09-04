import type { I18nCheckerOptions, I18nCheckerOptionsParams } from './types'
import { getConfigErrorMessage, getFileErrorMessage } from '../error'
import { FileCheckResult } from '../error/schemas/file'
import { error } from '../utils'
import { ConfigCheckResult } from '../error/schemas/config'

// 未來可提升參數命名維護性
// export const CONFIG_KEYS = {
//   SOURCE: 'source',
//   PATH: 'path', 
//   EXTENSIONS: 'extensions',
//   OUTPUT_LANG: 'outputLang'
// } as const;

// // 在 types.ts 中使用
// export interface I18nCheckerOptions {
//   [CONFIG_KEYS.SOURCE]: string;
//   [CONFIG_KEYS.PATH]: string;
//   [CONFIG_KEYS.EXTENSIONS]: string;
//   [CONFIG_KEYS.OUTPUT_LANG]: Lang;
// }

// 使用閉包管理配置狀態和驗證
export function configManager () {
  // 私有變數
  let globalConfig: I18nCheckerOptions = {
    source: '',
    localesPath: '',
    extensions: '',
    outputLang: 'en_US',
    failOnError: true,
  }

  const handleError = (message: string) => {
    if(globalConfig.failOnError) {
      throw new Error(message)
    } else {
      error(message)
    }
  }

  // 驗證配置
  const validateConfig = (config: I18nCheckerOptionsParams) => {
    const { source, localesPath } = config

    if (!source) {
      handleError(getFileErrorMessage(FileCheckResult.REQUIRED, 'source'))
    }
    if (!localesPath) {
      handlePluginError(getFileErrorMessage(FileCheckResult.REQUIRED, 'localesPath'))
    }

    return true
  }



  // 返回公開的 API
  return {
    // 設置並驗證配置
    setConfig(config: I18nCheckerOptionsParams) {
      // 直接在這裡驗證
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
    handleError,
  }
}

const { setConfig, getConfig, handleError } = configManager()

// 為了向後兼容，也可以導出單獨的函數
export const setGlobalConfig = setConfig
export const getGlobalConfig = getConfig
export const handlePluginError = handleError