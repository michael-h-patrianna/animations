import { test, expect } from './fixtures/catalog.fixture'

test.describe('Progress Bar Animations', () => {
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
    await expect(stage.locator('.pf-progress-milestones')).toBeVisible()
    await expect(stage.locator('.milestone-container')).toHaveCount(5)
    await expect(stage.locator('.label-container span')).toHaveCount(5)

    // First and last labels
    await expect(stage.locator('.label-container')).toContainText('Start')
    await expect(stage.locator('.label-container')).toContainText('100%')
  })

  test('milestone progress markers become fully opaque as progress completes', async ({
    catalogPage,
  }) => {
    await catalogPage.gotoGroup('progress-bars-framer')

    const card = catalogPage.card('progress-bars__progress-milestones')
    const stage = await catalogPage.cardStage(card)

    // Wait for the last milestone marker to become fully opaque (progress reaches 100%)
    // The demo animation takes ~4s + 1.5s pause; markers animate to opacity:1 when active
    const lastMarker = stage.locator('.milestone-marker').last()
    await expect
      .poll(
        async () => {
          const opacity = await lastMarker.evaluate((el) =>
            parseFloat(window.getComputedStyle(el).opacity)
          )
          return opacity
        },
        { timeout: 10_000 }
      )
      .toBeGreaterThan(0.9)
  })

  test('replay resets and replays milestone progress', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('progress-bars-framer')

    const card = catalogPage.card('progress-bars__progress-milestones')
    const stage = await catalogPage.cardStage(card)

    // Wait for progress to complete (last marker becomes opaque)
    const lastMarker = stage.locator('.milestone-marker').last()
    await expect
      .poll(
        async () => {
          const opacity = await lastMarker.evaluate((el) =>
            parseFloat(window.getComputedStyle(el).opacity)
          )
          return opacity
        },
        { timeout: 10_000 }
      )
      .toBeGreaterThan(0.9)

    // Replay resets the animation
    const replay = catalogPage.replayButton(card)
    await expect(replay).toBeEnabled()
    await replay.click()

    // After replay, first marker should still have rendered content (remounted)
    await expect(stage.locator('.milestone-marker').first()).toBeVisible({ timeout: 5_000 })

    // Progress resumes — last marker eventually becomes opaque again
    await expect
      .poll(
        async () => {
          const opacity = await lastMarker.evaluate((el) =>
            parseFloat(window.getComputedStyle(el).opacity)
          )
          return opacity
        },
        { timeout: 10_000 }
      )
      .toBeGreaterThan(0.9)
  })
})
