import { defineConfig } from 'vite'
import i18nCheckerPlugin from './src/plugin'
import path from 'path'


export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/parser': path.resolve(__dirname, './src/parser'),
      '@/types': path.resolve(__dirname, './src/types'),
    },
  },
  plugins: [
    // i18nCheckerPlugin({
    //     source: 'zh_CN',
    //     path: 'locale/multi',
    //     extensions: 'ts',
    //     outputLang: 'zh_CN',
    // }),
      i18nCheckerPlugin({
        source: 'zh_CN',
        localesPath: 'locale/single',
        // recursive: true,
        extensions: 'ts',
        outputLang: 'zh_CN',
    }),
    // i18nCheckerPlugin({
    //   source: 'zh_CN',
    //   localesPath: 'locale/yml',
    //   extensions: 'yml',
    //   outputLang: 'zh_CN',
    //   failOnError: false,
    // }),
    {
      name: 'test',
      buildEnd() {
        console.log('the end')
      }
    }
  ],
})