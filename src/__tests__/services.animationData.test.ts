import { animationDataService } from '@/services/animationData'
import type { Category } from '@/types/animation'
import { describe, expect, it } from 'vitest'

describe('services - animationData', () => {
  describe('loadAnimations', () => {
    it('loads and returns non-empty catalog', async () => {
      const catalog = await animationDataService.loadAnimations()
      expect(Array.isArray(catalog)).toBe(true)
      expect(catalog.length).toBeGreaterThan(0)
    })

    it('returns catalog with correct structure', async () => {
      const catalog = await animationDataService.loadAnimations()
      catalog.forEach((category) => {
        expect(category).toMatchObject({
          id: expect.any(String),
          title: expect.any(String),
          groups: expect.any(Array),
        })
        expect(category.id).toBeTruthy()
        expect(category.title).toBeTruthy()
        expect(category.groups.length).toBeGreaterThan(0)
      })
    })

    it('returns catalog with groups containing animations', async () => {
      const catalog = await animationDataService.loadAnimations()
      catalog.forEach((category) => {
        category.groups.forEach((group) => {
          expect(group).toMatchObject({
            id: expect.any(String),
            title: expect.any(String),
            animations: expect.any(Array),
          })
          expect(group.id).toBeTruthy()
          expect(group.title).toBeTruthy()
          expect(group.animations.length).toBeGreaterThan(0)
        })
      })
    })

    it('returns catalog with animations containing required fields', async () => {
      const catalog = await animationDataService.loadAnimations()
      catalog.forEach((category) => {
        category.groups.forEach((group) => {
          group.animations.forEach((animation) => {
            expect(animation).toMatchObject({
              id: expect.any(String),
              title: expect.any(String),
              description: expect.any(String),
              categoryId: expect.any(String),
              groupId: expect.any(String),
            })
            expect(animation.id).toBeTruthy()
            expect(animation.title).toBeTruthy()
            expect(animation.description).toBeTruthy()
            expect(animation.categoryId).toBe(category.id)
            expect(animation.groupId).toBe(group.id)
          })
        })
      })
    })

    it('caches catalog on subsequent calls', async () => {
      const catalog1 = await animationDataService.loadAnimations()
      const catalog2 = await animationDataService.loadAnimations()
      // Should return the same reference (cached)
      expect(catalog1).toBe(catalog2)
    })
  })

  describe('refreshCatalog', () => {
    it('rebuilds catalog with correct structure', async () => {
      const catalog = await animationDataService.refreshCatalog()
      expect(Array.isArray(catalog)).toBe(true)
      expect(catalog.length).toBeGreaterThan(0)
      catalog.forEach((category) => {
        expect(category).toMatchObject({
          id: expect.any(String),
          title: expect.any(String),
          groups: expect.any(Array),
        })
      })
    })

    it('returns fresh catalog instance on refresh', async () => {
      const catalog1 = await animationDataService.loadAnimations()
      const catalog2 = await animationDataService.refreshCatalog()
      // Should be different instances after refresh
      expect(catalog1).not.toBe(catalog2)
      expect(catalog1.length).toBe(catalog2.length)
    })
  })

  describe('buildCatalogFromCategories coverage', () => {
    it('returns catalog with all expected categories', async () => {
      const catalog = await animationDataService.loadAnimations()
      const expectedCategories = ['base', 'dialogs', 'progress', 'realtime', 'rewards']
      const actualCategories = catalog.map((cat) => cat.id).sort()
      expectedCategories.forEach((expectedId) => {
        expect(actualCategories).toContain(expectedId)
      })
    })

    it('ensures all animations have categoryId and groupId matching their parent', async () => {
      const catalog = await animationDataService.loadAnimations()
      catalog.forEach((category) => {
        category.groups.forEach((group) => {
          group.animations.forEach((animation) => {
            expect(animation.categoryId).toBe(category.id)
            expect(animation.groupId).toBe(group.id)
          })
        })
      })
    })

    it('ensures all groups have tech field when present in metadata', async () => {
      const catalog = await animationDataService.loadAnimations()
      catalog.forEach((category) => {
        category.groups.forEach((group) => {
          if (group.tech) {
            expect(['css', 'framer', 'js']).toContain(group.tech)
          }
        })
      })
    })

    it('ensures all animations have valid tags array', async () => {
      const catalog = await animationDataService.loadAnimations()
      catalog.forEach((category) => {
        category.groups.forEach((group) => {
          group.animations.forEach((animation) => {
            if (animation.tags !== undefined) {
              expect(Array.isArray(animation.tags)).toBe(true)
              animation.tags.forEach((tag) => {
                expect(typeof tag).toBe('string')
              })
            }
          })
        })
      })
    })

    it('returns consistent results on multiple catalog loads', async () => {
      const catalog1 = await animationDataService.loadAnimations()
      const catalog2 = await animationDataService.loadAnimations()
      expect(catalog1.length).toBe(catalog2.length)
      expect(catalog1[0].groups.length).toBe(catalog2[0].groups.length)
      expect(catalog1[0].groups[0].animations.length).toBe(
        catalog2[0].groups[0].animations.length
      )
    })
  })
})
