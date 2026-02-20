import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import jsdoc from 'eslint-plugin-jsdoc'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { existsSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'

/** Inline plugin: project-specific lint rules for animation components. */
const animationRulesPlugin = {
  rules: {
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
        const hexColor = /^#(?:[0-9a-fA-F]{3,4}){1,2}$/
        const rgbFunc = /^rgba?\s*\(/i
        const hslFunc = /^hsla?\s*\(/i

        const namedColors = new Set([
          'aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure',
          'beige', 'bisque', 'black', 'blanchedalmond', 'blue',
          'blueviolet', 'brown', 'burlywood', 'cadetblue', 'chartreuse',
          'chocolate', 'coral', 'cornflowerblue', 'cornsilk', 'crimson',
          'cyan', 'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray',
          'darkgreen', 'darkgrey', 'darkkhaki', 'darkmagenta',
          'darkolivegreen', 'darkorange', 'darkorchid', 'darkred',
          'darksalmon', 'darkseagreen', 'darkslateblue', 'darkslategray',
          'darkslategrey', 'darkturquoise', 'darkviolet', 'deeppink',
          'deepskyblue', 'dimgray', 'dimgrey', 'dodgerblue', 'firebrick',
          'floralwhite', 'forestgreen', 'fuchsia', 'gainsboro',
          'ghostwhite', 'gold', 'goldenrod', 'gray', 'green',
          'greenyellow', 'grey', 'honeydew', 'hotpink', 'indianred',
          'indigo', 'ivory', 'khaki', 'lavender', 'lavenderblush',
          'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral',
          'lightcyan', 'lightgoldenrodyellow', 'lightgray', 'lightgreen',
          'lightgrey', 'lightpink', 'lightsalmon', 'lightseagreen',
          'lightskyblue', 'lightslategray', 'lightslategrey',
          'lightsteelblue', 'lightyellow', 'lime', 'limegreen', 'linen',
          'magenta', 'maroon', 'mediumaquamarine', 'mediumblue',
          'mediumorchid', 'mediumpurple', 'mediumseagreen',
          'mediumslateblue', 'mediumspringgreen', 'mediumturquoise',
          'mediumvioletred', 'midnightblue', 'mintcream', 'mistyrose',
          'moccasin', 'navajowhite', 'navy', 'oldlace', 'olive',
          'olivedrab', 'orange', 'orangered', 'orchid', 'palegoldenrod',
          'palegreen', 'paleturquoise', 'palevioletred', 'papayawhip',
          'peachpuff', 'peru', 'pink', 'plum', 'powderblue', 'purple',
          'rebeccapurple', 'red', 'rosybrown', 'royalblue', 'saddlebrown',
          'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna',
          'silver', 'skyblue', 'slateblue', 'slategray', 'slategrey',
          'snow', 'springgreen', 'steelblue', 'tan', 'teal', 'thistle',
          'tomato', 'turquoise', 'violet', 'wheat', 'white', 'whitesmoke',
          'yellow', 'yellowgreen',
        ])

        // CSS keywords that look like color names but are not hardcoded colors
        const allowedKeywords = new Set([
          'transparent', 'currentcolor', 'currentColor', 'inherit',
          'initial', 'unset', 'revert',
        ])

        const msg =
          'Hardcoded color values are not allowed. Use CSS custom properties (var(--color-xxx)) or theme tokens instead.'

        function isColorString(value) {
          if (typeof value !== 'string') return false
          const trimmed = value.trim()
          if (hexColor.test(trimmed)) return true
          if (rgbFunc.test(trimmed)) return true
          if (hslFunc.test(trimmed)) return true
          if (
            namedColors.has(trimmed.toLowerCase()) &&
            !allowedKeywords.has(trimmed)
          ) {
            return true
          }
          return false
        }

        return {
          Literal(node) {
            if (isColorString(node.value)) {
              const filename = context.filename ?? context.getFilename()
              if (filename.includes('.test.')) return
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
     * Ban CSS file imports in framer/ (Motion) variant directories.
     * Motion variants must be pure React + Motion — no CSS — so they can
     * be ported to React Native via Moti without modification.
     */
    'no-css-in-motion': {
      meta: {
        type: 'problem',
        docs: {
          description:
            'Disallow CSS imports in Motion (framer/) animation variants. Motion variants must be CSS-free for React Native/Moti portability.',
        },
        schema: [],
      },
      create(context) {
        return {
          ImportDeclaration(node) {
            const filename = context.filename ?? context.getFilename()
            if (!filename.includes('/framer/')) return

            const source = node.source.value
            if (typeof source !== 'string') return
            if (!source.endsWith('.css')) return

            context.report({
              node,
              message:
                'CSS imports are banned in Motion (framer/) variants. Motion animations must use only inline styles and Motion props for React Native/Moti portability.',
            })
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
            // Catch style objects: { filter: '...blur...' } or { backdropFilter: '...blur...' }
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
            const filename = context.filename ?? context.getFilename()

            // Only apply to .tsx files inside css/ or framer/ animation directories
            if (!filename.endsWith('.tsx')) return
            if (!filename.includes('/css/') && !filename.includes('/framer/')) return
            // Skip non-animation files (shared components, mocks, etc.)
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
            const filename = context.filename ?? context.getFilename()

            if (!filename.endsWith('.tsx')) return

            const base = basename(filename, '.tsx')
            if (base.startsWith('Mock') || base === 'index') return

            const dir = dirname(filename)
            const parentDir = dirname(dir)
            const variantDir = basename(dir)

            // Only applies to css/ and framer/ animation directories
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
  },
}

export default defineConfig([
  globalIgnores(['dist', '.claude']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactRefresh.configs.vite,
      eslintConfigPrettier,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      jsdoc,
      'react-hooks': reactHooks,
      'animation-rules': animationRulesPlugin,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'jsdoc/require-jsdoc': [
        'error',
        {
          publicOnly: true,
          contexts: [
            'FunctionDeclaration',
            'ClassDeclaration',
            'TSInterfaceDeclaration',
            'TSTypeAliasDeclaration',
          ],
          require: {
            FunctionDeclaration: true,
            ClassDeclaration: true,
            ArrowFunctionExpression: false,
            FunctionExpression: false,
          },
        },
      ],
      'jsdoc/require-param': 'off',
      'jsdoc/require-returns': 'off',
      'animation-rules/no-hardcoded-colors': 'error',
      'animation-rules/no-direct-image-imports': 'error',
      'animation-rules/no-blur-animation': 'error',
      'animation-rules/no-radial-angular-gradient': 'error',
      'animation-rules/require-animation-metadata': 'error',
      'animation-rules/require-dual-implementation': 'error',
    },
  },
  {
    files: ['**/*.tsx'],
    rules: {
      'max-lines': [
        'error',
        {
          max: 500,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
    },
  },
  // Motion (framer/) variants must be CSS-free for React Native portability
  {
    files: ['src/components/**/framer/**/*.{ts,tsx}'],
    rules: {
      'animation-rules/no-css-in-motion': 'error',
    },
  },
])
