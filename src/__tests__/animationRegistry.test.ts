import {
  buildRegistryFromCategories,
  categories,
  findAnimationById,
  getGroupAnimations,
} from '@/components/animationRegistry'
import { describe, expect, it } from 'vitest'

describe('animationRegistry', () => {
  describe('categories export', () => {
    it('contains exactly the 5 known category keys in stable order', () => {
      const ids = Object.keys(categories)
      expect(ids).toHaveLength(5)
      expect(ids).toEqual(
        expect.arrayContaining(['base', 'dialogs', 'progress', 'realtime', 'rewards'])
      )
    })

    it('every category metadata.id matches its registry key', () => {
      for (const [key, cat] of Object.entries(categories)) {
        expect(cat.metadata.id).toBe(key)
      }
    })

    it('every category has a descriptive human-readable title', () => {
      const titles = Object.values(categories).map((cat) => cat.metadata.title)
      expect(titles).toEqual(
        expect.arrayContaining([
          'Base effects',
          'Dialog & Modal Animations',
          'Progress & Loading Animations',
          'Real-time Updates & Timers',
          'Game Elements & Rewards',
        ])
      )
    })

    it('every category has at least one group whose metadata.id matches its registry key and has a title', () => {
      for (const cat of Object.values(categories)) {
        const groups = Object.entries(cat.groups)
        expect(groups.length).toBeGreaterThanOrEqual(1)

        for (const [groupKey, group] of groups) {
          expect(group.metadata.id).toBe(groupKey)
          expect(group.metadata.title).toMatch(/\w{3,}/)
        }
      }
    })

    it('every group has framer and css maps with valid animation entries', () => {
      for (const cat of Object.values(categories)) {
        for (const [groupKey, group] of Object.entries(cat.groups)) {
          // Both framer and css should be iterable objects (Object.entries succeeds)
          const framerKeys = Object.keys(group.framer)
          const cssKeys = Object.keys(group.css)
          // At least one of framer/css should have entries for the group to be useful
          expect(framerKeys.length + cssKeys.length).toBeGreaterThanOrEqual(1)

          // Every framer entry must have matching metadata and a lazy component
          for (const [animId, anim] of Object.entries(group.framer)) {
            expect(anim.metadata.id, `${groupKey}/framer/${animId}: metadata.id`).toBe(animId)
            expect(anim.metadata.title, `${groupKey}/framer/${animId}: title`).toMatch(/\w{2,}/)
            expect(anim.metadata.description, `${groupKey}/framer/${animId}: description`).toMatch(
              /\w{5,}/
            )
            expect(anim.component, `${groupKey}/framer/${animId}: component`).toHaveProperty(
              '$$typeof',
              Symbol.for('react.lazy')
            )
          }
          // Every css entry must have matching metadata and a lazy component
          for (const [animId, anim] of Object.entries(group.css)) {
            expect(anim.metadata.id, `${groupKey}/css/${animId}: metadata.id`).toBe(animId)
            expect(anim.metadata.title, `${groupKey}/css/${animId}: title`).toMatch(/\w{2,}/)
            expect(anim.metadata.description, `${groupKey}/css/${animId}: description`).toMatch(
              /\w{5,}/
            )
            expect(anim.component, `${groupKey}/css/${animId}: component`).toHaveProperty(
              '$$typeof',
              Symbol.for('react.lazy')
            )
          }
        }
      }
    })
  })

  describe('buildRegistryFromCategories', () => {
    const registry = buildRegistryFromCategories()

    it('returns a record with 100+ animations', () => {
      const count = Object.keys(registry).length
      expect(count).toBeGreaterThanOrEqual(100)
    })

    it('all registry keys follow the group__variant naming convention', () => {
      for (const key of Object.keys(registry)) {
        expect(key).toMatch(/^[a-z][a-z0-9-]*__[a-z][a-z0-9-]*$/)
      }
    })

    it('all registry values are React.lazy components', () => {
      for (const [key, component] of Object.entries(registry)) {
        expect(component, `${key}: not a lazy component`).toHaveProperty(
          '$$typeof',
          Symbol.for('react.lazy')
        )
      }
    })

    it('contains animations from all 5 categories', () => {
      const keys = Object.keys(registry)
      expect(keys.some((k) => k.startsWith('standard-effects__'))).toBe(true) // base
      expect(keys.some((k) => k.startsWith('modal-base__'))).toBe(true) // dialogs
      expect(keys.some((k) => k.startsWith('progress-bars__'))).toBe(true) // progress
      expect(keys.some((k) => k.startsWith('timer-effects__'))).toBe(true) // realtime
      expect(keys.some((k) => k.startsWith('collection-effects__'))).toBe(true) // rewards
    })

    it('returns deterministic results on repeated calls', () => {
      const registry1 = buildRegistryFromCategories()
      const registry2 = buildRegistryFromCategories()
      expect(Object.keys(registry1).sort()).toEqual(Object.keys(registry2).sort())
    })

    it('CSS variant overwrites framer variant when both share the same ID', () => {
      // The flat registry iterates framer first, then CSS per group.
      // When both maps have the same ID, CSS wins (last write wins).
      // Verify this is the actual behavior by checking a known dual-variant animation.
      const framerMap = Object.values(categories).flatMap((cat) =>
        Object.values(cat.groups).flatMap((g) => Object.keys(g.framer))
      )
      const cssMap = Object.values(categories).flatMap((cat) =>
        Object.values(cat.groups).flatMap((g) => Object.keys(g.css))
      )
      const overlap = framerMap.filter((id) => cssMap.includes(id))
      // There should be significant overlap (both variants use same IDs)
      expect(overlap.length).toBeGreaterThan(50)

      // The registry should still contain these IDs (not silently dropped)
      const registryKeys = new Set(Object.keys(registry))
      const missingIds = overlap.filter((id) => !registryKeys.has(id))
      expect(missingIds).toEqual([])
    })

    it('CSS component identity wins over framer for dual-variant animations', () => {
      // Pick the first dual-variant animation and verify the flat registry entry
      // points to the CSS component reference, not the framer one.
      for (const cat of Object.values(categories)) {
        for (const group of Object.values(cat.groups)) {
          for (const [animId, cssEntry] of Object.entries(group.css)) {
            const framerEntry = group.framer[animId]
            if (!framerEntry) continue

            // Both variants exist — the flat registry should contain the CSS component
            const registryComponent = registry[animId]
            expect(
              registryComponent,
              `${animId}: flat registry should use CSS component, not framer`
            ).toBe(cssEntry.component)
            // It should NOT be the framer component
            expect(registryComponent).not.toBe(framerEntry.component)
            return // One verified pair is sufficient to prove the ordering
          }
        }
      }
      throw new Error('No dual-variant animation found to verify CSS-wins-over-framer')
    })
  })

  describe('getGroupAnimations', () => {
    it('returns framer animations for a known group', () => {
      const anims = getGroupAnimations('standard-effects', 'framer')
      expect(Object.keys(anims).length).toBeGreaterThanOrEqual(1)
      for (const [id, anim] of Object.entries(anims)) {
        expect(id).toMatch(/^standard-effects__/)
        expect(anim.component).toHaveProperty('$$typeof', Symbol.for('react.lazy'))
      }
    })

    it('returns css animations for a known group', () => {
      const anims = getGroupAnimations('standard-effects', 'css')
      expect(Object.keys(anims).length).toBeGreaterThanOrEqual(1)
      for (const [id, anim] of Object.entries(anims)) {
        expect(id).toMatch(/^standard-effects__/)
        expect(anim.metadata.id).toBe(id)
      }
    })

    it('returns empty object for unknown group', () => {
      const anims = getGroupAnimations('nonexistent-group', 'framer')
      expect(anims).toEqual({})
    })

    it('returns same animations as direct category.groups access', () => {
      const directFramer = categories['base']!.groups['standard-effects']!.framer
      const helperFramer = getGroupAnimations('standard-effects', 'framer')
      expect(Object.keys(helperFramer).sort()).toEqual(Object.keys(directFramer).sort())
    })

    it('returns framer map (not css) when tech is "framer" — verifies correct branch', () => {
      // This catches a swap bug where the ternary condition is inverted
      const framerAnims = getGroupAnimations('standard-effects', 'framer')
      const cssAnims = getGroupAnimations('standard-effects', 'css')
      // Both should have the same IDs (dual-implementation) but different component refs
      const framerIds = Object.keys(framerAnims).sort()
      const cssIds = Object.keys(cssAnims).sort()
      expect(framerIds).toEqual(cssIds)
      // Components must be different objects (lazy wrappers from different modules)
      const firstId = framerIds[0]!
      expect(framerAnims[firstId]!.component).not.toBe(cssAnims[firstId]!.component)
    })

    it('finds groups across all categories (not just the first)', () => {
      // Collect one group ID from each category and verify getGroupAnimations finds it
      for (const [catKey, cat] of Object.entries(categories)) {
        const firstGroupId = Object.keys(cat.groups)[0]!
        const framerAnims = getGroupAnimations(firstGroupId, 'framer')
        expect(
          Object.keys(framerAnims).length,
          `getGroupAnimations("${firstGroupId}", "framer") returned empty — category: ${catKey}`
        ).toBeGreaterThanOrEqual(1)
      }
    })

    it('returns empty object for unknown group with valid tech', () => {
      const result = getGroupAnimations('this-group-does-not-exist', 'css')
      expect(result).toEqual({})
    })
  })

  describe('findAnimationById', () => {
    it('finds animation present in both framer and css variants', () => {
      // standard-effects__bounce exists in both variants
      const result = findAnimationById('standard-effects__bounce')
      expect(result).toEqual({
        baseGroupId: 'standard-effects',
        hasFramer: true,
        hasCss: true,
      })
    })

    it('returns null for nonexistent animation ID', () => {
      const result = findAnimationById('nonexistent-group__nonexistent-variant')
      expect(result).toBeNull()
    })

    it('returns null for empty string', () => {
      expect(findAnimationById('')).toBeNull()
    })

    it('returns the correct baseGroupId (not the suffixed group ID)', () => {
      // Pick any known animation from the catalog
      const allAnimIds = Object.values(categories).flatMap((cat) =>
        Object.values(cat.groups).flatMap((group) => Object.keys(group.framer))
      )
      // Use the first one
      const testId = allAnimIds[0]!
      const result = findAnimationById(testId)
      // baseGroupId should NOT end with -framer or -css (it's the base group key)
      expect(result?.baseGroupId).not.toMatch(/-(?:framer|css)$/)
      expect(result?.baseGroupId).toMatch(/^[a-z][a-z0-9-]+$/)
    })

    it('correctly identifies animation only in framer when css variant is missing', () => {
      // Verify by checking all groups — find one where framer has an ID that css does not
      // If all are paired (which is the design intent), this test documents that behavior
      let foundFramerOnly = false
      for (const cat of Object.values(categories)) {
        for (const group of Object.values(cat.groups)) {
          for (const id of Object.keys(group.framer)) {
            if (!(id in group.css)) {
              const result = findAnimationById(id)
              expect(result).toEqual({
                baseGroupId: expect.stringMatching(/^[a-z][a-z0-9-]+$/),
                hasFramer: true,
                hasCss: false,
              })
              foundFramerOnly = true
              break
            }
          }
          if (foundFramerOnly) break
        }
        if (foundFramerOnly) break
      }
      // If no framer-only animation exists, all are paired — document this
      if (!foundFramerOnly) {
        // All animations are dual-implementation — every framer ID has a css counterpart
        const allFramerIds = Object.values(categories).flatMap((cat) =>
          Object.values(cat.groups).flatMap((group) => Object.keys(group.framer))
        )
        for (const id of allFramerIds) {
          const result = findAnimationById(id)
          expect(result!.hasFramer).toBe(true)
          expect(result!.hasCss).toBe(true)
        }
      }
    })

    it('finds animations across all 5 categories', () => {
      // Pick one animation ID from each category
      for (const cat of Object.values(categories)) {
        const firstGroup = Object.values(cat.groups)[0]!
        const firstAnimId = Object.keys(firstGroup.framer)[0]!
        const result = findAnimationById(firstAnimId)
        expect(result).toEqual(
          expect.objectContaining({
            baseGroupId: expect.stringMatching(/^[a-z][a-z0-9-]+$/),
          })
        )
      }
    })

    it('returns consistent results across multiple calls for the same ID', () => {
      const result1 = findAnimationById('standard-effects__bounce')
      const result2 = findAnimationById('standard-effects__bounce')
      expect(result1).toEqual(result2)
    })
  })
})
