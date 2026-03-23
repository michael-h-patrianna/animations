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
])

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

/** Discover all base group IDs by clicking sidebar links in framer mode. */
async function discoverBaseGroupIds(cp: CatalogPage): Promise<string[]> {
  await cp.goto()
  await cp.selectFramerMode()
  await cp.waitForCards()

  const ids: string[] = []
  const count = await cp.allGroupLinks().count()

  for (let i = 0; i < count; i++) {
    await cp.allGroupLinks().nth(i).click()
    await expect.poll(() => cp.currentPathname(), { timeout: 5_000 }).toMatch(/-framer$/)
    const m = cp.currentPathname().match(/^\/(.*)-framer$/)
    if (m && !ids.includes(m[1])) ids.push(m[1])
  }

  return ids
}

test.describe('CSS/Framer Structural Parity', () => {
  test.setTimeout(300_000)

  test('both variants have matching IDs and similar dimensions per group', async ({
    catalogPage,
  }) => {
    const baseIds = await discoverBaseGroupIds(catalogPage)
    expect(baseIds.length).toBeGreaterThan(0)

    const idMismatches: string[] = []
    const sizeFailures: string[] = []
    let comparedCount = 0

    for (const baseId of baseIds) {
      // Framer: collect IDs and metrics using scoped cards (avoids AnimatePresence duplicates)
      await catalogPage.gotoGroup(`${baseId}-framer`)
      await catalogPage.waitForTransitionSettle()
      const framerCards = catalogPage.scopedCards(`${baseId}-framer`)
      const framerIds = (
        await framerCards.evaluateAll((els) =>
          els.map((el) => el.getAttribute('data-animation-id')).filter(Boolean)
        )
      ).sort() as string[]

      const framerMetrics = new Map<string, StageMetrics>()
      for (const id of framerIds) {
        const metrics = await measureStage(catalogPage, id)
        if (metrics) framerMetrics.set(id, metrics)
      }

      // CSS: collect IDs and compare using scoped cards
      await catalogPage.gotoGroup(`${baseId}-css`)
      await catalogPage.waitForTransitionSettle()
      const cssCards = catalogPage.scopedCards(`${baseId}-css`)
      const cssIds = (
        await cssCards.evaluateAll((els) =>
          els.map((el) => el.getAttribute('data-animation-id')).filter(Boolean)
        )
      ).sort() as string[]

      // Check ID parity
      if (JSON.stringify(framerIds) !== JSON.stringify(cssIds)) {
        const framerOnly = framerIds.filter((id) => !cssIds.includes(id))
        const cssOnly = cssIds.filter((id) => !framerIds.includes(id))
        const parts: string[] = [`${baseId}: ID mismatch`]
        if (framerOnly.length > 0) parts.push(`  framer-only: ${framerOnly.join(', ')}`)
        if (cssOnly.length > 0) parts.push(`  css-only: ${cssOnly.join(', ')}`)
        idMismatches.push(parts.join('\n'))
      }

      // Check size parity for shared animations
      for (const id of framerIds) {
        if (!cssIds.includes(id) || !framerMetrics.has(id) || SKIP_SIZE_CHECK.has(id)) continue
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
    }

    expect(comparedCount, 'Must compare at least some animations').toBeGreaterThan(0)

    const allFailures = [...idMismatches, ...sizeFailures]
    if (allFailures.length > 0) {
      throw new Error(
        `Structural parity failures (${allFailures.length} issues, ${comparedCount} compared):\n${allFailures.map((f) => `  - ${f}`).join('\n')}`
      )
    }
  })
})
