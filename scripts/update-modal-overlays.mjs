#!/usr/bin/env node

/**
 * Script to replace inline overlay opacity styles with tokenized overlay styles
 * in all modal components.
 *
 * Usage: node scripts/update-modal-overlays.mjs
 */

import { readFileSync, writeFileSync } from 'fs'
import { glob } from 'glob'

const OPACITY_TO_TOKEN = {
  0.68: 'overlayStyles.standard',
  0.7: 'overlayStyles.standard',
  0.72: 'overlayStyles.standard',
  0.76: 'overlayStyles.standard',
  0.4: 'overlayStyles.subtle',
  0.85: 'overlayStyles.strong',
}

function processFile(filePath) {
  let content = readFileSync(filePath, 'utf-8')
  let modified = false

  // Check if file uses inline overlay opacity
  if (!content.includes('--overlay-opacity')) {
    return { modified: false }
  }

  // Extract the opacity value
  const opacityMatch = content.match(/\['--overlay-opacity'[^\]]+\]:\s*'([\d.]+)'/)
  if (!opacityMatch) {
    return { modified: false }
  }

  const opacityValue = opacityMatch[1]
  const tokenStyle = OPACITY_TO_TOKEN[opacityValue] || 'overlayStyles.standard'

  // Remove CSSProperties import if it exists and is only used for this
  const hasCSSPropertiesImport = content.includes("import type { CSSProperties } from 'react'")
  const cssPropertiesUsages = content.match(/CSSProperties/g)
  const cssPropertiesOnlyUsedForOverlay =
    hasCSSPropertiesImport && cssPropertiesUsages && cssPropertiesUsages.length <= 3 // Import + 2 uses in overlay style

  if (cssPropertiesOnlyUsedForOverlay) {
    content = content.replace(/import type { CSSProperties } from 'react'\n/, '')
    modified = true
  }

  // Add overlay styles import if not present
  if (!content.includes("from '@/motion/primitives'")) {
    // Find the import section
    const firstImportIndex = content.indexOf('import')
    const lastImportIndex = content.lastIndexOf('import')
    const insertPosition = content.indexOf('\n', lastImportIndex) + 1

    content =
      content.substring(0, insertPosition) +
      "import { overlayStyles } from '@/motion/primitives'\n" +
      content.substring(insertPosition)
    modified = true
  }

  // Replace the inline style with token style
  const oldStylePattern = /style=\{\s*\{\s*\['--overlay-opacity'[^\}]+\}\s*as\s*CSSProperties\s*\}/
  if (oldStylePattern.test(content)) {
    content = content.replace(oldStylePattern, `style={${tokenStyle}}`)
    modified = true
  }

  return {
    modified,
    content,
  }
}

async function main() {
  console.log('🔍 Scanning for modal components with inline overlay styles...\n')

  const files = await glob('src/components/dialogs/modal-base/**/*.tsx', {
    cwd: process.cwd(),
    absolute: true,
  })

  console.log(`Found ${files.length} modal component files\n`)

  let modifiedCount = 0

  for (const file of files) {
    const result = processFile(file)

    if (result.modified) {
      modifiedCount++
      writeFileSync(file, result.content, 'utf-8')
      console.log(`✓ Updated: ${file}`)
    }
  }

  console.log(`\n${'='.repeat(60)}`)
  console.log(`\nSummary:`)
  console.log(`  Modified: ${modifiedCount}`)
  console.log(`  Total: ${files.length}`)
  console.log(`\n✓ All done!\n`)
}

main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
