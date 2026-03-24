import {
  buildRegistryFromCategories,
  findAnimationById,
  getAllGroups,
  getGroupAnimations,
  getLazyGroupAnimationsAsync,
  getNavCatalog,
} from '@/components/animationRegistry'
import {
  preloadRegistry,
  resetLazyTestState,
} from '@/__tests__/helpers/lazyCatalog'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'

describe('animationRegistry', () => {
  describe('navigation metadata', () => {
    it('exposes exactly 5 categories in the nav catalog', () => {
      const navCatalog = getNavCatalog()
      const ids = navCatalog.categories.map((category) => category.id)

      expect(ids).toEqual(['base', 'dialogs', 'progress', 'realtime', 'rewards'])
    })

    it('registers framer and css group variants in the nav catalog', () => {
      const allGroups = getAllGroups()

      expect(allGroups.length).toBeGreaterThanOrEqual(36)
      expect(allGroups.every((group) => group.id.match(/-(?:framer|css)$/))).toBe(true)
      expect(allGroups.some((group) => group.id === 'standard-effects-framer')).toBe(true)
      expect(allGroups.some((group) => group.id === 'standard-effects-css')).toBe(true)
    })
  })

  describe('lazy group loading', () => {
    afterEach(() => {
      resetLazyTestState()
    })

    it('loads a group asynchronously and exposes it via sync cache reads afterwards', async () => {
      const loaded = await getLazyGroupAnimationsAsync('standard-effects', 'framer')
      const cached = getGroupAnimations('standard-effects', 'framer')

      expect(Object.keys(loaded).length).toBeGreaterThanOrEqual(1)
      expect(Object.keys(cached).sort()).toEqual(Object.keys(loaded).sort())
      expect(Object.keys(cached).every((id) => id.startsWith('standard-effects__'))).toBe(true)
    })

    it('returns empty object for unknown groups', () => {
      expect(getGroupAnimations('nonexistent-group', 'framer')).toEqual({})
    })
  })

  describe('loaded registry snapshot', () => {
    beforeAll(async () => {
      resetLazyTestState()
      await preloadRegistry()
    })

    afterAll(() => {
      resetLazyTestState()
    })

    it('builds a flat registry from loaded groups', () => {
      const registry = buildRegistryFromCategories()

      expect(Object.keys(registry).length).toBeGreaterThanOrEqual(100)
      expect(Object.keys(registry).every((key) => key.match(/^[a-z][a-z0-9-]*__[a-z][a-z0-9-]*$/)))
        .toBe(true)
    })

    it('contains animations from all 5 categories', () => {
      const keys = Object.keys(buildRegistryFromCategories())

      expect(keys.some((key) => key.startsWith('standard-effects__'))).toBe(true)
      expect(keys.some((key) => key.startsWith('modal-base__'))).toBe(true)
      expect(keys.some((key) => key.startsWith('progress-bars__'))).toBe(true)
      expect(keys.some((key) => key.startsWith('timer-effects__'))).toBe(true)
      expect(keys.some((key) => key.startsWith('collection-effects__'))).toBe(true)
    })

    it('returns the same group IDs for both tech variants of a loaded base group', () => {
      const framerAnims = getGroupAnimations('standard-effects', 'framer')
      const cssAnims = getGroupAnimations('standard-effects', 'css')

      expect(Object.keys(framerAnims).sort()).toEqual(Object.keys(cssAnims).sort())
    })

    it('findAnimationById resolves loaded animations to their base group', () => {
      expect(findAnimationById('standard-effects__bounce')).toEqual({
        baseGroupId: 'standard-effects',
        hasFramer: true,
        hasCss: true,
      })
    })

    it('findAnimationById returns null for unknown animation IDs', () => {
      expect(findAnimationById('nonexistent-group__nonexistent-variant')).toBeNull()
    })
  })
})
