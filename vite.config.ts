/// <reference types="vitest" />
import { defineConfig } from 'vite'
import i18nCheckerPlugin from './src'
import path from 'path'


export default defineConfig({
  test: {
    setupFiles: ['./test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    // i18nCheckerPlugin({
    //   sourceLocale: 'zh_CN',
    //   localesPath: 'locale/single',
    //   extensions: 'ts',
    //   errorLocale: 'zh_CN',
    //   failOnError: true,
    //   applyMode: 'serve',
    // }),
    // i18nCheckerPlugin({
    //   sourceLocale: 'zh_CN',
    //   localesPath: 'locale/multi',
    //   extensions: 'ts',
    //   // errorLocale: 'zh_CN',
    //   failOnError: true,
    //   applyMode: 'serve',
    // }),
    i18nCheckerPlugin({
      sourceLocale: 'zh_CN',
      localesPath: 'locale/json',
      extensions: 'json',
      errorLocale: 'zh_CN',
      failOnError: true,
      applyMode: 'serve',
    }),
  ],
})