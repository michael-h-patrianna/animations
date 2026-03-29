/**
 * Integration test: verifies the full lazy pipeline from category
 * registration through group loading to animation object construction.
 *
 * Unlike smoke tests (which verify rendering) and hook tests (which mock
 * the registry), this test exercises the real metadata transformation
 * pipeline and asserts on the shape of the output objects.
 */

import { resetLazyTestState } from '@/__tests__/helpers/lazyCatalog'
import { loadLazyGroup, getLazyNavCatalog } from '@/lib/lazyGroupRegistry'
import '@/components/lazyBootstrap'
import { afterEach, describe, expect, it } from 'vitest'

describe('Lazy pipeline integration', () => {
  afterEach(() => {
    resetLazyTestState()
  })

  it('transforms metadata into Animation objects with branded IDs and computed URL slugs', async () => {
    const result = await loadLazyGroup('standard-effects-framer')

    expect(result.group.id).toBe('standard-effects-framer')
    expect(result.group.title).toContain('Framer')

    const animations = result.group.animations
    expect(animations.length).toBeGreaterThanOrEqual(1)

    const first = animations[0]!
    // Branded AnimationId: group__variant pattern
    expect(first.id).toMatch(/^standard-effects__/)
    // Computed URL slugs from group + animation ID
    expect(first.urlSlugFramer).toMatch(/^\/standard-effects-framer\?animation=/)
    expect(first.urlSlugCss).toMatch(/^\/standard-effects-css\?animation=/)
    // Category ID propagated
    expect(first.categoryId).toBe('base')
    // GroupVariantId propagated
    expect(first.groupId).toBe('standard-effects-framer')
  }, 30_000)

  it('loads CSS variant of the same group with matching animation IDs', async () => {
    const framerResult = await loadLazyGroup('standard-effects-framer')
    const cssResult = await loadLazyGroup('standard-effects-css')

    const framerIds = new Set(framerResult.group.animations.map((a) => a.id))
    const cssIds = new Set(cssResult.group.animations.map((a) => a.id))

    // Every framer animation has a CSS counterpart
    for (const id of framerIds) {
      expect(cssIds.has(id)).toBe(true)
    }
    // Every CSS animation has a framer counterpart
    for (const id of cssIds) {
      expect(framerIds.has(id)).toBe(true)
    }
  }, 30_000)

  it('preserves optional metadata fields through the pipeline', async () => {
    // Lights group has controls: 'lights' metadata
    const result = await loadLazyGroup('lights-framer')
    const withControls = result.group.animations.filter((a) => a.controls === 'lights')
    expect(withControls.length).toBeGreaterThanOrEqual(1)

    // Collection effects have demoMode and tier
    const collectionResult = await loadLazyGroup('collection-effects-framer')
    const withDemoMode = collectionResult.group.animations.filter((a) => a.demoMode !== undefined)
    expect(withDemoMode.length).toBeGreaterThanOrEqual(1)

    const withTier = collectionResult.group.animations.filter((a) => a.tier !== undefined)
    expect(withTier.length).toBeGreaterThanOrEqual(1)
  }, 30_000)

  it('populates animations record keyed by animation ID', async () => {
    const result = await loadLazyGroup('standard-effects-framer')

    // The animations record maps id → AnimationExport with matching metadata
    for (const anim of result.group.animations) {
      const entry = result.animations[anim.id]
      expect(entry?.metadata.id).toBe(anim.id)
      expect(entry?.metadata.title).toBe(anim.title)
      expect(entry?.metadata.description).toMatch(/\w+/)
    }
  }, 30_000)

  it('nav catalog contains all registered categories and groups', () => {
    const catalog = getLazyNavCatalog()

    expect(catalog.categories.length).toBeGreaterThanOrEqual(3)

    // Every category has both framer and css group variants
    for (const category of catalog.categories) {
      const framerGroups = category.groups.filter((g) => g.tech === 'framer')
      const cssGroups = category.groups.filter((g) => g.tech === 'css')
      expect(framerGroups.length).toBe(cssGroups.length)
    }

    // groupMap is consistent with categories — every group has a matching entry
    const allGroupIds = catalog.categories.flatMap((c) => c.groups.map((g) => g.id))
    for (const id of allGroupIds) {
      expect(catalog.groupMap[id]?.id).toBe(id)
    }
  })

  it('respects metadata order field for animation sorting', async () => {
    // Load a group that may have ordered animations
    const result = await loadLazyGroup('modal-base-framer')
    const animations = result.group.animations

    // Guard: need at least 2 animations to validate ordering
    expect(animations.length).toBeGreaterThanOrEqual(2)

    // Verify animations are sorted by order (implicit 0 for unset)
    for (let i = 1; i < animations.length; i++) {
      const prevOrder = result.animations[animations[i - 1]!.id]?.metadata.order ?? 0
      const currOrder = result.animations[animations[i]!.id]?.metadata.order ?? 0
      expect(currOrder).toBeGreaterThanOrEqual(prevOrder)
    }
  }, 30_000)
})
