import { categories } from '@/components/animationRegistry'
import { describe, expect, it } from 'vitest'

/**
 * Validates that every group in the registry produces a complete GroupExport
 * with both framer and css maps populated. This catches registration failures
 * where a group index.ts exists but fails to discover its animation files.
 */
describe('group export completeness', () => {
  const allGroups = Object.values(categories).flatMap((cat) =>
    Object.entries(cat.groups).map(([key, group]) => ({ catId: cat.metadata.id, key, group }))
  )

  it('every category has at least one group', () => {
    for (const [catKey, cat] of Object.entries(categories)) {
      const groupCount = Object.keys(cat.groups).length
      expect(groupCount, `Category "${catKey}" has no groups`).toBeGreaterThanOrEqual(1)
    }
  })

  it('every group has at least 2 animations across both maps (framer+css)', () => {
    for (const { catId, key, group } of allGroups) {
      const framerCount = Object.keys(group.framer).length
      const cssCount = Object.keys(group.css).length
      // Each group should have at least 1 framer + 1 css (dual implementation)
      expect(
        framerCount + cssCount,
        `${catId}/${key}: insufficient animations`
      ).toBeGreaterThanOrEqual(2)
    }
  })

  it('every group with framer animations has matching css animations (dual implementation)', () => {
    for (const { catId, key, group } of allGroups) {
      const framerIds = new Set(Object.keys(group.framer))
      const cssIds = new Set(Object.keys(group.css))

      if (framerIds.size === 0 && cssIds.size === 0) continue

      // Both should have the same IDs
      for (const id of framerIds) {
        expect(cssIds.has(id), `${catId}/${key}: framer has "${id}" without CSS pair`).toBe(true)
      }
      for (const id of cssIds) {
        expect(framerIds.has(id), `${catId}/${key}: css has "${id}" without framer pair`).toBe(true)
      }
    }
  })

  it('every group has at least 1 animation per tech variant', () => {
    for (const { catId, key, group } of allGroups) {
      expect(
        Object.keys(group.framer).length,
        `${catId}/${key}: no framer animations`
      ).toBeGreaterThanOrEqual(1)
      expect(
        Object.keys(group.css).length,
        `${catId}/${key}: no css animations`
      ).toBeGreaterThanOrEqual(1)
    }
  })

  it('all 17 expected groups are present', () => {
    const groupKeys = allGroups.map((g) => g.key).sort()
    expect(groupKeys).toEqual([
      'button-effects',
      'collection-effects',
      'icon-animations',
      'lights',
      'loading-states',
      'modal-base',
      'modal-celebrations',
      'modal-content',
      'modal-dismiss',
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
})
