// Architecture boundary tests -- verifies the import graph respects layer rules.
//
// Layer hierarchy (each layer may import from layers below it):
//   types -> (nothing)
//   utils -> types
//   services -> types, utils (NO React, NO components)
//   lib -> types, utils, services
//   motion -> types, motion/tokens
//   hooks -> types, utils, services, lib, contexts
//   animation components -> types, utils, motion, lib, demo-blocks (NO ui, NO other categories)
//   demo-ui -> types, hooks, contexts, services, demo-ui

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, it, expect } from 'vitest'

const SRC_DIR = join(__dirname, '..')

// ============================================================================
// Import Extraction
// ============================================================================

const IMPORT_RE = /(?:^|\n)\s*import\s+(?:type\s+)?(?:{[^}]*}|[^'"]*)\s+from\s+['"](@\/[^'"]+)['"]/g

/** Extracts all `@/` import paths from a TypeScript source file. */
function extractImports(filePath: string): string[] {
  const content = readFileSync(filePath, 'utf-8')
  const imports: string[] = []
  for (const match of content.matchAll(IMPORT_RE)) {
    imports.push(match[1]!)
  }
  return imports
}

/** Recursively collects all .ts/.tsx files under a directory. */
function collectFiles(dir: string, ext = /\.tsx?$/): string[] {
  const files: string[] = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) {
      if (entry === 'node_modules' || entry === '__tests__' || entry === 'test') continue
      files.push(...collectFiles(full, ext))
    } else if (ext.test(entry)) {
      files.push(full)
    }
  }
  return files
}

/** Converts an `@/` import path to its architectural layer. */
function classifyImportLayer(importPath: string): string {
  const rel = importPath.replace('@/', '')
  if (rel.startsWith('types/')) return 'types'
  if (rel.startsWith('utils/')) return 'utils'
  if (rel.startsWith('services/')) return 'services'
  if (rel.startsWith('lib/')) return 'lib'
  if (rel.startsWith('motion/')) return 'motion'
  if (rel.startsWith('hooks/')) return 'hooks'
  if (rel.startsWith('contexts/')) return 'contexts'
  if (rel.startsWith('demo-ui/')) return 'demo-ui'
  if (rel.startsWith('components/ui/')) return 'components-ui'
  if (rel.startsWith('components/demo-blocks/')) return 'demo-blocks'
  if (rel.startsWith('components/')) return 'animation'
  return 'other'
}

// ============================================================================
// Boundary Rules
// ============================================================================

/** Layers that each source layer is allowed to import from. */
const ALLOWED_IMPORTS: Record<string, Set<string>> = {
  types: new Set([]),
  utils: new Set(['types']),
  services: new Set(['types', 'utils', 'services']),
  lib: new Set(['types', 'utils', 'services', 'lib']),
  motion: new Set(['types', 'motion']),
  hooks: new Set(['types', 'utils', 'services', 'lib', 'hooks', 'contexts', 'other']),
  contexts: new Set(['types', 'utils', 'services', 'lib', 'hooks', 'contexts']),
  'demo-ui': new Set([
    'types',
    'utils',
    'services',
    'hooks',
    'contexts',
    'demo-ui',
    'components-ui',
    'demo-blocks',
  ]),
  'components-ui': new Set([
    'types',
    'utils',
    'services',
    'hooks',
    'contexts',
    'lib',
    'demo-ui',
    'components-ui',
    'demo-blocks',
  ]),
  animation: new Set(['types', 'utils', 'motion', 'lib', 'demo-blocks', 'animation']),
  'demo-blocks': new Set(['types', 'utils', 'demo-blocks']),
}

// ============================================================================
// Tests
// ============================================================================

describe('Architecture import boundaries', () => {
  const layers = ['types', 'utils', 'services', 'lib', 'motion'] as const

  for (const layer of layers) {
    it(`${layer}/ respects its import boundary`, () => {
      const dir = join(SRC_DIR, layer)
      let files: string[]
      try {
        files = collectFiles(dir)
      } catch {
        // Layer directory might not exist (e.g., empty utils/)
        return
      }

      const violations: string[] = []
      const allowed = ALLOWED_IMPORTS[layer]!

      for (const file of files) {
        for (const imp of extractImports(file)) {
          const importLayer = classifyImportLayer(imp)
          if (importLayer !== 'other' && !allowed.has(importLayer)) {
            const rel = relative(SRC_DIR, file)
            violations.push(`${rel} imports ${imp} (${layer}/ → ${importLayer}/ is forbidden)`)
          }
        }
      }

      expect(violations).toEqual([])
    })
  }

  it('services/ does not import React runtime values', () => {
    const dir = join(SRC_DIR, 'services')
    const files = collectFiles(dir)
    const violations: string[] = []

    for (const file of files) {
      const content = readFileSync(file, 'utf-8')
      // Check for non-type React imports. Type-only imports (import type { X } from 'react')
      // are erased at runtime and don't create a framework dependency.
      const reactImports = content.match(/^\s*import\s+(?!type\s)[^'"]*from\s+['"]react['"]/gm)
      if (reactImports) {
        const rel = relative(SRC_DIR, file)
        violations.push(
          `${rel} imports runtime values from 'react' — services must be framework-agnostic`
        )
      }
    }

    expect(violations).toEqual([])
  })

  it('animation components do not import from components/ui/', () => {
    const categories = ['base', 'dialogs', 'progress', 'realtime', 'rewards']
    const violations: string[] = []

    for (const cat of categories) {
      const dir = join(SRC_DIR, 'components', cat)
      let files: string[]
      try {
        files = collectFiles(dir)
      } catch {
        continue
      }

      for (const file of files) {
        // Only check files inside framer/ or css/ subdirectories
        const rel = relative(SRC_DIR, file).replace(/\\/g, '/')
        if (!rel.includes('/framer/') && !rel.includes('/css/')) continue

        for (const imp of extractImports(file)) {
          if (imp.startsWith('@/components/ui/')) {
            violations.push(`${rel} imports ${imp} — animation components must be standalone`)
          }
        }
      }
    }

    expect(violations).toEqual([])
  })
})
