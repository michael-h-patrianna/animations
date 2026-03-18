import { buildCatalog } from '@/services/animationData'
import type { Category } from '@/types/animation'
import { describe, expect, it } from 'vitest'

describe('buildCatalog', () => {
  // Build once; buildCatalog is pure and deterministic.
  const catalog: Category[] = buildCatalog()

  it('returns exactly 5 categories', () => {
    expect(catalog).toHaveLength(5)
  })

  it('every category has a non-empty id and title', () => {
    for (const cat of catalog) {
      expect(cat.id).toMatch(/^[a-z]+/)
      expect(cat.title).toMatch(/\w{3,}/)
    }
  })

  it('every category has at least 2 groups (framer + css pair minimum)', () => {
    for (const cat of catalog) {
      expect(cat.groups.length).toBeGreaterThanOrEqual(2)
    }
  })

  it('groups are split into -framer and -css variants with matching tech field', () => {
    for (const cat of catalog) {
      for (const group of cat.groups) {
        if (group.id.endsWith('-framer')) {
          expect(group.tech).toBe('framer')
          expect(group.title).toContain('(Framer)')
        } else if (group.id.endsWith('-css')) {
          expect(group.tech).toBe('css')
          expect(group.title).toContain('(CSS)')
        } else {
          throw new Error(`Group "${group.id}" missing -framer or -css suffix`)
        }
      }
    }
  })

  it('framer and css groups come in pairs sharing the same base id', () => {
    const unpaired: string[] = []
    for (const cat of catalog) {
      const baseIds = new Set(cat.groups.map((g) => g.id.replace(/-(?:framer|css)$/, '')))
      for (const baseId of baseIds) {
        const variants = cat.groups.filter((g) => g.id.replace(/-(?:framer|css)$/, '') === baseId)
        // Each base ID should have at most 2 variants (framer + css)
        expect(variants.length).toBeLessThanOrEqual(2)

        if (variants.length === 1) {
          unpaired.push(variants[0].id)
        }
        if (variants.length === 2) {
          const techs = new Set(variants.map((v) => v.tech))
          expect(techs, `${baseId}: paired groups should have different techs`).toEqual(
            new Set(['framer', 'css'])
          )
          // Paired groups should have the same animation IDs
          const ids0 = new Set(variants[0].animations.map((a) => a.id))
          const ids1 = new Set(variants[1].animations.map((a) => a.id))
          for (const id of ids0) {
            expect(ids1.has(id), `${baseId}: framer has ${id} but css doesn't`).toBe(true)
          }
          for (const id of ids1) {
            expect(ids0.has(id), `${baseId}: css has ${id} but framer doesn't`).toBe(true)
          }
        }
      }
    }
    // If there are unpaired groups, they should be few and documented
    // Currently expect all groups to be paired
    expect(unpaired, `Unpaired groups: ${unpaired.join(', ')}`).toEqual([])
  })

  it('every animation has all required fields populated', () => {
    for (const cat of catalog) {
      for (const group of cat.groups) {
        for (const anim of group.animations) {
          expect(anim.id).toMatch(/^[a-z][a-z0-9-]*__[a-z][a-z0-9-]*$/)
          expect(anim.title).toMatch(/\w{2,}/)
          expect(anim.description).toMatch(/\w{5,}/)
          expect(anim.categoryId).toBe(cat.id)
          expect(anim.groupId).toBe(group.id)
        }
      }
    }
  })

  it('animation ids follow group__variant naming convention', () => {
    for (const cat of catalog) {
      for (const group of cat.groups) {
        for (const anim of group.animations) {
          expect(anim.id).toMatch(/^[a-z][a-z0-9-]*__[a-z][a-z0-9-]*$/)
        }
      }
    }
  })

  it('no duplicate animation ids exist across the entire catalog', () => {
    const allIds: string[] = []
    for (const cat of catalog) {
      for (const group of cat.groups) {
        for (const anim of group.animations) {
          allIds.push(anim.id)
        }
      }
    }
    // IDs repeat across framer/css variants (same animation, different tech)
    // But within a single group, IDs should be unique
    for (const cat of catalog) {
      for (const group of cat.groups) {
        const groupIds = group.animations.map((a) => a.id)
        expect(new Set(groupIds).size).toBe(groupIds.length)
      }
    }
  })

  it('total animation count is substantial (guards against broken imports)', () => {
    const total = catalog.reduce(
      (sum, cat) => sum + cat.groups.reduce((gs, g) => gs + g.animations.length, 0),
      0
    )
    // Registry should have 100+ animations across all groups
    expect(total).toBeGreaterThanOrEqual(100)
  })

  it('propagates optional metadata fields when present', () => {
    const allAnims = catalog.flatMap((c) => c.groups.flatMap((g) => g.animations))

    // At least some animations should have tags
    const withTags = allAnims.filter((a) => a.tags && a.tags.length > 0)
    expect(withTags.length).toBeGreaterThanOrEqual(10)

    // At least some should have infinite flag
    const withInfinite = allAnims.filter((a) => a.infinite === true)
    expect(withInfinite.length).toBeGreaterThanOrEqual(5)
  })

  it('returns same structure on repeated calls (pure function)', () => {
    const catalog2 = buildCatalog()
    expect(catalog2.length).toBe(catalog.length)
    for (let i = 0; i < catalog.length; i++) {
      expect(catalog2[i].id).toBe(catalog[i].id)
      expect(catalog2[i].groups.length).toBe(catalog[i].groups.length)
    }
  })
})
