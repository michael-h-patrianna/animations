import {
  getAllGroups,
  getGroupAnimations,
  getLazyGroupAnimationsAsync,
  getNavCatalog,
} from '@/components/animationRegistry'
import {
  loadLazyCatalog,
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

  describe('loaded group data', () => {
    beforeAll(async () => {
      resetLazyTestState()
      await loadLazyCatalog()
    })

    afterAll(() => {
      resetLazyTestState()
    })

    it('returns the same animation IDs for both tech variants of a loaded base group', () => {
      const framerAnims = getGroupAnimations('standard-effects', 'framer')
      const cssAnims = getGroupAnimations('standard-effects', 'css')

      expect(Object.keys(framerAnims).sort()).toEqual(Object.keys(cssAnims).sort())
    })
  })
})
