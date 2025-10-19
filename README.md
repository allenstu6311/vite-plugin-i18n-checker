# vite-plugin-i18n-checker

[![npm version](https://img.shields.io/npm/v/vite-plugin-i18n-checker.svg)](https://www.npmjs.com/package/vite-plugin-i18n-checker)
[![npm version](https://img.shields.io/npm/dt/vite-plugin-i18n-checker.svg)](https://www.npmjs.com/package/vite-plugin-i18n-checker)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

[English](README.md) | [中文](README.zh-CN.md)

## 📖 Project Introduction

This is a **Vite plugin** for checking multi-language files in projects, ensuring key completeness and consistency across different language versions. It supports multiple file formats and flexible directory structures, helping developers maintain i18n translation file quality.

### ✨ Key Features

- 🔍 **Automatic Checking** - Automatically compares key structures across language files
- 📁 **Multi-format Support** - Supports `.json`, `.yml`, `yaml`, `.ts`, `.js` formats
- 🏗️ **Flexible Structure** - Supports both single-file and multi-file directory structures
- 🌍 **Multi-language Error Messages** - Supports Chinese and English error prompts
- ⚡ **Flexible Execution Mode** - Choose to run during development or build
- 📊 **Detailed Reports** - Tabular display of missing, extra, and invalid keys
- 🚫 **File & Key Filtering** - Ignore specific files and keys during checking
- ⚙️ **Custom Rules** - Define custom validation rules for advanced use cases
- 🛠️ **CLI Tool** - Supports command-line tool for CI environments

### 🎯 Check Types

- **Missing Keys** - Missing translation keys
- **Extra Keys** - Redundant translation keys  
- **Invalid Keys** - Keys with mismatched structure types
- **Missing Files** - Missing language files

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Vite Plugin](#vite-plugin)
  - [CLI Options](#cli-options)
- [Configuration](#configuration)
- [Supported File Structures](#supported-file-structures)
  - [Single File Mode](#single-file-mode)
  - [Multi-file Mode](#multi-file-mode)
- [CI Integration](#ci-integration)
  - [GitHub Actions](#github-actions)
- [Advanced Usage](#advanced-usage)
  - [Custom Rules](#custom-rules)
  - [File Filtering](#file-filtering)
- [Examples](#examples)
- [Development](#development)
- [Links](#links)

## Installation

```bash
npm install -D vite-plugin-i18n-checker
# or
yarn add -D vite-plugin-i18n-checker
# or
pnpm add -D vite-plugin-i18n-checker
```

## Usage

### Vite Plugin

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

### CLI Options

**`--sourceLocale, -s`**
Define base language code, all target files will be compared against this language. **Required**

```bash
npx i18n-check -s zh_CN -p ./src/locales -x json
```

**`--localesPath, -p`**
Define language files directory path. **Required**

```bash
npx i18n-check -s zh_CN -p ./src/locales -x json
```

**`--extensions, -x`**
Define file extensions to check. **Required**

```bash
npx i18n-check -s zh_CN -p ./src/locales -x json
```

**`--failOnError, -f`**
Whether to interrupt execution when errors are found.

```bash
npx i18n-check -s zh_CN -p ./src/locales -x json -f
```

**`--applyMode, -m`**
Set execution mode (serve/build/all).

```bash
npx i18n-check -s zh_CN -p ./src/locales -x json -m build
```

**`--exclude, -e`**
Ignore specific file patterns (supports multiple patterns).

```bash
npx i18n-check -s zh_CN -p ./src/locales -x json -e "**/test/**" "**/*.spec.*"
```

**`--ignoreKeys, -i`**
Ignore specific key patterns (supports multiple patterns).

```bash
npx i18n-check -s zh_CN -p ./src/locales -x json -i "common.debug" "unused.*"
```

**`--rules, -r`**
Custom validation rules file path (JavaScript/TypeScript file).

```bash
npx i18n-check -s zh_CN -p ./src/locales -x json -r "./custom-rules.mjs"
```

Rules file format example:

```javascript
// custom-rules.mjs
export default [
  {
    abnormalType: 'forbiddenKey',
    check: ({ source, target, key, pathStack, indexStack }) => key === 'theme',
    msg: 'Theme key is not allowed in translations'
  },
  {
    abnormalType: 'emptyValue',
    check: ({ source, target, key, pathStack, indexStack }) => target[key] === '',
    msg: 'Translation values cannot be empty'
  }
];
```

**`--errorLocale, -l`**
Set error message display language.

```bash
npx i18n-check -s zh_CN -p ./src/locales -x json -l zh_CN
```

**`--no-watch`**
Do not watch file changes.

```bash
npx i18n-check -s zh_CN -p ./src/locales -x json --no-watch
```

## Configuration

| Parameter | Type | Default | Required | Description |
|-----------|------|---------|----------|-------------|
| `sourceLocale` | `string` | - | ✅ | Base language code (e.g., `zh_CN`) |
| `localesPath` | `string` | - | ✅ | Root directory path for language files |
| `extensions` | `SupportedParserType` | `'json'` | ✅ | Supported file extensions (e.g., `json`, `ts`, `yml`) |
| `errorLocale` | `'zh_CN' \| 'en_US'` | `'en_US'` | ❌ | Error message display language |
| `failOnError` | `boolean` | `true` | ❌ | Whether to interrupt development server on error |
| `applyMode` | `'serve' \| 'build' \| 'all'` | `'serve'` | ❌ | Plugin execution mode (development/build/all) |
| `exclude` | `(string \| RegExp)[]` | `[]` | ❌ | Files to ignore during checking |
| `ignoreKeys` | `string[]` | `[]` | ❌ | Keys to ignore during checking |
| `rules` | `CustomRule[]` | `[]` | ❌ | Custom validation rules: `{abnormalType: string, check: (source, target, pathStack, indexStack, key) => boolean, msg?: string}[]` |

## Supported File Structures

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

## CI Integration

### GitHub Actions

Create workflow in `.github/workflows/i18n-check.yml`:

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
      run: npx i18n-check --sourceLocale zh_CN --localesPath ./src/locales --extensions json --failOnError true
```

## Advanced Usage

### Custom Rules

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

### File Filtering

```typescript
i18nChecker({
  sourceLocale: 'zh_CN',
  localesPath: './src/locales',
  extensions: 'json',
  // Ignore specific files
  exclude: [
    '**/test/**',           // Ignore all files in test directories
    /\.spec\./,             // Ignore files with .spec. in name
    'temp.json'             // Ignore specific file
  ],
  // Ignore specific keys
  ignoreKeys: [
    'common.debug',         // Ignore debug keys
    'unused'                // Ignore specific key
  ]
})
```

## Examples

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

// Run in both build and development mode
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

## Development

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

# Lint code
pnpm lint
```

## Links

- [GitHub Repository](https://github.com/allenstu6311/vite-plugin-i18n-checker)
- [NPM Package](https://www.npmjs.com/package/vite-plugin-i18n-checker)