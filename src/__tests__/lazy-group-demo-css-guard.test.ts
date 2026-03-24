import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'

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

/** Collect all animation .tsx files (not index, not Mock, not Parts/Helpers). */
function getAnimationFiles(): string[] {
  return walkDir(ANIM_ROOT, (file) => {
    if (!file.endsWith('.tsx')) return false
    const variantDir = basename(dirname(file))
    if (variantDir !== 'css' && variantDir !== 'framer') return false

    const base = basename(file, '.tsx')
    return (
      base !== 'index' &&
      !base.startsWith('Mock') &&
      !base.endsWith('Parts') &&
      !base.endsWith('Helpers')
    )
  })
}

/** Extract all import sources from a .tsx or .ts file (including bare CSS imports). */
function extractImports(filePath: string): string[] {
  const content = readFileSync(filePath, 'utf8')
  const imports: string[] = []
  let match

  const fromPattern = /import\s+[\s\S]*?from\s+['"]([^'"]+)['"]/g
  while ((match = fromPattern.exec(content)) !== null) {
    imports.push(match[1])
  }

  const barePattern = /import\s+['"]([^'"]+)['"]/g
  while ((match = barePattern.exec(content)) !== null) {
    imports.push(match[1])
  }

  return [...new Set(imports)]
}

/** Extract static class names from JSX className attributes. */
function extractJsxClassNames(tsxContent: string): string[] {
  const classes = new Set<string>()
  const codeOnly = tsxContent.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*/g, '')
  let match

  const staticPattern = /className="([^"]+)"/g
  while ((match = staticPattern.exec(codeOnly)) !== null) {
    match[1].split(/\s+/).filter(Boolean).forEach((name) => classes.add(name))
  }

  const templatePattern = /className=\{`([^`]+)`\}/g
  while ((match = templatePattern.exec(codeOnly)) !== null) {
    const marked = match[1].replace(/\$\{[^}]*\}/g, '\0')
    marked
      .split(/\s+/)
      .filter(Boolean)
      .filter((name) => !name.includes('\0'))
      .forEach((name) => classes.add(name))
  }

  return [...classes]
}

/** Returns true when the file directly relies on demo-block utility classes. */
function usesRawDemoBlockClasses(filePath: string): boolean {
  const classNames = extractJsxClassNames(readFileSync(filePath, 'utf8'))
  return classNames.some((name) => name.startsWith('pf-demo-'))
}

/** Importing Demo* components or demo-blocks.css loads the shared demo styles in the chunk. */
function hasLocalDemoBlockStyleDependency(filePath: string): boolean {
  return extractImports(filePath).some(
    (source) =>
      source.startsWith('@/components/demo-blocks') || source.includes('/demo-blocks/demo-blocks.css')
  )
}

/** Group-level side-effect import is the fallback when components use raw demo classes directly. */
function groupIndexLoadsDemoBlocksCss(filePath: string): boolean {
  const groupIndexPath = resolve(dirname(filePath), '..', 'index.ts')
  if (!existsSync(groupIndexPath)) return false

  return extractImports(groupIndexPath).some((source) =>
    source.includes('/demo-blocks/demo-blocks.css')
  )
}

describe('lazy-loaded groups load demo-block styles explicitly', () => {
  const animationFiles = getAnimationFiles()

  it('has animation files to audit', () => {
    expect(animationFiles.length).toBeGreaterThan(10)
  })

  it('does not rely on unrelated lazy chunks to style raw pf-demo-* classes', () => {
    const violations: string[] = []

    for (const filePath of animationFiles) {
      if (!usesRawDemoBlockClasses(filePath)) continue
      if (hasLocalDemoBlockStyleDependency(filePath)) continue
      if (groupIndexLoadsDemoBlocksCss(filePath)) continue

      const relativePath = filePath.replace(ANIM_ROOT, '')
      violations.push(
        `${relativePath}: uses raw pf-demo-* classes but neither the file nor its group index loads demo-blocks.css`
      )
    }

    expect(violations).toEqual([])
  })
})
