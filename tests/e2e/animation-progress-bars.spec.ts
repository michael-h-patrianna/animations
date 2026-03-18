import { test, expect } from './fixtures/catalog.fixture'

test.describe('Progress Bar Animations', () => {
  test('renders progress bar cards in both Framer and CSS variants', async ({ catalogPage }) => {
    const variants = [
      { groupId: 'progress-bars-framer', expectedTag: 'FRAMER' },
      { groupId: 'progress-bars-css', expectedTag: 'CSS' },
    ] as const

    const representativeIds = ['progress-bars__timeline-progress', 'progress-bars__progress-bounce']

    for (const variant of variants) {
      await catalogPage.gotoGroup(variant.groupId)

      // Verify multiple cards exist
      const cards = catalogPage.allCards()
      expect(await cards.count()).toBeGreaterThan(5)

      for (const animId of representativeIds) {
        const card = catalogPage.card(animId)
        await expect(card).toBeVisible()
        await expect(catalogPage.cardMeta(card)).toContainText(variant.expectedTag)

        // Animation has rendered content (not placeholder)
        const stage = await catalogPage.cardStage(card)
        await expect(stage.locator('.pf-card__placeholder')).toHaveCount(0)
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

    // Count milestones with active styling (cyan color)
    const activeMilestoneCount = async () => {
      return stage.locator('.milestone-marker').evaluateAll(
        (nodes) =>
          nodes.filter((node) => {
            const style = node.getAttribute('style') ?? ''
            return /0\s*,\s*255\s*,\s*255/.test(style)
          }).length
      )
    }

    // All 5 milestones should activate as progress completes
    await expect.poll(activeMilestoneCount, { timeout: 6_000 }).toBe(5)
  })

  test('replay resets and replays milestone activation', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('progress-bars-framer')

    const card = catalogPage.card('progress-bars__progress-milestones')
    const stage = await catalogPage.cardStage(card)

    const activeMilestoneCount = async () => {
      return stage.locator('.milestone-marker').evaluateAll(
        (nodes) =>
          nodes.filter((node) => {
            const style = node.getAttribute('style') ?? ''
            return /0\s*,\s*255\s*,\s*255/.test(style)
          }).length
      )
    }

    // Wait for all milestones to activate
    await expect.poll(activeMilestoneCount, { timeout: 6_000 }).toBe(5)

    // Replay resets
    const replay = catalogPage.replayButton(card)
    await expect(replay).toBeEnabled()
    await replay.click()

    // After replay, milestones should reset (fewer than 5 active)
    await expect.poll(activeMilestoneCount, { timeout: 2_000 }).toBeLessThan(5)

    // And re-activate
    await expect.poll(activeMilestoneCount, { timeout: 6_000 }).toBe(5)
  })
})
