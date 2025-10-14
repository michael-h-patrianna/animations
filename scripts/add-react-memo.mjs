#!/usr/bin/env node

/**
 * Script to automatically wrap React components with React.memo
 *
 * This script scans all animation component files in src/components/base/
 * and wraps their exports with React.memo for performance optimization.
 *
 * Usage: node scripts/add-react-memo.mjs [--dry-run]
 */

import { readFileSync, writeFileSync } from 'fs'
import { glob } from 'glob'

const isDryRun = process.argv.includes('--dry-run')

/**
 * Process a single file to add React.memo
 */
function processFile(filePath) {
  const content = readFileSync(filePath, 'utf-8')

  // Skip if already using memo
  if (content.includes('memo(') || content.includes('React.memo(')) {
    console.log(`⏭️  Skipping ${filePath} - already memoized`)
    return { modified: false }
  }

  // Check if file has React import
  const hasReactImport = /import.*from ['"]react['"]/.test(content)

  // Find export pattern
  const exportFunctionMatch = content.match(/export\s+function\s+(\w+)/)
  const exportConstMatch = content.match(/export\s+const\s+(\w+)\s*=/)

  if (!exportFunctionMatch && !exportConstMatch) {
    console.log(`⚠️  Skipping ${filePath} - no export function or const found`)
    return { modified: false }
  }

  let newContent = content
  const componentName = exportFunctionMatch ? exportFunctionMatch[1] : exportConstMatch[1]

  // Add memo to React import or create new import
  if (hasReactImport) {
    // Check if import already includes memo
    const reactImportMatch = content.match(/import\s+{([^}]+)}\s+from\s+['"]react['"]/)
    if (reactImportMatch) {
      const imports = reactImportMatch[1]
      if (!imports.includes('memo')) {
        // Add memo to existing import
        const newImports = imports.trim() + ', memo'
        newContent = newContent.replace(
          /import\s+{[^}]+}\s+from\s+['"]react['"]/,
          `import { ${newImports} } from 'react'`
        )
      }
    } else {
      // Has React import but not destructured - add separate memo import
      newContent = newContent.replace(
        /import.*from ['"]react['"]/,
        `$&\nimport { memo } from 'react'`
      )
    }
  } else {
    // Add new React import with memo
    newContent = `import { memo } from 'react'\n${newContent}`
  }

  if (exportFunctionMatch) {
    // Pattern: export function ComponentName
    // Convert to: function ComponentNameComponent = ... then export const ComponentName = memo(...)

    // Find the full function including its body
    const functionStartIndex = newContent.indexOf(`export function ${componentName}`)
    const functionBodyStart = newContent.indexOf('{', functionStartIndex)

    // Find the matching closing brace
    let braceCount = 1
    let currentIndex = functionBodyStart + 1
    while (braceCount > 0 && currentIndex < newContent.length) {
      if (newContent[currentIndex] === '{') braceCount++
      if (newContent[currentIndex] === '}') braceCount--
      currentIndex++
    }

    const functionEnd = currentIndex
    const fullFunction = newContent.substring(functionStartIndex, functionEnd)

    // Replace export function with function (keep function keyword)
    const unexportedFunction = fullFunction.replace('export function', 'function')

    // Add memoized export after the function
    const memoizedExport = `\n\n/**\n * Memoized ${componentName} to prevent unnecessary re-renders in grid layouts.\n */\nexport const ${componentName} = memo(${componentName}Component)`

    // Rename the function to ComponentNameComponent
    const renamedFunction = unexportedFunction.replace(
      `function ${componentName}`,
      `function ${componentName}Component`
    )

    newContent =
      newContent.substring(0, functionStartIndex) +
      renamedFunction +
      memoizedExport +
      newContent.substring(functionEnd)
  } else if (exportConstMatch) {
    // Pattern: export const ComponentName = ...
    // Just wrap the value with memo
    const constMatch = newContent.match(new RegExp(`export const ${componentName}\\s*=\\s*([^;]+)`))
    if (constMatch) {
      const originalValue = constMatch[1].trim()

      // If it's an arrow function or function expression, wrap it
      newContent = newContent.replace(
        new RegExp(`export const ${componentName}\\s*=\\s*${escapeRegex(originalValue)}`),
        `const ${componentName}Component = ${originalValue}\n\n/**\n * Memoized ${componentName} to prevent unnecessary re-renders in grid layouts.\n */\nexport const ${componentName} = memo(${componentName}Component)`
      )
    }
  }

  return {
    modified: true,
    content: newContent,
  }
}

/**
 * Escape special regex characters
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Main execution
 */
async function main() {
  console.log('🔍 Scanning for animation components...\n')

  // Find all TypeScript/TSX files in base components, excluding metadata files
  const files = await glob('src/components/base/**/*.{ts,tsx}', {
    cwd: process.cwd(),
    absolute: true,
    ignore: [
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/*.spec.ts',
      '**/*.spec.tsx',
      '**/*.meta.ts', // Exclude metadata files - they export plain objects, not components
    ],
  })

  console.log(`Found ${files.length} component files\n`)

  let modifiedCount = 0
  let skippedCount = 0

  for (const file of files) {
    const result = processFile(file)

    if (result.modified) {
      modifiedCount++

      if (isDryRun) {
        console.log(`✓ Would modify: ${file}`)
      } else {
        writeFileSync(file, result.content, 'utf-8')
        console.log(`✓ Modified: ${file}`)
      }
    } else {
      skippedCount++
    }
  }

  console.log(`\n${'='.repeat(60)}`)
  console.log(`\nSummary:`)
  console.log(`  Modified: ${modifiedCount}`)
  console.log(`  Skipped: ${skippedCount}`)
  console.log(`  Total: ${files.length}`)

  if (isDryRun) {
    console.log(`\n⚠️  DRY RUN - No files were actually modified`)
    console.log(`Remove --dry-run flag to apply changes\n`)
  } else {
    console.log(`\n✓ All done! Run tests to verify animations still work correctly.\n`)
  }
}

main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
