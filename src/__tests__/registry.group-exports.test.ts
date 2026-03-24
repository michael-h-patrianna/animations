import { getNavCatalog } from '../components/animationRegistry'
import { loadLazyCatalog, resetLazyTestState } from './helpers/lazyCatalog'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('group export completeness', () => {
  let catalog: Awaited<ReturnType<typeof loadLazyCatalog>> = []

  beforeAll(async () => {
    resetLazyTestState()
    catalog = await loadLazyCatalog()
  })

  afterAll(() => {
    resetLazyTestState()
  })

  it('registers all 18 expected base groups in navigation metadata', () => {
    const navCatalog = getNavCatalog()
    const baseGroupIds = [...new Set(navCatalog.categories.flatMap((category) => category.groups.map((group) => group.baseGroupId)))].sort()

    expect(baseGroupIds).toEqual([
      'button-effects',
      'collection-effects',
      'icon-animations',
      'lights',
      'loading-states',
      'modal-base',
      'modal-celebrations',
      'modal-content',
      'modal-dismiss',
      'modal-open',
      'modal-orchestration',
      'prize-reveal',
      'progress-bars',
      'realtime-data',
      'standard-effects',
      'text-effects',
      'timer-effects',
      'update-indicators',
    ])
  })

  it('loads both framer and css variants for every base group', () => {
    for (const category of catalog) {
      const baseIds = new Set(category.groups.map((group) => group.id.replace(/-(?:framer|css)$/, '')))

      for (const baseId of baseIds) {
        expect(category.groups.some((group) => group.id === `${baseId}-framer`)).toBe(true)
        expect(category.groups.some((group) => group.id === `${baseId}-css`)).toBe(true)
      }
    }
  })

  it('keeps animation IDs aligned across loaded framer and css variants', () => {
    for (const category of catalog) {
      const baseIds = new Set(category.groups.map((group) => group.id.replace(/-(?:framer|css)$/, '')))

      for (const baseId of baseIds) {
        const framerGroup = category.groups.find((group) => group.id === `${baseId}-framer`)
        const cssGroup = category.groups.find((group) => group.id === `${baseId}-css`)

        expect(framerGroup?.animations.map((animation) => animation.id).sort()).toEqual(
          cssGroup?.animations.map((animation) => animation.id).sort()
        )
      }
    }
  })
})
