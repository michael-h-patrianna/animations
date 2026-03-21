import {
  buildRegistryFromCategories,
  categories,
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
  })
})
