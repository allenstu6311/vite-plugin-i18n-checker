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
- ⚡ **Flexible Execution Mode** - Choose to run during development or build
- 📊 **HTML Reports** - Generate beautiful HTML reports with two-level collapsible structure and automatic pagination
- 📈 **Report History** - Save historical reports by timestamp with configurable auto-cleanup strategy
- 🚫 **File & Key Filtering** - Support include/exclude patterns for filtering files and keys
- ⚙️ **Custom Rules** - Define custom validation rules for advanced use cases
- 🛠️ **CLI Tool** - Supports command-line tool for CI environments

### 🎯 Check Types

- **Missing Keys** - Missing translation keys
- **Extra Keys** - Redundant translation keys
- **Invalid Keys** - Keys with mismatched structure types (data type mismatch, array length mismatch)
- **Missing Files** - Missing language files
- **Empty Files** - Empty language files

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Vite Plugin](#vite-plugin)
  - [CLI Tool](#cli-tool)
- [Configuration](#configuration)
- [HTML Reports](#html-reports)
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
      failOnError: false,           // Whether to interrupt on error (optional)
      report: {                     // Report configuration (optional)
        dir: 'i18CheckerReport',    // Report output directory
        retention: 7                // Report retention days
      }
    })
  ]
})
```

### CLI Tool

```bash
npx i18n-check -s zh_CN -p ./src/locales -x json
```

#### CLI Options

**`--sourceLocale, -s`** (Required)
Define base language code, all target files will be compared against this language.

```bash
npx i18n-check -s zh_CN -p ./src/locales -x json
```

**`--localesPath, -p`** (Required)
Define language files directory path.

```bash
npx i18n-check -s zh_CN -p ./src/locales -x json
```

**`--extensions, -x`** (Required)
Define file extensions to check.

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

**`--include`**
Include specific file patterns (supports multiple patterns).

```bash
npx i18n-check -s zh_CN -p ./src/locales -x json --include "**/common/**"
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
    check: ({ source, target, key, pathStack }) => key === 'theme',
    msg: 'Theme key is not allowed in translations'
  },
  {
    abnormalType: 'emptyValue',
    check: ({ source, target, key, pathStack }) => target[key] === '',
    msg: 'Translation values cannot be empty'
  }
];
```

**`--report-dir <path>`**
Set report output directory.

```bash
npx i18n-check -s zh_CN -p ./src/locales -x json --report-dir checkReport
```

**`--report-retention <days>`**
Set report retention days (auto-cleanup expired reports).

```bash
npx i18n-check -s zh_CN -p ./src/locales -x json --report-retention 7
```

**`-w, --watch`**
Watch file changes and automatically re-check when files are modified.

```bash
npx i18n-check -s zh_CN -p ./src/locales -x json -w
```

## Configuration

| Parameter | Type | Default | Required | Description |
|-----------|------|---------|----------|-------------|
| `sourceLocale` | `string` | - | ✅ | Base language code (e.g., `zh_CN`) |
| `localesPath` | `string` | - | ✅ | Root directory path for language files |
| `extensions` | `SupportedParserType` | `'json'` | ✅ | Supported file extensions (`json`, `ts`, `js`, `yml`, `yaml`) |
| `failOnError` | `boolean` | `false` | ❌ | Whether to interrupt on error |
| `applyMode` | `'serve' \| 'build' \| 'all'` | `'serve'` | ❌ | Plugin execution mode (development/build/all) |
| `include` | `(string \| RegExp)[]` | `[]` | ❌ | File patterns to include |
| `exclude` | `(string \| RegExp)[]` | `[]` | ❌ | File patterns to ignore |
| `ignoreKeys` | `(string \| RegExp)[]` | `[]` | ❌ | Key patterns to ignore |
| `rules` | `CustomRule[]` | `[]` | ❌ | Custom validation rules |
| `watch` | `boolean` | `false` | ❌ | Whether to watch file changes |
| `report` | `ReportOptions` | `{ dir: 'i18CheckerReport', retention: 7 }` | ❌ | Report configuration |

### ReportOptions

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `dir` | `string` | `'i18CheckerReport'` | Report output directory |
| `retention` | `number` | `7` | Report retention days (auto-cleanup) |

### CustomRule

```typescript
type CustomRule = {
  abnormalType: string;                     // Custom anomaly type name
  check: (ctx: CollectAbnormalKeysParam) => boolean;  // Check function
  msg?: string;                            // Error message (optional)
}

// Check function parameters
type CollectAbnormalKeysParam = {
  source: any;        // Source language object
  target: any;        // Target language object
  key: string;        // Current key being checked
  pathStack: string[]; // Array of keys representing the current path
}
```

## HTML Reports

The plugin automatically generates beautiful HTML reports for better visualization.

### Report Features

- 📋 **Two-level Collapsible Structure** - First level by anomaly type, second level by file grouping
- 📄 **Automatic Pagination** - Automatically paginate when a single file has more than 20 issues
- 🎨 **Beautiful Styling** - GitHub + Playwright mixed design style
- 🕐 **Historical Records** - Save each check result by timestamp
- 🗑️ **Auto-cleanup** - Automatically clean up expired reports based on `retention` configuration

### Report Directory Structure

```
i18CheckerReport/           # Report root directory (configurable)
└── 2026-02-15/            # Grouped by date
    ├── 09-30-00/          # Timestamp directory
    │   └── index.html
    ├── 10-15-30/
    │   └── index.html
    └── 14-20-45/
        └── index.html
```

### Configuration Example

```typescript
i18nChecker({
  sourceLocale: 'zh_CN',
  localesPath: './src/locales',
  extensions: 'json',
  report: {
    dir: 'checkReport',    // Custom report directory
    retention: 30          // Keep reports for 30 days
  }
})
```

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
      run: npx i18n-check --sourceLocale zh_CN --localesPath ./src/locales --extensions json
```

## Advanced Usage

### Custom Rules

The `check` function receives a context object with the following properties:
- `source`: Source language object
- `target`: Target language object
- `pathStack`: Array of keys representing the current path
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
      check: ({ source, target, pathStack, key }) => key === 'theme',
      msg: 'Theme key is not allowed in translations'
    },
    {
      abnormalType: 'emptyValue',
      check: ({ source, target, pathStack, key }) => target[key] === '',
      msg: 'Translation values cannot be empty'
    },
    {
      abnormalType: 'nestedCheck',
      check: ({ source, target, pathStack, key }) => {
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
  // Only include specific files
  include: [
    '**/common/**',         // Only check common directory
    '**/auth/**'            // Only check auth directory
  ],
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

### Basic Configuration

```typescript
i18nChecker({
  sourceLocale: 'zh_CN',
  localesPath: './src/locales',
  extensions: 'ts',
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

### Watch File Changes

```typescript
// Enable watch mode - automatically re-check when files change
i18nChecker({
  sourceLocale: 'zh_CN',
  localesPath: './src/locales',
  extensions: 'json',
  watch: true,      // Automatically check when translation files are modified
})

// Disable watch mode - only check once during startup (default)
i18nChecker({
  sourceLocale: 'zh_CN',
  localesPath: './src/locales',
  extensions: 'json',
  watch: false,     // Disable automatic re-checking
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

### Complete Configuration Example

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
      msg: 'Translation values cannot be empty'
    }
  ]
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

## 📊 Error Report Examples

### CLI Report

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

### HTML Report

HTML reports provide better visual experience:
- Collapsible panels grouped by anomaly type
- Second-level collapsible grouping by file
- Automatic pagination for more than 20 items
- Support click to expand/collapse

After checking is complete, the report will be output to the configured directory, and the terminal will display the report path:
```
Please check the detailed report at "/path/to/your/project/i18CheckerReport"
```

## Development

### Project Structure

```
src/
├── abnormal/          # Anomaly detection and processing
├── bin/               # CLI entry point
├── checker/           # File comparison logic
├── config/            # Configuration management
├── errorHandling/     # Error handling and messages
├── helpers/           # Helper functions
├── parser/            # File parsers
├── report/            # Report generation
│   └── abnormalKey/   # Abnormal key reports
│       ├── cli-renderer.ts   # CLI report rendering
│       ├── html-renderer.ts  # HTML report rendering
│       ├── index.ts          # Report coordinator
│       └── types.ts          # Report type definitions
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
- [Issues](https://github.com/allenstu6311/vite-plugin-i18n-checker/issues)
