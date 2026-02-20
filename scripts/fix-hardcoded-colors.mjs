/**
 * Transforms hardcoded CSS color values into CSS custom properties.
 *
 * For each CSS file with hardcoded colors:
 * 1. Extracts all unique color values from color-related properties
 * 2. Generates semantic variable names based on usage context
 * 3. Declares them as custom properties on the first rule's selector
 * 4. Replaces inline values with var() references
 *
 * Usage: node scripts/fix-hardcoded-colors.mjs [--dry-run] [glob]
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { basename, dirname } from 'node:path'

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const globArg = args.find((a) => !a.startsWith('--')) || 'src/**/*.css'

// Color-related properties where we check for hardcoded values
const COLOR_PROPS = new Set([
  'color',
  'background-color',
  'background',
  'border-color',
  'border',
  'border-top-color',
  'border-right-color',
  'border-bottom-color',
  'border-left-color',
  'outline-color',
  'outline',
  'box-shadow',
  'text-shadow',
  'text-decoration-color',
  'fill',
  'stroke',
  'stop-color',
  'flood-color',
  'lighting-color',
  'column-rule-color',
  'caret-color',
  'accent-color',
])

const SKIP_VALUES = new Set([
  'transparent',
  'currentcolor',
  'currentColor',
  'inherit',
  'initial',
  'unset',
  'revert',
  'none',
])

// Patterns to match color values
const HEX_RE = /#(?:[0-9a-fA-F]{3,4}){1,2}/g
const RGB_RE = /rgba?\s*\([^)]+\)/gi
const HSL_RE = /hsla?\s*\([^)]+\)/gi

/**
 * Extract a prefix from the filename for variable naming.
 * ModalBaseSpringBounce.css -> modal-base-spring-bounce
 * shared.css -> uses parent dir name
 */
function getPrefix(filePath) {
  const name = basename(filePath, '.css')
  if (name === 'shared') {
    const parentDir = basename(dirname(filePath))
    return parentDir
  }
  // Convert PascalCase to kebab-case
  return name
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '')
}

/**
 * Generate a semantic variable name based on property and color index.
 */
function makeVarName(prefix, prop, index, total) {
  const propSuffix = prop
    .replace('background-color', 'bg')
    .replace('background', 'bg')
    .replace('border-color', 'border')
    .replace('box-shadow', 'shadow')
    .replace('text-shadow', 'text-shadow')
    .replace('text-decoration-color', 'decoration')
    .replace('outline-color', 'outline')
    .replace('border-top-color', 'border-top')
    .replace('border-right-color', 'border-right')
    .replace('border-bottom-color', 'border-bottom')
    .replace('border-left-color', 'border-left')

  const suffix = total > 1 ? `-${index + 1}` : ''
  return `--${prefix}-${propSuffix}${suffix}`
}

/**
 * Extract all color values from a CSS value string.
 */
function extractColors(value) {
  const colors = []
  // Extract rgb/rgba first (they contain parens which would break other matching)
  let cleaned = value
  for (const match of value.matchAll(RGB_RE)) {
    colors.push(match[0])
    cleaned = cleaned.replace(match[0], `__COLOR_${colors.length - 1}__`)
  }
  for (const match of cleaned.matchAll(HSL_RE)) {
    colors.push(match[0])
  }
  // Reset and check for hex
  for (const match of value.matchAll(HEX_RE)) {
    // Make sure this hex isn't inside an already-extracted rgb/hsl
    const pos = value.indexOf(match[0])
    let insideFunc = false
    for (const c of colors) {
      const cPos = value.indexOf(c)
      if (pos >= cPos && pos < cPos + c.length) {
        insideFunc = true
        break
      }
    }
    if (!insideFunc) {
      colors.push(match[0])
    }
  }
  return colors.filter((c) => !SKIP_VALUES.has(c.trim().toLowerCase()))
}

/**
 * Check if a CSS value contains var() references (already using custom properties)
 */
function hasVarRef(value) {
  return /\bvar\s*\(/.test(value)
}

/**
 * Process a single CSS file.
 */
function processFile(filePath) {
  const content = readFileSync(filePath, 'utf8')
  const prefix = getPrefix(filePath)

  // Parse declarations that have hardcoded colors
  // We'll track: { prop, originalValue, colors[], line }
  const colorDecls = []
  const lines = content.split('\n')

  // Simple CSS parser - find property: value pairs in color properties
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    // Skip comments, empty lines, selectors, closing braces
    if (!line || line.startsWith('/*') || line.startsWith('*') || line.startsWith('//')) continue
    if (line.endsWith('{') || line === '}') continue
    if (line.startsWith('@')) continue

    // Match property: value
    const declMatch = line.match(/^([\w-]+)\s*:\s*(.+?)\s*;?\s*$/)
    if (!declMatch) continue

    const [, prop, value] = declMatch
    if (!COLOR_PROPS.has(prop)) continue
    if (hasVarRef(value)) continue // Already using variables

    const colors = extractColors(value)
    if (colors.length > 0) {
      colorDecls.push({ prop, value, colors, lineIndex: i })
    }
  }

  if (colorDecls.length === 0) return null

  // Build a map of unique colors to variable names
  // Group by property to generate better names
  const colorToVar = new Map()
  const propCounts = new Map()

  for (const decl of colorDecls) {
    for (const color of decl.colors) {
      if (colorToVar.has(color)) continue

      const count = propCounts.get(decl.prop) || 0
      propCounts.set(decl.prop, count + 1)

      // Count total colors for this prop to decide if we need numbering
      const totalForProp = colorDecls.filter((d) => d.prop === decl.prop).reduce((sum, d) => sum + d.colors.length, 0)

      const varName = makeVarName(prefix, decl.prop, count, totalForProp)
      colorToVar.set(color, varName)
    }
  }

  // Build the custom property declarations block
  const varDecls = []
  for (const [color, varName] of colorToVar) {
    varDecls.push(`  ${varName}: ${color};`)
  }

  // Replace hardcoded colors with var() references in the content
  let newContent = content
  for (const [color, varName] of colorToVar) {
    // Escape regex special chars in the color value
    const escaped = color.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    // Replace all occurrences but not inside custom property declarations (lines starting with --)
    const regex = new RegExp(escaped, 'g')
    const newLines = newContent.split('\n')
    for (let i = 0; i < newLines.length; i++) {
      const trimmed = newLines[i].trim()
      // Skip lines that ARE custom property declarations
      if (trimmed.startsWith('--')) continue
      newLines[i] = newLines[i].replace(regex, `var(${varName})`)
    }
    newContent = newLines.join('\n')
  }

  // Find the first rule's opening brace to insert custom properties
  const firstBraceIndex = newContent.indexOf('{')
  if (firstBraceIndex === -1) return null

  // Find the next line after the opening brace
  const afterBrace = newContent.indexOf('\n', firstBraceIndex)
  if (afterBrace === -1) return null

  // Check if there are already custom property declarations right after the brace
  const nextContent = newContent.slice(afterBrace + 1).trimStart()
  const hasExistingVars = nextContent.startsWith('  --')

  // Insert our variable declarations
  const insertion = (hasExistingVars ? '' : '\n') + varDecls.join('\n') + '\n'
  newContent = newContent.slice(0, afterBrace + 1) + insertion + newContent.slice(afterBrace + 1)

  return { original: content, transformed: newContent, colorCount: colorToVar.size, declCount: colorDecls.length }
}

// Main
console.log(`${dryRun ? '[DRY RUN] ' : ''}Fixing hardcoded colors in: ${globArg}\n`)

// Get list of files with violations from stylelint
const output = execSync(`npx stylelint "${globArg}" 2>&1 || true`, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 })
const fileSet = new Set()
const fileLines = output.split('\n')
let currentFile = ''
for (const line of fileLines) {
  if (line.endsWith('.css') && !line.startsWith(' ')) {
    currentFile = line.trim()
  }
  if (line.includes('animation-rules/no-hardcoded-colors')) {
    fileSet.add(currentFile)
  }
}

const files = [...fileSet].sort()
console.log(`Found ${files.length} files with hardcoded colors\n`)

let totalFixed = 0
let totalColors = 0

for (const file of files) {
  try {
    const result = processFile(file)
    if (!result) {
      console.log(`  SKIP ${file} (no changes needed)`)
      continue
    }

    if (dryRun) {
      console.log(`  WOULD FIX ${file}: ${result.colorCount} colors in ${result.declCount} declarations`)
    } else {
      writeFileSync(file, result.transformed, 'utf8')
      console.log(`  FIXED ${file}: ${result.colorCount} colors in ${result.declCount} declarations`)
    }
    totalFixed++
    totalColors += result.colorCount
  } catch (err) {
    console.error(`  ERROR ${file}: ${err.message}`)
  }
}

console.log(`\n${dryRun ? 'Would fix' : 'Fixed'} ${totalFixed} files, ${totalColors} unique color values extracted to custom properties`)
