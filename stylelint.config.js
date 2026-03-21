import stylelint from 'stylelint'

const {
  createPlugin,
  utils: { report, ruleMessages },
} = stylelint

// ===========================================================================
// CUSTOM RULES — project-specific + anti-AI-slop
// ===========================================================================

// ---------------------------------------------------------------------------
// no-blur: blur() is GPU-expensive and unsupported in React Native
// ---------------------------------------------------------------------------
const noBlurName = 'animation-rules/no-blur'
const noBlurMessages = ruleMessages(noBlurName, {
  rejected:
    'blur() is banned. It is not supported in React Native and is GPU-expensive on mobile. Use opacity or scale alternatives.',
})

const noBlurRule = createPlugin(noBlurName, (primary) => {
  return (root, result) => {
    if (!primary) return

    root.walkDecls((decl) => {
      if (/\bblur\s*\(/i.test(decl.value)) {
        report({
          message: noBlurMessages.rejected,
          node: decl,
          result,
          ruleName: noBlurName,
        })
      }
    })
  }
})

// ---------------------------------------------------------------------------
// no-radial-angular-gradient: only linear-gradient() is portable to RN
// ---------------------------------------------------------------------------
const noRadialName = 'animation-rules/no-radial-angular-gradient'
const noRadialMessages = ruleMessages(noRadialName, {
  rejected:
    'radial-gradient() and conic-gradient() are banned. Only linear-gradient() is portable to React Native.',
})

const noRadialRule = createPlugin(noRadialName, (primary) => {
  return (root, result) => {
    if (!primary) return

    root.walkDecls((decl) => {
      if (/\b(?:radial-gradient|conic-gradient)\s*\(/i.test(decl.value)) {
        report({
          message: noRadialMessages.rejected,
          node: decl,
          result,
          ruleName: noRadialName,
        })
      }
    })
  }
})

// ---------------------------------------------------------------------------
// no-hardcoded-colors: colors must use CSS custom properties or tokens
// ---------------------------------------------------------------------------
const noColorsName = 'animation-rules/no-hardcoded-colors'
const noColorsMessages = ruleMessages(noColorsName, {
  rejected:
    'Hardcoded color values are not allowed. Use CSS custom properties (var(--color-xxx)) or theme tokens instead.',
})

const noColorsRule = createPlugin(noColorsName, (primary) => {
  return (root, result) => {
    if (!primary) return

    const colorProperties = new Set([
      'color',
      'background-color',
      'background',
      'border-color',
      'border',
      'border-top-color',
      'border-right-color',
      'border-bottom-color',
      'border-left-color',
      'outline-color',
      'outline',
      'box-shadow',
      'text-shadow',
      'text-decoration-color',
      'fill',
      'stroke',
      'stop-color',
      'flood-color',
      'lighting-color',
      'column-rule-color',
      'caret-color',
      'accent-color',
    ])

    const hexPattern = /#(?:[0-9a-fA-F]{3,4}){1,2}(?!\w)/
    const rgbPattern = /\brgba?\s*\(/i
    const hslPattern = /\bhsla?\s*\(/i

    root.walkDecls((decl) => {
      if (!colorProperties.has(decl.prop)) return

      const value = decl.value
      if (
        /^var\(/.test(value) &&
        !hexPattern.test(value) &&
        !rgbPattern.test(value) &&
        !hslPattern.test(value)
      )
        return
      if (/^(?:transparent|currentcolor|inherit|initial|unset|revert|none)$/i.test(value.trim()))
        return

      if (hexPattern.test(value) || rgbPattern.test(value) || hslPattern.test(value)) {
        report({
          message: noColorsMessages.rejected,
          node: decl,
          result,
          ruleName: noColorsName,
        })
      }
    })
  }
})

// ---------------------------------------------------------------------------
// no-z-index-magic: z-index values above 100 are almost always AI slop.
// AI agents love z-index: 999 / 9999 / 99999. Use a design-token scale.
// ---------------------------------------------------------------------------
const noZIndexName = 'animation-rules/no-z-index-magic'
const noZIndexMessages = ruleMessages(noZIndexName, {
  rejected: (value) =>
    `z-index: ${value} is too high. Use values 1–100 or CSS custom properties. Magic z-index values (999, 9999) are a code smell.`,
})

const noZIndexRule = createPlugin(noZIndexName, (primary) => {
  return (root, result) => {
    if (!primary) return

    root.walkDecls('z-index', (decl) => {
      const value = decl.value.trim()
      // Allow CSS custom properties and calc()
      if (/^var\(/.test(value) || /^calc\(/.test(value)) return
      // Allow auto, inherit, initial, unset
      if (/^(?:auto|inherit|initial|unset|revert)$/i.test(value)) return

      const num = parseInt(value, 10)
      if (!Number.isNaN(num) && (num > 100 || num < -100)) {
        report({
          message: noZIndexMessages.rejected(value),
          node: decl,
          result,
          ruleName: noZIndexName,
        })
      }
    })
  }
})

// ---------------------------------------------------------------------------
// no-ignored-display-properties: catches property combos the browser ignores.
// AI agents frequently generate display:inline + width/height/vertical margins
// because they don't understand the box model.
// Replaces the unmaintained stylelint-declaration-block-no-ignored-properties
// plugin (incompatible with stylelint 17).
// ---------------------------------------------------------------------------
const noIgnoredName = 'animation-rules/no-ignored-display-properties'
const noIgnoredMessages = ruleMessages(noIgnoredName, {
  rejected: (ignored, cause) =>
    `"${ignored}" has no effect when "${cause}" is set. The browser silently ignores it — likely an AI-generated mistake.`,
})

const noIgnoredRule = createPlugin(noIgnoredName, (primary) => {
  // Map: display value → set of properties that are ignored with it
  const ignoredCombos = {
    inline: new Set([
      'width',
      'min-width',
      'max-width',
      'height',
      'min-height',
      'max-height',
      'margin-top',
      'margin-bottom',
      'overflow',
      'overflow-x',
      'overflow-y',
    ]),
    'table-row': new Set(['margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left']),
    'table-row-group': new Set([
      'margin',
      'margin-top',
      'margin-right',
      'margin-bottom',
      'margin-left',
    ]),
    'table-column': new Set([
      'margin',
      'margin-top',
      'margin-right',
      'margin-bottom',
      'margin-left',
      'padding',
      'padding-top',
      'padding-right',
      'padding-bottom',
      'padding-left',
    ]),
    'table-column-group': new Set([
      'margin',
      'margin-top',
      'margin-right',
      'margin-bottom',
      'margin-left',
      'padding',
      'padding-top',
      'padding-right',
      'padding-bottom',
      'padding-left',
    ]),
  }

  // position: static ignores top/right/bottom/left/z-index
  const staticIgnored = new Set(['top', 'right', 'bottom', 'left', 'z-index'])

  return (root, result) => {
    if (!primary) return

    root.walkRules((rule) => {
      const declMap = new Map()
      rule.walkDecls((decl) => {
        declMap.set(decl.prop.toLowerCase(), decl)
      })

      // Check display-based ignored properties
      const displayDecl = declMap.get('display')
      if (displayDecl) {
        const displayVal = displayDecl.value.trim().toLowerCase()
        const ignored = ignoredCombos[displayVal]
        if (ignored) {
          for (const prop of ignored) {
            const targetDecl = declMap.get(prop)
            if (targetDecl) {
              report({
                message: noIgnoredMessages.rejected(
                  `${prop}: ${targetDecl.value}`,
                  `display: ${displayVal}`
                ),
                node: targetDecl,
                result,
                ruleName: noIgnoredName,
              })
            }
          }
        }
      }

      // Check position: static with offset/z-index
      const positionDecl = declMap.get('position')
      if (positionDecl && positionDecl.value.trim().toLowerCase() === 'static') {
        for (const prop of staticIgnored) {
          const targetDecl = declMap.get(prop)
          if (targetDecl) {
            report({
              message: noIgnoredMessages.rejected(
                `${prop}: ${targetDecl.value}`,
                'position: static'
              ),
              node: targetDecl,
              result,
              ruleName: noIgnoredName,
            })
          }
        }
      }
    })
  }
})

// ---------------------------------------------------------------------------
// no-important-in-keyframes: !important inside @keyframes is always wrong.
// AI agents add it reflexively. Browsers silently ignore it in keyframes.
// ---------------------------------------------------------------------------
const noImportantKfName = 'animation-rules/no-important-in-keyframes'
const noImportantKfMessages = ruleMessages(noImportantKfName, {
  rejected:
    '!important inside @keyframes is silently ignored by browsers. Remove it — the animation will not behave as intended.',
})

const noImportantKfRule = createPlugin(noImportantKfName, (primary) => {
  return (root, result) => {
    if (!primary) return

    root.walkAtRules('keyframes', (atRule) => {
      atRule.walkDecls((decl) => {
        if (decl.important) {
          report({
            message: noImportantKfMessages.rejected,
            node: decl,
            result,
            ruleName: noImportantKfName,
          })
        }
      })
    })
  }
})

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
    noBlurRule,
    noRadialRule,
    noColorsRule,
    // Anti-AI-slop rules
    noZIndexRule,
    noIgnoredRule,
    noImportantKfRule,
    // Defensive CSS (catches missing defensive patterns AI agents skip)
    'stylelint-plugin-defensive-css',
  ],
  rules: {
    // =====================================================================
    // PROJECT-SPECIFIC RULES
    // =====================================================================
    [noBlurName]: true,
    [noRadialName]: true,
    [noColorsName]: true,

    // =====================================================================
    // ANTI-AI-SLOP: custom rules targeting common AI coding mistakes
    // =====================================================================
    [noZIndexName]: true,
    [noIgnoredName]: true,
    [noImportantKfName]: true,

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
})
