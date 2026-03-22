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

  test('milestone progress activates all 5 milestones over time', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('progress-bars-framer')

    const card = catalogPage.card('progress-bars__progress-milestones')
    const stage = await catalogPage.cardStage(card)

    // Count milestones with data-active attribute (set by component state)
    const activeMilestoneCount = () => stage.locator('.milestone-container[data-active]').count()

    // All 5 milestones should activate as progress completes (4s animation + buffer)
    await expect.poll(activeMilestoneCount, { timeout: 8_000 }).toBe(5)
  })

  test('replay resets and replays milestone activation', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('progress-bars-framer')

    const card = catalogPage.card('progress-bars__progress-milestones')
    const stage = await catalogPage.cardStage(card)

    const activeMilestoneCount = () => stage.locator('.milestone-container[data-active]').count()

    // Wait for all milestones to activate
    await expect.poll(activeMilestoneCount, { timeout: 8_000 }).toBe(5)

    // Replay resets
    const replay = catalogPage.replayButton(card)
    await expect(replay).toBeEnabled()
    await replay.click()

    // After replay, milestones should reset (fewer than 5 active)
    await expect.poll(activeMilestoneCount, { timeout: 3_000 }).toBeLessThan(5)

    // And re-activate
    await expect.poll(activeMilestoneCount, { timeout: 8_000 }).toBe(5)
  })
})
