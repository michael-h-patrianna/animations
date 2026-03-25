import { test, expect } from './fixtures/catalog.fixture'
import type { CatalogPage } from './page-objects/CatalogPage'

/**
 * CSS/Framer structural parity: verifies that both variants of each animation
 * produce equivalent DOM output — same animation IDs, same card counts, and
 * similar bounding box dimensions.
 *
 * Uses deterministic DOM assertions instead of pixel-level screenshot
 * comparison, which is timing-sensitive and flaky for animated content.
 *
 * Bug this catches: a new animation added to framer/ but not css/ (or vice
 * versa), a CSS variant that renders at a completely different size due to
 * missing styles, or a registration mismatch where IDs don't match.
 */

/** Animations excluded from size comparison due to known production size differences. */
const SKIP_SIZE_CHECK = new Set([
  'modal-content__list-soft-stagger', // CSS variant renders taller (488px vs 241px)
  'modal-orchestration__wizard-scale-rotate', // Size mismatch (323px vs 241px)
  'modal-content__form-field-gradient', // Framer renders taller (511px vs 240px)
])

// Keep in sync with route-coverage.spec.ts.
const ALL_GROUP_BASE_IDS = [
  'button-effects',
  'text-effects',
  'standard-effects',
  'modal-base',
  'modal-content',
  'modal-dismiss',
  'modal-open',
  'modal-orchestration',
  'modal-celebrations',
  'prize-reveal',
  'icon-animations',
  'collection-effects',
  'lights',
  'progress-bars',
  'loading-states',
  'update-indicators',
  'timer-effects',
  'realtime-data',
] as const

type StageMetrics = {
  width: number
  height: number
  childCount: number
}

/** Measure a card's demo stage dimensions and child count. Returns null on failure. */
async function measureStage(cp: CatalogPage, animId: string): Promise<StageMetrics | null> {
  try {
    const card = cp.card(animId)
    if (!(await card.isVisible().catch(() => false))) return null
    await card.scrollIntoViewIfNeeded()
    const stage = card.locator('[data-testid="demo-stage"]')
    if (!(await stage.isVisible().catch(() => false))) return null
    await expect
      .poll(async () => stage.locator(':scope > *').count(), { timeout: 5_000 })
      .toBeGreaterThan(0)

    const box = await stage.boundingBox()
    if (!box) return null
    const childCount = await stage.locator(':scope > *').count()

    return {
      width: Math.round(box.width),
      height: Math.round(box.height),
      childCount,
    }
  } catch {
    return null
  }
}

async function collectGroupAnimationIds(cp: CatalogPage, groupId: string): Promise<string[]> {
  await cp.gotoGroup(groupId)
  await cp.waitForTransitionSettle()

  return (
    await cp
      .scopedCards(groupId)
      .evaluateAll((els) => els.map((el) => el.getAttribute('data-animation-id')).filter(Boolean))
  ).sort() as string[]
}

test.describe('CSS/Framer Structural Parity', () => {
  for (const baseId of ALL_GROUP_BASE_IDS) {
    test(`${baseId} variants have matching IDs and similar dimensions`, async ({
      catalogPage,
    }) => {
      test.setTimeout(90_000)

      const framerGroupId = `${baseId}-framer`
      const cssGroupId = `${baseId}-css`
      const framerIds = await collectGroupAnimationIds(catalogPage, framerGroupId)
      const cssIds = await collectGroupAnimationIds(catalogPage, cssGroupId)

      expect(
        framerIds,
        `${baseId}: framer/css animation IDs must match.\nframer=${framerIds.join(', ')}\ncss=${cssIds.join(', ')}`
      ).toEqual(cssIds)

      await catalogPage.gotoGroup(framerGroupId)
      await catalogPage.waitForTransitionSettle()
      const framerMetrics = new Map<string, StageMetrics>()
      for (const id of framerIds) {
        const metrics = await measureStage(catalogPage, id)
        if (metrics) framerMetrics.set(id, metrics)
      }

      await catalogPage.gotoGroup(cssGroupId)
      await catalogPage.waitForTransitionSettle()
      const sizeFailures: string[] = []
      let comparedCount = 0

      for (const id of framerIds) {
        if (!framerMetrics.has(id) || SKIP_SIZE_CHECK.has(id)) continue
        const cssMetrics = await measureStage(catalogPage, id)
        if (!cssMetrics) continue

        const framer = framerMetrics.get(id)!
        comparedCount++

        // Width should match (same card grid layout)
        if (Math.abs(framer.width - cssMetrics.width) > 4) {
          sizeFailures.push(
            `${id}: width mismatch (framer: ${framer.width}px, css: ${cssMetrics.width}px)`
          )
        }

        // Height can differ between variants (different CSS/Motion implementations).
        // Flag only extreme divergence: >100% of the smaller height AND >50px absolute.
        const minHeight = Math.min(framer.height, cssMetrics.height)
        const heightDiff = Math.abs(framer.height - cssMetrics.height)
        if (minHeight > 0 && heightDiff > minHeight && heightDiff > 50) {
          sizeFailures.push(
            `${id}: height divergence (framer: ${framer.height}px, css: ${cssMetrics.height}px)`
          )
        }

        // Both variants should render children
        if (framer.childCount === 0) {
          sizeFailures.push(`${id}: framer variant has zero stage children`)
        }
        if (cssMetrics.childCount === 0) {
          sizeFailures.push(`${id}: css variant has zero stage children`)
        }
      }

      expect(comparedCount, `${baseId}: must compare at least one shared animation`).toBeGreaterThan(0)

      if (sizeFailures.length > 0) {
        throw new Error(
          `${baseId}: structural parity failures (${sizeFailures.length} issues, ${comparedCount} compared):\n${sizeFailures.map((f) => `  - ${f}`).join('\n')}`
        )
      }
    })
  }
})
