/**
 * Multi-step data flow integration test.
 *
 * Traces data from: animationRegistry → buildCatalog → GroupSection rendering
 * with filter → AnimationCard render props. Verifies that the full pipeline
 * produces correct output at each step, catching mismatches between layers
 * that unit tests of individual modules would miss.
 */
import { categories, findAnimationById, getGroupAnimations } from '@/components/animationRegistry'
import { GroupSection } from '@/components/ui/GroupSection'
import { buildCatalog } from '@/services/animationData'
import type { Category } from '@/types/animation'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

const catalog: Category[] = buildCatalog()

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe('integration: full data flow pipeline', () => {
  it('animation IDs in catalog match findAnimationById lookups', () => {
    const allAnimIds = catalog.flatMap((c) =>
      c.groups.flatMap((g) => g.animations.map((a) => a.id))
    )
    // Deduplicate (framer + css groups share IDs)
    const uniqueIds = [...new Set(allAnimIds)]

    for (const id of uniqueIds) {
      const found = findAnimationById(id)
      // Every catalog ID must resolve to a group with at least one tech variant
      expect(found, `findAnimationById("${id}") returned null`).toEqual(
        expect.objectContaining({ baseGroupId: expect.stringMatching(/.+/) })
      )
    }
  })

  it('getGroupAnimations returns entries matching catalog group animations', () => {
    for (const cat of catalog) {
      for (const group of cat.groups) {
        const baseGroupId = group.id.replace(/-(?:framer|css)$/, '')
        const registry = getGroupAnimations(baseGroupId, group.tech as 'framer' | 'css')
        const registryIds = new Set(Object.keys(registry))

        for (const anim of group.animations) {
          expect(
            registryIds.has(anim.id),
            `Catalog animation "${anim.id}" in group "${group.id}" is missing from getGroupAnimations("${baseGroupId}", "${group.tech}")`
          ).toBe(true)
        }
      }
    }
  })

  it('GroupSection renders the correct animation count from a real catalog group', () => {
    // Pick a framer group with multiple animations
    const group = catalog
      .flatMap((c) => c.groups)
      .find((g) => g.tech === 'framer' && g.animations.length >= 3)

    if (!group) throw new Error('No framer group with 3+ animations found')

    renderWithRouter(<GroupSection group={group} elementId={`group-${group.id}`} />)

    const cardTitles = screen.getAllByTestId('card-title')
    expect(cardTitles.length).toBe(group.animations.length)
  })

  it('animationFilter in GroupSection correctly isolates a single animation', () => {
    const group = catalog
      .flatMap((c) => c.groups)
      .find((g) => g.tech === 'framer' && g.animations.length >= 2)

    if (!group) throw new Error('No framer group with 2+ animations found')

    const targetAnim = group.animations[0]!

    renderWithRouter(
      <GroupSection group={group} elementId={`group-${group.id}`} animationFilter={targetAnim.id} />
    )

    // Only the filtered animation should be shown — single card-title element
    const titles = screen.getAllByTestId('card-title')
    expect(titles).toHaveLength(1)
    expect(titles[0]).toHaveTextContent(targetAnim.title)

    // Filter banner should show the animation ID
    expect(screen.getByTestId('filter-banner')).toHaveTextContent(targetAnim.id)
  })

  it('invalid animationFilter shows error banner with "not found" message', () => {
    const group = catalog.flatMap((c) => c.groups).find((g) => g.tech === 'framer')!

    renderWithRouter(
      <GroupSection
        group={group}
        elementId={`group-${group.id}`}
        animationFilter="nonexistent__animation"
      />
    )

    expect(screen.getByTestId('filter-banner')).toHaveTextContent(/not found/)
    // The "Show all animations" button should be present
    expect(screen.getByTestId('remove-filter-btn')).toBeVisible()
  })

  it('CSS and Framer groups for the same base ID produce the same animation titles', () => {
    for (const cat of catalog) {
      const baseIds = new Set(cat.groups.map((g) => g.id.replace(/-(?:framer|css)$/, '')))
      for (const baseId of baseIds) {
        const framerGroup = cat.groups.find((g) => g.id === `${baseId}-framer`)
        const cssGroup = cat.groups.find((g) => g.id === `${baseId}-css`)
        if (!framerGroup || !cssGroup) continue

        const framerTitles = framerGroup.animations.map((a) => a.title).sort()
        const cssTitles = cssGroup.animations.map((a) => a.title).sort()
        expect(
          framerTitles,
          `Title mismatch for group "${baseId}": framer=[${framerTitles}] css=[${cssTitles}]`
        ).toEqual(cssTitles)
      }
    }
  })

  it('all catalog groups have URL slugs containing their animation IDs', () => {
    for (const cat of catalog) {
      for (const group of cat.groups) {
        for (const anim of group.animations) {
          // urlSlugFramer should contain the encoded animation ID
          expect(anim.urlSlugFramer, `${anim.id} urlSlugFramer missing`).toContain(
            encodeURIComponent(anim.id)
          )
          expect(anim.urlSlugCss, `${anim.id} urlSlugCss missing`).toContain(
            encodeURIComponent(anim.id)
          )
        }
      }
    }
  })

  it('registry components loaded via getGroupAnimations are React.lazy', () => {
    // Pick first base group from each category
    for (const cat of Object.values(categories)) {
      const firstGroupKey = Object.keys(cat.groups)[0]!
      const framerAnims = getGroupAnimations(firstGroupKey, 'framer')
      for (const [id, entry] of Object.entries(framerAnims)) {
        expect(entry.component, `${id} component is not React.lazy`).toHaveProperty(
          '$$typeof',
          Symbol.for('react.lazy')
        )
      }
    }
  })

  it('findAnimationById returns baseGroupIds that map to real groups in the catalog', () => {
    // This traces a critical data flow: findAnimationById returns baseGroupId,
    // and useGroupInitialization appends '-framer' or '-css' to find the actual group.
    // If baseGroupId + '-framer' doesn't match any catalog group, navigation breaks.
    const allAnimIds = [
      ...new Set(catalog.flatMap((c) => c.groups.flatMap((g) => g.animations.map((a) => a.id)))),
    ]
    const catalogGroupIds = new Set(catalog.flatMap((c) => c.groups.map((g) => g.id)))

    for (const animId of allAnimIds) {
      const found = findAnimationById(animId)
      if (!found) {
        throw new Error(
          `findAnimationById("${animId}") returned null — catalog has it but registry doesn't`
        )
      }

      // The baseGroupId + tech suffix must exist in the catalog
      if (found.hasFramer) {
        expect(
          catalogGroupIds.has(`${found.baseGroupId}-framer`),
          `${animId}: baseGroupId "${found.baseGroupId}" + "-framer" not in catalog groups`
        ).toBe(true)
      }
      if (found.hasCss) {
        expect(
          catalogGroupIds.has(`${found.baseGroupId}-css`),
          `${animId}: baseGroupId "${found.baseGroupId}" + "-css" not in catalog groups`
        ).toBe(true)
      }
    }
  })

  it('every catalog animation can be found by getGroupAnimations using its group context', () => {
    // Traces: catalog animation → extract baseGroupId and tech → getGroupAnimations → find entry
    // This verifies the complete round-trip through the registry lookup path that
    // GroupSection uses at runtime to resolve animation components.
    for (const cat of catalog) {
      for (const group of cat.groups) {
        const baseGroupId = group.id.replace(/-(?:framer|css)$/, '')
        const tech = group.tech as 'framer' | 'css'
        const registryAnims = getGroupAnimations(baseGroupId, tech)
        const registryIds = new Set(Object.keys(registryAnims))

        for (const anim of group.animations) {
          expect(
            registryIds.has(anim.id),
            `Animation "${anim.id}" in catalog group "${group.id}" not found via ` +
              `getGroupAnimations("${baseGroupId}", "${tech}")`
          ).toBe(true)

          // Verify the registry entry has a component
          const entry = registryAnims[anim.id]!
          expect(entry.component).toHaveProperty('$$typeof', Symbol.for('react.lazy'))

          // Verify metadata consistency between catalog and registry
          expect(entry.metadata.title).toBe(anim.title)
          expect(entry.metadata.description).toBe(anim.description)
        }
      }
    }
  })
})
