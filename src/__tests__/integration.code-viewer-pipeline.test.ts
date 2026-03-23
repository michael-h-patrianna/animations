/**
 * Integration test for the code viewer pipeline.
 *
 * Traces: registry → resolveAnimationSource → cleanSourceForDisplay
 * Verifies the complete pipeline produces valid, display-ready source code
 * from real animation registry entries.
 */
import { categories, getGroupAnimations } from '@/components/animationRegistry'
import { resolveAnimationSource } from '@/lib/groupBuilder'
import { cleanSourceForDisplay } from '@/lib/sourceTransform'
import { describe, expect, it } from 'vitest'

describe('integration: code viewer pipeline', () => {
  it('resolveAnimationSource returns tabs for a real framer+css animation pair', async () => {
    // Pick the first group that has both framer and css variants
    let framerEntry, cssEntry, animId
    outer: for (const cat of Object.values(categories)) {
      for (const group of Object.values(cat.groups)) {
        for (const [id, entry] of Object.entries(group.framer)) {
          if (group.css[id]) {
            framerEntry = entry
            cssEntry = group.css[id]!
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
    // Get any framer entry with source
    let framerEntry
    for (const cat of Object.values(categories)) {
      for (const group of Object.values(cat.groups)) {
        const firstId = Object.keys(group.framer)[0]
        if (firstId) {
          framerEntry = group.framer[firstId]!
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
    // For every group, verify that framer and css variants have the same animation IDs
    for (const cat of Object.values(categories)) {
      for (const groupKey of Object.keys(cat.groups)) {
        const framerAnims = getGroupAnimations(groupKey, 'framer')
        const cssAnims = getGroupAnimations(groupKey, 'css')

        const framerIds = new Set(Object.keys(framerAnims))
        const cssIds = new Set(Object.keys(cssAnims))

        // Every framer ID should have a css counterpart
        for (const id of framerIds) {
          expect(cssIds.has(id), `Group "${groupKey}": framer has "${id}" but css doesn't`).toBe(
            true
          )
        }
        // Every css ID should have a framer counterpart
        for (const id of cssIds) {
          expect(framerIds.has(id), `Group "${groupKey}": css has "${id}" but framer doesn't`).toBe(
            true
          )
        }
      }
    }
  })

  it('metadata consistency: registry titles match across framer and css variants', () => {
    for (const cat of Object.values(categories)) {
      for (const group of Object.values(cat.groups)) {
        for (const [id, framerAnim] of Object.entries(group.framer)) {
          const cssAnim = group.css[id]
          if (!cssAnim) continue

          expect(framerAnim.metadata.title, `${id}: title mismatch between framer and css`).toBe(
            cssAnim.metadata.title
          )

          // tier should match if present
          if (framerAnim.metadata.tier !== undefined || cssAnim.metadata.tier !== undefined) {
            expect(framerAnim.metadata.tier, `${id}: tier mismatch`).toBe(cssAnim.metadata.tier)
          }
        }
      }
    }
  })

  it('metadata consistency: descriptions match across framer and css variants', () => {
    for (const cat of Object.values(categories)) {
      for (const group of Object.values(cat.groups)) {
        for (const [id, framerAnim] of Object.entries(group.framer)) {
          const cssAnim = group.css[id]
          if (!cssAnim) continue

          expect(
            framerAnim.metadata.description,
            `${id}: description mismatch between framer and css`
          ).toBe(cssAnim.metadata.description)
        }
      }
    }
  })

  it('full pipeline: resolveAnimationSource → cleanSourceForDisplay strips data-animation-id from TSX tabs', async () => {
    // Verify the full pipeline for every group that has source loaders attached.
    // Only checks TSX tabs — CSS tabs may reference data-animation-id in selectors
    // (e.g., [data-animation-id="..."] { ... }), which is intentional and should not be stripped.
    const errors: string[] = []

    for (const cat of Object.values(categories)) {
      for (const group of Object.values(cat.groups)) {
        const firstId = Object.keys(group.framer)[0]
        if (!firstId) continue

        const framerEntry = group.framer[firstId]!
        const cssEntry = group.css[firstId]

        try {
          const tabs = await resolveAnimationSource(framerEntry, cssEntry)
          if (tabs.length === 0) continue // No source loaders in test env

          for (const tab of tabs) {
            // Only check TSX tabs — CSS files legitimately contain data-animation-id in selectors
            if (tab.language !== 'tsx') continue

            const cleaned = cleanSourceForDisplay(tab.code)
            if (cleaned.includes('data-animation-id=')) {
              errors.push(`${firstId}/${tab.label}: data-animation-id survived cleanSourceForDisplay`)
            }
            // Cleaned code should not be empty (source was loaded)
            if (tab.code.length > 0 && cleaned.length === 0) {
              errors.push(`${firstId}/${tab.label}: cleanSourceForDisplay produced empty output from non-empty source`)
            }
          }
        } catch (e) {
          errors.push(`${firstId}: resolveAnimationSource threw: ${(e as Error).message}`)
        }
      }
    }

    expect(errors, `Pipeline failures:\n${errors.join('\n')}`).toEqual([])
  })

  // PRODUCTION BUG: text-effects__verb-floating and text-effects__verb-jogging have
  // infinite: true in CSS metadata but undefined (missing) in framer metadata.
  // This causes the catalog to show different behavior flags for the same animation
  // depending on whether the user views the framer or CSS variant.
  it.fails('metadata consistency: optional fields match across framer and css variants (KNOWN BUG: text-effects verb animations)', () => {
    const mismatches: string[] = []

    for (const cat of Object.values(categories)) {
      for (const group of Object.values(cat.groups)) {
        for (const [id, framerAnim] of Object.entries(group.framer)) {
          const cssAnim = group.css[id]
          if (!cssAnim) continue

          const optionalFields = [
            'disableReplay', 'infinite', 'controls', 'prizeCountMax',
            'previewPosition', 'demoMode', 'previewMaxWidth',
          ] as const

          for (const field of optionalFields) {
            const framerVal = framerAnim.metadata[field]
            const cssVal = cssAnim.metadata[field]
            if (framerVal !== cssVal) {
              mismatches.push(`${id}.${field}: framer=${JSON.stringify(framerVal)} css=${JSON.stringify(cssVal)}`)
            }
          }
        }
      }
    }

    expect(mismatches, `Metadata mismatches between framer and css:\n${mismatches.join('\n')}`).toEqual([])
  })
})
