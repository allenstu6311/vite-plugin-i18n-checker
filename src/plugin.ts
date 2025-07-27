import { Plugin } from 'vite'

export default function i18nCheckerPlugin(): Plugin {
  return {
    name: 'vite-plugin-i18n-checker',
    apply: 'serve', // 只在開發模式啟用
    enforce: 'post', // 在大多數 plugin 處理完後執行
    configResolved(config) {
      console.log('[i18n-checker] plugin loaded')
      // 🚧 未來這裡會觸發語系比對邏輯
    }
  }
}
