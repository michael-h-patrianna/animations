import { readFileSync, readdirSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'

function getFilename(context) {
  return context.filename ?? context.getFilename()
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
