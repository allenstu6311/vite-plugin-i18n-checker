# vite-plugin-i18n-checker

[![npm version](https://img.shields.io/npm/v/vite-plugin-i18n-checker.svg)](https://www.npmjs.com/package/vite-plugin-i18n-checker)
[![npm version](https://img.shields.io/npm/dt/vite-plugin-i18n-checker.svg)](https://www.npmjs.com/package/vite-plugin-i18n-checker)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

[English](README.md) | [中文](README.zh-CN.md)

## 📖 專案簡介

這是一個 **Vite 插件**，用來檢查專案中的多語系檔案，確保各語言版本的 key 完整性與一致性。支援多種檔案格式和靈活的目錄結構，幫助開發者維護 i18n 翻譯檔案的品質。

### ✨ 主要功能

- 🔍 **自動檢查** - 自動比對各語言檔案的 key 結構
- 📁 **多格式支援** - 支援 `.json`、`.yml`、`yaml`、`.ts`、`.js` 格式
- 🏗️ **靈活結構** - 支援單檔案和多檔案目錄結構
- ⚡ **靈活執行模式** - 可選擇在開發或建置時執行
- 🔄 **自動同步** - 自動填充缺少的 key、刪除多餘的 key，支援預覽模式
- 📊 **HTML 報告** - 生成精美的 HTML 報告，支援兩層摺疊結構和自動分頁
- 📈 **報告歷史** - 按時間戳保存歷史報告，可配置自動清理策略
- 🚫 **檔案和 Key 過濾** - 支援 include/exclude 模式過濾檔案和 key
- ⚙️ **自定義規則** - 定義自定義驗證規則以支援進階使用場景
- 🛠️ **CLI 工具** - 支援命令列工具，可在 CI 環境中使用

### 🎯 檢查類型

- **Missing Keys** - 缺少的翻譯 key
- **Extra Keys** - 多餘的翻譯 key
- **Invalid Keys** - 結構類型不匹配的 key（資料類型不符、陣列長度不符）
- **Missing Files** - 缺少的語言檔案
- **Empty Files** - 空的語言檔案
- **Delete Keys** - 待刪除的 key（同步模式）
- **Add Keys** - 待新增的 key（同步模式）

## 目錄

- [安裝](#安裝)
- [使用方式](#使用方式)
  - [Vite 插件](#vite-插件)
  - [CLI 工具](#cli-工具)
- [配置選項](#配置選項)
- [同步功能](#同步功能)
- [HTML 報告](#html-報告)
- [支援的檔案結構](#支援的檔案結構)
  - [單檔案模式](#單檔案模式)
  - [多檔案模式](#多檔案模式)
- [CI 整合](#ci-整合)
  - [GitHub Actions](#github-actions)
- [進階使用](#進階使用)
  - [自定義規則](#自定義規則)
  - [檔案過濾](#檔案過濾)
- [使用範例](#使用範例)
- [開發](#開發)
- [相關連結](#相關連結)

## 安裝

```bash
npm install -D vite-plugin-i18n-checker
# 或
yarn add -D vite-plugin-i18n-checker
# 或
pnpm add -D vite-plugin-i18n-checker
```

## 使用方式

### Vite 插件

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
      failOnError: false,           // 錯誤時是否中斷（可選）
      report: {                     // 報告配置（可選）
        dir: 'i18CheckerReport',    // 報告輸出目錄
        retention: 7                // 報告保留天數
      }
    })
  ]
})
```

### CLI 工具

```bash
npx i18n-check -s zh_CN -p ./src/locales -x json
```

#### CLI 選項

**`--sourceLocale, -s`** (必填)
定義基準語言代碼，所有目標檔案將與此語言進行比較。

```bash
npx i18n-check -s zh_CN -p ./src/locales -x json
```

**`--localesPath, -p`** (必填)
定義語言檔案目錄路徑。

```bash
npx i18n-check -s zh_CN -p ./src/locales -x json
```

**`--extensions, -x`** (必填)
定義要檢查的檔案副檔名。

```bash
npx i18n-check -s zh_CN -p ./src/locales -x json
```

**`--failOnError, -f`**
發現錯誤時是否中斷執行。

```bash
npx i18n-check -s zh_CN -p ./src/locales -x json -f
```

**`--applyMode, -m`**
設定執行模式（serve/build/all）。

```bash
npx i18n-check -s zh_CN -p ./src/locales -x json -m build
```

**`--include`**
包含特定檔案模式（支援多個模式）。

```bash
npx i18n-check -s zh_CN -p ./src/locales -x json --include "**/common/**"
```

**`--exclude, -e`**
忽略特定檔案模式（支援多個模式）。

```bash
npx i18n-check -s zh_CN -p ./src/locales -x json -e "**/test/**" "**/*.spec.*"
```

**`--ignoreKeys, -i`**
忽略特定 key 模式（支援多個模式）。

```bash
npx i18n-check -s zh_CN -p ./src/locales -x json -i "common.debug" "unused.*"
```

**`--rules, -r`**
自定義驗證規則檔案路徑（JavaScript/TypeScript 檔案）。

```bash
npx i18n-check -s zh_CN -p ./src/locales -x json -r "./custom-rules.mjs"
```

規則檔案格式範例：

```javascript
// custom-rules.mjs
export default [
  {
    abnormalType: 'forbiddenKey',
    check: ({ source, target, key, pathStack }) => key === 'theme',
    msg: '翻譯中不允許使用 theme 作為 key'
  },
  {
    abnormalType: 'emptyValue',
    check: ({ source, target, key, pathStack }) => target[key] === '',
    msg: '翻譯值不能為空'
  }
];
```

**`--report-dir <path>`**
設定報告輸出目錄。

```bash
npx i18n-check -s zh_CN -p ./src/locales -x json --report-dir checkReport
```

**`--report-retention <days>`**
設定報告保留天數（自動清理過期報告）。

```bash
npx i18n-check -s zh_CN -p ./src/locales -x json --report-retention 7
```

**`-w, --watch`**
監聽檔案變化，檔案修改時自動重新檢查。

```bash
npx i18n-check -s zh_CN -p ./src/locales -x json -w
```

**`--sync [path]`**
啟用同步模式，自動填充或刪除 key。可選擇性提供配置檔案路徑。

```bash
# 啟用同步模式（使用預設配置）
npx i18n-check -s zh_CN -p ./src/locales -x json --sync

# 使用配置檔案
npx i18n-check -s zh_CN -p ./src/locales -x json --sync ./sync-config.mjs
```

**`--override`**
同步模式下，覆蓋目標語言中已存在的值。

```bash
npx i18n-check -s zh_CN -p ./src/locales -x json --sync --override
```

**`--autoFill`**
同步模式下，自動填充缺少的 key。

```bash
npx i18n-check -s zh_CN -p ./src/locales -x json --sync --autoFill
```

**`--autoDelete`**
同步模式下，自動刪除多餘的 key。

```bash
npx i18n-check -s zh_CN -p ./src/locales -x json --sync --autoDelete
```

**`--no-preview`**
同步模式下，跳過預覽直接執行變更。

```bash
npx i18n-check -s zh_CN -p ./src/locales -x json --sync --no-preview
```

## 配置選項

| 參數 | 型別 | 預設值 | 必填 | 說明 |
|------|------|--------|------|------|
| `sourceLocale` | `string` | 無 | ✅ | 基準語言代碼（如 `zh_CN`） |
| `localesPath` | `string` | 無 | ✅ | 語言檔案根目錄路徑 |
| `extensions` | `SupportedParserType` | `'json'` | ✅ | 支援的副檔名（`json`、`ts`、`js`、`yml`、`yaml`） |
| `failOnError` | `boolean` | `false` | ❌ | 發現錯誤時是否中斷 |
| `applyMode` | `'serve' \| 'build' \| 'all'` | `'serve'` | ❌ | 插件適用模式（開發/建置/全部） |
| `include` | `(string \| RegExp)[]` | `[]` | ❌ | 要包含的檔案模式 |
| `exclude` | `(string \| RegExp)[]` | `[]` | ❌ | 要忽略的檔案模式 |
| `ignoreKeys` | `(string \| RegExp)[]` | `[]` | ❌ | 要忽略的 key 模式 |
| `rules` | `CustomRule[]` | `[]` | ❌ | 自定義驗證規則 |
| `watch` | `boolean` | `false` | ❌ | 是否監聽檔案變化 |
| `sync` | `boolean \| SyncOptions` | `undefined` | ❌ | 同步配置（自動填充/刪除 key） |
| `report` | `ReportOptions` | `{ dir: 'i18CheckerReport', retention: 7 }` | ❌ | 報告配置 |

### SyncOptions

| 參數 | 型別 | 預設值 | 說明 |
|------|------|--------|------|
| `autoFill` | `boolean` | `true` | 自動填充缺少的 key |
| `autoDelete` | `boolean` | `false` | 自動刪除多餘的 key |
| `override` | `boolean` | `false` | 覆蓋目標語言中已存在的值 |
| `preview` | `boolean` | `true` | 顯示變更預覽 |

### ReportOptions

| 參數 | 型別 | 預設值 | 說明 |
|------|------|--------|------|
| `dir` | `string` | `'i18CheckerReport'` | 報告輸出目錄 |
| `retention` | `number` | `7` | 報告保留天數（自動清理） |

### CustomRule

```typescript
type CustomRule = {
  abnormalType: string;                     // 自定義異常類型名稱
  check: (ctx: CollectAbnormalKeysParam) => boolean;  // 檢查函數
  msg?: string;                            // 錯誤訊息（可選）
}

// 檢查函數參數
type CollectAbnormalKeysParam = {
  source: any;        // 基準語言物件
  target: any;        // 目標語言物件
  key: string;        // 當前檢查的 key
  pathStack: string[]; // 當前路徑的 key 陣列
}
```

## 同步功能

同步功能可以自動維護翻譯檔案的一致性，自動填充缺少的 key 或刪除多餘的 key。

### 啟用同步模式

```typescript
i18nChecker({
  sourceLocale: 'zh_CN',
  localesPath: './src/locales',
  extensions: 'json',
  sync: true  // 啟用同步模式（使用預設配置）
})
```

### 自訂同步配置

```typescript
i18nChecker({
  sourceLocale: 'zh_CN',
  localesPath: './src/locales',
  extensions: 'json',
  sync: {
    autoFill: true,      // 自動填充缺少的 key（預設：true）
    autoDelete: false,   // 自動刪除多餘的 key（預設：false）
    override: false,     // 覆蓋已存在的值（預設：false）
    preview: true        // 顯示變更預覽（預設：true）
  }
})
```

### 同步行為說明

#### autoFill（自動填充）
當目標語言缺少某些 key 時，會自動從基準語言複製 key 和值：

```json
// zh_CN.json (基準語言)
{
  "common": {
    "save": "儲存",
    "cancel": "取消",
    "delete": "刪除"  // 新增的 key
  }
}

// en_US.json (執行前)
{
  "common": {
    "save": "Save",
    "cancel": "Cancel"
  }
}

// en_US.json (執行後 - autoFill: true)
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "刪除"  // 自動填充（複製基準語言的值）
  }
}
```

#### autoDelete（自動刪除）
當目標語言有多餘的 key 時，會自動刪除：

```json
// zh_CN.json (基準語言)
{
  "common": {
    "save": "儲存",
    "cancel": "取消"
  }
}

// en_US.json (執行前)
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "oldKey": "Old Value"  // 多餘的 key
  }
}

// en_US.json (執行後 - autoDelete: true)
{
  "common": {
    "save": "Save",
    "cancel": "Cancel"
  }
}
```

#### override（覆蓋值）
配合 `autoFill` 使用，決定是否覆蓋目標語言中已存在的 key：

```json
// zh_CN.json (基準語言)
{
  "common": {
    "save": "儲存",
    "cancel": "取消更新"  // 值已更新
  }
}

// en_US.json (執行前)
{
  "common": {
    "save": "Save",
    "cancel": "Cancel"  // 舊的翻譯
  }
}

// en_US.json (執行後 - override: true)
{
  "common": {
    "save": "Save",
    "cancel": "取消更新"  // 被基準語言的值覆蓋
  }
}
```

#### preview（預覽模式）
當 `preview: true` 時，會在終端顯示變更預覽，不會直接修改檔案。設定為 `false` 則直接執行變更。

### CLI 使用範例

```bash
# 基本同步（預覽模式）
npx i18n-check -s zh_CN -p ./src/locales -x json --sync

# 自動填充並覆蓋（預覽模式）
npx i18n-check -s zh_CN -p ./src/locales -x json --sync --override

# 自動填充和刪除（直接執行）
npx i18n-check -s zh_CN -p ./src/locales -x json --sync --autoFill --autoDelete --no-preview

# 使用外部配置檔案
npx i18n-check -s zh_CN -p ./src/locales -x json --sync ./sync-config.mjs
```

同步配置檔案範例 (`sync-config.mjs`):

```javascript
// sync-config.mjs
export default {
  autoFill: true,
  autoDelete: false,
  override: false,
  preview: true
};
```

## HTML 報告

插件會自動生成精美的 HTML 報告，提供更好的視覺化體驗。

### 報告特色

- 📋 **兩層摺疊結構** - 第一層按異常類型分類，第二層按檔案分組
- 📄 **自動分頁** - 單個檔案超過 20 個問題時自動分頁顯示
- 🎨 **精美樣式** - GitHub + Playwright 混合設計風格
- 🕐 **歷史記錄** - 按時間戳保存每次檢查結果
- 🗑️ **自動清理** - 根據 `retention` 配置自動清理過期報告

### 報告目錄結構

```
i18CheckerReport/           # 報告根目錄（可配置）
└── 2026-02-15/            # 按日期分類
    ├── 09-30-00/          # 時間戳目錄
    │   └── index.html
    ├── 10-15-30/
    │   └── index.html
    └── 14-20-45/
        └── index.html
```

### 配置範例

```typescript
i18nChecker({
  sourceLocale: 'zh_CN',
  localesPath: './src/locales',
  extensions: 'json',
  report: {
    dir: 'checkReport',    // 自定義報告目錄
    retention: 30          // 保留 30 天的報告
  }
})
```

## 支援的檔案結構

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

## CI 整合

### GitHub Actions

在 `.github/workflows/i18n-check.yml` 中建立工作流程：

```yaml
name: i18n Check

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  i18n-check:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Check i18n files
      run: npx i18n-check --sourceLocale zh_CN --localesPath ./src/locales --extensions json
```

## 進階使用

### 自定義規則

`check` 函數會接收包含以下屬性的上下文物件：
- `source`: 基準語言物件
- `target`: 目標語言物件
- `pathStack`: 代表當前路徑的 key 陣列
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
      check: ({ source, target, pathStack, key }) => key === 'theme',
      msg: '翻譯中不允許使用 theme 作為 key'
    },
    {
      abnormalType: 'emptyValue',
      check: ({ source, target, pathStack, key }) => target[key] === '',
      msg: '翻譯值不能為空'
    },
    {
      abnormalType: 'nestedCheck',
      check: ({ source, target, pathStack, key }) => {
        // 檢查巢狀物件是否有特定結構
        return pathStack.includes('user') && key === 'name' &&
               typeof target[key] !== 'string'
      },
      msg: '使用者名稱必須是字串'
    }
  ]
})
```

### 檔案過濾

```typescript
i18nChecker({
  sourceLocale: 'zh_CN',
  localesPath: './src/locales',
  extensions: 'json',
  // 只包含特定檔案
  include: [
    '**/common/**',         // 只檢查 common 目錄
    '**/auth/**'            // 只檢查 auth 目錄
  ],
  // 忽略特定檔案
  exclude: [
    '**/test/**',           // 忽略所有測試目錄中的檔案
    /\.spec\./,             // 忽略檔名包含 .spec. 的檔案
    'temp.json'             // 忽略特定檔案
  ],
  // 忽略特定 key
  ignoreKeys: [
    'common.debug',         // 忽略除錯相關的 key
    'unused'                // 忽略特定 key
  ]
})
```

## 使用範例

### 基本配置

```typescript
i18nChecker({
  sourceLocale: 'zh_CN',
  localesPath: './src/locales',
  extensions: 'ts',
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

### 監聽檔案變化

```typescript
// 啟用監聽模式 - 檔案變更時自動重新檢查
i18nChecker({
  sourceLocale: 'zh_CN',
  localesPath: './src/locales',
  extensions: 'json',
  watch: true,      // 翻譯檔案修改時自動檢查
})

// 停用監聽模式 - 僅在啟動時檢查一次（預設）
i18nChecker({
  sourceLocale: 'zh_CN',
  localesPath: './src/locales',
  extensions: 'json',
  watch: false,     // 停用自動重新檢查
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

### 完整配置範例

```typescript
i18nChecker({
  sourceLocale: 'zh_CN',
  localesPath: './src/locales',
  extensions: 'json',
  failOnError: true,
  applyMode: 'all',
  watch: true,
  include: ['**/common/**', '**/auth/**'],
  exclude: ['**/test/**', /\.spec\./],
  ignoreKeys: ['debug.*', 'temp'],
  report: {
    dir: 'i18n-reports',
    retention: 30
  },
  rules: [
    {
      abnormalType: 'emptyValue',
      check: ({ target, key }) => target[key] === '',
      msg: '翻譯值不能為空'
    }
  ]
})
```

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

## 📊 錯誤報告範例

### CLI 報告

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

### HTML 報告

HTML 報告提供更好的視覺體驗：
- 按異常類型分組的摺疊面板
- 按檔案分組的二級摺疊
- 超過 20 項自動分頁
- 支援點擊展開/收合

檢查完成後，報告會輸出到配置的目錄，在終端會顯示報告路徑：
```
Please check the detailed report at "/path/to/your/project/i18CheckerReport"
```

## 開發

### 專案結構

```
src/
├── abnormal/          # 異常檢測和處理
├── bin/               # CLI 入口
├── checker/           # 檔案比對邏輯
├── config/            # 配置管理
├── errorHandling/     # 錯誤處理和訊息
├── helpers/           # 輔助函數
├── parser/            # 檔案解析器
├── report/            # 報告生成
│   └── abnormalKey/   # 異常 key 報告
│       ├── cli-renderer.ts   # CLI 報告渲染
│       ├── html-renderer.ts  # HTML 報告渲染
│       ├── index.ts          # 報告協調器
│       └── types.ts          # 報告類型定義
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

# 程式碼檢查
pnpm lint
```

## 相關連結

- [GitHub Repository](https://github.com/allenstu6311/vite-plugin-i18n-checker)
- [NPM Package](https://www.npmjs.com/package/vite-plugin-i18n-checker)
- [Issues](https://github.com/allenstu6311/vite-plugin-i18n-checker/issues)
