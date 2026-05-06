import stylelint from 'stylelint'

import { stripVarFallbacks } from '../eslint-rules/strip-var-fallbacks.js'

const {
  createPlugin,
  utils: { report, ruleMessages },
} = stylelint

/**
 * no-hardcoded-colors: colors must use CSS custom properties or tokens.
 */
const ruleName = 'animation-rules/no-hardcoded-colors'
const messages = ruleMessages(ruleName, {
  rejected:
    'Hardcoded color values are not allowed. Use CSS custom properties (var(--color-xxx)) or theme tokens instead.',
})

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

export const noHardcodedColorsRule = createPlugin(ruleName, (primary) => {
  return (root, result) => {
    if (!primary) return

    root.walkDecls((decl) => {
      if (!colorProperties.has(decl.prop)) return

      const value = decl.value
      if (/^(?:transparent|currentcolor|inherit|initial|unset|revert|none)$/i.test(value.trim()))
        return

      const stripped = stripVarFallbacks(value)
      if (hexPattern.test(stripped) || rgbPattern.test(stripped) || hslPattern.test(stripped)) {
        report({
          message: messages.rejected,
          node: decl,
          result,
          ruleName,
        })
      }
    })
  }
})
