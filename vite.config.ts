/// <reference types="vitest" />
import path from 'path';
import { defineConfig } from 'vite';
import i18nCheckerPlugin from './src';


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
    //   failOnError: true,
    //   applyMode: 'serve',
    // }),
    // i18nCheckerPlugin({
    //   sourceLocale: 'zh_CN',
    //   localesPath: 'locale/multi',
    //   extensions: 'ts',
    //   failOnError: true,
    //   applyMode: 'serve',
    // }),
    i18nCheckerPlugin({
      sourceLocale: 'zh_CN',
      localesPath: 'locale/json',
      extensions: 'json',
      failOnError: true,
      applyMode: 'serve',
      report:{
        retention: 1
      }
    }),
  ],
});