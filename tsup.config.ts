import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/index.ts', 'src/bin/i18n-check.ts'],
    splitting: false,
    sourcemap: true,
    clean: true,
    dts: true,
    format: ['cjs', 'esm'],
    external: [/^@babel\//],
    // banner: {
    //   js: '#!/usr/bin/env node'
    // }
  })