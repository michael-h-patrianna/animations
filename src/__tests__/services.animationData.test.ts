import { loadLazyCatalog, resetLazyTestState } from '@/__tests__/helpers/lazyCatalog'
import type { Category } from '@/types/animation'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('lazy-loaded catalog data', () => {
  let catalog: Category[] = []

  beforeAll(async () => {
    resetLazyTestState()
    catalog = await loadLazyCatalog()
  })

  afterAll(() => {
    resetLazyTestState()
  })

  it('returns exactly 5 categories once groups are loaded', () => {
    expect(catalog).toHaveLength(5)
  })

  it('keeps category ids and titles populated', () => {
    for (const category of catalog) {
      expect(category.id).toMatch(/^[a-z]+/)
      expect(category.title).toMatch(/\w{3,}/)
      expect(category.groups.length).toBeGreaterThanOrEqual(2)
    }
  })

  it('keeps group ids and tech aligned', () => {
    for (const category of catalog) {
      for (const group of category.groups) {
        expect(group.id).toMatch(/-(?:framer|css)$/)
        expect(group.tech).toMatch(/^(framer|css)$/)
        expect(group.animations.length).toBeGreaterThanOrEqual(1)
      }
    }
  })

  it('loads a substantial number of animations across the catalog', () => {
    const total = catalog.reduce(
      (sum, category) =>
        sum + category.groups.reduce((groupSum, group) => groupSum + group.animations.length, 0),
      0
    )

    expect(total).toBeGreaterThanOrEqual(100)
  })

  it('propagates metadata fields through loaded groups', () => {
    const allAnimations = catalog.flatMap((category) =>
      category.groups.flatMap((group) => group.animations)
    )

    expect(allAnimations.some((animation) => animation.infinite === true)).toBe(true)
    expect(allAnimations.some((animation) => animation.disableReplay === true)).toBe(true)
    expect(allAnimations.some((animation) => animation.controls === 'prizeCount')).toBe(true)
  })

  it('preserves deterministic ordering for negative-order animations', () => {
    const rewardsCategory = catalog.find((category) => category.id === 'rewards')
    const collectionFramer = rewardsCategory?.groups.find(
      (group) => group.id === 'collection-effects-framer'
    )

    expect(collectionFramer?.animations[0]?.id).toBe('collection-effects__coin-trail')
  })
})
