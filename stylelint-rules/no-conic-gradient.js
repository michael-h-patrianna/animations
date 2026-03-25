import stylelint from 'stylelint'

const {
  createPlugin,
  utils: { report, ruleMessages },
} = stylelint

/**
 * no-conic-gradient: conic-gradient() is not portable to React Native.
 * radial-gradient() is allowed (available via RN package).
 */
const ruleName = 'animation-rules/no-radial-angular-gradient'
const messages = ruleMessages(ruleName, {
  rejected:
    'conic-gradient() is banned — not portable to React Native. Use linear-gradient() or radial-gradient() instead.',
})

export const noConicGradientRule = createPlugin(ruleName, (primary) => {
  return (root, result) => {
    if (!primary) return

    root.walkDecls((decl) => {
      if (/\bconic-gradient\s*\(/i.test(decl.value)) {
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
