import stylelint from 'stylelint'
import path from 'node:path'

const {
  createPlugin,
  utils: { report, ruleMessages },
} = stylelint

/**
 * require-framer-class-suffix: CSS files inside framer/ directories must use
 * -fm suffixed class names (e.g. pf-ripple-fm, not pf-ripple) to prevent
 * style bleed from CSS variant stylesheets that share the same class names.
 *
 * Both variants' CSS is loaded into the same document in the catalog. Without
 * distinct class names, CSS variant animation/transition rules bleed into
 * framer variant elements after a mode switch (CSS persists in DOM after
 * component unmount).
 */
const ruleName = 'animation-rules/require-framer-class-suffix'
const messages = ruleMessages(ruleName, {
  rejected: (className) =>
    `Framer variant class ".${className}" must end with "-fm" suffix (e.g. ".${className}-fm") to prevent CSS bleed from the CSS variant.`,
})

export const requireFramerClassSuffixRule = createPlugin(ruleName, (primary) => {
  return (root, result) => {
    if (!primary) return

    // Only apply to CSS files inside framer/ directories
    const filePath = root.source?.input?.file ?? ''
    const parts = filePath.split(path.sep)
    const framerIdx = parts.lastIndexOf('framer')
    if (framerIdx === -1) return

    root.walkRules((rule) => {
      // Skip rules inside @media (reduced-motion etc.) — they mirror the main rules
      if (rule.parent?.type === 'atrule' && rule.parent?.name === 'keyframes') return

      // Extract class selectors from the rule
      const classPattern = /\.(pf-[a-zA-Z0-9_-]+)/g
      let match
      while ((match = classPattern.exec(rule.selector)) !== null) {
        const className = match[1]
        // Must end with -fm (block), -fm__element (element), or -fm--modifier
        // Regex: the "fm" suffix must appear as the last segment of the block name
        // Valid: pf-ripple-fm, pf-ripple-fm__overlay, pf-ripple-fm--active
        // Invalid: pf-ripple, pf-ripple__overlay, pf-ripple--active
        const hasFmSuffix = /^pf-[a-zA-Z0-9-]+-fm(__[a-zA-Z0-9-]+)?(--[a-zA-Z0-9-]+)?$/.test(
          className
        )
        if (!hasFmSuffix) {
          report({
            message: messages.rejected(className),
            node: rule,
            word: `.${className}`,
            result,
            ruleName,
          })
        }
      }
    })
  }
})
