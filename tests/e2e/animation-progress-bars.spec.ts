import type { Locator } from '@playwright/test'
import { test, expect } from './fixtures/catalog.fixture'

test.describe('Progress Bar Animations', () => {
  async function progressFillScale(fill: Locator) {
    return fill.evaluate((el) => {
      const transform = window.getComputedStyle(el).transform
      if (transform === 'none') return 0
      const match = transform.match(/matrix(?:3d)?\(([^)]+)\)/)
      if (!match) return -1
      const first = Number(match[1]?.split(',')[0]?.trim() ?? Number.NaN)
      return Number.isFinite(first) ? first : -1
    })
  }

  test('renders progress bar cards in both Framer and CSS variants', async ({ catalogPage }) => {
    const variants = [
      { groupId: 'progress-bars-framer', expectedSuffix: '-framer' },
      { groupId: 'progress-bars-css', expectedSuffix: '-css' },
    ] as const

    const representativeIds = ['progress-bars__timeline-progress', 'progress-bars__progress-bounce']

    for (const variant of variants) {
      await catalogPage.gotoGroup(variant.groupId)

      // URL confirms the correct mode
      expect(catalogPage.currentPathname()).toMatch(new RegExp(`${variant.expectedSuffix}$`))

      // Verify multiple cards exist
      const cards = catalogPage.allCards()
      expect(await cards.count()).toBeGreaterThan(5)

      for (const animId of representativeIds) {
        const card = catalogPage.card(animId)
        await expect(card).toBeVisible()

        // Animation has rendered content (not placeholder)
        const stage = await catalogPage.cardStage(card)
        await expect(stage.locator(':scope > *').first()).toBeVisible()
      }
    }
  })

  test('milestone progress bar renders expected structure', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('progress-bars-framer')

    const card = catalogPage.card('progress-bars__progress-milestones')
    const stage = await catalogPage.cardStage(card)

    // Milestones structure
    await expect(stage.locator('[data-testid="progress-milestones"]')).toBeVisible()
    await expect(stage.locator('.milestone-container')).toHaveCount(5)
    await expect(stage.locator('.label-container span')).toHaveCount(5)

    // First and last labels
    await expect(stage.locator('.label-container')).toContainText('Start')
    await expect(stage.locator('.label-container')).toContainText('100%')
  })

  test('milestone progress fill advances over time', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('progress-bars-framer')

    const card = catalogPage.card('progress-bars__progress-milestones')
    const stage = await catalogPage.cardStage(card)

    const fill = stage.locator('[data-testid="progress-fill"]')
    await expect.poll(async () => progressFillScale(fill), { timeout: 5_000 }).toBeGreaterThan(0.3)
  })

  test('replay resets and replays milestone progress', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('progress-bars-framer')

    const card = catalogPage.card('progress-bars__progress-milestones')
    const stage = await catalogPage.cardStage(card)

    const fill = stage.locator('[data-testid="progress-fill"]')
    await expect.poll(async () => progressFillScale(fill), { timeout: 5_000 }).toBeGreaterThan(0.3)

    // Replay resets the animation
    const replay = catalogPage.replayButton(card)
    await expect(replay).toBeEnabled()
    const fillHandle = await fill.elementHandle()
    await replay.click()

    await expect(stage.locator('.milestone-marker').first()).toBeVisible({ timeout: 5_000 })
    await expect
      .poll(
        async () => {
          if (fillHandle == null) return true
          return fillHandle.evaluate((el) => el.isConnected).catch(() => false)
        },
        { timeout: 5_000 }
      )
      .toBe(false)

    // Progress resumes on the remounted demo.
    const remountedFill = stage.locator('[data-testid="progress-fill"]')
    await expect
      .poll(async () => progressFillScale(remountedFill), { timeout: 5_000 })
      .toBeGreaterThan(0.3)
  })
})
