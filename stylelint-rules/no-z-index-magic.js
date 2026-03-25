import stylelint from 'stylelint'

const {
  createPlugin,
  utils: { report, ruleMessages },
} = stylelint

/**
 * no-z-index-magic: z-index values above 100 are almost always AI slop.
 * AI agents love z-index: 999 / 9999 / 99999. Use a design-token scale.
 */
const ruleName = 'animation-rules/no-z-index-magic'
const messages = ruleMessages(ruleName, {
  rejected: (value) =>
    `z-index: ${value} is too high. Use values 1–100 or CSS custom properties. Magic z-index values (999, 9999) are a code smell.`,
})

export const noZIndexMagicRule = createPlugin(ruleName, (primary) => {
  return (root, result) => {
    if (!primary) return

    root.walkDecls('z-index', (decl) => {
      const value = decl.value.trim()
      if (/^var\(/.test(value) || /^calc\(/.test(value)) return
      if (/^(?:auto|inherit|initial|unset|revert)$/i.test(value)) return

      const num = parseInt(value, 10)
      if (!Number.isNaN(num) && (num > 100 || num < -100)) {
        report({
          message: messages.rejected(value),
          node: decl,
          result,
          ruleName,
        })
      }
    })
  }
})
