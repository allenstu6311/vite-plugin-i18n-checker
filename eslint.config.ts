import unusedImports from "eslint-plugin-unused-imports";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig([
  ...tseslint.configs.recommended,
  {
    plugins: {
      "unused-imports": unusedImports,
    }
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      semi: ["error", "always"],
      "no-unused-vars": "off", // or "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        { "vars": "all", "varsIgnorePattern": "^_", "args": "after-used", "argsIgnorePattern": "^_" }
      ],
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
]);