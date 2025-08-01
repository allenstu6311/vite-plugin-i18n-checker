import { defineConfig } from 'vite'
import i18nCheckerPlugin from './src/plugin'
import path from 'path'

export default defineConfig({
  plugins: [
    i18nCheckerPlugin({
        source: 'zh_CN',
        path: 'locale',
        recursive: true,
        extensions: 'ts',
        mode: 'directory',
        lang: 'zh_CN',
        // ignore: ['en_US', 'zh_CN'],
        // autoFill: true,
        // autoDelete: true,
    }),
  ],
})