import js from '@eslint/js'
import eslintReact from '@eslint-react/eslint-plugin'
import eslintConfigPrettier from 'eslint-config-prettier'
import jsdoc from 'eslint-plugin-jsdoc'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

import testingLibrary from 'eslint-plugin-testing-library'

import { rules as animationRuleDefinitions } from './eslint-rules/animation-rules.js'

/** Inline plugin wrapping the extracted animation rule definitions. */
const animationRulesPlugin = { rules: animationRuleDefinitions }

export default defineConfig([
  globalIgnores(['dist', 'coverage', '.claude', '.agents']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      eslintReact.configs.recommended,
      reactRefresh.configs.vite,
      eslintConfigPrettier,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      jsdoc,
      'animation-rules': animationRulesPlugin,
    },
    rules: {
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
      // Allow _-prefixed variables to signal intentional discard (e.g. const [_unused, setSomething])
      '@typescript-eslint/no-unused-vars': [
        'error',
        { varsIgnorePattern: '^_', argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
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
      'animation-rules/no-unstyled-interactive-elements': 'error',
      'animation-rules/no-excessive-z-index': 'error',
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
  // Test files: exempt from function length limits, enforce assertion quality
  {
    files: ['**/*.test.ts', '**/*.test.tsx'],
    plugins: {
      'testing-library': testingLibrary,
    },
    rules: {
      'max-lines-per-function': 'off',
      'animation-rules/no-shallow-assertions': 'error',
      // vi.mock() factories define components/hooks inside functions — valid pattern
      '@eslint-react/component-hook-factories': 'off',

      // ─── Anti-slop: testing-library ──────────────────────────────────────
      ...testingLibrary.configs['flat/react'].rules,
      'testing-library/prefer-screen-queries': 'error',
      // Animation DOM structure tests legitimately use container queries to inspect
      // rendered CSS animation elements, keyframe states, and structural output.
      // These have no data-testid or ARIA equivalent.
      'testing-library/no-node-access': 'warn',
      'testing-library/no-container': 'warn',
      'testing-library/await-async-queries': 'error',
      'testing-library/prefer-find-by': 'error',
      'testing-library/prefer-presence-queries': 'error',
      // Timer-cleanup tests call cleanup() before vi.clearAllTimers() to ensure
      // deterministic unmount ordering. Vitest auto-cleanup order is not guaranteed
      // relative to user afterEach hooks.
      'testing-library/no-manual-cleanup': 'warn',
      'testing-library/no-unnecessary-act': 'error',
      'testing-library/no-render-in-lifecycle': 'error',
      'testing-library/no-debugging-utils': 'warn',
      'testing-library/prefer-explicit-assert': 'warn',
      // render-result-naming-convention off — non-component helpers use render() too
      'testing-library/render-result-naming-convention': 'off',

      // ─── Ban .skip abuse ─────────────────────────────────────────────────
      'no-restricted-syntax': [
        'error',
        {
          selector: 'CallExpression[callee.object.name="it"][callee.property.name="skip"]',
          message: 'No it.skip — fix or remove the test.',
        },
        {
          selector: 'CallExpression[callee.object.name="test"][callee.property.name="skip"]',
          message: 'No test.skip — fix or remove the test.',
        },
        {
          selector: 'CallExpression[callee.object.name="describe"][callee.property.name="skip"]',
          message: 'No describe.skip — fix or remove the test suite.',
        },
      ],
    },
  },
  {
    files: ['eslint-rules/**/*.js'],
    rules: {
      'max-lines-per-function': 'off',
    },
  },
  // Animation components: static arrays (character splits, particle lists) never reorder
  {
    files: ['src/components/**/css/**/*.{ts,tsx}', 'src/components/**/framer/**/*.{ts,tsx}'],
    rules: {
      '@eslint-react/no-array-index-key': 'off',
      // Animation components use the "collect-then-forEach" cleanup pattern:
      //   const timers = [setTimeout(fn1, d1), ...]
      //   return () => timers.forEach(id => clearTimeout(id))
      // @eslint-react/web-api/no-leaked-timeout cannot statically trace this idiom
      // and produces false positives on all array-collected timeouts. Real tracking
      // bugs (setTimeout result not captured at all) are caught as "must be assigned"
      // violations at authoring time, which ARE flagged in non-animation files.
      '@eslint-react/web-api/no-leaked-timeout': 'off',
      // Animation components intentionally call setState synchronously in mount-only
      // effects to fire the initial animation cue (e.g. setAnimationKey(k+1) to
      // trigger the first keyframe cycle). This is a deliberate design pattern —
      // the alternative (lazy initializer) cannot handle side effects like
      // setInterval/IntersectionObserver-triggered state. All occurrences here
      // are in [] dep effects so there is no infinite-loop risk.
      '@eslint-react/set-state-in-effect': 'off',
      // Animation render functions are JSX-heavy by design: each variant requires
      // DOM structure, inline motion props, and keyframe data co-located for clarity.
      // Splitting into sub-components would create artificial decomposition with no
      // reuse value and would break the self-contained component contract.
      'max-lines-per-function': 'off',
      // Animation files may exceed the global 500-line limit but are capped at 400
      // (skip blanks + comments). Components beyond this should extract config,
      // hooks, or sub-components into a sibling *Config.ts or *Parts.tsx file.
      'max-lines': ['error', { max: 400, skipBlankLines: true, skipComments: true }],
      // Embedded colors in compound CSS values (box-shadow, gradient strings) are
      // caught by the stricter Literal handler. Warn (not error) in animation dirs
      // to flag for migration without breaking CI on 50+ pre-existing occurrences.
      'animation-rules/no-hardcoded-colors': 'warn',
      // Animation components are documented through co-located .meta.ts files
      // (title, description, tags) which are the canonical documentation source.
      // Requiring JSDoc on these components produces empty /** */ stubs with no value.
      'jsdoc/require-jsdoc': 'off',
    },
  },
  // Animation helper files (shared parts, mock content, models) at group root
  {
    files: [
      'src/components/**/Mock*.tsx',
      'src/components/**/*Parts.tsx',
      'src/components/**/*Components.tsx',
      'src/components/**/fireworkModel.ts',
      'src/components/**/utils.ts',
      'src/components/**/cardSets.ts',
    ],
    rules: {
      'jsdoc/require-jsdoc': 'off',
      // Helper files share the same embedded-color leniency as animation components
      'animation-rules/no-hardcoded-colors': 'warn',
    },
  },
  // Timer test utils: components intentionally leak timers to test the leak detector
  {
    files: ['src/__tests__/utils/timerTestUtils.test.tsx'],
    rules: {
      '@eslint-react/web-api/no-leaked-timeout': 'off',
      '@eslint-react/web-api/no-leaked-interval': 'off',
    },
  },
  // E2E test fixtures: Playwright's `use()` is not a React hook
  {
    files: ['tests/e2e/**/*.ts'],
    rules: {
      '@eslint-react/rules-of-hooks': 'off',
      'jsdoc/require-jsdoc': 'off',
      // E2E describe blocks are inherently long — tests are sequential user flows
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
      'animation-rules/no-default-export-in-animation': 'error',
    },
  },
])
