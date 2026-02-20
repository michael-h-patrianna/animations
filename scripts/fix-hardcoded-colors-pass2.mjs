/**
 * Second-pass fixer for hardcoded colors that the line-based script missed.
 * Uses postcss to properly parse multi-line CSS values (box-shadow, background, etc.)
 * and extract colors into custom properties.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { basename, dirname } from 'node:path'
import postcss from 'postcss'

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const globArg = args.find((a) => !a.startsWith('--')) || 'src/**/*.css'

const COLOR_PROPS = new Set([
  'color', 'background-color', 'background', 'border-color', 'border',
  'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color',
  'outline-color', 'outline', 'box-shadow', 'text-shadow', 'text-decoration-color',
  'fill', 'stroke', 'stop-color', 'flood-color', 'lighting-color',
  'column-rule-color', 'caret-color', 'accent-color',
])

const HEX_RE = /#(?:[0-9a-fA-F]{3,4}){1,2}(?!\w)/g
const RGB_RE = /\brgba?\s*\([^)]+\)/gi
const HSL_RE = /\bhsla?\s*\([^)]+\)/gi

function getPrefix(filePath) {
  const name = basename(filePath, '.css')
  if (name === 'shared') return basename(dirname(filePath))
  return name.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')
}

function extractColors(value) {
  const colors = []
  for (const m of value.matchAll(RGB_RE)) colors.push(m[0])
  for (const m of value.matchAll(HSL_RE)) colors.push(m[0])
  for (const m of value.matchAll(HEX_RE)) {
    let inside = false
    for (const c of colors) {
      const ci = value.indexOf(c)
      if (m.index >= ci && m.index < ci + c.length) { inside = true; break }
    }
    if (!inside) colors.push(m[0])
  }
  return colors
}

function makeVarName(prefix, prop, index) {
  const p = prop
    .replace('background-color', 'bg').replace('background', 'bg')
    .replace('border-color', 'border').replace('box-shadow', 'shadow')
    .replace('text-shadow', 'text-shadow').replace('text-decoration-color', 'decoration')
  return `--${prefix}-${p}-${index}`
}

// Get files with violations
const output = execSync(`npx stylelint "${globArg}" 2>&1 || true`, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 })
const fileSet = new Set()
let currentFile = ''
for (const line of output.split('\n')) {
  if (line.endsWith('.css') && !line.startsWith(' ')) currentFile = line.trim()
  if (line.includes('animation-rules/no-hardcoded-colors')) fileSet.add(currentFile)
}

const files = [...fileSet].sort()
console.log(`${dryRun ? '[DRY RUN] ' : ''}Found ${files.length} files with remaining hardcoded colors\n`)

let totalFixed = 0

for (const file of files) {
  try {
    const css = readFileSync(file, 'utf8')
    const root = postcss.parse(css, { from: file })
    const prefix = getPrefix(file)

    // Find the first rule to inject variables into
    let firstRule = null
    root.walk((node) => {
      if (!firstRule && node.type === 'rule') firstRule = node
    })
    if (!firstRule) { console.log(`  SKIP ${file} (no rules found)`); continue }

    // Collect colors that need extraction from declarations
    const colorMap = new Map() // color string -> var name
    let varIndex = 100 // Start at high index to avoid conflicts with pass 1
    const declsToFix = []

    root.walkDecls((decl) => {
      if (!COLOR_PROPS.has(decl.prop)) return
      if (decl.prop.startsWith('--')) return // Skip custom property definitions
      if (/\bvar\s*\(/.test(decl.value) && !HEX_RE.test(decl.value) && !RGB_RE.test(decl.value) && !HSL_RE.test(decl.value)) return

      const colors = extractColors(decl.value)
      if (colors.length === 0) return

      for (const color of colors) {
        if (!colorMap.has(color)) {
          colorMap.set(color, makeVarName(prefix, decl.prop, varIndex++))
        }
      }
      declsToFix.push(decl)
    })

    if (colorMap.size === 0) { console.log(`  SKIP ${file} (no fixable colors)`); continue }

    // Replace colors with var() references
    for (const decl of declsToFix) {
      let newValue = decl.value
      for (const [color, varName] of colorMap) {
        // Escape for regex
        const escaped = color.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        newValue = newValue.replace(new RegExp(escaped, 'g'), `var(${varName})`)
      }
      decl.value = newValue
    }

    // Inject custom property declarations at the top of the first rule
    const existingVarDecls = []
    firstRule.walkDecls((d) => { if (d.prop.startsWith('--')) existingVarDecls.push(d) })
    const insertAfter = existingVarDecls.length > 0
      ? existingVarDecls[existingVarDecls.length - 1]
      : null

    const newDecls = []
    for (const [color, varName] of colorMap) {
      newDecls.push(postcss.decl({ prop: varName, value: color }))
    }

    if (insertAfter) {
      for (const d of newDecls.reverse()) firstRule.insertAfter(insertAfter, d)
    } else {
      for (const d of newDecls.reverse()) firstRule.prepend(d)
    }

    const result = root.toString()
    if (result === css) { console.log(`  SKIP ${file} (no changes)`); continue }

    if (dryRun) {
      console.log(`  WOULD FIX ${file}: ${colorMap.size} colors`)
    } else {
      writeFileSync(file, result, 'utf8')
      console.log(`  FIXED ${file}: ${colorMap.size} colors`)
    }
    totalFixed++
  } catch (err) {
    console.error(`  ERROR ${file}: ${err.message}`)
  }
}

console.log(`\n${dryRun ? 'Would fix' : 'Fixed'} ${totalFixed} files`)
