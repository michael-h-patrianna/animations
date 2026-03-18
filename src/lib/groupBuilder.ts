import type {
  AnimationExport,
  AnimationMetadata,
  GroupExport,
  GroupMetadata,
} from '@/types/animation'
import { lazy, type ComponentType } from 'react'

/** Shape of an eagerly-imported `.meta.ts` module. */
type MetaModule = { metadata: AnimationMetadata }

/** Shape of a lazily-imported `.tsx` component module (named exports). */
type ComponentModuleLoader = () => Promise<Record<string, unknown>>

/** Files to skip when scanning glob results — not animation components. */
const SKIP_PATTERN =
  /^(?:Mock|index|Shared|Premium|.*(?:Helper|Parts|Components|cardSets|utils|fireworkModel))/

/**
 * Extracts the base filename from a Vite glob-matched path.
 *
 * `'./framer/StandardEffectsBounce.meta.ts'` → `'StandardEffectsBounce'`
 * `'./framer/StandardEffectsBounce.tsx'`      → `'StandardEffectsBounce'`
 */
function baseNameFromPath(path: string): string {
  return path.replace(/^.*\//, '').replace(/\.meta\.ts$|\.tsx?$/, '')
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
  metaModules: Record<string, MetaModule>
): Record<string, AnimationExport> {
  const animations: Record<string, AnimationExport> = {}

  for (const [metaPath, metaModule] of Object.entries(metaModules)) {
    const baseName = baseNameFromPath(metaPath)
    if (SKIP_PATTERN.test(baseName)) continue

    const meta = metaModule.metadata

    // Find the corresponding component loader by matching base filename
    const componentPath = Object.keys(componentLoaders).find(
      (p) => baseNameFromPath(p) === baseName
    )
    if (!componentPath) continue

    const loader = componentLoaders[componentPath]
    const exportName = baseName

    const component = lazy(() =>
      loader().then((m) => ({
        default: m[exportName] as ComponentType<Record<string, unknown>>,
      }))
    )

    animations[meta.id] = { component, metadata: meta }
  }

  return animations
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
 * )
 * ```
 */
export function buildGroupExport(
  metadata: GroupMetadata,
  framerComponents: Record<string, ComponentModuleLoader>,
  framerMeta: Record<string, MetaModule>,
  cssComponents: Record<string, ComponentModuleLoader>,
  cssMeta: Record<string, MetaModule>
): GroupExport {
  return {
    metadata,
    framer: buildAnimationMap(framerComponents, framerMeta),
    css: buildAnimationMap(cssComponents, cssMeta),
  }
}
