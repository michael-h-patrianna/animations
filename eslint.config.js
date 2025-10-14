import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
      eslintConfigPrettier,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // TODO: Install eslint-plugin-jsdoc and enable JSDoc linting
      // 'jsdoc/require-jsdoc': ['warn', {
      //   publicOnly: true,
      //   require: {
      //     FunctionDeclaration: true,
      //     ClassDeclaration: true,
      //   }
      // }],
      // 'jsdoc/require-param': 'warn',
      // 'jsdoc/require-returns': 'warn',
    },
  },
])
