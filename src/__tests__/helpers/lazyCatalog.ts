import '@/components/lazyBootstrap'
import { buildRegistryFromCategories, clearAnimationCache } from '@/components/animationRegistry'
import { loadLazyGroup, getLazyNavCatalog } from '@/lib/lazyGroupRegistry'
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
export async function preloadRegistry(): Promise<Record<string, React.ComponentType<Record<string, unknown>>>> {
  await loadLazyCatalog()
  return buildRegistryFromCategories()
}

/** Clears lazy group caches so tests can start from a cold state. */
export function resetLazyTestState(): void {
  clearAnimationCache()
}
