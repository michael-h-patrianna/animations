import { buildGroupExport, resolveAnimationSource } from '@/lib/groupBuilder'
import { extractStaticModuleSpecifiers } from '@/__tests__/helpers/sourceImportDiscovery'
import type { AnimationMetadata, GroupMetadata } from '@/types/animation'
import { describe, expect, it } from 'vitest'

const groupMeta: GroupMetadata = { id: 'test-group', title: 'Test Group' }
const realComponentSources = import.meta.glob<string>(
  '/src/components/{base,dialogs,progress,realtime,rewards}/*/{framer,css}/*.tsx',
  { query: '?raw', import: 'default', eager: true }
)
const realMetaSources = import.meta.glob<string>(
  '/src/components/{base,dialogs,progress,realtime,rewards}/*/{framer,css}/*.meta.ts',
  { query: '?raw', import: 'default', eager: true }
)
const realRootSharedSources = import.meta.glob<string>(
  '/src/components/{base,dialogs,progress,realtime,rewards}/*/*.{ts,tsx}',
  { query: '?raw', import: 'default', eager: true }
)
const realSubdirTsSources = import.meta.glob<string>(
  '/src/components/{base,dialogs,progress,realtime,rewards}/*/{framer,css}/*.ts',
  { query: '?raw', import: 'default', eager: true }
)
const realSubdirCssSources = import.meta.glob<string>(
  '/src/components/{base,dialogs,progress,realtime,rewards}/*/{framer,css}/*.css',
  { query: '?raw', import: 'default', eager: true }
)

type RawLoaderMap = Record<string, () => Promise<string>>

function makeMeta(id: string, overrides?: Partial<AnimationMetadata>): AnimationMetadata {
  return {
    id,
    title: id,
    description: 'desc',
    urlSlugFramer: `/${id}-framer`,
    urlSlugCss: `/${id}-css`,
    ...overrides,
  }
}

function fileName(path: string): string {
  return path.replace(/^.*\//, '')
}

function baseName(path: string): string {
  return fileName(path).replace(/\.tsx$/, '')
}

function normalizePath(path: string): string {
  const parts: string[] = []
  for (const part of path.split('/')) {
    if (part === '' || part === '.') continue
    if (part === '..') {
      parts.pop()
    } else {
      parts.push(part)
    }
  }
  return '/' + parts.join('/')
}

function groupRootFor(componentPath: string): string {
  const parts = componentPath.split('/')
  return `/src/components/${parts[3]}/${parts[4]}`
}

function subdirFor(componentPath: string): 'framer' | 'css' {
  return componentPath.includes('/framer/') ? 'framer' : 'css'
}

function toGroupPath(groupRoot: string, path: string): string {
  return `.${path.slice(groupRoot.length)}`
}

function pathLoader(source: string): () => Promise<string> {
  return () => Promise.resolve(source)
}

function addLoader(loaders: RawLoaderMap, groupRoot: string, path: string, source: string): void {
  loaders[toGroupPath(groupRoot, path)] = pathLoader(source)
}

function hasMetaPair(path: string): boolean {
  return Object.hasOwn(realMetaSources, path.replace(/\.tsx$/, '.meta.ts'))
}

function isSameGroupPath(path: string, groupRoot: string): boolean {
  return path.startsWith(`${groupRoot}/`)
}

function isRootSharedPath(path: string, groupRoot: string): boolean {
  return isSameGroupPath(path, groupRoot) && !path.includes('/framer/') && !path.includes('/css/')
}

function buildRealRawSources(componentPath: string): {
  rawSources: {
    framerTsx?: RawLoaderMap
    framerCss?: RawLoaderMap
    cssTsx?: RawLoaderMap
    cssCss?: RawLoaderMap
    shared?: RawLoaderMap
  }
  helperSources: Map<string, string>
} {
  const groupRoot = groupRootFor(componentPath)
  const subdir = subdirFor(componentPath)
  const rawSources = {
    framerTsx: {} as RawLoaderMap,
    framerCss: {} as RawLoaderMap,
    cssTsx: {} as RawLoaderMap,
    cssCss: {} as RawLoaderMap,
    shared: {} as RawLoaderMap,
  }
  const helperSources = new Map<string, string>()

  addLoader(
    subdir === 'framer' ? rawSources.framerTsx : rawSources.cssTsx,
    groupRoot,
    componentPath,
    realComponentSources[componentPath]!
  )

  for (const [path, source] of Object.entries(realRootSharedSources)) {
    if (isRootSharedPath(path, groupRoot) && fileName(path) !== 'index.ts') {
      addLoader(rawSources.shared, groupRoot, path, source)
      helperSources.set(path, fileName(path))
    }
  }

  for (const [path, source] of Object.entries(realSubdirTsSources)) {
    if (isSameGroupPath(path, groupRoot) && !path.endsWith('.meta.ts')) {
      addLoader(rawSources.shared, groupRoot, path, source)
      helperSources.set(path, fileName(path))
    }
  }

  for (const [path, source] of Object.entries(realComponentSources)) {
    if (isSameGroupPath(path, groupRoot) && !hasMetaPair(path)) {
      addLoader(
        path.includes('/framer/') ? rawSources.framerTsx : rawSources.cssTsx,
        groupRoot,
        path,
        source
      )
      helperSources.set(path, fileName(path))
    }
  }

  for (const [path, source] of Object.entries(realSubdirCssSources)) {
    const cssBasePath = path.replace(/\.css$/, '')
    if (
      path.startsWith(`${groupRoot}/${subdir}/`) &&
      cssBasePath.endsWith(`/${baseName(componentPath)}`)
    ) {
      addLoader(
        subdir === 'framer' ? rawSources.framerCss : rawSources.cssCss,
        groupRoot,
        path,
        source
      )
      continue
    }
    if (
      isSameGroupPath(path, groupRoot) &&
      !path.endsWith('.module.css') &&
      !hasMetaPair(`${cssBasePath}.tsx`)
    ) {
      addLoader(
        path.includes('/framer/') ? rawSources.framerCss : rawSources.cssCss,
        groupRoot,
        path,
        source
      )
      helperSources.set(path, fileName(path))
    }
  }

  return { rawSources, helperSources }
}

function resolveImportPath(componentPath: string, importPath: string): string | undefined {
  const groupRoot = groupRootFor(componentPath)
  if (importPath.includes('Mock')) return undefined
  if (importPath.startsWith('@/components/')) {
    const absolute = `/src${importPath.slice(1)}`
    return isSameGroupPath(absolute, groupRoot) ? absolute : undefined
  }
  if (importPath.startsWith('./') || importPath.startsWith('../')) {
    return normalizePath(`${componentPath.replace(/\/[^/]+$/, '')}/${importPath}`)
  }
  return undefined
}

function candidateImportPaths(path: string): string[] {
  if (path.endsWith('.module.css')) return []
  if (/\.(ts|tsx|css)$/.test(path)) return [path]
  return [`${path}.ts`, `${path}.tsx`, `${path}.css`]
}

function expectedSharedLabels(componentPath: string, helperSources: Map<string, string>): string[] {
  const source = realComponentSources[componentPath]!
  const labels = new Set<string>()
  for (const importPath of extractStaticModuleSpecifiers(source)) {
    const resolved = resolveImportPath(componentPath, importPath)
    if (!resolved) continue
    for (const candidate of candidateImportPaths(resolved)) {
      const label = helperSources.get(candidate)
      if (label) {
        labels.add(label)
      }
    }
  }
  return [...labels].sort()
}

describe('real animation source import discovery', () => {
  it('discovers supported group-level imports from every real animation component', async () => {
    const failures: string[] = []

    for (const componentPath of Object.keys(realComponentSources).filter(hasMetaPair).sort()) {
      const componentName = baseName(componentPath)
      const subdir = subdirFor(componentPath)
      const { rawSources, helperSources } = buildRealRawSources(componentPath)
      const expectedLabels = expectedSharedLabels(componentPath, helperSources)
      if (expectedLabels.length === 0) continue

      const result = buildGroupExport(
        groupMeta,
        subdir === 'framer'
          ? {
              [`./framer/${componentName}.tsx`]: () =>
                Promise.resolve({ [componentName]: () => null }),
            }
          : {},
        subdir === 'framer'
          ? {
              [`./framer/${componentName}.meta.ts`]: {
                metadata: makeMeta(`g__${componentName}`),
              },
            }
          : {},
        subdir === 'css'
          ? {
              [`./css/${componentName}.tsx`]: () =>
                Promise.resolve({ [componentName]: () => null }),
            }
          : {},
        subdir === 'css'
          ? { [`./css/${componentName}.meta.ts`]: { metadata: makeMeta(`g__${componentName}`) } }
          : {},
        rawSources
      )

      const entry =
        subdir === 'framer'
          ? result.framer[`g__${componentName}`]
          : result.css[`g__${componentName}`]
      const tabs = await resolveAnimationSource(
        subdir === 'framer' ? entry : undefined,
        subdir === 'css' ? entry : undefined
      )
      const actualLabels = new Set(tabs.map((tab) => tab.label))
      for (const label of expectedLabels) {
        if (!actualLabels.has(label)) {
          failures.push(`${componentPath} missing ${label}`)
        }
      }
    }

    expect(failures).toEqual([])
  }, 15000)
})
