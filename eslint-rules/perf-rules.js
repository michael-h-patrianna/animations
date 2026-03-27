import { readFileSync } from 'node:fs'
import { basename, dirname, resolve } from 'node:path'

import { getFilename } from './rule-helpers.js'

/**
 * ESLint rules enforcing performance tags on animation metadata.
 *
 * Detects requestAnimationFrame usage ('raf' tag) and layout-recalc-triggering
 * patterns ('lrc' tag) in animation component source files and requires the
 * corresponding tag in the sibling .meta.ts file.
 *
 * Limitation: only detects direct usage within the component's own .tsx and .css
 * files. Transitive usage via imported helpers (e.g. SharedTimer using rAF
 * internally) must be tagged manually.
 */

// ─── Pattern definitions ─────────────────────────────────────────────────────

/** Identifiers whose presence in JS/TS source indicates rAF usage. */
const RAF_PATTERNS = [
  /\brequestAnimationFrame\b/,
  /\bcancelAnimationFrame\b/,
  /\buseAnimationFrame\b/, // Motion rAF hook
]

/**
 * Identifiers whose presence in JS/TS source indicates layout-recalc-triggering
 * operations. Each entry has a pattern and a human-readable label for the error
 * message.
 */
const LRC_JS_PATTERNS = [
  { pattern: /\bgetBoundingClientRect\b/, label: 'getBoundingClientRect()' },
  { pattern: /\bgetComputedStyle\b/, label: 'getComputedStyle()' },
  { pattern: /\.offsetWidth\b/, label: '.offsetWidth' },
  { pattern: /\.offsetHeight\b/, label: '.offsetHeight' },
  { pattern: /\.offsetTop\b/, label: '.offsetTop' },
  { pattern: /\.offsetLeft\b/, label: '.offsetLeft' },
  { pattern: /\.clientWidth\b/, label: '.clientWidth' },
  { pattern: /\.clientHeight\b/, label: '.clientHeight' },
  { pattern: /\.scrollWidth\b/, label: '.scrollWidth' },
  { pattern: /\.scrollHeight\b/, label: '.scrollHeight' },
  // Direct DOM mutation of layout properties
  { pattern: /\.style\.width\s*=/, label: '.style.width =' },
  { pattern: /\.style\.height\s*=/, label: '.style.height =' },
  { pattern: /\.style\.top\s*=/, label: '.style.top =' },
  { pattern: /\.style\.left\s*=/, label: '.style.left =' },
  { pattern: /\.style\.right\s*=/, label: '.style.right =' },
  { pattern: /\.style\.bottom\s*=/, label: '.style.bottom =' },
  { pattern: /\.style\.margin\w*\s*=/, label: '.style.margin =' },
  { pattern: /\.style\.padding\w*\s*=/, label: '.style.padding =' },
]

/**
 * CSS properties that trigger layout recalc when animated.
 * Used to scan @keyframes blocks and transition declarations.
 */
const LAYOUT_CSS_PROPS = [
  'width',
  'height',
  'top',
  'left',
  'right',
  'bottom',
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
]

/**
 * Motion animate/initial/exit properties that trigger layout recalc.
 * Motion applies these as real CSS properties, not transforms.
 */
const LAYOUT_MOTION_PROPS = ['width', 'height', 'top', 'left', 'right', 'bottom']

// ─── Source helpers ───────────────────────────────────────────────────────────

/** Strips single-line and multi-line comments from JS/TS source. */
function stripJsComments(source) {
  // Remove multi-line comments, then single-line comments.
  // Preserves string literals by skipping quoted content.
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '')
}

/**
 * Reads a file at the given path, returning its content or null on failure.
 */
function readFileSafe(filePath) {
  try {
    return readFileSync(filePath, 'utf8')
  } catch {
    return null
  }
}

/**
 * Detects whether the given JS/TS source uses requestAnimationFrame.
 * Returns the first matched pattern label, or null.
 */
function detectRaf(source) {
  const stripped = stripJsComments(source)
  for (const pattern of RAF_PATTERNS) {
    if (pattern.test(stripped)) {
      return stripped.match(pattern)[0]
    }
  }
  return null
}

/**
 * Detects whether the given JS/TS source uses layout-recalc-triggering APIs.
 * Returns the first matched label, or null.
 */
function detectLrcInJs(source) {
  const stripped = stripJsComments(source)

  // Check direct DOM API patterns
  for (const { pattern, label } of LRC_JS_PATTERNS) {
    if (pattern.test(stripped)) {
      return label
    }
  }

  // Check Motion animate/initial/exit with layout properties.
  // Match animate={{ ... }}, initial={{ ... }}, exit={{ ... }} spanning multiple lines.
  const motionPropRe = /\b(?:animate|initial|exit)\s*=\s*\{\{([\s\S]*?)\}\}/g
  let match
  while ((match = motionPropRe.exec(stripped)) !== null) {
    const objContent = match[1]
    for (const prop of LAYOUT_MOTION_PROPS) {
      // Match property name at start of line or after comma/whitespace, followed by colon
      const propRe = new RegExp(`\\b${prop}\\s*:`)
      if (propRe.test(objContent)) {
        return `Motion animate={{ ${prop}: ... }}`
      }
    }
  }

  return null
}

/**
 * Detects layout-recalc-triggering patterns in CSS source.
 * Checks inside @keyframes blocks and transition declarations.
 * Returns the first matched description, or null.
 */
function detectLrcInCss(cssSource) {
  // Build a regex that matches any layout property as a CSS declaration
  const layoutPropPattern = new RegExp(
    `(?:^|[{;\\s])(${LAYOUT_CSS_PROPS.join('|')})\\s*:`,
    'm'
  )

  // Extract @keyframes blocks and check for layout properties inside them
  const keyframeBlockRe = /@keyframes\s+[\w-]+\s*\{/g
  let kfMatch
  while ((kfMatch = keyframeBlockRe.exec(cssSource)) !== null) {
    // Find the matching closing brace for this @keyframes block
    let depth = 1
    let i = kfMatch.index + kfMatch[0].length
    const start = i
    while (i < cssSource.length && depth > 0) {
      if (cssSource[i] === '{') depth++
      if (cssSource[i] === '}') depth--
      i++
    }
    const blockContent = cssSource.slice(start, i - 1)
    const propMatch = blockContent.match(layoutPropPattern)
    if (propMatch) {
      return `CSS @keyframes animates '${propMatch[1]}'`
    }
  }

  // Check transition declarations for layout properties.
  // Match: transition: width 0.3s, transition-property: width height
  const transitionRe = /transition(?:-property)?\s*:\s*([^;{}]+)/g
  let tMatch
  while ((tMatch = transitionRe.exec(cssSource)) !== null) {
    const value = tMatch[1]
    for (const prop of LAYOUT_CSS_PROPS) {
      if (new RegExp(`\\b${prop}\\b`).test(value)) {
        return `CSS transition on '${prop}'`
      }
    }
  }

  return null
}

// ─── Rule definition ─────────────────────────────────────────────────────────

const perfRules = {
  /**
   * Requires 'raf' and/or 'lrc' tags in animation metadata when the component
   * source uses requestAnimationFrame or layout-recalc-triggering patterns.
   *
   * Runs on .meta.ts files in css/ or framer/ directories. Reads the sibling
   * .tsx component file and any co-located .css file to detect patterns.
   *
   * Only errors on missing tags — manually added tags for transitive usage
   * (via imported helpers) are never flagged as extraneous.
   */
  'require-perf-tags': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Animation metadata must declare raf/lrc tags when the component uses requestAnimationFrame or layout-recalc-triggering APIs.',
      },
      schema: [],
    },
    create(context) {
      const filename = getFilename(context)
      if (!filename.endsWith('.meta.ts')) return {}
      if (!filename.includes('/css/') && !filename.includes('/framer/')) return {}

      // Collect declared tags from the metadata AST
      let tagsNode = null
      const declaredTags = new Set()

      return {
        Property(node) {
          const name = node.key?.name || node.key?.value
          if (name !== 'tags') return
          tagsNode = node

          // Extract string values from the tags array
          if (node.value?.type === 'ArrayExpression') {
            for (const el of node.value.elements) {
              if (el?.type === 'Literal' && typeof el.value === 'string') {
                declaredTags.add(el.value)
              }
            }
          }
        },

        'Program:exit'() {
          const dir = dirname(filename)
          const base = basename(filename, '.meta.ts')

          // Read sibling .tsx
          const tsxPath = resolve(dir, `${base}.tsx`)
          const tsxSource = readFileSafe(tsxPath)
          if (tsxSource === null) return // No component file — other rules handle this

          // Read sibling .css (may not exist for framer variants)
          const cssPath = resolve(dir, `${base}.css`)
          const cssSource = readFileSafe(cssPath)

          // ── Detect RAF ──
          const rafEvidence = detectRaf(tsxSource)
          if (rafEvidence !== null && !declaredTags.has('raf')) {
            const loc = tagsNode?.loc ?? { line: 1, column: 0 }
            context.report({
              loc: loc.start ?? loc,
              message: `Component uses ${rafEvidence} but metadata is missing 'raf' tag. Add tags: ['raf'] to ${base}.meta.ts.`,
            })
          }

          // ── Detect LRC ──
          const lrcJsEvidence = detectLrcInJs(tsxSource)
          const lrcCssEvidence = cssSource !== null ? detectLrcInCss(cssSource) : null
          const lrcEvidence = lrcJsEvidence ?? lrcCssEvidence

          if (lrcEvidence !== null && !declaredTags.has('lrc')) {
            const loc = tagsNode?.loc ?? { line: 1, column: 0 }
            context.report({
              loc: loc.start ?? loc,
              message: `Component uses ${lrcEvidence} which triggers layout recalculation, but metadata is missing 'lrc' tag. Add tags: ['lrc'] to ${base}.meta.ts.`,
            })
          }
        },
      }
    },
  },
}

export { perfRules }
