import stylelint from 'stylelint'

const {
  createPlugin,
  utils: { report, ruleMessages },
} = stylelint

// ---------------------------------------------------------------------------
// Custom rule: no-blur
// Catches blur() in any property value (filter, backdrop-filter, etc.)
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
// Custom rule: no-radial-angular-gradient
// Catches radial-gradient() and conic-gradient() in any property value.
// Only linear-gradient() is portable to React Native.
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
// Custom rule: no-hardcoded-colors
// Catches hex, rgb/rgba, hsl/hsla color values in CSS declarations.
// Colors must use CSS custom properties (var(--color-xxx)).
// ---------------------------------------------------------------------------
const noColorsName = 'animation-rules/no-hardcoded-colors'
const noColorsMessages = ruleMessages(noColorsName, {
  rejected:
    'Hardcoded color values are not allowed. Use CSS custom properties (var(--color-xxx)) or theme tokens instead.',
})

const noColorsRule = createPlugin(noColorsName, (primary) => {
  return (root, result) => {
    if (!primary) return

    // Properties where color values are meaningful
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
      // Skip values that only use custom properties
      if (/^var\(/.test(value) && !hexPattern.test(value) && !rgbPattern.test(value) && !hslPattern.test(value)) return
      // Skip transparent, currentColor, inherit, etc.
      if (/^(?:transparent|currentcolor|inherit|initial|unset|revert|none)$/i.test(value.trim())) return

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

export default {
  extends: ['stylelint-config-standard'],
  plugins: [noBlurRule, noRadialRule, noColorsRule],
  rules: {
    // Custom animation project rules
    [noBlurName]: true,
    [noRadialName]: true,
    [noColorsName]: true,

    // Disable rules that conflict with animation codebase conventions
    'no-descending-specificity': null,
    'no-duplicate-selectors': null,
    'selector-class-pattern': [
      '^[a-z][a-z0-9]*(-[a-z0-9]+)*(__[a-z][a-z0-9]*(-[a-z0-9]+)*)?(--[a-z][a-z0-9]*(-[a-z0-9]+)*)?$',
      { message: 'Class selectors must be lowercase-hyphenated BEM (e.g. "pf-modal--spring-bounce", "bfx-ripple__wave").' },
    ],
    'custom-property-empty-line-before': null,
    'declaration-empty-line-before': null,
    'rule-empty-line-before': null,
    'keyframes-name-pattern': null, // Animation keyframe names follow component conventions
    'import-notation': null, // CSS @import style is project choice
    'comment-empty-line-before': null,
    'custom-property-pattern': null, // Custom property names follow component conventions
  },
}
