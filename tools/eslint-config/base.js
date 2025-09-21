import js from "@eslint/js"
import eslintConfigPrettier from "eslint-config-prettier"
import onlyWarn from "eslint-plugin-only-warn"
import turboPlugin from "eslint-plugin-turbo"
import tseslint from "typescript-eslint"
import globals from "globals"

export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        ...globals.browser,
        ...globals.es2022,
        ...globals.node
      }
    },
    rules: {
      // TypeScript specific rules
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-empty-interface": "off",

      // General code quality
      "no-console": "warn",
      "no-debugger": "error",
      "no-duplicate-imports": "error",
      "no-unused-expressions": "error",
      "prefer-const": "error",
      "no-var": "error",
    },
    settings: {
      react: {
        version: "detect"
      }
    }
  },
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
    },
  },
  {
    plugins: {
      onlyWarn,
    },
  },
  {
    ignores: ["dist/**"],
  }];