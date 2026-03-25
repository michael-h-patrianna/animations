import '@/components/lazyBootstrap'
import { clearAnimationCache, getGroupAnimations } from '@/components/animationRegistry'
import { loadLazyGroup, getLazyNavCatalog, getAllLazyGroups } from '@/lib/lazyGroupRegistry'
import type { Category } from '@/types/animation'
import type React from 'react'

/** Loads every registered lazy group and returns a fully populated catalog snapshot. */
export async function loadLazyCatalog(): Promise<Category[]> {
  const navCatalog = getLazyNavCatalog()
  const categories = await Promise.all(
    navCatalog.categories.map(async (category) => ({
      id: category.id,
      title: category.title,
      groups: await Promise.all(
        category.groups.map(async (group) => {
          const result = await loadLazyGroup(group.id)
          return result.group
        })
      ),
    }))
  )

  return categories
}

/** Preloads every lazy group and returns a flat registry of loaded components. */
export async function preloadRegistry(): Promise<
  Record<string, React.ComponentType<Record<string, unknown>>>
> {
  await loadLazyCatalog()
  const registry: Record<string, React.ComponentType<Record<string, unknown>>> = {}
  for (const group of getAllLazyGroups()) {
    const loaded = getGroupAnimations(
      group.baseGroupId,
      group.id.endsWith('-css') ? 'css' : 'framer'
    )
    for (const [id, anim] of Object.entries(loaded)) {
      registry[id] = anim.component
    }
  }
  return registry
}

/** Clears lazy group caches so tests can start from a cold state. */
export function resetLazyTestState(): void {
  clearAnimationCache()
}
