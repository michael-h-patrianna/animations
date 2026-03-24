/**
 * Portability tier compliance tests.
 *
 * These tests programmatically scan all animation components to verify:
 * 1. Import isolation — imports respect the declared portability tier
 * 2. CSS class coverage — all classes used in JSX are defined in imported CSS
 * 3. Tier parity — CSS and Framer versions declare the same tier
 * 4. Tier accuracy — declared tier is not lower than what dependencies require
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'

// ─── Helpers ────────────────────────────────────────────────────────────────

const ANIM_ROOT = resolve(__dirname, '../components')

/** Recursively collect files matching a predicate. */
function walkDir(dir: string, predicate: (path: string) => boolean): string[] {
  const results: string[] = []
  let entries: string[]
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
    if (stat.isDirectory()) {
      results.push(...walkDir(full, predicate))
    } else if (predicate(full)) {
      results.push(full)
    }
  }
  return results
}

/** Collect all animation .tsx files (not index, not Mock, not Parts/Helpers) */
function getAnimationFiles(): string[] {
  return walkDir(ANIM_ROOT, (f) => {
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
}

/** Read the tier from a sibling .meta.ts file. Returns undefined if not declared. */
function readTier(tsxPath: string): number | undefined {
  const base = basename(tsxPath, '.tsx')
  const metaPath = resolve(dirname(tsxPath), `${base}.meta.ts`)
  if (!existsSync(metaPath)) return undefined
  const content = readFileSync(metaPath, 'utf8')
  const match = content.match(/\btier\s*:\s*([1-4])\b/)
  return match ? Number(match[1]) : undefined
}

/** Extract all import sources from a .tsx file (including bare CSS imports). */
function extractImports(filePath: string): string[] {
  const content = readFileSync(filePath, 'utf8')
  const imports: string[] = []
  let match

  // import ... from '...' (handles multi-line imports)
  const fromPattern = /import\s+[\s\S]*?from\s+['"]([^'"]+)['"]/g
  while ((match = fromPattern.exec(content)) !== null) {
    imports.push(match[1])
  }

  // import '...' (bare CSS imports without from)
  const barePattern = /import\s+['"]([^'"]+)['"]/g
  while ((match = barePattern.exec(content)) !== null) {
    imports.push(match[1])
  }

  return [...new Set(imports)]
}

// Imports that are invisible to portability checks (demo harness, not consumer code)
const IGNORED_IMPORTS = ['@/components/demo-blocks']

/** Determine the minimum tier required by the file's actual imports. */
function computeMinimumTier(imports: string[]): number {
  const projectImports = imports.filter(
    (s) => s.startsWith('@/') && !IGNORED_IMPORTS.some((prefix) => s.startsWith(prefix))
  )
  if (projectImports.length === 0) return 1

  const hasAssets = projectImports.some((s) => s.startsWith('@/assets'))
  if (hasAssets) return 4

  // Has project imports but only from extractable utility paths
  const extractable = ['@/motion/', '@/utils/', '@/types/']
  const allExtractable = projectImports.every((s) =>
    extractable.some((prefix) => s.startsWith(prefix))
  )
  if (allExtractable) return 2

  return 4
}

/** Extract CSS class names used in className attributes from TSX source (not comments). */
function extractJsxClassNames(tsxContent: string): string[] {
  const classes = new Set<string>()

  // Strip block comments (including JSDoc) and line comments to avoid false positives
  const codeOnly = tsxContent.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*/g, '')

  // Match className="..." (static strings)
  const staticPattern = /className="([^"]+)"/g
  let match
  while ((match = staticPattern.exec(codeOnly)) !== null) {
    match[1].split(/\s+/).forEach((c) => classes.add(c))
  }

  // Match className={`...`} (template literals — extract static parts)
  const templatePattern = /className=\{`([^`]+)`\}/g
  while ((match = templatePattern.exec(codeOnly)) !== null) {
    // Mark positions adjacent to ${} so we can discard partial fragments.
    // e.g. `pf-marker--t${val}` → `pf-marker--t⌀` → skip the fragment
    const marked = match[1].replace(/\$\{[^}]*\}/g, '\0')
    marked
      .split(/\s+/)
      .filter(Boolean)
      .filter((c) => !c.includes('\0'))
      .forEach((c) => classes.add(c))
  }

  return [...classes]
}

/** Extract CSS class definitions from a CSS file. */
function extractCssClassDefinitions(cssContent: string): Set<string> {
  const classes = new Set<string>()
  // Match .class-name in selectors (handles .foo, .foo.bar, .foo:hover, etc.)
  const classPattern = /\.([a-zA-Z_][\w-]*)/g
  let match
  while ((match = classPattern.exec(cssContent)) !== null) {
    classes.add(match[1])
  }
  return classes
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe('Portability: Tier Accuracy', () => {
  const files = getAnimationFiles()

  it('has animation files to test', () => {
    expect(files.length).toBeGreaterThan(10)
  })

  it('declared tier is not lower than actual dependency requirements', () => {
    const violations: string[] = []

    for (const file of files) {
      const tier = readTier(file)
      if (tier === undefined) continue // No tier declared yet — require-portability-tier lint handles this

      const imports = extractImports(file)
      const minimumTier = computeMinimumTier(imports)

      if (tier < minimumTier) {
        const rel = file.replace(ANIM_ROOT, '')
        violations.push(
          `${rel}: declared tier ${tier} but imports require tier ${minimumTier} (imports: ${imports.filter((s) => s.startsWith('@/')).join(', ')})`
        )
      }
    }

    expect(violations).toEqual([])
  })
})

describe('Portability: Tier Parity', () => {
  const files = getAnimationFiles()

  it('CSS and Framer variants of the same animation declare the same tier', () => {
    const tierMap = new Map<
      string,
      { css?: number; framer?: number; cssPath?: string; framerPath?: string }
    >()

    for (const file of files) {
      const tier = readTier(file)
      if (tier === undefined) continue

      const base = basename(file, '.tsx')
      const dir = basename(dirname(file)) // 'css' or 'framer'

      const entry = tierMap.get(base) ?? {}
      if (dir === 'css') {
        entry.css = tier
        entry.cssPath = file
      } else if (dir === 'framer') {
        entry.framer = tier
        entry.framerPath = file
      }
      tierMap.set(base, entry)
    }

    const mismatches: string[] = []
    for (const [name, entry] of tierMap) {
      if (entry.css !== undefined && entry.framer !== undefined && entry.css !== entry.framer) {
        mismatches.push(`${name}: css=tier ${entry.css}, framer=tier ${entry.framer}`)
      }
    }

    expect(mismatches).toEqual([])
  })
})

describe('Portability: CSS Class Coverage', () => {
  const cssFiles = walkDir(ANIM_ROOT, (f) => {
    if (!f.endsWith('.tsx')) return false
    if (basename(dirname(f)) !== 'css') return false
    const base = basename(f, '.tsx')
    return (
      base !== 'index' &&
      !base.startsWith('Mock') &&
      !base.endsWith('Parts') &&
      !base.endsWith('Helpers')
    )
  })

  it('has CSS animation files to test', () => {
    expect(cssFiles.length).toBeGreaterThan(5)
  })

  it('all className values in CSS variants are defined in imported CSS files', () => {
    const orphans: string[] = []

    for (const tsxFile of cssFiles) {
      const tsxContent = readFileSync(tsxFile, 'utf8')
      const usedClasses = extractJsxClassNames(tsxContent)
      if (usedClasses.length === 0) continue

      // Collect all CSS class definitions from imported .css files
      const cssImports = extractImports(tsxFile).filter((s) => s.endsWith('.css'))
      const definedClasses = new Set<string>()

      for (const cssImport of cssImports) {
        const cssPath = resolve(dirname(tsxFile), cssImport)
        if (!existsSync(cssPath)) continue
        const cssContent = readFileSync(cssPath, 'utf8')
        extractCssClassDefinitions(cssContent).forEach((c) => definedClasses.add(c))
      }

      // Also scan group-level shared.css (one directory up from css/)
      const groupSharedPath = resolve(dirname(tsxFile), '..', 'shared.css')
      if (existsSync(groupSharedPath)) {
        const sharedContent = readFileSync(groupSharedPath, 'utf8')
        extractCssClassDefinitions(sharedContent).forEach((c) => definedClasses.add(c))
      }

      // Include demo-blocks CSS for components that import from @/components/demo-blocks
      const allImports = extractImports(tsxFile)
      if (allImports.some((s) => s.startsWith('@/components/demo-blocks'))) {
        const demoBlocksCss = resolve(ANIM_ROOT, 'demo-blocks', 'demo-blocks.css')
        if (existsSync(demoBlocksCss)) {
          const demoContent = readFileSync(demoBlocksCss, 'utf8')
          extractCssClassDefinitions(demoContent).forEach((c) => definedClasses.add(c))
        }
      }

      // Check each used class is defined
      for (const cls of usedClasses) {
        // Skip dynamic class fragments (conditional BEM modifiers like is-unlocked)
        if (cls.startsWith('is-')) continue
        // Skip BEM modifier/element fragments ending with - or -- (e.g., "ring-", "pf-marker--t")
        // These are partial strings from template literal concatenation
        if (cls.endsWith('-') || cls.endsWith('--')) continue
        // Skip single-character fragments from template literal splitting
        if (cls.length <= 2) continue
        if (!definedClasses.has(cls)) {
          const rel = tsxFile.replace(ANIM_ROOT, '')
          orphans.push(`${rel}: className "${cls}" not found in any imported CSS file`)
        }
      }
    }

    // Orphaned classes indicate portability gaps — the component uses classes
    // it doesn't explicitly import, making copy-paste incomplete.
    //
    // RATCHET: Current threshold is 12 components. When fixing components,
    // lower ORPHAN_THRESHOLD to match the new count. The "ratchet slack"
    // assertion below will fail when the actual count drops 5+ below the
    // threshold, reminding you to tighten it.
    const ORPHAN_THRESHOLD = 4
    const componentOrphans = new Set(orphans.map((o) => o.split(':')[0]))
    if (componentOrphans.size > ORPHAN_THRESHOLD) {
      // Report count and samples instead of the full list
      const sample = orphans.slice(0, 10).join('\n')
      expect.fail(
        `${componentOrphans.size} CSS components have ${orphans.length} orphaned classes (classes used but not defined in any imported CSS).\n` +
          `This means copy-pasting these components would result in unstyled elements.\n` +
          `First 10:\n${sample}`
      )
    }

    // Ratchet tightening reminder: if the actual count is 5+ below the
    // threshold, the threshold is stale and should be lowered.
    if (componentOrphans.size <= ORPHAN_THRESHOLD - 5) {
      expect.fail(
        `Orphan component count (${componentOrphans.size}) is well below the threshold (${ORPHAN_THRESHOLD}). ` +
          `Tighten ORPHAN_THRESHOLD to ${componentOrphans.size} in this test to prevent regression.`
      )
    }
  })
})

describe('Portability: Import Isolation', () => {
  const files = getAnimationFiles()

  it('Tier 1 animations have zero @/ imports', () => {
    const violations: string[] = []

    for (const file of files) {
      const tier = readTier(file)
      if (tier !== 1) continue

      const imports = extractImports(file)
      const projectImports = imports.filter(
        (s) => s.startsWith('@/') && !IGNORED_IMPORTS.some((p) => s.startsWith(p))
      )

      if (projectImports.length > 0) {
        const rel = file.replace(ANIM_ROOT, '')
        violations.push(`${rel}: tier 1 but has @/ imports: ${projectImports.join(', ')}`)
      }
    }

    expect(violations).toEqual([])
  })

  it('Tier 2-3 animations have no @/assets imports', () => {
    const violations: string[] = []

    for (const file of files) {
      const tier = readTier(file)
      if (tier === undefined || tier === 1 || tier === 4) continue

      const imports = extractImports(file)
      const assetImports = imports.filter((s) => s.startsWith('@/assets'))

      if (assetImports.length > 0) {
        const rel = file.replace(ANIM_ROOT, '')
        violations.push(`${rel}: tier ${tier} but imports @/assets: ${assetImports.join(', ')}`)
      }
    }

    expect(violations).toEqual([])
  })
})
