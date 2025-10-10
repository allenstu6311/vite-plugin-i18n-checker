import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/index.ts'],
    splitting: false,
    sourcemap: true,
    clean: true,
    dts: true,
    format: ['cjs', 'esm'],
    // external: [
    //   "@babel/core",
    //   "@babel/traverse",
    //   "@babel/types",
    //   "debug",
    //   /^@babel\//,   // ← 把所有 @babel/* 依賴都丟出去
    //   /^debug($|\/)/
    // ]
    external: [/^@babel\//],
    
  })