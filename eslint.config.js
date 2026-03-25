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
      // Path alias enforcement: all src/ imports must use @/ not ../
      'animation-rules/no-relative-parent-imports': 'error',
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
      'animation-rules/no-implicit-demo-block-styles': 'error',
      'animation-rules/no-unstyled-interactive-elements': 'error',
      'animation-rules/no-excessive-z-index': 'error',
      // E2E readiness: every UI component must have data-testid for stable selectors
      'animation-rules/require-data-testid': 'error',
      // Copy-paste portability: every .meta.ts must declare a tier
      'animation-rules/require-portability-tier': 'error',
      // Copy-paste portability: ban position: fixed in animation components
      'animation-rules/no-position-fixed': 'error',
    },
  },
  // Source code quality gates: line limits and default export ban.
  // Config files (vite, vitest, playwright, etc.) are exempt since
  // their APIs require default exports.
  {
    files: ['**/*.js', '**/*.ts', '**/*.tsx'],
    ignores: ['**/*.config.js', '**/*.config.cjs', '**/*.config.mjs', '**/*.config.ts'],
    rules: {
      // Project convention: all exports are named. Default exports break groupBuilder resolution
      // and make imports less grep-able.
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ExportDefaultDeclaration',
          message:
            'Default exports are banned. Use named exports: `export const X = ...` or `export function X()`. Config files are exempt.',
        },
      ],
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
          max: 85,
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

      // ─── Ban .skip abuse + default exports + text queries ─────────────────
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ExportDefaultDeclaration',
          message:
            'Default exports are banned. Use named exports: `export const X = ...` or `export function X()`.',
        },
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
        {
          selector: 'CallExpression[callee.property.name=/ByText$/]',
          message:
            'Do not query by text content — use getByTestId/queryByTestId with data-testid attributes instead. Text changes frequently and makes tests brittle.',
        },
        {
          selector: 'CallExpression[callee.name=/ByText$/]',
          message:
            'Do not query by text content — use getByTestId/queryByTestId with data-testid attributes instead. Text changes frequently and makes tests brittle.',
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
      // Animation files may exceed the global 500-line limit but are capped at 450
      // (skip blanks + comments). Components beyond this should extract config,
      // hooks, or sub-components into a sibling *Config.ts or *Parts.tsx file.
      'max-lines': ['error', { max: 450, skipBlankLines: true, skipComments: true }],
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
      // Copy-paste portability: imports must respect declared tier budget
      'animation-rules/tier-dependency-budget': 'error',
      // Copy-paste portability: Tier 1-2 CSS must have var() fallbacks.
      // Warn until existing CSS files are fixed with fallback values or reclassified to tier 2+.
      'animation-rules/require-css-var-fallback': 'warn',
      // Image import portability is enforced by tier-dependency-budget (tier 2-3
      // bans @/assets, tier 4 unrestricted). The generic no-direct-image-imports
      // rule creates false positives for tier 4 animations that legitimately
      // require project-specific imagery (prize reveals, celebrations, etc.).
      'animation-rules/no-direct-image-imports': 'off',
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
      'src/components/**/*Config.ts',
      'src/components/**/FlipCard*.tsx',
    ],
    rules: {
      'jsdoc/require-jsdoc': 'off',
      // Helper files share the same embedded-color leniency as animation components
      'animation-rules/no-hardcoded-colors': 'error',
      // Mock files mix component and function exports — react-refresh false positive
      'react-refresh/only-export-components': 'off',
      // Group helper files are the group-level asset management layer — they import
      // from @/assets/ (the centralized system) and re-export to animation components.
      // Banning direct image imports here would force an unmanageable index.ts with 100+ exports.
      'animation-rules/no-direct-image-imports': 'off',
    },
  },
  // Shared computation files at group root: trajectory generators, physics models,
  // type bundles. These contain pure mathematical functions computing animation
  // keyframes — same exempt status as animation components for line limits.
  {
    files: [
      'src/components/**/Shared*.ts',
      'src/components/**/Shared*.tsx',
      'src/components/**/*Trajectory.ts',
    ],
    rules: {
      'max-lines-per-function': 'off',
      'max-lines': ['error', { max: 600, skipBlankLines: true, skipComments: true }],
    },
  },
  // Logger test: logger.debug() triggers false positive from testing-library/no-debugging-utils
  // which targets screen.debug()/prettyDOM(). The logger's .debug() method is unrelated.
  {
    files: ['src/__tests__/services.logger.test.ts'],
    rules: {
      'testing-library/no-debugging-utils': 'off',
    },
  },
  // ErrorBoundary test: AsyncThrower intentionally calls setState in useEffect to verify
  // that ErrorBoundary catches state-update-triggered render errors. The pattern is the
  // test subject, not a mistake.
  {
    files: ['src/__tests__/components.ErrorBoundary.test.tsx'],
    rules: {
      '@eslint-react/set-state-in-effect': 'off',
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
      'src/__tests__/realtime-data.live-score-behavior.test.tsx',
      'src/__tests__/utils/animationTestUtils.test.tsx',
      'src/test/utils/animationTestUtils.tsx',
      // Focus trap tests require document.activeElement — no Testing Library equivalent
      'src/__tests__/hooks.useModalAccessibility.test.tsx',
      // Modal lifecycle integration test: focus trap assertions require document.activeElement
      'src/__tests__/integration.modal-lifecycle.test.tsx',
      // Portability tests: inspect CSS custom property values on animation root elements
      'src/__tests__/animation-portability-fixes.test.tsx',
      'src/__tests__/dialogs.modal-base-scale-gentle-pop-parity.test.tsx',
      // Timer pill color tests: inspect CSS custom properties for urgency phase colors
      'src/__tests__/timer-effects.pill-countdown-color-props.test.tsx',
      // UI card/panel tests: inspect rendered DOM structure and CSS variable wiring
      'src/__tests__/ui.animation-card.test.tsx',
      'src/__tests__/ui.editor-right-panel.test.tsx',
      // Demo-UI tests: inspect popover positioning, toggle group indicator styling
      'src/__tests__/demo-ui.popover.test.tsx',
      'src/__tests__/demo-ui.toggle-group.test.tsx',
      // Component behavioral tests: particle count, label presence, CSS custom properties
      'src/__tests__/component-behavior.test.tsx',
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
  // Tests requiring explicit cleanup() for deterministic ordering:
  // - App.test.tsx / hooks.usePreviewModal.test.ts: cleanup() must run BEFORE
  //   _resetScrollLockState() so useEffect unmount decrements lockCount first.
  // - all-animations.data-animation-id.test.tsx: 170+ lazy components in one suite
  //   require explicit cleanup per test to prevent memory accumulation.
  // - integration.modal-lifecycle.test.tsx: cleanup() must run BEFORE
  //   _resetScrollLockState() for deterministic scroll lock ordering.
  {
    files: [
      'src/__tests__/App.test.tsx',
      'src/__tests__/all-animations.data-animation-id.test.tsx',
      'src/__tests__/hooks.usePreviewModal.test.ts',
      'src/__tests__/integration.modal-lifecycle.test.tsx',
    ],
    rules: {
      'testing-library/no-manual-cleanup': 'off',
    },
  },
  // E2E test fixtures: Playwright's `use()` is not a React hook
  {
    files: ['tests/e2e/**/*.ts'],
    rules: {
      // e2e files live outside src/ and have no @/ alias in their tsconfig —
      // cross-fixture relative imports (e.g. ../page-objects/Foo) are legitimate here.
      'animation-rules/no-relative-parent-imports': 'off',
      '@eslint-react/rules-of-hooks': 'off',
      'jsdoc/require-jsdoc': 'off',
      // E2E describe blocks are inherently long — tests are sequential user flows
      'max-lines-per-function': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      // E2E tests use color name strings ('cyan', 'magenta') as accent/theme
      // identifiers in test data — not as hardcoded color values in UI code.
      'animation-rules/no-hardcoded-colors': 'off',
      // Ban CSS class/ID selectors in locator() — use data-testid or aria-* instead
      'animation-rules/no-class-id-locators': 'error',
      // Ban waitForTimeout() — flaky arbitrary delays. Use condition-based waits.
      'animation-rules/no-waitfor-timeout': 'error',
      // Ban flaky click targets (getByText, getByRole) — use getByTestId or data-testid locators
      'animation-rules/no-flaky-click-selectors': 'error',
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
  // AnimationInspectorContext uses setState-in-effect to synchronize animated preview
  // values and clear stale selections when the active group changes. These are standard
  // React "sync state with props" patterns, not unnecessary re-renders.
  {
    files: ['src/contexts/AnimationInspectorContext.tsx'],
    rules: {
      '@eslint-react/set-state-in-effect': 'off',
    },
  },
  // CSS button-effects use cloneElement to inject animation classes directly onto
  // the consumer's element — a wrapper div would break the "apply this class to your
  // element" consumer model. cloneElement is the correct pattern here.
  {
    files: ['src/components/base/button-effects/css/*.tsx'],
    rules: {
      '@eslint-react/no-clone-element': 'off',
    },
  },
  // Demo-ui components: self-contained UI kit with dense JSX layouts
  // (dropdown positioning, input styling, tooltip logic). max-lines-per-function
  // at 75 is too restrictive for properly-formatted React component JSX.
  // DropdownMenuItems additionally uses useLayoutEffect for portal positioning
  // (measure DOM rect → set position state) which is the standard React pattern.
  {
    files: ['src/demo-ui/**/*.{ts,tsx}'],
    rules: {
      'max-lines-per-function': [
        'error',
        { max: 120, skipBlankLines: true, skipComments: true, IIFEs: true },
      ],
    },
  },
  {
    files: ['src/demo-ui/components/ui/DropdownMenuItems.tsx'],
    rules: {
      '@eslint-react/set-state-in-effect': 'off',
    },
  },
  // SharedTimer: useLayoutEffect synchronously rebases countdown state on prop change
  // to prevent a flash of stale values before paint. useCardControls: mount-only DOM
  // probe resolves a CSS variable to hex via getComputedStyle.
  {
    files: [
      'src/components/realtime/timer-effects/SharedTimer.ts',
      'src/components/ui/useCardControls.ts',
    ],
    rules: {
      '@eslint-react/set-state-in-effect': 'off',
    },
  },
  // Layout store: theme/accent identifiers (e.g. 'dark-purple', 'cyan') are
  // data-attribute values mapped to CSS token sets, not color values applied to DOM.
  {
    files: ['src/demo-ui/stores/layoutStore.ts'],
    rules: {
      'animation-rules/no-hardcoded-colors': 'off',
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
  // Color utilities: raw color values are the purpose of these modules
  {
    files: [
      'src/utils/colors.ts',
      'src/components/**/SharedParticleUtils.ts',
      'src/components/**/SharedDefaults.ts',
      'src/components/**/SharedCelebrationTypes.ts',
      'src/components/**/SharedFallbackCoin.tsx',
    ],
    rules: {
      'animation-rules/no-hardcoded-colors': 'off',
    },
  },
  // Settings panel UI: hex values are form input defaults (color picker fallbacks),
  // not hardcoded animation styling. Meta prop defaults are consumer-facing values.
  {
    files: ['src/components/ui/PropField.tsx', 'src/components/**/*.meta.ts'],
    rules: {
      'animation-rules/no-hardcoded-colors': 'off',
    },
  },
  // Color picker: hue spectrum gradient and SV area use fixed HSL/hex values
  // that define the color wheel itself — no theme token can replace them.
  // Color utilities: raw color values are the purpose of these modules.
  {
    files: ['src/demo-ui/components/ui/ColorPicker.tsx', 'src/demo-ui/lib/colors/**/*.ts'],
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
