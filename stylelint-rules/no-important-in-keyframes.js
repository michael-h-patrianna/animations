import stylelint from 'stylelint'

const {
  createPlugin,
  utils: { report, ruleMessages },
} = stylelint

/**
 * no-important-in-keyframes: !important inside @keyframes is always wrong.
 * AI agents add it reflexively. Browsers silently ignore it in keyframes.
 */
const ruleName = 'animation-rules/no-important-in-keyframes'
const messages = ruleMessages(ruleName, {
  rejected:
    '!important inside @keyframes is silently ignored by browsers. Remove it — the animation will not behave as intended.',
})

export const noImportantInKeyframesRule = createPlugin(ruleName, (primary) => {
  return (root, result) => {
    if (!primary) return

    root.walkAtRules('keyframes', (atRule) => {
      atRule.walkDecls((decl) => {
        if (decl.important) {
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
