import { expect, test, type Locator, type Page } from '@playwright/test'

const groupId = 'progress-bars-framer'
const animationId = 'progress-bars__progress-milestones'

const currentPathname = (page: Page) => new URL(page.url()).pathname

const milestonesCard = (page: Page) => page.locator(`.pf-card[data-animation-id="${animationId}"]`).first()

const stageForCard = (card: Locator) => card.locator('.pf-demo-stage')

const gotoMilestonesGroup = async (page: Page) => {
  await page.goto(`/${groupId}`)
  await expect.poll(() => currentPathname(page)).toBe(`/${groupId}`)
  await page.waitForSelector(`.pf-card[data-animation-id="${animationId}"]`, { timeout: 10000 })
}

const waitForRenderedStage = async (card: Locator) => {
  await card.scrollIntoViewIfNeeded()

  const stage = stageForCard(card)
  await expect(stage).toBeVisible()
  await expect.poll(async () => stage.locator(':scope > *').count(), { timeout: 5000 }).toBeGreaterThan(0)

  return stage
}

const activeMilestoneCount = async (stage: Locator) => {
  const markers = stage.locator('.milestone-marker')
  return markers.evaluateAll((nodes) => {
    return nodes.filter((node) => {
      const style = node.getAttribute('style') ?? ''
      return /0\s*,\s*255\s*,\s*255/.test(style)
    }).length
  })
}

const fillScaleX = async (stage: Locator) => {
  const transform = await stage
    .locator('.pf-progress-fill')
    .evaluate((element) => window.getComputedStyle(element).transform)

  if (transform === 'none') return 1
  const match = transform.match(/^matrix\(([^,]+),/)
  return match ? Number.parseFloat(match[1]) : Number.NaN
}

test.describe('Progress Milestones', () => {
  test.beforeEach(async ({ page }) => {
    await gotoMilestonesGroup(page)
  })

  test('renders milestone structure with expected marker and label counts', async ({ page }) => {
    const card = milestonesCard(page)
    const stage = await waitForRenderedStage(card)

    await expect(stage.locator('.pf-progress-milestones')).toBeVisible()
    await expect(stage.locator('.milestone-container')).toHaveCount(5)
    await expect(stage.locator('.label-container span')).toHaveCount(5)
    await expect(stage.locator('.label-container')).toContainText('Start')
    await expect(stage.locator('.label-container')).toContainText('100%')
  })

  test('progress fill advances and activates all milestones', async ({ page }) => {
    const card = milestonesCard(page)
    const stage = await waitForRenderedStage(card)

    await expect.poll(async () => fillScaleX(stage), { timeout: 3500 }).toBeGreaterThan(0.35)
    await expect.poll(async () => activeMilestoneCount(stage), { timeout: 5500 }).toBe(5)
  })

  test('replay resets and replays milestone activation', async ({ page }) => {
    const card = milestonesCard(page)
    const stage = await waitForRenderedStage(card)
    const replayButton = card.locator('[data-role="replay"]')

    await expect.poll(async () => activeMilestoneCount(stage), { timeout: 5500 }).toBe(5)

    await expect(replayButton).toBeEnabled()
    await replayButton.click()

    await expect.poll(async () => activeMilestoneCount(stage), { timeout: 1200 }).toBeLessThan(5)
    await expect.poll(async () => activeMilestoneCount(stage), { timeout: 5500 }).toBe(5)
  })
})
