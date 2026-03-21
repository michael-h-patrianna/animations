import { readFileSync, readdirSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'

import { checkCssForAnimations, getFilename, isAnimationFile, isInFramer } from './rule-helpers.js'

const extraRules = {
  'no-viewport-units': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Disallow viewport units (vh, vw, vmin, vmax). Not portable to React Native.',
      },
      schema: [],
    },
    create(context) {
      if (!isAnimationFile(context)) return {}
      const vpPattern = /\d+(?:vh|vw|vmin|vmax)\b/i
      const msg =
        'Viewport units (vh, vw, vmin, vmax) are not portable to React Native. Use percentage-based values or compute dimensions in JavaScript.'
      return {
        Literal(node) {
          if (typeof node.value === 'string' && vpPattern.test(node.value)) {
            context.report({ node, message: msg })
          }
        },
        TemplateLiteral(node) {
          for (const quasi of node.quasis) {
            if (vpPattern.test(quasi.value.raw)) {
              context.report({ node, message: msg })
              return
            }
          }
        },
      }
    },
  },

  'no-important': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Disallow !important. Incompatible with Tailwind specificity and React Native.',
      },
      schema: [],
    },
    create(context) {
      if (!isAnimationFile(context)) return {}
      const importantPattern = /!\s*important/i
      const msg =
        '!important is banned in animation code. It conflicts with Tailwind specificity and has no React Native equivalent.'
      return {
        Literal(node) {
          if (typeof node.value === 'string' && importantPattern.test(node.value)) {
            context.report({ node, message: msg })
          }
        },
        TemplateLiteral(node) {
          for (const quasi of node.quasis) {
            if (importantPattern.test(quasi.value.raw)) {
              context.report({ node, message: msg })
              return
            }
          }
        },
      }
    },
  },

  'require-data-animation-id': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Every animation component must include a data-animation-id attribute for testing and catalog integration.',
      },
      schema: [],
    },
    create(context) {
      const filename = getFilename(context)
      if (!filename.endsWith('.tsx')) return {}
      if (!filename.includes('/css/') && !filename.includes('/framer/')) return {}
      const base = basename(filename, '.tsx')
      if (base.startsWith('Mock') || base === 'index') return {}
      if (base.includes('Helper') || base.includes('Parts')) return {}

      let found = false
      return {
        JSXAttribute(node) {
          if (node.name?.name === 'data-animation-id') {
            found = true
          }
        },
        'Program:exit'() {
          if (!found) {
            context.report({
              loc: { line: 1, column: 0 },
              message: `Missing data-animation-id attribute. Every animation component must include data-animation-id="<category-group>__<variant>" on its root element.`,
            })
          }
        },
      }
    },
  },

  'no-css-animations-in-framer': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Disallow CSS animation/transition properties in any CSS file inside framer/ directories.',
      },
      schema: [],
    },
    create(context) {
      return {
        Program() {
          const filename = getFilename(context)
          if (!filename.endsWith('.tsx')) return
          if (!isInFramer(context)) return
          const base = basename(filename, '.tsx')
          if (base.startsWith('Mock') || base === 'index') return

          const dir = dirname(filename)
          let cssFiles
          try {
            cssFiles = readdirSync(dir).filter((f) => f.endsWith('.css'))
          } catch {
            return
          }

          for (const cssFile of cssFiles) {
            let css
            try {
              css = readFileSync(join(dir, cssFile), 'utf8')
            } catch {
              continue
            }

            const findings = checkCssForAnimations(css)
            if (findings.length > 0) {
              context.report({
                loc: { line: 1, column: 0 },
                message: `${cssFile} contains CSS animations: ${findings.join(', ')}. In framer/ directories, animations must be driven by Motion/Reanimated. Static styling CSS is fine.`,
              })
            }
          }
        },
      }
    },
  },

  // Matchers that assert existence/type but not correctness — they
  // catch zero real bugs.
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

      // Returns the expect() CallExpression that this matcher chain is attached to.
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

      // screen.getBy* / getBy* calls already throw when the element is absent,
      // so wrapping them in toBeInTheDocument() adds zero information.
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

      return {
        CallExpression(node) {
          // 1. Block expect(typeof x), expect(Array.isArray), expect(!!x),
          //    expect(x !== null), expect(el.tagName) — none of these test behaviour.
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

          // 2. Block expect.any() — type-only assertion, not a value assertion.
          //    Do NOT block objectContaining/arrayContaining/stringContaining/stringMatching:
          //    those assert specific values inside the structure and are meaningful.
          if (node.callee.object.name === 'expect') {
            if (node.callee.property.name === 'any') {
              context.report({ node: node.callee.property, message: MSG })
            }
          }

          const methodName = node.callee.property.name
          if (!methodName) return

          // 3. Tautological: getBy* already throws when the element is absent,
          //    so expect(screen.getByX(...)).toBeInTheDocument() adds nothing.
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
            // Only flag "> 0" / ">= 0" — that is "has any value", not a real assertion.
            // "> 5" or "> 100" verifies a specific threshold and is meaningful.
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
   * Ban <button> elements in animation files that don't use a CSS class.
   * Prevents agents from creating buttons with inline styles or no styling.
   * Buttons must reference a class from shared.css or a group-scoped stylesheet.
   */
  'no-unstyled-interactive-elements': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Disallow <button> elements without a className in animation components.',
      },
      schema: [],
    },
    create(context) {
      if (!isAnimationFile(context)) return {}
      const base = basename(getFilename(context), '.tsx')
      if (base.startsWith('Mock') || base === 'index') return {}

      return {
        JSXOpeningElement(node) {
          const name = node.name?.name
          if (name !== 'button') return

          const classAttr = node.attributes.find(
            (attr) => attr.type === 'JSXAttribute' && attr.name?.name === 'className'
          )
          if (!classAttr || !classAttr.value) {
            context.report({
              node,
              message:
                '<button> in animation components must use a CSS class from shared.css or a group stylesheet (e.g. pf-button-primary, modal-content-button). Do not create buttons with inline styles.',
            })
            return
          }

          // Also ban buttons that have a className AND a style prop (inline style override)
          const styleAttr = node.attributes.find(
            (attr) => attr.type === 'JSXAttribute' && attr.name?.name === 'style'
          )
          if (styleAttr) {
            context.report({
              node,
              message:
                '<button> in animation components must not use inline styles. Style buttons through CSS classes in shared.css or a group stylesheet.',
            })
          }
        },
      }
    },
  },

  /**
   * Ban z-index values above 10 in animation files.
   * High z-index breaks containment within the demo canvas.
   */
  'no-excessive-z-index': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Disallow z-index values above 10 in animation components. High z-index breaks demo canvas containment.',
      },
      schema: [],
    },
    create(context) {
      if (!isAnimationFile(context)) return {}

      const MAX_Z = 10
      const msg = `z-index values above ${MAX_Z} are banned in animation components. High z-index breaks containment within the demo canvas. Use values 0–${MAX_Z} for internal layering.`

      return {
        Property(node) {
          const name = node.key?.name || node.key?.value
          if (name !== 'zIndex') return

          if (node.value?.type === 'Literal' && typeof node.value.value === 'number') {
            if (node.value.value > MAX_Z) {
              context.report({ node, message: msg })
            }
          }
          if (
            node.value?.type === 'UnaryExpression' &&
            node.value.operator === '-' &&
            node.value.argument?.type === 'Literal'
          ) {
            // Negative z-index is fine, skip
            return
          }
        },
      }
    },
  },

  /**
   * Ban export default in animation component files.
   * groupBuilder resolves components via named exports matching the filename.
   * export default causes silent rendering failures (component loads as undefined).
   */
  'no-default-export-in-animation': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Disallow export default in animation components. groupBuilder requires named exports matching the filename.',
      },
      schema: [],
    },
    create(context) {
      if (!isAnimationFile(context)) return {}
      const base = basename(getFilename(context), '.tsx')
      if (base.startsWith('Mock') || base === 'index') return {}

      return {
        ExportDefaultDeclaration(node) {
          context.report({
            node,
            message: `export default is not allowed in animation components. groupBuilder requires named exports matching the filename. Use: export { ${base} } or export function ${base}()`,
          })
        },
      }
    },
  },

  'no-svg-in-motion': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Warn against SVG elements in framer/ variants. SVG has limited React Native performance.',
      },
      schema: [],
    },
    create(context) {
      if (!isInFramer(context)) return {}
      const svgElements = new Set([
        'svg',
        'path',
        'circle',
        'ellipse',
        'rect',
        'line',
        'polyline',
        'polygon',
        'g',
        'defs',
        'use',
        'clipPath',
        'mask',
        'pattern',
        'text',
        'tspan',
        'foreignObject',
        'linearGradient',
        'radialGradient',
        'stop',
      ])
      return {
        JSXOpeningElement(node) {
          const name = node.name?.name
          if (!name) return
          if (!svgElements.has(name)) return
          context.report({
            node,
            message: `<${name}> (SVG) has limited performance in React Native. Prefer View + transform/opacity animations. If SVG is required, add an eslint-disable comment with justification.`,
          })
        },
      }
    },
  },
  /**
   * Prevents animation components in one category from importing internals
   * of another category. Enforces the architectural boundary: each category
   * (base, dialogs, progress, realtime, rewards) is a self-contained module
   * that may only import from shared locations (types, lib, utils, motion,
   * assets, services) and its own group hierarchy.
   *
   * Category index files (which aggregate groups) and the central registry
   * (animationRegistry.ts) are exempt since they exist to bridge categories.
   */
  'no-cross-category-imports': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Disallow animation components from importing across category boundaries.',
      },
      schema: [],
    },
    create(context) {
      const filename = context.filename
      // Only applies to files inside src/components/<category>/<group>/
      const categoryMatch = filename.match(
        /src\/components\/(base|dialogs|progress|realtime|rewards)\/([^/]+)\//
      )
      if (!categoryMatch) return {}

      const ownCategory = categoryMatch[1]
      const otherCategories = ['base', 'dialogs', 'progress', 'realtime', 'rewards'].filter(
        (c) => c !== ownCategory
      )

      return {
        ImportDeclaration(node) {
          const source = node.source.value
          if (typeof source !== 'string') return

          for (const cat of otherCategories) {
            if (source.includes(`@/components/${cat}/`) || source.includes(`/components/${cat}/`)) {
              context.report({
                node,
                message: `Cross-category import: files in "${ownCategory}" must not import from "${cat}". Use shared modules (@/types, @/lib, @/utils, @/motion, @/assets) or restructure the dependency.`,
              })
              break
            }
          }
        },
      }
    },
  },
}

export { extraRules }
