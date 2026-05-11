import { readFileSync, readdirSync } from 'node:fs'
import { basename, dirname, join, normalize } from 'node:path'

import { checkCssForAnimations, getFilename, isAnimationFile, isInFramer } from './rule-helpers.js'

function extractImportsFromSource(source) {
  const imports = []
  let match

  const fromPattern = /import\s+[\s\S]*?from\s+['"]([^'"]+)['"]/g
  while ((match = fromPattern.exec(source)) !== null) {
    imports.push(match[1])
  }

  const barePattern = /import\s+['"]([^'"]+)['"]/g
  while ((match = barePattern.exec(source)) !== null) {
    imports.push(match[1])
  }

  return [...new Set(imports)]
}

function importsLoadDemoBlockStyles(imports) {
  const demoBlocksComponentPattern = /^@\/components\/demo-blocks(?:\/Demo[A-Z]\w*)?$/
  const relativeDemoBlocksCssPattern = /^(?:(?:\.\.|\.)\/)*demo-blocks\/demo-blocks\.css$/

  return imports.some((source) => {
    if (typeof source !== 'string') return false

    const normalizedSource = normalize(source).replaceAll('\\', '/')
    return (
      normalizedSource === '@/components/demo-blocks/demo-blocks.css' ||
      demoBlocksComponentPattern.test(normalizedSource) ||
      relativeDemoBlocksCssPattern.test(normalizedSource)
    )
  })
}

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

  /**
   * Prevent lazy-loaded animation chunks from relying on unrelated chunks to load
   * shared demo-block styles. If an animation file uses raw pf-demo-* classes,
   * it must either import demo-blocks directly or have its group index load
   * demo-blocks.css as a side effect.
   */
  'no-implicit-demo-block-styles': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Disallow animation files from using raw pf-demo-* classes without explicitly loading demo-block styles.',
      },
      schema: [],
    },
    create(context) {
      const filename = getFilename(context)
      if (!filename.endsWith('.tsx')) return {}
      if (!isAnimationFile(context)) return {}

      const base = basename(filename, '.tsx')
      if (base.startsWith('Mock') || base === 'index') return {}
      if (base.includes('Helper') || base.includes('Parts')) return {}

      let usesRawDemoClasses = false
      let loadsDemoBlockStylesLocally = false

      return {
        ImportDeclaration(node) {
          const source = node.source.value
          if (typeof source !== 'string') return
          if (importsLoadDemoBlockStyles([source])) {
            loadsDemoBlockStylesLocally = true
          }
        },
        JSXAttribute(node) {
          if (node.name?.name !== 'className') return
          if (context.sourceCode.getText(node).includes('pf-demo-')) {
            usesRawDemoClasses = true
          }
        },
        'Program:exit'() {
          if (!usesRawDemoClasses || loadsDemoBlockStylesLocally) return

          const groupIndexPath = join(dirname(filename), '..', 'index.ts')
          let groupIndexLoadsDemoStyles = false

          try {
            const groupIndexSource = readFileSync(groupIndexPath, 'utf8')
            groupIndexLoadsDemoStyles = importsLoadDemoBlockStyles(
              extractImportsFromSource(groupIndexSource)
            )
          } catch {
            groupIndexLoadsDemoStyles = false
          }

          if (groupIndexLoadsDemoStyles) return

          context.report({
            loc: { line: 1, column: 0 },
            message:
              'This animation uses raw pf-demo-* classes but does not explicitly load demo-block styles. Import a Demo* component, import "@/components/demo-blocks/demo-blocks.css" locally, or add that import to the group index. Lazy-loaded groups must not rely on unrelated chunks for shared styles.',
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
          'Forbid SVG elements animated via Motion (m.svg, m.path, etc.) in framer/ variants. Static SVG icons are allowed.',
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
          const nodeName = node.name
          // Flag m.svg, m.path, etc. — Motion-animated SVG elements
          if (
            nodeName?.type === 'JSXMemberExpression' &&
            nodeName.object?.name === 'm' &&
            svgElements.has(nodeName.property?.name)
          ) {
            context.report({
              node,
              message: `<m.${nodeName.property.name}> animates SVG via Motion — poor React Native performance. Use CSS keyframes or a static SVG with transform/opacity on a wrapper View.`,
            })
          }
          // Static <svg>, <path>, etc. are allowed — they're just icons
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
