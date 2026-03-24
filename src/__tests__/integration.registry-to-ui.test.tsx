import { buildRegistryFromCategories } from '@/components/animationRegistry'
import { loadLazyCatalog, preloadRegistry, resetLazyTestState } from '@/__tests__/helpers/lazyCatalog'
import { GroupSection } from '@/components/ui/GroupSection'
import type { Category } from '@/types/animation'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

/**
 * Integration test: verifies data flows correctly from the raw registry
 * through buildCatalog() into the GroupSection UI component.
 *
 * This catches mismatches between the metadata system and the UI layer
 * that unit tests of either layer alone would miss.
 */
describe('integration: registry → buildCatalog → GroupSection', () => {
  let catalog: Category[] = []

  beforeAll(async () => {
    resetLazyTestState()
    catalog = await loadLazyCatalog()
    await preloadRegistry()
  })

  afterAll(() => {
    resetLazyTestState()
  })

  it('loaded catalog produces groups whose IDs trace back to lazy group variants', () => {
    for (const cat of catalog) {
      for (const group of cat.groups) {
        expect(group.id).toMatch(/-(?:framer|css)$/)
        expect(group.title).toMatch(/\((?:Framer|CSS)\)$/)
      }
    }
  })

  it(
    'GroupSection renders animations from a real catalog group with correct titles',
    { timeout: 15_000 },
    () => {
      // Pick the first framer group that has animations
      const realGroup = catalog
        .flatMap((c) => c.groups)
        .find((g) => g.tech === 'framer' && g.animations.length > 0)

      // Fail fast if no framer group with animations exists
      if (!realGroup) throw new Error('No framer group with animations found in catalog')

      renderWithRouter(<GroupSection group={realGroup} elementId={`group-${realGroup.id}`} />)

      // Each animation title should appear in a card-title element
      const titleElements = screen.getAllByTestId('card-title')
      const renderedTitles = titleElements.map((el) => el.textContent)
      for (const anim of realGroup.animations) {
        expect(renderedTitles).toContain(anim.title)
      }
    }
  )

  it('every loaded catalog animation ID exists in the flat registry', () => {
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

  it('flat registry key set is a superset of all loaded catalog animation IDs', () => {
    const registry = buildRegistryFromCategories()
    const registryIds = new Set(Object.keys(registry))

    const catalogIds = new Set(
      catalog.flatMap((c) => c.groups.flatMap((g) => g.animations.map((a) => a.id)))
    )

    // Every catalog animation must be in the registry
    for (const id of catalogIds) {
      expect(registryIds.has(id), `Catalog animation "${id}" missing from flat registry`).toBe(true)
    }
  })

  it('framer and css groups for the same base group share identical animation IDs', () => {
    for (const cat of catalog) {
      const baseIds = new Set(cat.groups.map((g) => g.id.replace(/-(?:framer|css)$/, '')))
      for (const baseId of baseIds) {
        const framerGroup = cat.groups.find((g) => g.id === `${baseId}-framer`)
        const cssGroup = cat.groups.find((g) => g.id === `${baseId}-css`)

        if (framerGroup && cssGroup) {
          const framerAnimIds = new Set(framerGroup.animations.map((a) => a.id))
          const cssAnimIds = new Set(cssGroup.animations.map((a) => a.id))
          expect(framerAnimIds, `Mismatched animation IDs for group "${baseId}"`).toEqual(
            cssAnimIds
          )
        }
      }
    }
  })

  it('GroupSection renders correct count for groups with controls metadata', () => {
    // Find a group with controls animations
    const groupWithControls = catalog
      .flatMap((c) => c.groups)
      .find((g) => g.animations.some((a) => a.controls))

    if (groupWithControls) {
      renderWithRouter(
        <GroupSection group={groupWithControls} elementId={`group-${groupWithControls.id}`} />
      )

      // The group should render without error
      expect(screen.getByTestId(`group-section-group-${groupWithControls.id}`)).toBeVisible()
    }
  })
})
