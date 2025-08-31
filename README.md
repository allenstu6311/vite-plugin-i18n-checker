# vite-plugin-i18n-checker


## 📖 專案簡介
這是一個 **Vite 插件**，用來檢查專案中的多語系檔案，確保各語言版本的 key 完整性與一致性。  
支援檔案格式：
- `.json`
- `.yml`
- `.ts`（包含 `export default {}` 語法的語系檔）

## 🚀 安裝與使用
安裝：
```bash
pnpm add -D vite-plugin-i18n-checker

在 vite.config.ts 中啟用：

import { defineConfig } from 'vite'
import i18nChecker from 'vite-plugin-i18n-checker'
```



```
export default defineConfig({
  plugins: [
    i18nChecker({
      source: './src/locales/en_US.json', // 範本語言檔
      path: './src/locales',              // 其他語言檔的根路徑
      extensions: '.json,.yml,.ts',       // 支援副檔名
      lang: 'en_US',                      // 基準語言
    })
  ]
})```

```
| 參數           | 型別       | 預設值       | 必填 | 說明                                   |
| ------------ | -------- | --------- | -- | ------------------------------------ |
| `source`     | `string` | 無         | ✅  | 範本語言檔或語言資料夾（如 `zh_CN.js` 或 `zh-CN/`） |
| `path`       | `string` | 無         | ✅  | 其他語系檔的根目錄，用於比對檢查                     |
| `extensions` | `string` | 無         | ✅  | 支援的副檔名清單，例如：`.json,.yml,.ts`         |
| `lang`       | `string` | `"en_US"` | ❌  | 基準語言代碼，用來當作對照語言                      |
