import { defineConfig } from 'tsup';

const shared = {
  splitting: false,
  sourcemap: false,
  external: [/^@babel\//],
  env: {
    NODE_ENV: 'production',
  },
};

export default defineConfig([
  {
    ...shared,
    entry: ['src/index.ts'],
    clean: true,
    dts: true,
    format: ['esm', 'cjs'],
  },
  {
    ...shared,
    entry: ['src/bin/i18n-check.ts'],
    dts: false,
    format: ['esm'],
    banner: {
      js: '#!/usr/bin/env node',
    },
  },
]);
