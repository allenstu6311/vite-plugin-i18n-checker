/// <reference types="vitest" />
import dotenv from 'dotenv';
import path from 'path';
import { defineConfig } from 'vite';
import i18nCheckerPlugin from './src';

dotenv.config({ path: '.env' });

export default defineConfig({
  test: {
    setupFiles: ['./test/setup.ts'],
    exclude: ['**/node_modules/**'],
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
    //   applyMode: 'serve',
    //   sync: {
    //     autoFill: true,
    //     autoDelete: true,
    //     // override: true,
    //     // useAI:{},
    //     useAI: {
    //       localeRules: {
    //         '**/en_US.ts': 'en_US',
    //       },
    //       apiKey: process.env.GEMINI_API_KEY || '',
    //       provider: 'gemini',
    //     }
    //   },
    //   failOnError: false,
    //   report: {
    //     retention: 1
    //   }
    //   // sync: {
    //   //   // useAI: {
    //   //   //   apiKey: process.env.OPENAI_API_KEY || '',
    //   //   //   provider: 'openai',
    //   //   // }
    //   //   useAI: {
    //   //     apiKey: process.env.GEMINI_API_KEY || '',
    //   //     provider: 'gemini',
    //   //   }
    //   // },
    //   // watch: false
    //   // sync: true
    //   // sync: {
    //   //   useAI: {
    //   //     apiKey: process.env.GEMINI_API_KEY || '',
    //   //     provider: 'gemini',
    //   //     localeRules: {
    //   //       '**/en_US.ts': 'en_US',
    //   //       // '**/zh_TW.ts': 'zh_TW',
    //   //     },
    //   //   },
    //   //   // override: true
    //   // },

    // }),
    // i18nCheckerPlugin({
    //   sourceLocale: 'en_US',
    //   localesPath: 'locale/stressTest',
    //   extensions: 'js',
    //   // failOnError: true,
    //   // applyMode: 'serve',
    //   // sync: {
    //   //   // useAI: {
    //   //   //   apiKey: process.env.OPENAI_API_KEY || '',
    //   //   //   provider: 'openai',
    //   //   // }
    //   //   useAI: {
    //   //     apiKey: process.env.GEMINI_API_KEY || '',
    //   //     provider: 'gemini',
    //   //   }
    //   // },
    //   exclude: [
    //     '**/zh_CN.js',
    //     '**/km_KH.js',
    //     // '**/vi_VN.js',
    //     '**/es_ES.js',
    //     '**/en_US.js',
    //     '**/ja_JP.js',
    //     '**/km_KH.js',
    //     '**/ko_KR.js',
    //     '**/el_GR.js',
    //     '**/pt_PT.js',
    //   ],
    //   watch: false,
    //   sync: true,
    // // i18nCheckerPlugin({
    // //   sourceLocale: 'zh_CN',
    // //   localesPath: 'locale/multi',
    // //   extensions: 'ts',
    // //   // failOnError: true,
    // //   applyMode: 'serve',
    // //   sync: {
    // //     // useAI: {
    // //     //   apiKey: process.env.GEMINI_API_KEY || '',
    // //     //   provider: 'gemini',
    // //     // },
    // //     useAI: {
    // //       apiKey: process.env.OPENAI_API_KEY || '',
    // //       provider: 'openai',
    // //     },
    // //     localeRules: {
    // //       '**/en_US/**': 'en_US',
    // //       'locale/multi/**': 'es_ES',
    // //       // '**/zh_CN/**': 'zh_CN',
    // //     }
    // //   }
    // }),
    // i18nCheckerPlugin({
    //   sourceLocale: 'zh_CN',
    //   localesPath: 'locale/json',
    //   extensions: 'json',
    //   failOnError: false,
    //   applyMode: 'serve',
    //   sync: {
    //     // useAI: {
    //     //   // apiKey: process.env.OPENAI_API_KEY || '',
    //     //   // provider: 'openai',
    //     //   apiKey: process.env.GEMINI_API_KEY || '',
    //     //   provider: 'gemini',
    //     // },
    //     // localeRules: {
    //     //   '**/en_US.json': 'en_US',
    //     //   '**/es_ES.json': 'es_ES',
    //     // },
    //     override: false      }
    // }),
    // i18nCheckerPlugin({
    //   sourceLocale: 'zh_CN',
    //   localesPath: 'locale/yml',
    //   extensions: 'yml',
    //   // failOnError: true,
    //   applyMode: 'serve',
    //   sync: {
    //     // useAI: {
    //     //   apiKey: process.env.OPENAI_API_KEY || '',
    //     //   provider: 'openai',
    //     // }
    //     localeRules: {
    //       '**/en_US.yml': 'en_US',
    //     },
    //     useAI: {
    //       apiKey: process.env.GEMINI_API_KEY || '',
    //       provider: 'gemini',
    //     }
    //   },
    // }),
  ],
});