import stylelint from 'stylelint'

const {
  createPlugin,
  utils: { report, ruleMessages },
} = stylelint

/**
 * no-blur: blur() inside @keyframes is GPU-expensive and not portable to RN.
 * Static blur (filter/backdrop-filter on a class) is allowed as subtle polish
 * that can be omitted on mobile native without visual breakage.
 */
const ruleName = 'animation-rules/no-blur'
const messages = ruleMessages(ruleName, {
  rejected:
    'blur() inside @keyframes is banned — GPU-expensive on mobile and not portable to React Native. Static blur on classes is allowed.',
})

export const noBlurRule = createPlugin(ruleName, (primary) => {
  return (root, result) => {
    if (!primary) return

    root.walkAtRules('keyframes', (atRule) => {
      atRule.walkDecls((decl) => {
        if (/\bblur\s*\(/i.test(decl.value)) {
          report({
            message: messages.rejected,
            node: decl,
            result,
            ruleName,
          })
        }
      })
    })
  }
})
