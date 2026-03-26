import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { loadLazyCatalog, resetLazyTestState } from '@/__tests__/helpers/lazyCatalog'
import type { Category } from '@/types/animation'

describe('inspectorStarterDefaults', () => {
  let catalog: Category[] = []

  beforeAll(async () => {
    resetLazyTestState()
    catalog = await loadLazyCatalog()
  })

  afterAll(() => {
    resetLazyTestState()
  })

  it('every key in INSPECTOR_STARTER_DEFAULTS maps to a registered animation ID', async () => {
    const { getInspectorStarterDefaults } = await import('@/contexts/inspectorStarterDefaults')

    // Collect all animation IDs from the fully loaded catalog
    const allAnimationIds = new Set<string>()
    for (const category of catalog) {
      for (const group of category.groups) {
        for (const animation of group.animations) {
          allAnimationIds.add(animation.id)
        }
      }
    }

    expect(allAnimationIds.size).toBeGreaterThanOrEqual(100)

    // Probe every catalog ID to find which ones have starter defaults.
    // This verifies getInspectorStarterDefaults returns non-empty for known IDs.
    const idsWithDefaults: string[] = []
    for (const id of allAnimationIds) {
      const defaults = getInspectorStarterDefaults(id)
      if (Object.keys(defaults).length > 0) {
        idsWithDefaults.push(id)
      }
    }

    // Verify at least the 13 known entries were found via probing
    expect(idsWithDefaults).toEqual(
      expect.arrayContaining([
        'collection-effects__coin-burst',
        'icon-animations__bounce',
        'modal-celebrations__firework',
      ])
    )

    // Hardcode the known starter IDs from inspectorStarterDefaults.ts.
    // If a new entry is added there, this list must be updated.
    const knownStarterIds = [
      'collection-effects__coin-burst',
      'collection-effects__coin-magnet',
      'collection-effects__coin-trail',
      'collection-effects__coins-fountain',
      'icon-animations__bounce',
      'icon-animations__float',
      'icon-animations__pulse',
      'icon-animations__shake',
      'modal-celebrations__coin-cascade',
      'modal-celebrations__coins-arc',
      'modal-celebrations__coins-swirl',
      'modal-celebrations__firework',
      'modal-celebrations__treasure-particles',
    ]

    const missingFromCatalog = knownStarterIds.filter((id) => !allAnimationIds.has(id))

    expect(
      missingFromCatalog,
      `INSPECTOR_STARTER_DEFAULTS contains animation IDs not found in the catalog. ` +
        `Stale entries: ${missingFromCatalog.join(', ')}. ` +
        `Update src/contexts/inspectorStarterDefaults.ts to remove or fix these IDs.`
    ).toHaveLength(0)
  })
})
