import { getGroupAnimations } from '@/components/animationRegistry'
import { getAllLazyGroups, getLazyNavCatalog, loadLazyGroup } from '@/lib/lazyGroupRegistry'
import { loadLazyCatalog, resetLazyTestState } from '@/__tests__/helpers/lazyCatalog'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'

describe('animationRegistry', () => {
  describe('navigation metadata', () => {
    it('exposes exactly 5 categories in the nav catalog', () => {
      const navCatalog = getLazyNavCatalog()
      const ids = navCatalog.categories.map((category) => category.id)

      expect(ids).toEqual(['base', 'dialogs', 'progress', 'realtime', 'rewards'])
    })

    it('registers framer and css group variants in the nav catalog', () => {
      const allGroups = getAllLazyGroups()

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
      await loadLazyGroup('standard-effects-framer')
      const cached = getGroupAnimations('standard-effects', 'framer')

      expect(Object.keys(cached).length).toBeGreaterThanOrEqual(1)
      expect(Object.keys(cached).every((id) => id.startsWith('standard-effects__'))).toBe(true)
    }, 30_000)

    it('returns empty object for unknown groups', () => {
      expect(getGroupAnimations('nonexistent-group', 'framer')).toEqual({})
    })
  })

  describe('loaded group data', () => {
    beforeAll(async () => {
      resetLazyTestState()
      await loadLazyCatalog()
    }, 30_000)

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
