import type { I18nCheckerOptions } from './types'
import { getConfigErrorMessage, getFileErrorMessage } from '../error'
import { FileCheckResult } from '../error/types'
import { error } from '../utils'
import { ConfigCheckResult } from '../error/schemas/conifg'

// 使用閉包管理配置狀態和驗證
export function configManager () {
  // 私有變數
  let globalConfig: I18nCheckerOptions | null = null

  // 驗證配置
  const validateConfig = (config: I18nCheckerOptions) => {
    const { source, path } = config

    if (!source) {
      error(getFileErrorMessage(FileCheckResult.REQUIRED, 'source'))
    }
    if (!path) {
      error(getFileErrorMessage(FileCheckResult.REQUIRED, 'path'))
    }

    return true
  }

  // 返回公開的 API
  return {
    // 設置並驗證配置
    setConfig(config: I18nCheckerOptions) {
      // 直接在這裡驗證
      validateConfig(config)
      globalConfig = config
    },

    // 獲取配置
    getConfig(): I18nCheckerOptions | null {
      if (!globalConfig) {
        error(getConfigErrorMessage(ConfigCheckResult.NOT_INITIALIZED))
      }
      return globalConfig
    },

    // 檢查配置是否已初始化
    isInitialized(): boolean {
      return globalConfig !== null
    },

    // 重置配置
    reset() {
      globalConfig = null
    }
  }
}

const { setConfig, getConfig } = configManager()

// 為了向後兼容，也可以導出單獨的函數
export const setGlobalConfig = setConfig
export const getGlobalConfig = getConfig