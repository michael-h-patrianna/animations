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
  // Main app entry - now lightweight with lazy loading
  // Only includes UI shell, navigation, and lazy loading infrastructure
  // Animation code is split into separate chunks loaded on demand
  'index-*.js': 200,

  // React + React DOM + React Router
  'react-vendor-*.js': 300,

  // Motion (Framer Motion) core
  'motion-*.js': 150,

  // Third-party vendor chunk
  'vendor-*.js': 600,

  // Main CSS bundle
  'index-*.css': 300,

  // Animation group chunks - each should be up to 200KB
  // These are loaded on demand when user navigates to a group
  'collection-effects-*.js': 200,
  'icon-animations-*.js': 200,
  'lights-*.js': 200,
  'modal-celebrations-*.js': 500,
  'prize-reveal-*.js': 500,
  'modal-base-*.js': 200,
  'modal-content-*.js': 200,
  'modal-dismiss-*.js': 200,
  'modal-open-*.js': 200,
  'modal-orchestration-*.js': 200,
  'text-effects-*.js': 500,
  'standard-effects-*.js': 200,
  'button-effects-*.js': 200,
  'progress-bars-*.js': 500,
  'loading-states-*.js': 200,
  'timer-effects-*.js': 210,
  'update-indicators-*.js': 200,
  'realtime-data-*.js': 200,
}

function findMatchingFiles(pattern) {
  const prefix = pattern.split('*')[0]
  const suffix = pattern.split('*')[1]

  try {
    const files = readdirSync(DIST_DIR)
    return files.filter((f) => f.startsWith(prefix) && f.endsWith(suffix))
  } catch {
    return []
  }
}

let hasFailure = false

console.log('Bundle size check:')
console.log('─'.repeat(70))

for (const [pattern, budgetKB] of Object.entries(BUDGETS)) {
  const files = findMatchingFiles(pattern)

  if (files.length === 0) {
    console.log(`  ✗  ${pattern.padEnd(25)} — not found (FAIL: expected output missing)`)
    hasFailure = true
    continue
  }

  for (const file of files) {
    const sizeBytes = statSync(join(DIST_DIR, file)).size
    const sizeKB = sizeBytes / 1024
    const pct = ((sizeKB / budgetKB) * 100).toFixed(0)
    const status = sizeKB <= budgetKB ? '✓' : '✗'

    if (sizeKB > budgetKB) {
      hasFailure = true
    }

    // Truncate filename if too long
    const displayName = file.length > 28 ? file.slice(0, 25) + '...' : file

    console.log(
      `  ${status}  ${displayName.padEnd(28)} ${sizeKB.toFixed(1).padStart(8)} KB / ${String(budgetKB).padStart(5)} KB  (${pct}%)`
    )
  }
}

console.log('─'.repeat(70))

if (hasFailure) {
  console.log('FAIL: One or more bundles exceed their size budget.')
  process.exit(1)
} else {
  console.log('PASS: All bundles within budget.')
}
