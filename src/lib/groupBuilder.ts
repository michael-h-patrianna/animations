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
  return path.replace(/^.*\//, '').replace(/\.meta\.ts$|\.module\.css$|\.css$|\.tsx?$/, '')
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
  // Try exact match first, then .module variant for CSS modules
  const path =
    Object.keys(rawLoaders).find((p) => p.endsWith(`/${baseName}.${extension}`)) ??
    (extension === 'css'
      ? Object.keys(rawLoaders).find((p) => p.endsWith(`/${baseName}.module.css`))
      : undefined)
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

/** Loads raw source strings (tsx + css) for a single variant's loaders. */
async function loadVariantSources(
  loaders?: SourceLoaders
): Promise<{ tsx?: string; css?: string }> {
  const [tsx, css] = await Promise.all([
    loaders?.tsx?.() ?? Promise.resolve(undefined),
    loaders?.css?.() ?? Promise.resolve(undefined),
  ])
  return { tsx, css }
}

/** Appends Component and CSS source tabs for loaded variant sources. */
function appendVariantTabs(tabs: SourceTab[], sources: { tsx?: string; css?: string }): void {
  if (sources.tsx !== undefined)
    tabs.push({ label: 'Component', code: sources.tsx, language: 'tsx' })
  if (sources.css !== undefined) tabs.push({ label: 'CSS', code: sources.css, language: 'css' })
}

/** Scans a variant's source for group-level imports and adds their loaders to the map. */
function discoverSharedImports(
  source: string | undefined,
  loaders: SourceLoaders | undefined,
  sharedToLoad: Map<string, RawSourceLoader>
): void {
  if (source === undefined || !loaders?.shared) return
  for (const importPath of extractGroupImports(source)) {
    const resolved = resolveImportToGroupRoot(importPath, loaders.subdir)
    const match = findSharedLoader(loaders.shared, resolved)
    if (match && !sharedToLoad.has(match.path)) {
      sharedToLoad.set(match.path, match.loader)
    }
  }
}

/** Loads all discovered shared files in parallel and returns them as SourceTabs. */
async function loadSharedTabs(sharedToLoad: Map<string, RawSourceLoader>): Promise<SourceTab[]> {
  if (sharedToLoad.size === 0) return []
  const entries = [...sharedToLoad.entries()].sort(([a], [b]) => a.localeCompare(b))
  const loaded = await Promise.all(entries.map(([, loader]) => loader()))
  return entries.map(([path], i) => ({
    label: filenameFromPath(path),
    code: loaded[i]!,
    language: languageFromPath(path),
  }))
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

  const [framerSources, cssSources] = await Promise.all([
    loadVariantSources(framerLoaders),
    loadVariantSources(cssLoaders),
  ])

  const tabs: SourceTab[] = []
  appendVariantTabs(tabs, framerSources)
  appendVariantTabs(tabs, cssSources)

  const sharedToLoad = new Map<string, RawSourceLoader>()
  discoverSharedImports(framerSources.tsx, framerLoaders, sharedToLoad)
  discoverSharedImports(cssSources.tsx, cssLoaders, sharedToLoad)

  tabs.push(...(await loadSharedTabs(sharedToLoad)))
  return tabs
}

/** Optional raw source glob results passed to `buildGroupExport`. */
type RawSourceGlobs = {
  framerTsx?: Record<string, RawSourceLoader>
  framerCss?: Record<string, RawSourceLoader>
  cssTsx?: Record<string, RawSourceLoader>
  cssCss?: Record<string, RawSourceLoader>
  shared?: Record<string, RawSourceLoader>
}

/** Merges group-root shared files with helper files found in framer/css subdirs. */
function mergeSharedLoaders(rawSources: RawSourceGlobs): Record<string, RawSourceLoader> {
  const framerHelpers = collectHelperLoaders(rawSources.framerTsx, rawSources.framerCss)
  const cssHelpers = collectHelperLoaders(rawSources.cssTsx, rawSources.cssCss)
  return {
    ...(rawSources.shared ?? {}),
    ...framerHelpers,
    ...cssHelpers,
  }
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
  rawSources?: RawSourceGlobs
): GroupExport {
  const src = rawSources ?? {}
  const allShared = mergeSharedLoaders(src)

  return {
    metadata,
    framer: buildAnimationMap(
      framerComponents,
      framerMeta,
      src.framerTsx,
      src.framerCss,
      allShared,
      'framer'
    ),
    css: buildAnimationMap(cssComponents, cssMeta, src.cssTsx, src.cssCss, allShared, 'css'),
  }
}
