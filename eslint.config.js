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
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: {
        project: [
          './tsconfig.app.json',
          './tsconfig.node.json',
          './tsconfig.test.json',
          './tsconfig.e2e.json',
        ],
        tsconfigRootDir: import.meta.dirname,
      },
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
      'no-console': 'error',
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
      '@eslint-react/dom/no-dangerously-set-innerhtml': 'error',
      '@typescript-eslint/strict-boolean-expressions': [
        'error',
        {
          allowString: false,
          allowNumber: false,
          allowNullableObject: true,
          allowNullableBoolean: true,
          allowNullableString: true,
          allowNullableNumber: false,
          allowNullableEnum: false,
          allowAny: false,
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
      // E2E readiness: every UI component must have data-testid for stable selectors
      'animation-rules/require-data-testid': 'error',
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
    files: ['**/*.test.ts', '**/*.test.tsx', 'src/test/**/*.{ts,tsx}'],
    plugins: {
      'testing-library': testingLibrary,
    },
    rules: {
      'max-lines-per-function': 'off',
      // Test assertions and setup use truthiness idiomatically (e.g. expect(el).toBeTruthy())
      '@typescript-eslint/strict-boolean-expressions': 'off',
      'animation-rules/no-shallow-assertions': 'error',
      // vi.mock() factories define components/hooks inside functions — valid pattern
      '@eslint-react/component-hook-factories': 'off',

      // ─── Anti-slop: testing-library ──────────────────────────────────────
      ...testingLibrary.configs['flat/react'].rules,
      'testing-library/prefer-screen-queries': 'error',
      // Animation DOM structure tests legitimately use container queries to inspect
      // rendered CSS animation elements, keyframe states, and structural output.
      // These have no data-testid or ARIA equivalent.
      'testing-library/no-node-access': 'error',
      'testing-library/no-container': 'error',
      'testing-library/await-async-queries': 'error',
      'testing-library/prefer-find-by': 'error',
      'testing-library/prefer-presence-queries': 'error',
      // Timer-cleanup tests call cleanup() before vi.clearAllTimers() to ensure
      // deterministic unmount ordering. Vitest auto-cleanup order is not guaranteed
      // relative to user afterEach hooks.
      'testing-library/no-manual-cleanup': 'error',
      'testing-library/no-unnecessary-act': 'error',
      'testing-library/no-render-in-lifecycle': 'error',
      'testing-library/no-debugging-utils': 'error',
      'testing-library/prefer-explicit-assert': 'error',
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
      'animation-rules/no-hardcoded-colors': 'error',
      // Enforce category boundaries: animation components must not import across
      // categories (e.g. rewards/ importing from dialogs/ internals).
      'animation-rules/no-cross-category-imports': 'error',
      // Animation components legitimately use radial/conic gradients for visual
      // effects (glow, spotlight, ring progress). The portability rule is useful for
      // non-animation code but produces false positives here — 13 inline suppressions
      // existed prior to this override. Radial gradient portability to React Native
      // will be handled per-component during the native migration.
      'animation-rules/no-radial-angular-gradient': 'off',
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
      'animation-rules/no-hardcoded-colors': 'error',
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
  // Animation DOM structure tests: inspect BEM classes, data-animation-id,
  // CSS animation keyframe state, and structural parity between CSS/Framer variants.
  // These have no ARIA or data-testid equivalent — querySelector is the only
  // way to assert on class-based animation structure.
  {
    files: [
      'src/__tests__/all-animations.data-animation-id.test.tsx',
      'src/__tests__/modal-orchestration.*.test.tsx',
      'src/__tests__/text-effects.*.test.tsx',
      'src/__tests__/realtime-data.css-framer-parity.test.tsx',
      'src/__tests__/update-indicators.css-framer-parity.test.tsx',
      'src/__tests__/timer-effects.urgent-pulse.structure.test.tsx',
      'src/__tests__/utils/animationTestUtils.test.tsx',
      'src/test/utils/animationTestUtils.tsx',
      // UI tests that inspect structural DOM attributes (data-app-shell, hidden state)
      'src/__tests__/ui.mobile-header.test.tsx',
    ],
    rules: {
      'testing-library/no-node-access': 'off',
      'testing-library/no-container': 'off',
    },
  },
  // Timer-cleanup tests: assertNoLeakedTimersAfterUnmount handles render/unmount
  // internally; explicit cleanup() is removed. no-manual-cleanup stays at 'error'
  // globally. These tests use container queries to verify timer state after unmount.
  {
    files: [
      'src/__tests__/*timer-cleanup*.test.tsx',
      'src/__tests__/*raf-cleanup*.test.tsx',
      'src/__tests__/*restart-parity*.test.tsx',
      'src/__tests__/*timing-parity*.test.tsx',
      'src/__tests__/*restart-timeout-cleanup*.test.tsx',
      'src/__tests__/*timer-pulse.cleanup*.test.tsx',
      'src/__tests__/*timer-pulse.restart-parity*.test.tsx',
      'src/__tests__/*pill-countdown.timeout-cleanup*.test.tsx',
    ],
    rules: {
      'testing-library/no-node-access': 'off',
      'testing-library/no-container': 'off',
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
      '@typescript-eslint/strict-boolean-expressions': 'off',
      // Ban CSS class/ID selectors in locator() — use data-testid or aria-* instead
      'animation-rules/no-class-id-locators': 'error',
    },
  },
  // Animation-specific e2e tests: CSS class selectors are acceptable for testing
  // internal animation DOM structure (particles, milestones, characters) which has
  // no data-testid equivalent. These selectors are scoped within data-animation-id.
  {
    files: ['tests/e2e/animation-*.spec.ts'],
    rules: {
      'animation-rules/no-class-id-locators': 'off',
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
      'animation-rules/no-svg-in-motion': 'error',
      'animation-rules/no-default-export-in-animation': 'error',
    },
  },
  // Context providers export both Provider and hook — react-refresh false positive
  {
    files: ['src/contexts/**/*.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  // Animation helper/part components: not standalone animations, exempt from metadata/dual-impl rules
  {
    files: [
      'src/components/**/css/*Helpers.tsx',
      'src/components/**/css/*Parts.tsx',
      'src/components/**/css/*CardParts.tsx',
    ],
    rules: {
      'animation-rules/require-animation-metadata': 'off',
      'animation-rules/require-dual-implementation': 'off',
    },
  },
  // Color utility: raw color manipulation is the purpose of this module
  {
    files: ['src/utils/colors.ts'],
    rules: {
      'animation-rules/no-hardcoded-colors': 'off',
    },
  },
  // Asset index: centralized image import point (the rule's own intended exception)
  {
    files: ['src/assets/index.ts'],
    rules: {
      'animation-rules/no-direct-image-imports': 'off',
    },
  },
])
