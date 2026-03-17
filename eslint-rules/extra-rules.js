import { readFileSync, readdirSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'

function getFilename(context) {
  return context.filename
}

function isInFramer(context) {
  return getFilename(context).includes('/framer/')
}

function isAnimationFile(context) {
  const f = getFilename(context)
  return f.includes('/css/') || f.includes('/framer/')
}

function checkCssForAnimations(css) {
  const findings = []
  if (/@keyframes\s/m.test(css)) findings.push('@keyframes')
  if (/(?:^|[{;\s])animation(?:-name|-duration|-delay|-timing-function|-iteration-count|-direction|-fill-mode|-play-state)?\s*:/m.test(css)) {
    findings.push('animation')
  }
  if (/(?:^|[{;\s])transition(?:-property|-duration|-delay|-timing-function)?\s*:/m.test(css)) {
    findings.push('transition')
  }
  return findings
}

const extraRules = {
  'no-viewport-units': {
    meta: {
      type: 'problem',
      docs: { description: 'Disallow viewport units (vh, vw, vmin, vmax). Not portable to React Native.' },
      schema: [],
    },
    create(context) {
      if (!isAnimationFile(context)) return {}
      const vpPattern = /\d+(?:vh|vw|vmin|vmax)\b/i
      const msg = 'Viewport units (vh, vw, vmin, vmax) are not portable to React Native. Use percentage-based values or compute dimensions in JavaScript.'
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
      docs: { description: 'Disallow !important. Incompatible with Tailwind specificity and React Native.' },
      schema: [],
    },
    create(context) {
      if (!isAnimationFile(context)) return {}
      const importantPattern = /!\s*important/i
      const msg = '!important is banned in animation code. It conflicts with Tailwind specificity and has no React Native equivalent.'
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
      docs: { description: 'Every animation component must include a data-animation-id attribute for testing and catalog integration.' },
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
          if (node.name?.name === 'data-animation-id') { found = true }
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
      docs: { description: 'Disallow CSS animation/transition properties in any CSS file inside framer/ directories.' },
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
          try { cssFiles = readdirSync(dir).filter((f) => f.endsWith('.css')) } catch { return }

          for (const cssFile of cssFiles) {
            let css
            try { css = readFileSync(join(dir, cssFile), 'utf8') } catch { continue }

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
  // Maps matcher name → custom error message.
  'no-shallow-assertions': {
    meta: {
      type: 'problem',
      docs: { description: 'Disallow shallow test matchers that assert existence or type instead of correctness.' },
      schema: [],
    },
    create(context) {
      const MSG = 'Shallow useless test. Delete test! Do not try to rewrite it just to make it pass. It is fundamentally useless.'
      const SHALLOW_MATCHERS = {
        toBeDefined: true,
        toBeTruthy: true,
        toBeFalsy: true,
        toBeUndefined: true,
      }

      return {
        CallExpression(node) {
          // 1. Block expect(typeof x), expect(Array.isArray), expect(!!x), expect(x !== null), expect(el.tagName)
          if (node.callee.type === 'Identifier' && node.callee.name === 'expect') {
            const arg = node.arguments[0]
            if (arg) {
              if (arg.type === 'UnaryExpression' && arg.operator === 'typeof') {
                context.report({ node, message: MSG })
              }
              if (arg.type === 'CallExpression' && arg.callee.type === 'MemberExpression' && arg.callee.object.name === 'Array' && arg.callee.property.name === 'isArray') {
                context.report({ node, message: MSG })
              }
              if (arg.type === 'UnaryExpression' && arg.operator === '!') {
                context.report({ node, message: MSG })
              }
              if (arg.type === 'CallExpression' && arg.callee.name === 'Boolean') {
                context.report({ node, message: MSG })
              }
              if (arg.type === 'BinaryExpression' && ['!==', '!=', '===', '==', 'in'].includes(arg.operator)) {
                context.report({ node, message: MSG })
              }
              if (arg.type === 'MemberExpression' && (arg.property.name === 'tagName' || arg.property.name === 'nodeName')) {
                context.report({ node, message: MSG })
              }
            }
          }

          if (node.callee.type !== 'MemberExpression') return

          // 2. Block expect.any(), expect.objectContaining(), etc.
          if (node.callee.object.name === 'expect') {
            const prop = node.callee.property.name
            if (['any', 'objectContaining', 'arrayContaining', 'stringContaining', 'stringMatching'].includes(prop)) {
              context.report({ node: node.callee.property, message: MSG })
            }
          }

          const methodName = node.callee.property.name
          if (!methodName) return

          let isShallow = false

          const isNot = node.callee.object.type === 'MemberExpression' && node.callee.object.property.name === 'not'

          if (SHALLOW_MATCHERS[methodName]) {
            isShallow = true
          } else if (methodName === 'toBeNull' && isNot) {
            isShallow = true
          } else if (methodName === 'toBe') {
            if (node.arguments.length === 1) {
              const arg = node.arguments[0]
              if (arg.type === 'Identifier' && arg.name === 'undefined') {
                isShallow = true
              } else if (arg.type === 'Literal' && ['string', 'object', 'boolean', 'number', 'function', 'symbol'].includes(arg.value)) {
                isShallow = true
              } else if (isNot && arg.type === 'Literal' && (arg.value === 0 || arg.value === '')) {
                isShallow = true
              }
            }
          } else if (methodName === 'toBeGreaterThan' || methodName === 'toBeGreaterThanOrEqual') {
            if (node.arguments.length === 1 && node.arguments[0].type === 'Literal') {
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
          } else if (isNot && methodName === 'toHaveLength' && node.arguments[0]?.type === 'Literal' && node.arguments[0].value === 0) {
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
          
          if (obj.type === 'CallExpression' && obj.callee.type === 'Identifier' && obj.callee.name === 'expect') {
            context.report({
              node: node.callee.property,
              message: MSG,
            })
          }
        },
      }
    },
  },

  'no-svg-in-motion': {
    meta: {
      type: 'problem',
      docs: { description: 'Warn against SVG elements in framer/ variants. SVG has limited React Native performance.' },
      schema: [],
    },
    create(context) {
      if (!isInFramer(context)) return {}
      const svgElements = new Set([
        'svg', 'path', 'circle', 'ellipse', 'rect', 'line', 'polyline', 'polygon',
        'g', 'defs', 'use', 'clipPath', 'mask', 'pattern', 'text', 'tspan',
        'foreignObject', 'linearGradient', 'radialGradient', 'stop',
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
}

export { extraRules }
