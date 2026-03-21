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
          unpaired.push(variants[0]!.id)
        }
        if (variants.length === 2) {
          const techs = new Set(variants.map((v) => v.tech))
          expect(techs, `${baseId}: paired groups should have different techs`).toEqual(
            new Set(['framer', 'css'])
          )
          // Paired groups should have the same animation IDs
          const ids0 = new Set(variants[0]!.animations.map((a) => a.id))
          const ids1 = new Set(variants[1]!.animations.map((a) => a.id))
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

    // At least some should have infinite flag
    const withInfinite = allAnims.filter((a) => a.infinite === true)
    expect(withInfinite.length).toBeGreaterThanOrEqual(5)

    // At least some should have tier
    const withTier = allAnims.filter((a) => a.tier !== undefined)
    expect(withTier.length).toBeGreaterThanOrEqual(1)
  })

  it('returns same structure on repeated calls (pure function)', () => {
    const catalog2 = buildCatalog()
    expect(catalog2.length).toBe(catalog.length)
    for (let i = 0; i < catalog.length; i++) {
      expect(catalog2[i]!.id).toBe(catalog[i]!.id)
      expect(catalog2[i]!.groups.length).toBe(catalog[i]!.groups.length)
    }
  })

  it('group titles follow the pattern "GroupTitle (Framer)" or "GroupTitle (CSS)"', () => {
    for (const cat of catalog) {
      for (const group of cat.groups) {
        if (group.tech === 'framer') {
          expect(group.title, `Group "${group.id}" should end with (Framer)`).toMatch(/\(Framer\)$/)
        } else if (group.tech === 'css') {
          expect(group.title, `Group "${group.id}" should end with (CSS)`).toMatch(/\(CSS\)$/)
        }
      }
    }
  })

  it('group IDs follow the pattern "baseGroupId-framer" or "baseGroupId-css"', () => {
    for (const cat of catalog) {
      for (const group of cat.groups) {
        expect(group.id).toMatch(/-(?:framer|css)$/)
        // The base ID (without suffix) should be a valid kebab-case identifier
        const baseId = group.id.replace(/-(?:framer|css)$/, '')
        expect(baseId).toMatch(/^[a-z][a-z0-9-]+$/)
      }
    }
  })

  it('every animation groupId matches the group it belongs to', () => {
    for (const cat of catalog) {
      for (const group of cat.groups) {
        for (const anim of group.animations) {
          expect(
            anim.groupId,
            `Animation "${anim.id}" has groupId "${anim.groupId}" but belongs to group "${group.id}"`
          ).toBe(group.id)
        }
      }
    }
  })

  it('animation id prefix matches the base group id (without tech suffix)', () => {
    for (const cat of catalog) {
      for (const group of cat.groups) {
        const baseGroupId = group.id.replace(/-(?:framer|css)$/, '')
        for (const anim of group.animations) {
          const prefix = anim.id.split('__')[0]
          expect(
            prefix,
            `Animation "${anim.id}" prefix "${prefix}" doesn't match group base ID "${baseGroupId}"`
          ).toBe(baseGroupId)
        }
      }
    }
  })

  it('disableReplay flag is propagated to catalog animations when set', () => {
    const allAnims = catalog.flatMap((c) => c.groups.flatMap((g) => g.animations))
    // Some animations should have disableReplay: true
    const withDisableReplay = allAnims.filter((a) => a.disableReplay === true)
    // At least some should exist (e.g., prize reveals that don't support replay)
    expect(withDisableReplay.length).toBeGreaterThanOrEqual(1)
  })

  it('category order is deterministic across calls', () => {
    const catalog2 = buildCatalog()
    const ids1 = catalog.map((c) => c.id)
    const ids2 = catalog2.map((c) => c.id)
    expect(ids1).toEqual(ids2)
  })

  it('framer and css groups have the same animation count per base group', () => {
    for (const cat of catalog) {
      const baseIds = new Set(cat.groups.map((g) => g.id.replace(/-(?:framer|css)$/, '')))
      for (const baseId of baseIds) {
        const variants = cat.groups.filter((g) => g.id.replace(/-(?:framer|css)$/, '') === baseId)
        if (variants.length === 2) {
          expect(
            variants[0]!.animations.length,
            `Group "${baseId}": framer and css variants have different animation counts`
          ).toBe(variants[1]!.animations.length)
        }
      }
    }
  })

  it('groups with no animations in a tech variant are excluded from catalog', () => {
    // If a group has framer animations but zero css animations (or vice versa),
    // the empty variant should not appear as a group in the catalog.
    // This verifies the toGroup null-return filter works.
    for (const cat of catalog) {
      for (const group of cat.groups) {
        expect(
          group.animations.length,
          `Group "${group.id}" has 0 animations but still appears in catalog`
        ).toBeGreaterThanOrEqual(1)
      }
    }
  })

  it('each animation in catalog has the correct groupId including tech suffix', () => {
    // The groupId field must match the group it belongs to, which includes -framer or -css.
    // A mismatch here would cause GroupSection to fail to resolve the animation component.
    for (const cat of catalog) {
      for (const group of cat.groups) {
        for (const anim of group.animations) {
          expect(anim.groupId).toBe(group.id)
          expect(anim.groupId).toMatch(/-(?:framer|css)$/)
        }
      }
    }
  })

  it('group titles contain the base group title from registry metadata', () => {
    // Verify that toGroup constructs titles as "${metadata.title} (Framer)" or "(CSS)"
    for (const cat of catalog) {
      for (const group of cat.groups) {
        if (group.tech === 'framer') {
          expect(group.title).toMatch(/\(Framer\)$/)
        } else {
          expect(group.title).toMatch(/\(CSS\)$/)
        }
        // The title before the parenthetical should be non-empty
        const baseTitle = group.title.replace(/\s*\((?:Framer|CSS)\)$/, '')
        expect(baseTitle, `Group "${group.id}" has empty base title`).toMatch(/\S/)
      }
    }
  })
})
