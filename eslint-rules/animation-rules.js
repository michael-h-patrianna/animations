import { existsSync, readFileSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'

import { isColorString } from './color-helpers.js'
import { extraRules } from './extra-rules.js'

/**
 * Inline ESLint plugin: project-specific lint rules for animation components.
 * Ensures animations are portable to Tailwind (web) and React Native (Reanimated/Moti).
 */

// ─── Shared helpers ──────────────────────────────────────────────────────────

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

// ─── Rule definitions ────────────────────────────────────────────────────────

const rules = {
  /**
   * Ban hardcoded color values (hex, rgb/rgba, hsl/hsla, named CSS colors)
   * in JS/TS code. Colors must come from CSS custom properties or a theme.
   */
  'no-hardcoded-colors': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Disallow inline/hardcoded color values. Use CSS custom properties or theme tokens.',
      },
      schema: [],
    },
    create(context) {
      const msg =
        'Hardcoded color values are not allowed. Use CSS custom properties (var(--color-xxx)) or theme tokens instead.'

      return {
        Literal(node) {
          if (isColorString(node.value)) {
            if (getFilename(context).includes('.test.')) return
            context.report({ node, message: msg })
          }
        },
        TemplateLiteral(node) {
          for (const quasi of node.quasis) {
            const raw = quasi.value.raw
            if (/#(?:[0-9a-fA-F]{3,4}){1,2}(?!\w)/.test(raw)) {
              context.report({ node, message: msg })
              return
            }
            if (/rgba?\s*\(/i.test(raw) || /hsla?\s*\(/i.test(raw)) {
              context.report({ node, message: msg })
              return
            }
          }
        },
      }
    },
  },

  /**
   * Ban direct imports of image files. Images should be managed through
   * a centralized asset or theme system.
   */
  'no-direct-image-imports': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Disallow direct image imports. Manage images through a centralized asset system.',
      },
      schema: [],
    },
    create(context) {
      const imagePattern = /\.(?:webp|png|jpg|jpeg|svg|gif|avif|ico|bmp|tiff?)$/i

      return {
        ImportDeclaration(node) {
          const source = node.source.value
          if (typeof source !== 'string') return
          if (!imagePattern.test(source)) return

          context.report({
            node,
            message:
              'Direct image imports are not allowed. Manage images through a centralized asset or theme system.',
          })
        },
      }
    },
  },

  /**
   * Ban CSS animation properties in CSS files imported by framer/ variants.
   * Static styling CSS is allowed — only @keyframes, animation-*, and
   * transition-* are banned because animations must be driven by Motion/Reanimated.
   */
  'no-css-animations-in-motion': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Disallow CSS animation/transition properties in CSS files imported by framer/ variants. Animations must use Motion, not CSS.',
      },
      schema: [],
    },
    create(context) {
      if (!isInFramer(context)) return {}

      return {
        ImportDeclaration(node) {
          const source = node.source.value
          if (typeof source !== 'string') return
          if (!source.endsWith('.css')) return

          const dir = dirname(getFilename(context))
          const cssPath = resolve(dir, source)

          let css
          try {
            css = readFileSync(cssPath, 'utf8')
          } catch {
            return
          }

          const findings = checkCssForAnimations(css)
          if (findings.length > 0) {
            context.report({
              node,
              message: `Imported CSS file contains CSS animations: ${findings.join(', ')}. In framer/ variants, animations must be driven by Motion/Reanimated, not CSS. Static styling is fine.`,
            })
          }
        },
      }
    },
  },

  /**
   * Ban blur() in animation code — filter: blur() and backdrop-filter: blur()
   * are not supported in React Native and are expensive on mobile GPUs.
   */
  'no-blur-animation': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Disallow blur() in animation code. Blur is not supported in React Native and is GPU-expensive on mobile.',
      },
      schema: [],
    },
    create(context) {
      const blurPattern = /\bblur\s*\(/i
      const msg =
        'blur() is banned in animation code. It is not supported in React Native and is GPU-expensive on mobile. Use opacity or scale alternatives.'

      return {
        Literal(node) {
          if (typeof node.value === 'string' && blurPattern.test(node.value)) {
            context.report({ node, message: msg })
          }
        },
        TemplateLiteral(node) {
          for (const quasi of node.quasis) {
            if (blurPattern.test(quasi.value.raw)) {
              context.report({ node, message: msg })
              return
            }
          }
        },
        Property(node) {
          if (
            node.key &&
            (node.key.name === 'filter' || node.key.name === 'backdropFilter') &&
            node.value &&
            node.value.type === 'Literal' &&
            typeof node.value.value === 'string' &&
            blurPattern.test(node.value.value)
          ) {
            context.report({ node: node.value, message: msg })
          }
        },
      }
    },
  },

  /**
   * Ban radial-gradient() and conic-gradient() in animation code.
   * Only linear-gradient() is portable to React Native.
   */
  'no-radial-angular-gradient': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Disallow radial-gradient() and conic-gradient(). Only linear-gradient() is portable to React Native.',
      },
      schema: [],
    },
    create(context) {
      const gradientPattern = /\b(?:radial-gradient|conic-gradient)\s*\(/i
      const msg =
        'radial-gradient() and conic-gradient() are banned. Only linear-gradient() is portable to React Native. Use solid fills or linear-gradient() instead.'

      return {
        Literal(node) {
          if (typeof node.value === 'string' && gradientPattern.test(node.value)) {
            context.report({ node, message: msg })
          }
        },
        TemplateLiteral(node) {
          for (const quasi of node.quasis) {
            if (gradientPattern.test(quasi.value.raw)) {
              context.report({ node, message: msg })
              return
            }
          }
        },
      }
    },
  },

  /**
   * Every animation .tsx in css/ or framer/ must have a sibling .meta.ts file.
   * Metadata drives the catalog UI and is required for every animation variant.
   */
  'require-animation-metadata': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Every animation component (.tsx) in css/ or framer/ must have a corresponding .meta.ts file.',
      },
      schema: [],
    },
    create(context) {
      return {
        Program() {
          const filename = getFilename(context)

          if (!filename.endsWith('.tsx')) return
          if (!isAnimationFile(context)) return
          const base = basename(filename, '.tsx')
          if (base.startsWith('Mock') || base === 'index') return

          const dir = dirname(filename)
          const metaPath = join(dir, `${base}.meta.ts`)

          if (!existsSync(metaPath)) {
            context.report({
              loc: { line: 1, column: 0 },
              message: `Missing metadata file: ${base}.meta.ts must exist alongside ${base}.tsx. Every animation needs metadata for the catalog.`,
            })
          }
        },
      }
    },
  },

  /**
   * Every animation in css/ must have a counterpart in framer/ (and vice versa).
   * Animations are always implemented twice: CSS+React and Motion+React.
   */
  'require-dual-implementation': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Every animation must exist in both css/ and framer/ variants. Flags missing counterparts.',
      },
      schema: [],
    },
    create(context) {
      return {
        Program() {
          const filename = getFilename(context)

          if (!filename.endsWith('.tsx')) return

          const base = basename(filename, '.tsx')
          if (base.startsWith('Mock') || base === 'index') return

          const dir = dirname(filename)
          const parentDir = dirname(dir)
          const variantDir = basename(dir)

          if (variantDir !== 'css' && variantDir !== 'framer') return

          const counterpartDir = variantDir === 'css' ? 'framer' : 'css'
          const counterpartPath = join(parentDir, counterpartDir, `${base}.tsx`)

          if (!existsSync(counterpartPath)) {
            const missingVariant = variantDir === 'css' ? 'Motion (framer/)' : 'CSS (css/)'
            context.report({
              loc: { line: 1, column: 0 },
              message: `Missing ${missingVariant} counterpart: ${base}.tsx must also exist in ${counterpartDir}/. Every animation requires both CSS and Motion implementations.`,
            })
          }
        },
      }
    },
  },

  // ─── New portability rules ───────────────────────────────────────────────

  /**
   * Ban CSS style properties that have no React Native equivalent.
   * Applies to framer/ variants only (which must be Moti/Reanimated-portable).
   *
   * Banned: clipPath, boxShadow, textShadow, mixBlendMode, backdropFilter.
   * perspective: only the CSS string form is banned (numeric is fine in RN).
   */
  'no-non-portable-styles': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Disallow CSS style properties that are not supported in React Native/Reanimated. Applies to framer/ variants.',
      },
      schema: [],
    },
    create(context) {
      if (!isInFramer(context)) return {}

      const bannedProps = new Map([
        [
          'clipPath',
          'clipPath is not supported in React Native. Restructure the animation or use opacity/transform alternatives.',
        ],
        [
          'boxShadow',
          'boxShadow is not supported in React Native. Use elevation (Android) or shadow* props (iOS) instead.',
        ],
        [
          'textShadow',
          'textShadow is not animatable in React Native/Reanimated. Use opacity or transform effects instead.',
        ],
        ['mixBlendMode', 'mixBlendMode is not supported in React Native.'],
        [
          'backdropFilter',
          'backdropFilter is not supported in React Native. Use opacity overlays instead.',
        ],
        ['WebkitBackdropFilter', 'WebkitBackdropFilter is not supported in React Native.'],
      ])

      return {
        Property(node) {
          const name = node.key?.name || node.key?.value
          if (!name) return

          if (bannedProps.has(name)) {
            context.report({ node, message: bannedProps.get(name) })
            return
          }

          // perspective: ban CSS string form like "perspective(800px)", allow numeric values
          if (
            name === 'perspective' &&
            node.value?.type === 'Literal' &&
            typeof node.value.value === 'string'
          ) {
            context.report({
              node,
              message:
                'CSS perspective() string syntax is not portable to React Native. Use a numeric value: { transform: [{ perspective: 800 }] }.',
            })
          }
        },
      }
    },
  },

  /**
   * Ban display: grid/inline-grid in framer/ variants.
   * React Native only supports flexbox layout.
   */
  'no-css-grid-in-motion': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Disallow display: grid in Motion (framer/) variants. React Native only supports flexbox.',
      },
      schema: [],
    },
    create(context) {
      if (!isInFramer(context)) return {}

      return {
        Property(node) {
          const name = node.key?.name || node.key?.value
          if (name !== 'display') return

          const value = node.value?.value
          if (value === 'grid' || value === 'inline-grid') {
            context.report({
              node,
              message:
                'display: grid is not supported in React Native. Use flexbox (display: flex) instead.',
            })
          }
        },
      }
    },
  },

  /**
   * Ban calc() in framer/ variants.
   * React Native does not support CSS calc() — compute values in JS instead.
   */
  'no-calc-in-motion': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Disallow calc() in Motion (framer/) variants. React Native does not support CSS calc().',
      },
      schema: [],
    },
    create(context) {
      if (!isInFramer(context)) return {}

      const calcPattern = /\bcalc\s*\(/i
      const msg =
        'calc() is not supported in React Native. Compute values in JavaScript instead.'

      return {
        Literal(node) {
          if (typeof node.value === 'string' && calcPattern.test(node.value)) {
            context.report({ node, message: msg })
          }
        },
        TemplateLiteral(node) {
          for (const quasi of node.quasis) {
            if (calcPattern.test(quasi.value.raw)) {
              context.report({ node, message: msg })
              return
            }
          }
        },
      }
    },
  },

  ...extraRules,
}

export { rules }
