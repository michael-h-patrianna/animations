import { basename, sep } from 'node:path'

import { getFilename } from './rule-helpers.js'

/** Files in src/components/ui/ that are generic primitives using ...props spread. */
const UI_PRIMITIVES = new Set(['card', 'button', 'button-variants'])

/** Matchers where expect.any() is meaningful as an asymmetric argument. */
const ASYMMETRIC_MATCHER_NAMES = new Set([
  'toHaveBeenCalledWith',
  'toEqual',
  'toMatchObject',
  'toHaveBeenLastCalledWith',
  'toHaveBeenNthCalledWith',
  'toStrictEqual',
  'objectContaining',
  'arrayContaining',
])

/** Query methods that produce flaky locators when used as .click() targets. */
const FLAKY_QUERY_METHODS = new Set([
  'getByText',
  'getByRole',
  'getByLabelText',
  'getByPlaceholderText',
  'getByAltText',
  'getByTitle',
])

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
  /**
   * Ban shallow test matchers that assert existence/type but not correctness.
   * These catch zero real bugs:
   *   - toBeDefined, toBeTruthy, toBeFalsy, toBeUndefined
   *   - expect(typeof x), expect(Array.isArray), expect(!!x)
   *   - expect.any() as a standalone assertion (allowed as asymmetric matcher)
   *   - toBeInstanceOf, toHaveProperty(key) without value
   *   - toBeGreaterThan(0), not.toHaveLength(0)
   */
  'no-shallow-assertions': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Disallow shallow test matchers that assert existence or type instead of correctness.',
      },
      schema: [],
    },
    create(context) {
      const MSG =
        'Shallow useless test. Delete test! Do not try to rewrite it just to make it pass. It is fundamentally useless.'
      const SHALLOW_MATCHERS = {
        toBeDefined: true,
        toBeTruthy: true,
        toBeFalsy: true,
        toBeUndefined: true,
      }

      function findExpectCall(node) {
        let obj = node.callee.object
        while (obj.type === 'CallExpression' && obj.callee.type === 'MemberExpression') {
          obj = obj.callee.object
        }
        if (obj.type === 'MemberExpression' && obj.property.name === 'not') {
          obj = obj.object
        }
        if (
          obj.type === 'CallExpression' &&
          obj.callee.type === 'Identifier' &&
          obj.callee.name === 'expect'
        ) {
          return obj
        }
        return null
      }

      function isGetByQuery(node) {
        if (!node || node.type !== 'CallExpression') return false
        const callee = node.callee
        const methodName =
          callee.type === 'MemberExpression'
            ? callee.property?.name
            : callee.type === 'Identifier'
              ? callee.name
              : null
        return typeof methodName === 'string' && /^getBy/.test(methodName)
      }

      /** True when expect.any() is used as an argument inside a matcher call. */
      function isInsideAsymmetricMatcher(node) {
        let ancestor = node.parent
        while (ancestor) {
          if (
            ancestor.type === 'CallExpression' &&
            ancestor.callee?.type === 'MemberExpression' &&
            ASYMMETRIC_MATCHER_NAMES.has(ancestor.callee.property?.name)
          ) {
            return true
          }
          ancestor = ancestor.parent
        }
        return false
      }

      return {
        CallExpression(node) {
          // 1. Block expect(typeof x), expect(Array.isArray), expect(!!x),
          //    expect(x !== null), expect(el.tagName).
          if (node.callee.type === 'Identifier' && node.callee.name === 'expect') {
            const arg = node.arguments[0]
            if (arg) {
              if (arg.type === 'UnaryExpression' && arg.operator === 'typeof') {
                context.report({ node, message: MSG })
              }
              if (
                arg.type === 'CallExpression' &&
                arg.callee.type === 'MemberExpression' &&
                arg.callee.object.name === 'Array' &&
                arg.callee.property.name === 'isArray'
              ) {
                context.report({ node, message: MSG })
              }
              if (arg.type === 'UnaryExpression' && arg.operator === '!') {
                context.report({ node, message: MSG })
              }
              if (arg.type === 'CallExpression' && arg.callee.name === 'Boolean') {
                context.report({ node, message: MSG })
              }
              if (
                arg.type === 'BinaryExpression' &&
                ['!==', '!=', '===', '==', 'in'].includes(arg.operator)
              ) {
                context.report({ node, message: MSG })
              }
              if (
                arg.type === 'MemberExpression' &&
                (arg.property.name === 'tagName' || arg.property.name === 'nodeName')
              ) {
                context.report({ node, message: MSG })
              }
            }
          }

          if (node.callee.type !== 'MemberExpression') return

          // 2. Block expect.any() as standalone assertion — type-only, not value.
          //    Allow expect.any() inside asymmetric matchers (toHaveBeenCalledWith etc.)
          //    where it asserts "called with *a* function" which is meaningful.
          if (node.callee.object.name === 'expect') {
            if (node.callee.property.name === 'any' && !isInsideAsymmetricMatcher(node)) {
              context.report({ node: node.callee.property, message: MSG })
            }
          }

          const methodName = node.callee.property.name
          if (!methodName) return

          // 3. Tautological: getBy* already throws when the element is absent.
          if (methodName === 'toBeInTheDocument') {
            const expectCall = findExpectCall(node)
            if (expectCall && isGetByQuery(expectCall.arguments[0])) {
              context.report({
                node: node.callee.property,
                message:
                  'Tautological assertion: getBy* already throws when the element is absent — toBeInTheDocument() adds no information. Assert a specific attribute, text content, or computed state instead.',
              })
              return
            }
          }

          let isShallow = false
          const isNot =
            node.callee.object.type === 'MemberExpression' &&
            node.callee.object.property.name === 'not'

          if (SHALLOW_MATCHERS[methodName]) {
            isShallow = true
          } else if (methodName === 'toBeNull' && isNot) {
            isShallow = true
          } else if (methodName === 'toBe') {
            if (node.arguments.length === 1) {
              const arg = node.arguments[0]
              if (arg.type === 'Identifier' && arg.name === 'undefined') {
                isShallow = true
              } else if (
                arg.type === 'Literal' &&
                ['string', 'object', 'boolean', 'number', 'function', 'symbol'].includes(arg.value)
              ) {
                isShallow = true
              } else if (isNot && arg.type === 'Literal' && (arg.value === 0 || arg.value === '')) {
                isShallow = true
              }
            }
          } else if (methodName === 'toBeGreaterThan' || methodName === 'toBeGreaterThanOrEqual') {
            if (
              node.arguments.length === 1 &&
              node.arguments[0].type === 'Literal' &&
              node.arguments[0].value === 0
            ) {
              isShallow = true
            }
          } else if (methodName === 'toMatch') {
            const arg = node.arguments[0]
            if (arg?.type === 'Literal' && arg.regex) {
              const pattern = arg.regex.pattern
              if (pattern.includes('.+') || pattern.includes('[a-zA-Z]') || pattern === '.*') {
                isShallow = true
              }
            }
          } else if (methodName === 'toBeInstanceOf') {
            isShallow = true
          } else if (methodName === 'toHaveProperty' && node.arguments.length === 1) {
            isShallow = true
          } else if (
            isNot &&
            methodName === 'toHaveLength' &&
            node.arguments[0]?.type === 'Literal' &&
            node.arguments[0].value === 0
          ) {
            isShallow = true
          } else if (isNot && methodName === 'toBeNaN') {
            isShallow = true
          }

          if (!isShallow) return

          // Walk up the member-expression chain to find expect()
          let obj = node.callee.object
          while (obj.type === 'CallExpression' && obj.callee.type === 'MemberExpression') {
            obj = obj.callee.object
          }
          if (obj.type === 'MemberExpression' && obj.property.name === 'not') {
            obj = obj.object
          }

          if (
            obj.type === 'CallExpression' &&
            obj.callee.type === 'Identifier' &&
            obj.callee.name === 'expect'
          ) {
            context.report({ node: node.callee.property, message: MSG })
          }
        },
      }
    },
  },
  /**
   * Ban page.waitForTimeout() in E2E specs.
   * Arbitrary delays are flaky, slow, and hide real timing issues.
   * Wait for a condition: toBeVisible, waitForFunction, expect.poll.
   */
  'no-waitfor-timeout': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Disallow page.waitForTimeout() in E2E specs — use condition-based waits instead.',
      },
      schema: [],
    },
    create(context) {
      const filename = getFilename(context)
      if (!filename.includes(`${sep}e2e${sep}`)) return {}

      return {
        CallExpression(node) {
          if (node.callee?.type !== 'MemberExpression') return
          if (node.callee.property?.name !== 'waitForTimeout') return
          context.report({
            node,
            message:
              'waitForTimeout() is banned in E2E tests — arbitrary delays are flaky. Wait for a condition: toBeVisible(), waitForFunction(), expect.poll().',
          })
        },
      }
    },
  },

  /**
   * Ban flaky .click() targets obtained via getByText, getByRole, etc.
   * Click targets must use getByTestId or data-testid locators.
   * Text and role selectors break on any copy or DOM structure change.
   */
  'no-flaky-click-selectors': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'E2E click targets must use getByTestId or data-testid locators, not text/role/label selectors.',
      },
      schema: [],
    },
    create(context) {
      const filename = getFilename(context)
      if (!filename.includes(`${sep}e2e${sep}`)) return {}

      return {
        CallExpression(node) {
          // Match: <expr>.click(...)
          if (node.callee?.type !== 'MemberExpression') return
          if (node.callee.property?.name !== 'click') return

          // Walk back through the chain to find the query method
          let obj = node.callee.object
          // Handle chained calls like page.getByText('x').first().click()
          while (obj.type === 'CallExpression' && obj.callee?.type === 'MemberExpression') {
            const method = obj.callee.property
            if (method?.type === 'Identifier' && FLAKY_QUERY_METHODS.has(method.name)) {
              context.report({
                node: method,
                message: `.click() target must use getByTestId() or [data-testid] locator. ${method.name}() produces flaky selectors that break on text or DOM changes.`,
              })
              return
            }
            obj = obj.callee.object
          }
          // Direct call: page.getByText('x').click()
          if (obj.type === 'CallExpression' && obj.callee?.type === 'Identifier') {
            const name = obj.callee.name
            if (FLAKY_QUERY_METHODS.has(name)) {
              context.report({
                node: obj.callee,
                message: `.click() target must use getByTestId() or [data-testid] locator. ${name}() produces flaky selectors that break on text or DOM changes.`,
              })
            }
          }
        },
      }
    },
  },
}

export { testingRules }
