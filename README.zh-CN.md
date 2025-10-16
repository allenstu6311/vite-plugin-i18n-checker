# vite-plugin-i18n-checker

[![npm version](https://img.shields.io/npm/v/vite-plugin-i18n-checker.svg)](https://www.npmjs.com/package/vite-plugin-i18n-checker)
[![npm version](https://img.shields.io/npm/dt/vite-plugin-i18n-checker.svg)](https://www.npmjs.com/package/vite-plugin-i18n-checker)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

[English](README.md) | [中文](README.zh-CN.md)

## 📖 專案簡介

這是一個 **Vite 插件**，用來檢查專案中的多語系檔案，確保各語言版本的 key 完整性與一致性。支援多種檔案格式和靈活的目錄結構，幫助開發者維護 i18n 翻譯檔案的品質。

### ✨ 主要功能

- 🔍 **自動檢查** - 自動比對各語言檔案的 key 結構
- 📁 **多格式支援** - 支援 `.json`、`.yml`,`yaml`、`.ts`、`.js` 格式
- 🏗️ **靈活結構** - 支援單檔案和多檔案目錄結構
- 🌍 **多語言錯誤訊息** - 支援中文和英文錯誤提示
- ⚡ **靈活執行模式** - 可選擇在開發或建置時執行
- 📊 **詳細報告** - 表格化顯示缺失、多餘和無效的 key
- 🚫 **檔案和 Key 過濾** - 檢查時可忽略特定檔案和 key
- ⚙️ **自定義規則** - 定義自定義驗證規則以支援進階使用場景

### 🎯 檢查類型

- **Missing Keys** - 缺少的翻譯 key
- **Extra Keys** - 多餘的翻譯 key  
- **Invalid Keys** - 結構類型不匹配的 key
- **Missing Files** - 缺少的語言檔案

## 🚀 安裝與使用

### 安裝

```bash
npm install -D vite-plugin-i18n-checker
# 或
yarn add -D vite-plugin-i18n-checker
# 或
pnpm add -D vite-plugin-i18n-checker
```

### 基本使用

在 `vite.config.ts` 中配置：

```typescript
import { defineConfig } from 'vite'
import i18nChecker from 'vite-plugin-i18n-checker'

export default defineConfig({
  plugins: [
    i18nChecker({
      sourceLocale: 'zh_CN',        // 基準語言代碼
      localesPath: './src/locales', // 語言檔案目錄
      extensions: 'json',           // 檔案副檔名
      errorLocale: 'zh_CN',         // 錯誤訊息語言（可選）
      failOnError: false,           // 錯誤時是否中斷（可選）
    })
  ]
})
```

## 📁 支援的檔案結構

### 單檔案模式

```
src/locales/
├── zh_CN.json    # 基準語言檔案
├── en_US.json    # 其他語言檔案
└── es_ES.json
```

### 多檔案模式

```
src/locales/
├── zh_CN/        # 基準語言目錄
│   ├── common.ts
│   ├── login.ts
│   └── table/
│       └── table.ts
├── en_US/        # 其他語言目錄
│   ├── common.ts
│   ├── login.ts
│   └── table/
│       └── table.ts
└── es_ES/
    ├── common.ts
    ├── login.ts
    └── table/
        └── table.ts
```

## ⚙️ 配置選項

| 參數 | 型別 | 預設值 | 必填 | 說明 |
|------|------|--------|------|------|
| `sourceLocale` | `string` | 無 | ✅ | 基準語言代碼（如 `zh_CN`） |
| `localesPath` | `string` | 無 | ✅ | 語言檔案根目錄路徑 |
| `extensions` | `SupportedParserType` | `'json'` | ✅ | 支援的副檔名（如 `json`、`ts`、`yml`） |
| `errorLocale` | `'zh_CN' \| 'en_US'` | `'en_US'` | ❌ | 錯誤訊息顯示語言 |
| `failOnError` | `boolean` | `true` | ❌ | 發現錯誤時是否中斷開發伺服器 |
| `applyMode` | `'serve' \| 'build' \| 'all'` | `'serve'` | ❌ | 插件適用模式（開發/建置/全部） |
| `ignoreFiles` | `(string \| RegExp)[]` | `[]` | ❌ | 檢查時要忽略的檔案 |
| `ignoreKeys` | `string[]` | `[]` | ❌ | 檢查時要忽略的 key |
| `rules` | `CustomRule[]` | `[]` | ❌ | 自定義驗證規則：`{abnormalType: string, check: (source, target, pathStack, indexStack, key) => boolean, msg?: string}[]` |

## 📝 支援的檔案格式

### JSON 格式
```json
{
  "common": {
    "save": "儲存",
    "cancel": "取消"
  },
  "login": {
    "title": "登入"
  }
}
```

### TypeScript/JavaScript 格式
```typescript
export default {
  common: {
    save: '儲存',
    cancel: '取消'
  },
  login: {
    title: '登入'
  }
}
```

### YAML 格式
```yaml
common:
  save: 儲存
  cancel: 取消
login:
  title: 登入
```

## 🔧 進階使用

### 自定義錯誤處理

```typescript
i18nChecker({
  sourceLocale: 'zh_CN',
  localesPath: './src/locales',
  extensions: 'ts',
  errorLocale: 'en_US',    // 使用英文錯誤訊息
  failOnError: false,      // 不中斷開發流程，只顯示警告
})
```

### 設定適用模式

```typescript
// 只在開發模式執行（預設）
i18nChecker({
  sourceLocale: 'zh_CN',
  localesPath: './src/locales',
  extensions: 'json',
  applyMode: 'serve',      // 只在開發伺服器執行
})

// 只在建置模式執行
i18nChecker({
  sourceLocale: 'zh_CN',
  localesPath: './src/locales', 
  extensions: 'json',
  applyMode: 'build',      // 只在建置時執行
})

// 在建置和開發模式都執行
i18nChecker({
  sourceLocale: 'zh_CN',
  localesPath: './src/locales', 
  extensions: 'json',
  applyMode: 'all',
})
```

### 多種檔案格式混合

```typescript
// 檢查 JSON 檔案
i18nChecker({
  sourceLocale: 'zh_CN',
  localesPath: './src/locales/json',
  extensions: 'json',
})

// 檢查 TypeScript 檔案
i18nChecker({
  sourceLocale: 'zh_CN', 
  localesPath: './src/locales/ts',
  extensions: 'ts',
})
```

### 檔案和 Key 過濾

```typescript
i18nChecker({
  sourceLocale: 'zh_CN',
  localesPath: './src/locales',
  extensions: 'json',
  // 忽略特定檔案
  ignoreFiles: [
    '**/test/**',           // 忽略所有測試目錄中的檔案
    /\.spec\./,             // 忽略檔名包含 .spec. 的檔案
    'temp.json'             // 忽略特定檔案
  ],
  // 忽略特定 key
  ignoreKeys: [
    'common.debug',         // 忽略除錯相關的 key
    'temp.*',               // 忽略以 temp. 開頭的 key
    'unused'                // 忽略特定 key
  ]
})
```

### 自定義驗證規則

`check` 函數會接收以下參數：
- `source`: 基準語言物件
- `target`: 目標語言物件
- `pathStack`: 代表當前路徑的 key 陣列
- `indexStack`: 陣列元素的索引陣列
- `key`: 當前檢查的 key

```typescript
i18nChecker({
  sourceLocale: 'zh_CN',
  localesPath: './src/locales',
  extensions: 'json',
  // 定義自定義驗證規則
  rules: [
    {
      abnormalType: 'forbiddenKey',
      check: (source, target, pathStack, indexStack, key) => key === 'theme',
      msg: '翻譯中不允許使用 theme 作為 key'
    },
    {
      abnormalType: 'emptyValue',
      check: (source, target, pathStack, indexStack, key) => target[key] === '',
      msg: '翻譯值不能為空'
    },
    {
      abnormalType: 'nestedCheck',
      check: (source, target, pathStack, indexStack, key) => {
        // 檢查巢狀物件是否有特定結構
        return pathStack.includes('user') && key === 'name' && 
               typeof target[key] !== 'string'
      },
      msg: '使用者名稱必須是字串'
    }
  ]
})
```

## 📊 錯誤報告範例

```
Missing keys
╔══════════════════════════════════════╤═══════════════════════╤═══════════════════════╗
║ file                                 │ key                   │ remark                ║
╠══════════════════════════════════════╪═══════════════════════╪═══════════════════════╣
║ src/locales/en_US.json               │ common.delete         │                       ║
║ src/locales/en_US.json               │ login.password        │                       ║
╚══════════════════════════════════════╧═══════════════════════╧═══════════════════════╝

Extra keys
╔══════════════════════════════════════╤═══════════════════════╤═══════════════════════╗
║ file                                 │ key                   │ remark                ║
╠══════════════════════════════════════╪═══════════════════════╪═══════════════════════╣
║ src/locales/zh_CN.json               │ common.extra          │                       ║
╚══════════════════════════════════════╧═══════════════════════╧═══════════════════════╝
```

## 🛠️ 開發

### 專案結構

```
src/
├── abnormal/          # 異常檢測和處理
├── checker/           # 檔案比對邏輯
├── config/            # 配置管理
├── error/             # 錯誤處理和訊息
├── helpers/           # 輔助函數
├── parser/            # 檔案解析器
├── report/            # 報告生成
└── utils/             # 工具函數
```

### 本地開發

```bash
# 安裝依賴
pnpm install

# 執行測試
pnpm test

# 建置
pnpm build

# 開發模式
pnpm dev
```

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📄 授權

ISC License

## 🔗 相關連結

- [GitHub Repository](https://github.com/allenstu6311/vite-plugin-i18n-checker)
- [NPM Package](https://www.npmjs.com/package/vite-plugin-i18n-checker)
