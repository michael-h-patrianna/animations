import stylelint from 'stylelint'

const {
  createPlugin,
  utils: { report, ruleMessages },
} = stylelint

/**
 * no-ignored-display-properties: catches property combos the browser ignores.
 * AI agents frequently generate display:inline + width/height/vertical margins
 * because they don't understand the box model.
 * Replaces the unmaintained stylelint-declaration-block-no-ignored-properties
 * plugin (incompatible with stylelint 17).
 */
const ruleName = 'animation-rules/no-ignored-display-properties'
const messages = ruleMessages(ruleName, {
  rejected: (ignored, cause) =>
    `"${ignored}" has no effect when "${cause}" is set. The browser silently ignores it — likely an AI-generated mistake.`,
})

/** Map: display value -> set of properties that are ignored with it */
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

/** position: static ignores top/right/bottom/left/z-index */
const staticIgnored = new Set(['top', 'right', 'bottom', 'left', 'z-index'])

export const noIgnoredDisplayPropertiesRule = createPlugin(ruleName, (primary) => {
  return (root, result) => {
    if (!primary) return

    root.walkRules((rule) => {
      const declMap = new Map()
      rule.walkDecls((decl) => {
        declMap.set(decl.prop.toLowerCase(), decl)
      })

      const displayDecl = declMap.get('display')
      if (displayDecl) {
        const displayVal = displayDecl.value.trim().toLowerCase()
        const ignored = ignoredCombos[displayVal]
        if (ignored) {
          for (const prop of ignored) {
            const targetDecl = declMap.get(prop)
            if (targetDecl) {
              report({
                message: messages.rejected(
                  `${prop}: ${targetDecl.value}`,
                  `display: ${displayVal}`
                ),
                node: targetDecl,
                result,
                ruleName,
              })
            }
          }
        }
      }

      const positionDecl = declMap.get('position')
      if (positionDecl && positionDecl.value.trim().toLowerCase() === 'static') {
        for (const prop of staticIgnored) {
          const targetDecl = declMap.get(prop)
          if (targetDecl) {
            report({
              message: messages.rejected(`${prop}: ${targetDecl.value}`, 'position: static'),
              node: targetDecl,
              result,
              ruleName,
            })
          }
        }
      }
    })
  }
})
