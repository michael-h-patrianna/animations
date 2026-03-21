/**
 * Auto-classify animation portability tiers.
 *
 * Analyzes imports in each animation .tsx to compute the minimum tier,
 * then writes `tier: N` into the corresponding .meta.ts files.
 * Pairs CSS/framer variants and uses the max tier across both.
 *
 * Usage: node scripts/classify-tiers.mjs [--dry-run]
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ANIM_ROOT = resolve(__dirname, '../src/components')
const DRY_RUN = process.argv.includes('--dry-run')

// ── Helpers ─────────────────────────────────────────────────────────────

function walkDir(dir, predicate) {
  const results = []
  let entries
  try {
    entries = readdirSync(dir)
  } catch {
    return results
  }
  for (const entry of entries) {
    const full = join(dir, entry)
    let stat
    try {
      stat = statSync(full)
    } catch {
      continue
    }
    if (stat.isDirectory()) results.push(...walkDir(full, predicate))
    else if (predicate(full)) results.push(full)
  }
  return results
}

function extractImports(filePath) {
  const content = readFileSync(filePath, 'utf8')
  const imports = []
  let match

  const fromPattern = /import\s+[\s\S]*?from\s+['"]([^'"]+)['"]/g
  while ((match = fromPattern.exec(content)) !== null) imports.push(match[1])

  const barePattern = /import\s+['"]([^'"]+)['"]/g
  while ((match = barePattern.exec(content)) !== null) imports.push(match[1])

  return [...new Set(imports)]
}

function computeMinimumTier(imports) {
  const projectImports = imports.filter((s) => s.startsWith('@/'))
  if (projectImports.length === 0) return 1

  const hasAssets = projectImports.some((s) => s.startsWith('@/assets'))
  if (hasAssets) return 4

  const extractable = ['@/motion/', '@/utils/', '@/types/']
  const allExtractable = projectImports.every((s) =>
    extractable.some((prefix) => s.startsWith(prefix))
  )
  if (allExtractable) return 2

  return 4
}

// ── Scan ────────────────────────────────────────────────────────────────

const animFiles = walkDir(ANIM_ROOT, (f) => {
  if (!f.endsWith('.tsx')) return false
  const dir = basename(dirname(f))
  if (dir !== 'css' && dir !== 'framer') return false
  const base = basename(f, '.tsx')
  return (
    base !== 'index' &&
    !base.startsWith('Mock') &&
    !base.endsWith('Parts') &&
    !base.endsWith('Helpers')
  )
})

// Group by animation name, compute max tier across variants
const tierByName = new Map()

for (const file of animFiles) {
  const name = basename(file, '.tsx')
  const imports = extractImports(file)
  const minTier = computeMinimumTier(imports)
  const current = tierByName.get(name) ?? 0
  tierByName.set(name, Math.max(current, minTier))
}

// ── Write ───────────────────────────────────────────────────────────────

const metaFiles = walkDir(ANIM_ROOT, (f) => {
  if (!f.endsWith('.meta.ts')) return false
  const dir = basename(dirname(f))
  return dir === 'css' || dir === 'framer'
})

let updated = 0
let skipped = 0

for (const metaPath of metaFiles) {
  const content = readFileSync(metaPath, 'utf8')

  // Skip if already has tier
  if (/\btier\s*:\s*[1-4]\b/.test(content)) {
    skipped++
    continue
  }

  const name = basename(metaPath, '.meta.ts')
  const tier = tierByName.get(name)
  if (tier === undefined) {
    console.warn(`  SKIP ${basename(metaPath)} — no matching .tsx found`)
    continue
  }

  // Insert tier after the last existing property before the closing }
  // Strategy: find the last comma-terminated line before } and insert after it
  const lines = content.split('\n')
  let insertIndex = -1
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].trimEnd().endsWith(',')) {
      insertIndex = i + 1
      break
    }
  }

  if (insertIndex === -1) {
    console.warn(`  SKIP ${basename(metaPath)} — could not find insertion point`)
    continue
  }

  // Detect indentation from the previous line
  const indent = lines[insertIndex - 1].match(/^(\s*)/)[1]
  lines.splice(insertIndex, 0, `${indent}tier: ${tier},`)

  if (DRY_RUN) {
    console.log(
      `  [DRY] ${basename(dirname(dirname(metaPath)))}/${basename(dirname(metaPath))}/${basename(metaPath)} → tier ${tier}`
    )
  } else {
    writeFileSync(metaPath, lines.join('\n'))
  }
  updated++
}

console.log(
  `\nDone. Updated: ${updated}, Skipped (already has tier): ${skipped}, Total: ${metaFiles.length}`
)
if (DRY_RUN) console.log('(dry run — no files were modified)')
