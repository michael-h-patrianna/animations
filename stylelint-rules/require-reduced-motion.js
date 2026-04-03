import stylelint from 'stylelint'

const {
  createPlugin,
  utils: { report, ruleMessages },
} = stylelint

/**
 * require-reduced-motion: any CSS file that defines @keyframes must also
 * contain a @media (prefers-reduced-motion: reduce) block.
 *
 * This catches missing accessibility handling for CSS animations. Framer
 * variants handle reduced motion via JS (useReducedMotion), so this rule
 * is scoped to css/*.module.css via overrides.
 */
const ruleName = 'animation-rules/require-reduced-motion'
const messages = ruleMessages(ruleName, {
  rejected:
    'File defines @keyframes but has no @media (prefers-reduced-motion: reduce) block. ' +
    'CSS animations must respect prefers-reduced-motion for accessibility (WCAG 2.3.3).',
})

export const requireReducedMotionRule = createPlugin(ruleName, (primary) => {
  return (root, result) => {
    if (!primary) return

    let hasKeyframes = false
    let hasReducedMotion = false
    /** @type {import('postcss').AtRule | null} */
    let firstKeyframes = null

    root.walkAtRules((atRule) => {
      if (atRule.name === 'keyframes' && !hasKeyframes) {
        hasKeyframes = true
        firstKeyframes = atRule
      }
      if (atRule.name === 'media' && /prefers-reduced-motion\s*:\s*reduce/.test(atRule.params)) {
        hasReducedMotion = true
      }
    })

    if (hasKeyframes && !hasReducedMotion && firstKeyframes) {
      report({
        message: messages.rejected,
        node: firstKeyframes,
        result,
        ruleName,
      })
    }
  }
})
