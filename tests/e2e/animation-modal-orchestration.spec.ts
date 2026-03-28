import type { Locator } from '@playwright/test'
import { test, expect } from './fixtures/catalog.fixture'

const MAGNETIC_HOVER_ID = 'modal-orchestration__magnetic-hover'

const GROUP_CASES = [
  { groupId: 'modal-orchestration-css', label: 'CSS' },
  { groupId: 'modal-orchestration-framer', label: 'Framer' },
] as const

async function measureMagneticHoverLayout(stage: Locator) {
  const grid = stage.locator('[class*="pf-magnetic-hover"]')
  await expect(grid).toBeVisible()

  return grid.evaluate((node) => {
    const countBands = (values: number[], tolerance = 6) => {
      const sorted = [...values].sort((a, b) => a - b)
      let bands = 0
      let previous = Number.NEGATIVE_INFINITY

      for (const value of sorted) {
        if (value - previous > tolerance) {
          bands += 1
          previous = value
        }
      }

      return bands
    }

    const root = node as HTMLElement
    const rootRect = root.getBoundingClientRect()
    const items = Array.from(
      root.querySelectorAll<HTMLElement>('[class*="pf-magnetic-hover__item"]')
    ).map((item) => {
      const rect = item.getBoundingClientRect()
      return {
        left: Math.round(rect.left - rootRect.left),
        top: Math.round(rect.top - rootRect.top),
        right: Math.round(rect.right - rootRect.left),
      }
    })

    return {
      itemCount: items.length,
      rootWidth: Math.round(rootRect.width),
      uniqueColumns: countBands(items.map((item) => item.left)),
      uniqueRows: countBands(items.map((item) => item.top)),
      maxRight: Math.max(...items.map((item) => item.right)),
    }
  })
}

test.describe('Modal Orchestration Magnetic Hover Tiles', () => {
  for (const { groupId, label } of GROUP_CASES) {
    test(`${label} tiles reflow instead of clipping when the inspector narrows the card`, async ({
      catalogPage,
    }) => {
      await catalogPage.page.setViewportSize({ width: 1280, height: 960 })
      await catalogPage.gotoGroup(groupId)

      const card = catalogPage.card(MAGNETIC_HOVER_ID)
      await expect(card).toBeVisible()

      await catalogPage.page.getByTestId('toggle-right-panel').click()
      await expect(catalogPage.page.getByTestId('right-panel')).toBeVisible()

      const stage = await catalogPage.cardStage(card)
      await expect
        .poll(
          async () =>
            stage
              .locator('[class*="pf-magnetic-hover__item"]')
              .evaluateAll((nodes) =>
                nodes.every((node) => Number.parseFloat(getComputedStyle(node).opacity) >= 0.99)
              ),
          { timeout: 3_000 }
        )
        .toBe(true)
      const layout = await measureMagneticHoverLayout(stage)

      expect(layout.itemCount).toBeGreaterThan(0)
      expect(layout.uniqueRows).toBeGreaterThan(1)
      expect(layout.uniqueColumns).toBeLessThanOrEqual(3)
      expect(layout.maxRight).toBeLessThanOrEqual(layout.rootWidth + 1)
    })
  }
})
