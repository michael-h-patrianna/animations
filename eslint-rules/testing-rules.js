import { basename, sep } from 'node:path'

import { getFilename } from './rule-helpers.js'

/** Files in src/components/ui/ that are generic primitives using ...props spread. */
const UI_PRIMITIVES = new Set(['card', 'button', 'button-variants'])

const testingRules = {
  /**
   * Require data-testid on UI components in src/components/ui/.
   * Ensures e2e tests and AI agents can use stable selectors.
   * Skips primitives (card.tsx, button.tsx) that forward props via spread.
   */
  'require-data-testid': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Every UI component in src/components/ui/ must include a data-testid attribute for stable e2e test selectors.',
      },
      schema: [],
    },
    create(context) {
      const filename = getFilename(context)
      if (!filename.endsWith('.tsx')) return {}
      if (!filename.includes(`${sep}components${sep}ui${sep}`)) return {}
      // Skip icon components — presentational SVGs with no interactive surface
      if (filename.includes(`${sep}icons${sep}`)) return {}
      const base = basename(filename, '.tsx')
      if (base.endsWith('.test') || base.endsWith('.spec')) return {}
      if (UI_PRIMITIVES.has(base)) return {}

      let found = false
      return {
        JSXAttribute(node) {
          if (node.name?.name === 'data-testid') {
            found = true
          }
        },
        'Program:exit'() {
          if (!found) {
            context.report({
              loc: { line: 1, column: 0 },
              message:
                'Missing data-testid attribute. Every UI component in src/components/ui/ must include data-testid on key elements for stable e2e test selectors.',
            })
          }
        },
      }
    },
  },

  /**
   * Ban CSS class (.) and ID (#) selectors in e2e test locator() calls.
   * Forces AI agents and developers to use data-testid, data-animation-id,
   * or aria-* selectors which are resilient to styling refactors.
   */
  'no-class-id-locators': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Disallow CSS class and ID selectors in Playwright locator() calls. Use data-testid or aria-* selectors instead.',
      },
      schema: [],
    },
    create(context) {
      const filename = getFilename(context)
      if (!filename.includes(`${sep}e2e${sep}`)) return {}

      // Matches selectors starting with . (CSS class) or # (ID)
      const flakyPattern = /^[.#]/

      return {
        CallExpression(node) {
          if (node.callee?.type !== 'MemberExpression') return
          if (node.callee.property?.name !== 'locator') return
          if (node.arguments.length === 0) return

          const arg = node.arguments[0]
          let value

          if (arg.type === 'Literal' && typeof arg.value === 'string') {
            value = arg.value
          } else if (arg.type === 'TemplateLiteral' && arg.quasis.length > 0) {
            value = arg.quasis[0].value.raw
          }

          if (value && flakyPattern.test(value)) {
            context.report({
              node: arg,
              message: `Flaky selector "${value.length > 40 ? value.slice(0, 40) + '…' : value}". Use [data-testid="..."], [data-animation-id="..."], or [aria-*] selectors instead of CSS class/ID selectors.`,
            })
          }
        },
      }
    },
  },
}

export { testingRules }
