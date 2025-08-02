import { defineConfig } from 'vite'
import i18nCheckerPlugin from './src/plugin'
import path from 'path'

export default defineConfig({
  plugins: [
    i18nCheckerPlugin({
        source: 'zh_CN',
        path: 'locale/single',
        recursive: true,
        extensions: 'ts',
        mode: 'single',
        lang: 'zh_CN',
        // ignore: ['en_US', 'zh_CN'],
        // autoFill: true,
        // autoDelete: true,
    }),
    {
      name: 'test',
      buildEnd() {
        console.log('the end')
      }
    }
  ],
})