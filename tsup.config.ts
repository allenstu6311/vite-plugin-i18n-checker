import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/bin/i18n-check.ts'],
  splitting: false,
  sourcemap: false,
  clean: true,
  dts: true,
  format: ['esm', 'cjs'],
  external: [/^@babel\//],
  env: {
    NODE_ENV: 'production',
  },
});