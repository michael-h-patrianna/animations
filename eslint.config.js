import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import jsdoc from 'eslint-plugin-jsdoc'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

import { rules as animationRuleDefinitions } from './eslint-rules/animation-rules.js'

/** Inline plugin wrapping the extracted animation rule definitions. */
const animationRulesPlugin = { rules: animationRuleDefinitions }

export default defineConfig([
  globalIgnores(['dist', '.claude', '.agents']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactRefresh.configs.vite,
      eslintConfigPrettier,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      jsdoc,
      'react-hooks': reactHooks,
      'animation-rules': animationRulesPlugin,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'jsdoc/require-jsdoc': [
        'error',
        {
          publicOnly: true,
          contexts: [
            'FunctionDeclaration',
            'ClassDeclaration',
            'TSInterfaceDeclaration',
            'TSTypeAliasDeclaration',
          ],
          require: {
            FunctionDeclaration: true,
            ClassDeclaration: true,
            ArrowFunctionExpression: false,
            FunctionExpression: false,
          },
        },
      ],
      'jsdoc/require-param': 'off',
      'jsdoc/require-returns': 'off',
      '@typescript-eslint/no-restricted-types': [
        'error',
        {
          types: {
            'NodeJS.Timeout': {
              message:
                'Use ReturnType<typeof setTimeout> instead — NodeJS namespace is unavailable in browser builds.',
              suggest: ['ReturnType<typeof setTimeout>'],
            },
            'NodeJS.Timer': {
              message:
                'Use ReturnType<typeof setTimeout> instead — NodeJS namespace is unavailable in browser builds.',
              suggest: ['ReturnType<typeof setTimeout>'],
            },
          },
        },
      ],
      // Existing animation portability rules
      'animation-rules/no-hardcoded-colors': 'error',
      'animation-rules/no-direct-image-imports': 'error',
      'animation-rules/no-blur-animation': 'error',
      'animation-rules/no-radial-angular-gradient': 'error',
      'animation-rules/require-animation-metadata': 'error',
      'animation-rules/require-dual-implementation': 'error',
      // New portability rules (all animation files)
      'animation-rules/no-viewport-units': 'error',
      'animation-rules/no-important': 'error',
      'animation-rules/require-data-animation-id': 'error',
    },
  },
  {
    files: ['**/*.js', '**/*.ts', '**/*.tsx'],
    ignores: ['**/*.config.js', '**/*.config.cjs', '**/*.config.mjs'],
    rules: {
      'max-lines': [
        'error',
        {
          max: 500,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      'max-lines-per-function': [
        'error',
        {
          max: 75,
          skipBlankLines: true,
          skipComments: true,
          IIFEs: true,
        },
      ],
    },
  },
  // Test files are exempt from function length limits — describe blocks need cohesion
  {
    files: ['**/*.test.ts', '**/*.test.tsx'],
    rules: {
      'max-lines-per-function': 'off',
    },
  },
  // Motion (framer/) variants: no CSS animations + RN-portable constraints
  {
    files: ['src/components/**/framer/**/*.{ts,tsx}'],
    rules: {
      'animation-rules/no-css-animations-in-motion': 'error',
      'animation-rules/no-css-animations-in-framer': 'error',
      'animation-rules/no-non-portable-styles': 'error',
      'animation-rules/no-css-grid-in-motion': 'error',
      'animation-rules/no-calc-in-motion': 'error',
      'animation-rules/no-svg-in-motion': 'warn',
    },
  },
])
