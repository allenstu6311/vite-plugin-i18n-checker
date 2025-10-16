# vite-plugin-i18n-checker

[![npm version](https://img.shields.io/npm/v/vite-plugin-i18n-checker.svg)](https://www.npmjs.com/package/vite-plugin-i18n-checker)
[![npm version](https://img.shields.io/npm/dt/vite-plugin-i18n-checker.svg)](https://www.npmjs.com/package/vite-plugin-i18n-checker)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

[English](README.md) | [中文](README.zh-CN.md)

## 📖 Project Introduction

This is a **Vite plugin** for checking multi-language files in projects, ensuring key completeness and consistency across different language versions. It supports multiple file formats and flexible directory structures, helping developers maintain i18n translation file quality.

### ✨ Key Features

- 🔍 **Automatic Checking** - Automatically compares key structures across language files
- 📁 **Multi-format Support** - Supports `.json`, `.yml`,`yaml`, `.ts`, `.js` formats
- 🏗️ **Flexible Structure** - Supports both single-file and multi-file directory structures
- 🌍 **Multi-language Error Messages** - Supports Chinese and English error prompts
- ⚡ **Flexible Execution Mode** - Choose to run during development or build
- 📊 **Detailed Reports** - Tabular display of missing, extra, and invalid keys
- 🚫 **File & Key Filtering** - Ignore specific files and keys during checking
- ⚙️ **Custom Rules** - Define custom validation rules for advanced use cases

### 🎯 Check Types

- **Missing Keys** - Missing translation keys
- **Extra Keys** - Redundant translation keys  
- **Invalid Keys** - Keys with mismatched structure types
- **Missing Files** - Missing language files

## 🚀 Installation and Usage

### Installation

```bash
npm install -D vite-plugin-i18n-checker
# or
yarn add -D vite-plugin-i18n-checker
# or
pnpm add -D vite-plugin-i18n-checker
```

### Basic Usage

Configure in `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import i18nChecker from 'vite-plugin-i18n-checker'

export default defineConfig({
  plugins: [
    i18nChecker({
      sourceLocale: 'zh_CN',        // Base language code
      localesPath: './src/locales', // Language files directory
      extensions: 'json',           // File extension
      errorLocale: 'zh_CN',         // Error message language (optional)
      failOnError: false,           // Whether to interrupt on error (optional)
    })
  ]
})
```

## 📁 Supported File Structures

### Single File Mode

```
src/locales/
├── zh_CN.json    # Base language file
├── en_US.json    # Other language files
└── es_ES.json
```

### Multi-file Mode

```
src/locales/
├── zh_CN/        # Base language directory
│   ├── common.ts
│   ├── login.ts
│   └── table/
│       └── table.ts
├── en_US/        # Other language directories
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

## ⚙️ Configuration Options

| Parameter | Type | Default | Required | Description |
|-----------|------|---------|----------|-------------|
| `sourceLocale` | `string` | - | ✅ | Base language code (e.g., `zh_CN`) |
| `localesPath` | `string` | - | ✅ | Root directory path for language files |
| `extensions` | `SupportedParserType` | `'json'` | ✅ | Supported file extensions (e.g., `json`, `ts`, `yml`) |
| `errorLocale` | `'zh_CN' \| 'en_US'` | `'en_US'` | ❌ | Error message display language |
| `failOnError` | `boolean` | `true` | ❌ | Whether to interrupt development server on error |
| `applyMode` | `'serve' \| 'build' \| 'all'` | `'serve'` | ❌ | Plugin execution mode (development/build/all) |
| `ignoreFiles` | `(string \| RegExp)[]` | `[]` | ❌ | Files to ignore during checking |
| `ignoreKeys` | `string[]` | `[]` | ❌ | Keys to ignore during checking |
| `rules` | `CustomRule[]` | `[]` | ❌ | Custom validation rules: `{abnormalType: string, check: (source, target, pathStack, indexStack, key) => boolean, msg?: string}[]` |

## 📝 Supported File Formats

### JSON Format
```json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel"
  },
  "login": {
    "title": "Login"
  }
}
```

### TypeScript/JavaScript Format
```typescript
export default {
  common: {
    save: 'Save',
    cancel: 'Cancel'
  },
  login: {
    title: 'Login'
  }
}
```

### YAML Format
```yaml
common:
  save: Save
  cancel: Cancel
login:
  title: Login
```

## 🔧 Advanced Usage

### Custom Error Handling

```typescript
i18nChecker({
  sourceLocale: 'zh_CN',
  localesPath: './src/locales',
  extensions: 'ts',
  errorLocale: 'en_US',    // Use English error messages
  failOnError: false,      // Don't interrupt development flow, only show warnings
})
```

### Setting Execution Mode

```typescript
// Only run in development mode (default)
i18nChecker({
  sourceLocale: 'zh_CN',
  localesPath: './src/locales',
  extensions: 'json',
  applyMode: 'serve',      // Only run in development server
})

// Only run in build mode
i18nChecker({
  sourceLocale: 'zh_CN',
  localesPath: './src/locales', 
  extensions: 'json',
  applyMode: 'build',      // Only run during build
})

// run in both build and development mode
i18nChecker({
  sourceLocale: 'zh_CN',
  localesPath: './src/locales', 
  extensions: 'json',
  applyMode: 'all',
})
```

### Multiple File Format Mixing

```typescript
// Check JSON files
i18nChecker({
  sourceLocale: 'zh_CN',
  localesPath: './src/locales/json',
  extensions: 'json',
})

// Check TypeScript files
i18nChecker({
  sourceLocale: 'zh_CN', 
  localesPath: './src/locales/ts',
  extensions: 'ts',
})
```

### File and Key Filtering

```typescript
i18nChecker({
  sourceLocale: 'zh_CN',
  localesPath: './src/locales',
  extensions: 'json',
  // Ignore specific files
  ignoreFiles: [
    '**/test/**',           // Ignore all files in test directories
    /\.spec\./,             // Ignore files with .spec. in name
    'temp.json'             // Ignore specific file
  ],
  // Ignore specific keys
  ignoreKeys: [
    'common.debug',         // Ignore debug keys
    'temp.*',               // Ignore keys starting with temp.
    'unused'                // Ignore specific key
  ]
})
```

### Custom Validation Rules

The `check` function receives the following parameters:
- `source`: Source language object
- `target`: Target language object  
- `pathStack`: Array of keys representing the current path
- `indexStack`: Array of indices for array elements
- `key`: Current key being checked

```typescript
i18nChecker({
  sourceLocale: 'zh_CN',
  localesPath: './src/locales',
  extensions: 'json',
  // Define custom validation rules
  rules: [
    {
      abnormalType: 'forbiddenKey',
      check: (source, target, pathStack, indexStack, key) => key === 'theme',
      msg: 'Theme key is not allowed in translations'
    },
    {
      abnormalType: 'emptyValue',
      check: (source, target, pathStack, indexStack, key) => target[key] === '',
      msg: 'Translation values cannot be empty'
    },
    {
      abnormalType: 'nestedCheck',
      check: (source, target, pathStack, indexStack, key) => {
        // Check if nested object has specific structure
        return pathStack.includes('user') && key === 'name' && 
               typeof target[key] !== 'string'
      },
      msg: 'User name must be a string'
    }
  ]
})
```

## 📊 Error Report Example

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

## 🛠️ Development

### Project Structure

```
src/
├── abnormal/          # Anomaly detection and processing
├── checker/           # File comparison logic
├── config/            # Configuration management
├── error/             # Error handling and messages
├── helpers/           # Helper functions
├── parser/            # File parsers
├── report/            # Report generation
└── utils/             # Utility functions
```

### Local Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Build
pnpm build

# Development mode
pnpm dev
```

## 🤝 Contributing

Issues and Pull Requests are welcome!

## 📄 License

ISC License

## 🔗 Related Links

- [GitHub Repository](https://github.com/allenstu6311/vite-plugin-i18n-checker)
- [NPM Package](https://www.npmjs.com/package/vite-plugin-i18n-checker)