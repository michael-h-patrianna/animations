#!/usr/bin/env node

/**
 * Bundle size budget checker.
 *
 * Runs after `npm run build` and verifies that the main entry chunks
 * stay within defined size budgets. Fails with exit code 1 if any
 * budget is exceeded.
 *
 * Usage: node scripts/check-bundle-size.mjs
 */

import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const DIST_DIR = join(import.meta.dirname, '..', 'dist', 'assets')

/** Size budgets in KB (uncompressed). */
const BUDGETS = {
  // Main app entry — includes all eager imports (registry, UI components, types,
  // plus raw source code for all animations for the code viewer feature).
  // Budget is uncompressed KB. Gzip is ~84KB at current size. Increased to 650
  // to accommodate 100+ animations with their source code embedded for the code viewer.
  'index-*.js': 650,
  // React + React DOM + React Router
  'react-vendor-*.js': 300,
  // Motion (Framer Motion) core
  'motion-*.js': 150,
  // Third-party vendor chunk (Radix, shiki, etc.)
  'vendor-*.js': 600,
  // Main CSS bundle
  'index-*.css': 300,
}

function findMatchingFile(pattern) {
  const prefix = pattern.split('*')[0]
  const suffix = pattern.split('*')[1]

  try {
    const files = readdirSync(DIST_DIR)
    return files.find((f) => f.startsWith(prefix) && f.endsWith(suffix))
  } catch {
    return undefined
  }
}

let hasFailure = false

console.log('Bundle size check:')
console.log('─'.repeat(60))

for (const [pattern, budgetKB] of Object.entries(BUDGETS)) {
  const file = findMatchingFile(pattern)

  if (!file) {
    console.log(`  ⚠  ${pattern.padEnd(25)} — not found (skipped)`)
    continue
  }

  const sizeBytes = statSync(join(DIST_DIR, file)).size
  const sizeKB = sizeBytes / 1024
  const pct = ((sizeKB / budgetKB) * 100).toFixed(0)
  const status = sizeKB <= budgetKB ? '✓' : '✗'

  if (sizeKB > budgetKB) {
    hasFailure = true
  }

  console.log(
    `  ${status}  ${pattern.padEnd(25)} ${sizeKB.toFixed(1).padStart(8)} KB / ${String(budgetKB).padStart(5)} KB  (${pct}%)`
  )
}

console.log('─'.repeat(60))

if (hasFailure) {
  console.log('FAIL: One or more bundles exceed their size budget.')
  process.exit(1)
} else {
  console.log('PASS: All bundles within budget.')
}
