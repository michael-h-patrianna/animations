import type {
  AnimationExport,
  AnimationMetadata,
  GroupExport,
  GroupMetadata,
  SourceTab,
} from '@/types/animation'
import { validateAnimationMetadata } from '@/lib/metadataSchema'
import { lazy, type ComponentType } from 'react'

/** Shape of an eagerly-imported `.meta.ts` module. */
type MetaModule = { metadata: AnimationMetadata }

/** Shape of a lazily-imported `.tsx` component module (named exports). */
type ComponentModuleLoader = () => Promise<Record<string, unknown>>

/** Raw source loaded via `import.meta.glob('...', { query: '?raw', import: 'default' })`. */
type RawSourceLoader = () => Promise<string>

/** Source loaders attached to each AnimationExport via WeakMap. */
type SourceLoaders = {
  tsx?: RawSourceLoader
  css?: RawSourceLoader
  /** All helper/shared files available for this animation's group, keyed by glob path. */
  shared: Record<string, RawSourceLoader>
  /** Subdirectory of this entry's component ('framer' or 'css'). */
  subdir: string
}
const sourceLoaderRegistry = new WeakMap<AnimationExport, SourceLoaders>()

/** Files to skip when scanning glob results — not animation components. */
const SKIP_PATTERN =
  /^(?:Mock|index|Shared|Premium|.*(?:Helper|Parts|Components|cardSets|utils|fireworkModel|FlipCard))/

/**
 * Extracts the base filename from a Vite glob-matched path.
 *
 * `'./framer/StandardEffectsBounce.meta.ts'` → `'StandardEffectsBounce'`
 * `'./framer/StandardEffectsBounce.tsx'`      → `'StandardEffectsBounce'`
 */
function baseNameFromPath(path: string): string {
  return path.replace(/^.*\//, '').replace(/\.meta\.ts$|\.css$|\.tsx?$/, '')
}

/** Extracts the filename with extension from a glob path. `'./framer/Foo.tsx'` → `'Foo.tsx'` */
function filenameFromPath(path: string): string {
  return path.replace(/^.*\//, '')
}

/**
 * Finds a raw source loader by basename in a glob result map.
 * Returns undefined if no match exists.
 */
function findRawLoader(
  rawLoaders: Record<string, RawSourceLoader> | undefined,
  baseName: string,
  extension: string
): RawSourceLoader | undefined {
  if (!rawLoaders) return undefined
  const path = Object.keys(rawLoaders).find((p) => p.endsWith(`/${baseName}.${extension}`))
  return path ? rawLoaders[path] : undefined
}

/**
 * Collects non-component (helper/utility) raw source loaders from a subdir glob result.
 * These are files matched by the glob but skipped by SKIP_PATTERN during component registration.
 */
function collectHelperLoaders(
  rawTsxLoaders?: Record<string, RawSourceLoader>,
  rawCssLoaders?: Record<string, RawSourceLoader>
): Record<string, RawSourceLoader> {
  const helpers: Record<string, RawSourceLoader> = {}
  for (const [path, loader] of Object.entries(rawTsxLoaders ?? {})) {
    const baseName = baseNameFromPath(path)
    if (SKIP_PATTERN.test(baseName)) {
      helpers[path] = loader
    }
  }
  for (const [path, loader] of Object.entries(rawCssLoaders ?? {})) {
    const baseName = baseNameFromPath(path)
    if (SKIP_PATTERN.test(baseName)) {
      helpers[path] = loader
    }
  }
  return helpers
}

/**
 * Builds a map of `{ [animationId]: AnimationExport }` from glob-matched
 * component loaders and eagerly-loaded metadata modules.
 *
 * Matching strategy: iterate over meta modules (the authoritative source),
 * derive the base filename, then find the corresponding component loader by
 * filename. Files that don't have a matching pair are silently skipped.
 */
function buildAnimationMap(
  componentLoaders: Record<string, ComponentModuleLoader>,
  metaModules: Record<string, MetaModule>,
  rawTsxLoaders: Record<string, RawSourceLoader> | undefined,
  rawCssLoaders: Record<string, RawSourceLoader> | undefined,
  sharedLoaders: Record<string, RawSourceLoader>,
  subdir: string
): Record<string, AnimationExport> {
  const animations: Record<string, AnimationExport> = {}

  for (const [metaPath, metaModule] of Object.entries(metaModules)) {
    const baseName = baseNameFromPath(metaPath)
    if (SKIP_PATTERN.test(baseName)) continue

    const meta = metaModule.metadata

    // Dev-mode runtime validation catches metadata typos that `satisfies` cannot
    if (import.meta.env.DEV) {
      const violations = validateAnimationMetadata(meta, `${subdir}/${baseName}.meta.ts`)
      if (violations.length > 0) {
        throw new Error(
          `[groupBuilder] Invalid metadata in ${subdir}/${baseName}.meta.ts:\n` +
            violations.map((msg) => `  - ${msg}`).join('\n')
        )
      }
    }

    // Find the corresponding component loader by matching base filename
    const componentPath = Object.keys(componentLoaders).find(
      (p) => baseNameFromPath(p) === baseName
    )
    if (!componentPath) continue

    // componentPath was just found via Object.keys(componentLoaders).find(), guaranteed to exist
    const loader = componentLoaders[componentPath]!
    const exportName = baseName

    const component = lazy(() =>
      loader().then((m) => ({
        default: m[exportName] as ComponentType<Record<string, unknown>>,
      }))
    )

    const entry: AnimationExport = { component, metadata: meta }

    // Attach lazy source loaders — resolved on demand when code viewer opens
    const tsxLoader = findRawLoader(rawTsxLoaders, baseName, 'tsx')
    const cssLoader = findRawLoader(rawCssLoaders, baseName, 'css')

    sourceLoaderRegistry.set(entry, {
      tsx: tsxLoader,
      css: cssLoader,
      shared: sharedLoaders,
      subdir,
    })

    if (import.meta.env.DEV && animations[meta.id]) {
      throw new Error(
        `[groupBuilder] Duplicate animation ID "${meta.id}" in ${subdir}/. ` +
          `"${baseName}" conflicts with an earlier registration. Animation IDs must be unique within a tech variant.`
      )
    }

    animations[meta.id] = entry
  }

  return animations
}

// ── Import parsing & shared file resolution ─────────────────────────────

/**
 * Matches import paths from `from '...'` statements.
 * Captures relative paths (`../Foo`, `./Foo`) and `@/` alias paths.
 */
const IMPORT_PATH_RE = /\bfrom\s+['"](\.\.\/?[^'"]+|\.\/[^'"]+|@\/[^'"]+)['"]/g

/** Files that should not appear as shared tabs (demo scaffolding). */
const MOCK_IMPORT_RE = /Mock/

/**
 * Extracts import paths from raw TypeScript source that may point to
 * group-level shared files. Returns deduplicated paths including both
 * legacy relative paths (`../utils`) and `@/` alias paths.
 */
function extractGroupImports(source: string): string[] {
  const paths = new Set<string>()
  for (const match of source.matchAll(IMPORT_PATH_RE)) {
    const importPath = match[1]!
    if (!MOCK_IMPORT_RE.test(importPath)) {
      paths.add(importPath)
    }
  }
  return [...paths]
}

/**
 * Resolves an import path relative to a component's subdirectory
 * to a glob-style path relative to the group root.
 *
 * From `framer/Component.tsx` importing `'../utils'` → `'./utils'`
 * From `framer/Component.tsx` importing `'./Config'`  → `'./framer/Config'`
 * From `css/Component.tsx`    importing `'../utils'` → `'./utils'`
 * `@/` paths are returned as-is for basename matching in findSharedLoader.
 */
function resolveImportToGroupRoot(importPath: string, subdir: string): string {
  if (importPath.startsWith('../')) {
    // Goes up one level from the subdir → lands at group root
    return './' + importPath.slice(3)
  }
  if (importPath.startsWith('./')) {
    // Same directory as the component → stays in the subdir
    return './' + subdir + '/' + importPath.slice(2)
  }
  // @/ alias paths: returned as-is, resolved by basename in findSharedLoader
  return importPath
}

/**
 * Finds the loader in the shared map that matches a resolved import path.
 * For relative paths tries common extensions: .ts, .tsx, .css.
 * For `@/` alias paths matches by basename (last path segment) since the
 * shared map is group-scoped and basenames are unique within a group.
 */
function findSharedLoader(
  shared: Record<string, RawSourceLoader>,
  resolvedPath: string
): { path: string; loader: RawSourceLoader } | undefined {
  if (resolvedPath.startsWith('@/')) {
    // Extract basename (e.g. '@/components/foo/bar/SharedUtils' → 'SharedUtils')
    const base = resolvedPath.replace(/^.*\//, '')
    for (const ext of ['.ts', '.tsx', '.css']) {
      const key = Object.keys(shared).find(
        (k) => k === `./${base}${ext}` || k.endsWith(`/${base}${ext}`)
      )
      if (key !== undefined) {
        return { path: key, loader: shared[key]! }
      }
    }
    return undefined
  }
  for (const ext of ['.ts', '.tsx', '.css']) {
    const candidate = resolvedPath + ext
    if (shared[candidate]) {
      return { path: candidate, loader: shared[candidate]! }
    }
  }
  return undefined
}

/** Infers syntax language from a filename. */
function languageFromPath(path: string): 'tsx' | 'css' {
  return path.endsWith('.css') ? 'css' : 'tsx'
}

/**
 * Resolves raw source code for both tech variants of an animation.
 * Returns a `SourceTab[]` with:
 *   1. Component — .tsx (framer or css variant, depending on which entry is provided)
 *   2. CSS — .css (css variant only)
 *   3+ Shared dependency files imported by the variant
 */
export async function resolveAnimationSource(
  framerEntry?: AnimationExport,
  cssEntry?: AnimationExport
): Promise<SourceTab[]> {
  const framerLoaders = framerEntry ? sourceLoaderRegistry.get(framerEntry) : undefined
  const cssLoaders = cssEntry ? sourceLoaderRegistry.get(cssEntry) : undefined

  // Phase 1: Load the main component sources
  // Framer CSS files are catalog layout styles loaded as side-effects by group index —
  // not consumer dependencies, so they are excluded from the code viewer.
  const [framerTsx, cssTsx, cssCss] = await Promise.all([
    framerLoaders?.tsx?.() ?? Promise.resolve(undefined),
    cssLoaders?.tsx?.() ?? Promise.resolve(undefined),
    cssLoaders?.css?.() ?? Promise.resolve(undefined),
  ])

  const tabs: SourceTab[] = []
  if (framerTsx !== undefined) tabs.push({ label: 'Component', code: framerTsx, language: 'tsx' })
  if (cssTsx !== undefined) tabs.push({ label: 'Component', code: cssTsx, language: 'tsx' })
  if (cssCss !== undefined) tabs.push({ label: 'CSS', code: cssCss, language: 'css' })

  // Phase 2: Discover and load shared dependencies from imports
  const sharedToLoad = new Map<string, RawSourceLoader>() // glob path → loader (deduplicated)

  if (framerTsx !== undefined && framerLoaders?.shared) {
    for (const importPath of extractGroupImports(framerTsx)) {
      const resolved = resolveImportToGroupRoot(importPath, framerLoaders.subdir)
      const match = findSharedLoader(framerLoaders.shared, resolved)
      if (match && !sharedToLoad.has(match.path)) {
        sharedToLoad.set(match.path, match.loader)
      }
    }
  }

  if (cssTsx !== undefined && cssLoaders?.shared) {
    for (const importPath of extractGroupImports(cssTsx)) {
      const resolved = resolveImportToGroupRoot(importPath, cssLoaders.subdir)
      const match = findSharedLoader(cssLoaders.shared, resolved)
      if (match && !sharedToLoad.has(match.path)) {
        sharedToLoad.set(match.path, match.loader)
      }
    }
  }

  // Load all shared files in parallel
  if (sharedToLoad.size > 0) {
    const entries = [...sharedToLoad.entries()].sort(([a], [b]) => a.localeCompare(b))
    const loadedShared = await Promise.all(entries.map(([, loader]) => loader()))

    for (let i = 0; i < entries.length; i++) {
      const [path] = entries[i]!
      const code = loadedShared[i]!
      tabs.push({
        label: filenameFromPath(path),
        code,
        language: languageFromPath(path),
      })
    }
  }

  return tabs
}

/**
 * Constructs a `GroupExport` from Vite `import.meta.glob` results.
 *
 * Replaces the manual import/lazy/map boilerplate in group `index.ts` files.
 * Each group index calls this with its glob results, reducing ~200 lines of
 * mechanical code to ~15 lines.
 *
 * @example
 * ```ts
 * import type { GroupMetadata } from '@/types/animation'
 * import { buildGroupExport } from '@/lib/groupBuilder'
 *
 * const metadata: GroupMetadata = {
 *   id: 'standard-effects',
 *   title: 'Standard effects',
 * }
 *
 * export const groupExport = buildGroupExport(
 *   metadata,
 *   import.meta.glob('./framer/*.tsx'),
 *   import.meta.glob<{ metadata: AnimationMetadata }>('./framer/*.meta.ts', { eager: true }),
 *   import.meta.glob('./css/*.tsx'),
 *   import.meta.glob<{ metadata: AnimationMetadata }>('./css/*.meta.ts', { eager: true }),
 *   {
 *     framerTsx: import.meta.glob<string>('./framer/*.tsx', { query: '?raw', import: 'default' }),
 *     framerCss: import.meta.glob<string>('./framer/*.css', { query: '?raw', import: 'default' }),
 *     cssTsx: import.meta.glob<string>('./css/*.tsx', { query: '?raw', import: 'default' }),
 *     cssCss: import.meta.glob<string>('./css/*.css', { query: '?raw', import: 'default' }),
 *     shared: import.meta.glob<string>('./*.{ts,tsx}', { query: '?raw', import: 'default' }),
 *   }
 * )
 * ```
 */
export function buildGroupExport(
  metadata: GroupMetadata,
  framerComponents: Record<string, ComponentModuleLoader>,
  framerMeta: Record<string, MetaModule>,
  cssComponents: Record<string, ComponentModuleLoader>,
  cssMeta: Record<string, MetaModule>,
  rawSources?: {
    framerTsx?: Record<string, RawSourceLoader>
    framerCss?: Record<string, RawSourceLoader>
    cssTsx?: Record<string, RawSourceLoader>
    cssCss?: Record<string, RawSourceLoader>
    shared?: Record<string, RawSourceLoader>
  }
): GroupExport {
  // Collect helper files from framer/css subdirs (files matching SKIP_PATTERN)
  const framerHelpers = collectHelperLoaders(rawSources?.framerTsx, rawSources?.framerCss)
  const cssHelpers = collectHelperLoaders(rawSources?.cssTsx, rawSources?.cssCss)

  // Merge group-root shared files + all subdir helpers into one pool
  const allShared: Record<string, RawSourceLoader> = {
    ...(rawSources?.shared ?? {}),
    ...framerHelpers,
    ...cssHelpers,
  }

  return {
    metadata,
    framer: buildAnimationMap(
      framerComponents,
      framerMeta,
      rawSources?.framerTsx,
      rawSources?.framerCss,
      allShared,
      'framer'
    ),
    css: buildAnimationMap(
      cssComponents,
      cssMeta,
      rawSources?.cssTsx,
      rawSources?.cssCss,
      allShared,
      'css'
    ),
  }
}
