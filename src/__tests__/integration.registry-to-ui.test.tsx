import { buildRegistryFromCategories, categories } from '@/components/animationRegistry'
import { GroupSection } from '@/components/ui/GroupSection'
import { buildCatalog } from '@/services/animationData'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

/**
 * Integration test: verifies data flows correctly from the raw registry
 * through buildCatalog() into the GroupSection UI component.
 *
 * This catches mismatches between the metadata system and the UI layer
 * that unit tests of either layer alone would miss.
 */
describe('integration: registry → buildCatalog → GroupSection', () => {
  const catalog = buildCatalog()

  it('buildCatalog produces groups whose IDs trace back to registry groups', () => {
    for (const cat of catalog) {
      for (const group of cat.groups) {
        // Strip -framer/-css suffix to get the registry group key
        const registryGroupKey = group.id.replace(/-(?:framer|css)$/, '')
        const registryCat = Object.values(categories).find((c) =>
          Object.keys(c.groups).includes(registryGroupKey)
        )
        expect(
          registryCat?.metadata.id,
          `Group "${group.id}" has no matching registry category`
        ).toMatch(/\w+/)

        const registryGroup = registryCat!.groups[registryGroupKey]
        expect(registryGroup?.metadata.id, `Registry group "${registryGroupKey}" not found`).toBe(
          registryGroupKey
        )

        // Verify metadata propagated correctly
        expect(group.title).toContain(registryGroup.metadata.title)
      }
    }
  })

  it('GroupSection renders animations from a real catalog group with correct titles', () => {
    // Pick the first framer group that has animations
    const realGroup = catalog
      .flatMap((c) => c.groups)
      .find((g) => g.tech === 'framer' && g.animations.length > 0)

    // Fail fast if no framer group with animations exists
    if (!realGroup) throw new Error('No framer group with animations found in catalog')

    render(<GroupSection group={realGroup} elementId={`group-${realGroup.id}`} />)

    // Group title with count should be rendered
    expect(screen.getByText(`${realGroup.title} (${realGroup.animations.length})`)).toHaveClass(
      'pf-group__title'
    )

    // Each animation title should appear
    for (const anim of realGroup.animations) {
      expect(screen.getByText(anim.title)).toBeVisible()
    }
  })

  it('every catalog animation ID exists in the flat registry', () => {
    const registry = buildRegistryFromCategories()

    for (const cat of catalog) {
      for (const group of cat.groups) {
        for (const anim of group.animations) {
          expect(
            Object.keys(registry).includes(anim.id),
            `Animation "${anim.id}" in catalog but not in flat registry`
          ).toBe(true)
        }
      }
    }
  })

  it('catalog categoryIds match the category they belong to', () => {
    for (const cat of catalog) {
      for (const group of cat.groups) {
        for (const anim of group.animations) {
          expect(anim.categoryId).toBe(cat.id)
          expect(anim.groupId).toBe(group.id)
        }
      }
    }
  })

  it('catalog group tech field matches the group suffix', () => {
    for (const cat of catalog) {
      for (const group of cat.groups) {
        if (group.id.endsWith('-framer')) {
          expect(group.tech).toBe('framer')
        } else if (group.id.endsWith('-css')) {
          expect(group.tech).toBe('css')
        }
      }
    }
  })
})
