import { requireFramerClassSuffixRule } from './stylelint-rules/require-framer-class-suffix.js'
import { noBlurRule } from './stylelint-rules/no-blur.js'
import { noConicGradientRule } from './stylelint-rules/no-conic-gradient.js'
import { noHardcodedColorsRule } from './stylelint-rules/no-hardcoded-colors.js'
import { noZIndexMagicRule } from './stylelint-rules/no-z-index-magic.js'
import { noIgnoredDisplayPropertiesRule } from './stylelint-rules/no-ignored-display-properties.js'
import { noImportantInKeyframesRule } from './stylelint-rules/no-important-in-keyframes.js'

// ===========================================================================
// CONFIG INTEGRITY — prevents AI agents from downgrading errors to warnings
// ===========================================================================
function enforceNoWarnings(config) {
  const { rules } = config
  for (const [name, value] of Object.entries(rules)) {
    if (value === null || value === false) continue

    // severity: "warning" hidden in options object
    if (Array.isArray(value)) {
      for (const entry of value) {
        if (
          entry !== null &&
          typeof entry === 'object' &&
          !Array.isArray(entry) &&
          typeof entry.severity === 'string' &&
          entry.severity !== 'error'
        ) {
          throw new Error(
            `[stylelint-integrity] Rule "${name}" has severity "${entry.severity}". ` +
              'All rules must be errors. Downgrading to "warning" is prohibited — ' +
              'disable the rule (null) or fix the violation.'
          )
        }
      }
    }
  }
  return config
}

export default enforceNoWarnings({
  extends: ['stylelint-config-standard'],
  plugins: [
    // Project-specific rules
    requireFramerClassSuffixRule,
    noBlurRule,
    noConicGradientRule,
    noHardcodedColorsRule,
    // Anti-AI-slop rules
    noZIndexMagicRule,
    noIgnoredDisplayPropertiesRule,
    noImportantInKeyframesRule,
    // Defensive CSS (catches missing defensive patterns AI agents skip)
    'stylelint-plugin-defensive-css',
  ],
  rules: {
    // =====================================================================
    // PROJECT-SPECIFIC RULES
    // =====================================================================
    // Framer CSS class naming: -fm suffix required to prevent CSS variant bleed.
    // Disabled globally — enabled per-group via overrides as groups are migrated.
    'animation-rules/require-framer-class-suffix': null,
    'animation-rules/no-blur': true,
    'animation-rules/no-radial-angular-gradient': true,
    'animation-rules/no-hardcoded-colors': true,

    // =====================================================================
    // ANTI-AI-SLOP: custom rules targeting common AI coding mistakes
    // =====================================================================
    'animation-rules/no-z-index-magic': true,
    'animation-rules/no-ignored-display-properties': true,
    'animation-rules/no-important-in-keyframes': true,

    // =====================================================================
    // ANTI-AI-SLOP: built-in rules that catch AI-generated garbage
    // =====================================================================

    // AI agents spray !important everywhere to "fix" specificity issues
    // they created. Ban it outright — proper specificity solves real problems.
    'declaration-no-important': true,

    // AI generates deeply nested selectors (5-6 levels) because it doesn't
    // understand the cascade. 3 levels is enough for any component.
    'max-nesting-depth': [3, { ignoreAtRules: ['media', 'supports', 'container'] }],

    // AI loves ID selectors for "guaranteed specificity". IDs are for
    // fragments and JS hooks, never for styling. #root is the only exception.
    'selector-max-id': 0,

    // Cap specificity to prevent AI from writing selectors like
    // .a .b .c .d .e .f { } to brute-force cascade issues.
    'selector-max-compound-selectors': 4,

    // Limit universal selector usage. AI resets (* { box-sizing: ... })
    // belong in a global reset, not in component CSS.
    'selector-max-universal': 1,

    // AI generates excessive decimal precision (0.333333333333) from
    // calculator outputs. 4 digits is more than enough for any CSS value.
    'number-max-precision': 4,

    // Re-enable: AI copy-pastes the same selector block multiple times.
    'no-duplicate-selectors': true,

    // Catch AI-hallucinated CSS property values (display: flexbox, etc.)
    // This is a newer stylelint rule that validates values against the spec.
    'declaration-property-value-no-unknown': [
      true,
      {
        ignoreProperties: {
          // Tailwind utility classes use arbitrary values
          '/.*/': ['/--tw-.*/'],
        },
      },
    ],

    // =====================================================================
    // DEFENSIVE CSS PLUGIN — catches missing resilience patterns
    // =====================================================================

    // Disabled: animation components use flex for centering single
    // children — requiring flex-wrap is wrong for that pattern.
    'defensive-css/require-flex-wrap': null,

    // AI sets background-image but forgets background-repeat, causing
    // tiled backgrounds on larger viewports.
    'defensive-css/require-background-repeat': true,

    // AI sprinkles will-change on everything for "performance". Misuse
    // causes memory bloat and compositing bugs.
    'defensive-css/no-unsafe-will-change': true,

    // =====================================================================
    // TAILWIND / AT-RULE COMPATIBILITY
    // =====================================================================
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['plugin', 'source', 'theme'],
      },
    ],

    // =====================================================================
    // ANIMATION CODEBASE CONVENTIONS (intentional relaxations)
    // =====================================================================

    // Animation @keyframes use compact single-line blocks:
    //   0% { transform: scale(0); opacity: 0; }
    'declaration-block-single-line-max-declarations': null,

    // Component-scoped CSS legitimately uses descending specificity for
    // state overrides (.card .active after .card .inactive).
    'no-descending-specificity': null,

    // Enforce BEM-compatible class naming
    'selector-class-pattern': [
      '^[a-zA-Z][a-zA-Z0-9]*(-[a-zA-Z0-9]+)*(__[a-zA-Z][a-zA-Z0-9]*(-[a-zA-Z0-9]+)*)?(--[a-zA-Z0-9][a-zA-Z0-9-]*)?$',
      {
        message:
          'Class selectors must follow BEM structure. Kebab-case, camelCase blocks, and numeric modifiers (e.g. "--1") are allowed.',
      },
    ],

    // Formatting rules — project preference, not quality signals
    'custom-property-empty-line-before': null,
    'declaration-empty-line-before': null,
    'rule-empty-line-before': null,
    'comment-empty-line-before': null,

    // Animation keyframe and custom property names follow component conventions
    'keyframes-name-pattern': null,
    'custom-property-pattern': null,
    'import-notation': null,
  },
  overrides: [
    // Enforce -fm class suffix in migrated framer groups.
    // Enable per-group as CSS-free migration completes.
    // Enforce -fm suffix on framer CSS files that have been migrated.
    // Add group globs here as each group completes CSS-free migration.
    {
      files: [
        'src/components/base/button-effects/framer/ButtonEffectsRipple.css',
        'src/components/base/button-effects/framer/ButtonEffectsSplitReveal.css',
        'src/components/progress/progress-bars/framer/ProgressBarsProgressMilestones.css',
        'src/components/progress/progress-bars/framer/ProgressBarsTimelineProgress.css',
      ],
      rules: {
        'animation-rules/require-framer-class-suffix': true,
      },
    },
  ],
})
