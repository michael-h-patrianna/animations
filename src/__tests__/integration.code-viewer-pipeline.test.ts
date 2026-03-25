/**
 * Integration test for the code viewer pipeline.
 *
 * Traces: registry → resolveAnimationSource → cleanSourceForDisplay
 * Verifies the complete pipeline produces valid, display-ready source code
 * from real animation registry entries.
 */
import { getGroupAnimations } from '@/components/animationRegistry'
import { loadLazyCatalog, resetLazyTestState } from '@/__tests__/helpers/lazyCatalog'
import { resolveAnimationSource } from '@/lib/groupBuilder'
import { cleanSourceForDisplay } from '@/lib/sourceTransform'
import type { Category } from '@/types/animation'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('integration: code viewer pipeline', () => {
  let catalog: Category[] = []

  beforeAll(async () => {
    resetLazyTestState()
    catalog = await loadLazyCatalog()
  })

  afterAll(() => {
    resetLazyTestState()
  })

  it('resolveAnimationSource returns tabs for a real framer+css animation pair', async () => {
    let framerEntry
    let cssEntry
    let animId

    outer: for (const category of catalog) {
      for (const group of category.groups.filter((item) => item.tech === 'framer')) {
        const baseGroupId = group.id.replace(/-(?:framer|css)$/, '')
        const framerAnimations = getGroupAnimations(baseGroupId, 'framer')
        const cssAnimations = getGroupAnimations(baseGroupId, 'css')

        for (const [id, entry] of Object.entries(framerAnimations)) {
          if (cssAnimations[id]) {
            framerEntry = entry
            cssEntry = cssAnimations[id]
            animId = id
            break outer
          }
        }
      }
    }

    if (!framerEntry || !cssEntry || !animId) {
      throw new Error('No dual-variant animation found in registry')
    }

    const tabs = await resolveAnimationSource(framerEntry, cssEntry)

    // Should have at least 2 tabs: framer Component + css Component
    expect(tabs.length).toBeGreaterThanOrEqual(2)

    // First tab should be framer Component
    expect(tabs[0]!.label).toBe('Component')
    expect(tabs[0]!.language).toBe('tsx')
    expect(tabs[0]!.code.length).toBeGreaterThan(10) // Non-trivial source

    // At least one tab should be CSS variant component
    const cssTsxTab = tabs.find((t, i) => i > 0 && t.label === 'Component')
    expect(cssTsxTab).toEqual(expect.objectContaining({ label: 'Component', language: 'tsx' }))
  })

  it('cleanSourceForDisplay strips data-animation-id from real source code', async () => {
    let framerEntry

    for (const category of catalog) {
      for (const group of category.groups.filter((item) => item.tech === 'framer')) {
        const baseGroupId = group.id.replace(/-(?:framer|css)$/, '')
        const framerAnimations = getGroupAnimations(baseGroupId, 'framer')
        const firstId = Object.keys(framerAnimations)[0]
        if (firstId) {
          framerEntry = framerAnimations[firstId]
          break
        }
      }
      if (framerEntry) break
    }

    if (!framerEntry) throw new Error('No framer entry found')

    const tabs = await resolveAnimationSource(framerEntry, undefined)
    if (tabs.length === 0) return // No source loaders in test env — skip gracefully

    const rawCode = tabs[0]!.code
    const cleanedCode = cleanSourceForDisplay(rawCode)

    // If the raw code contained data-animation-id, it should be stripped
    if (rawCode.includes('data-animation-id=')) {
      expect(cleanedCode).not.toContain('data-animation-id=')
    }

    // Cleaned code should retain the component structure (import + export/function)
    expect(cleanedCode).toMatch(/import\b/)
  })

  it('getGroupAnimations returns entries whose IDs are consistent across framer and css', () => {
    for (const group of catalog.flatMap((category) =>
      category.groups.filter((item) => item.tech === 'framer')
    )) {
      const baseGroupId = group.id.replace(/-(?:framer|css)$/, '')
      const framerAnims = getGroupAnimations(baseGroupId, 'framer')
      const cssAnims = getGroupAnimations(baseGroupId, 'css')

      const framerIds = new Set(Object.keys(framerAnims))
      const cssIds = new Set(Object.keys(cssAnims))

      for (const id of framerIds) {
        expect(cssIds.has(id), `Group "${baseGroupId}": framer has "${id}" but css doesn't`).toBe(
          true
        )
      }
      for (const id of cssIds) {
        expect(
          framerIds.has(id),
          `Group "${baseGroupId}": css has "${id}" but framer doesn't`
        ).toBe(true)
      }
    }
  })

  it('metadata consistency: registry titles match across framer and css variants', () => {
    for (const group of catalog.flatMap((category) =>
      category.groups.filter((item) => item.tech === 'framer')
    )) {
      const baseGroupId = group.id.replace(/-(?:framer|css)$/, '')
      const framerAnimations = getGroupAnimations(baseGroupId, 'framer')
      const cssAnimations = getGroupAnimations(baseGroupId, 'css')
      for (const [id, framerAnim] of Object.entries(framerAnimations)) {
        const cssAnim = cssAnimations[id]
        if (!cssAnim) continue

        expect(framerAnim.metadata.title, `${id}: title mismatch between framer and css`).toBe(
          cssAnim.metadata.title
        )

        if (framerAnim.metadata.tier !== undefined || cssAnim.metadata.tier !== undefined) {
          expect(framerAnim.metadata.tier, `${id}: tier mismatch`).toBe(cssAnim.metadata.tier)
        }
      }
    }
  })

  it('metadata consistency: descriptions match across framer and css variants', () => {
    for (const group of catalog.flatMap((category) =>
      category.groups.filter((item) => item.tech === 'framer')
    )) {
      const baseGroupId = group.id.replace(/-(?:framer|css)$/, '')
      const framerAnimations = getGroupAnimations(baseGroupId, 'framer')
      const cssAnimations = getGroupAnimations(baseGroupId, 'css')
      for (const [id, framerAnim] of Object.entries(framerAnimations)) {
        const cssAnim = cssAnimations[id]
        if (!cssAnim) continue

        expect(
          framerAnim.metadata.description,
          `${id}: description mismatch between framer and css`
        ).toBe(cssAnim.metadata.description)
      }
    }
  })

  it('full pipeline: resolveAnimationSource → cleanSourceForDisplay strips data-animation-id from TSX tabs', async () => {
    // Verify the full pipeline for every group that has source loaders attached.
    // Only checks TSX tabs — CSS tabs may reference data-animation-id in selectors
    // (e.g., [data-animation-id="..."] { ... }), which is intentional and should not be stripped.
    const errors: string[] = []

    for (const group of catalog.flatMap((category) =>
      category.groups.filter((item) => item.tech === 'framer')
    )) {
      const baseGroupId = group.id.replace(/-(?:framer|css)$/, '')
      const framerAnimations = getGroupAnimations(baseGroupId, 'framer')
      const cssAnimations = getGroupAnimations(baseGroupId, 'css')
      const firstId = Object.keys(framerAnimations)[0]
      if (!firstId) continue

      const framerEntry = framerAnimations[firstId]!
      const cssEntry = cssAnimations[firstId]

      try {
        const tabs = await resolveAnimationSource(framerEntry, cssEntry)
        if (tabs.length === 0) continue

        for (const tab of tabs) {
          if (tab.language !== 'tsx') continue

          const cleaned = cleanSourceForDisplay(tab.code)
          if (cleaned.includes('data-animation-id=')) {
            errors.push(`${firstId}/${tab.label}: data-animation-id survived cleanSourceForDisplay`)
          }
          if (tab.code.length > 0 && cleaned.length === 0) {
            errors.push(
              `${firstId}/${tab.label}: cleanSourceForDisplay produced empty output from non-empty source`
            )
          }
        }
      } catch (e) {
        errors.push(`${firstId}: resolveAnimationSource threw: ${(e as Error).message}`)
      }
    }

    expect(errors, `Pipeline failures:\n${errors.join('\n')}`).toEqual([])
  })
})
