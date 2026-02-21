import { expect, test, type Locator, type Page } from '@playwright/test'

const currentPathname = (page: Page) => new URL(page.url()).pathname

const cardByAnimationId = (page: Page, animationId: string) =>
  page.locator(`.pf-card[data-animation-id="${animationId}"]`).first()

const stageForCard = (card: Locator) => card.locator('.pf-demo-stage')

const gotoGroup = async (page: Page, groupId: string) => {
  await page.goto(`/${groupId}`)
  await expect.poll(() => currentPathname(page)).toBe(`/${groupId}`)
  await page.waitForSelector('.pf-card[data-animation-id^="progress-bars__"]', { timeout: 10000 })
}

const waitForRenderedStage = async (card: Locator) => {
  await card.scrollIntoViewIfNeeded()

  const stage = stageForCard(card)
  await expect(stage).toBeVisible()
  await expect.poll(async () => stage.locator(':scope > *').count(), { timeout: 5000 }).toBeGreaterThan(0)

  return stage
}

const representativeAnimations = [
  'progress-bars__timeline-progress',
  'progress-bars__progress-bounce',
  'progress-bars__xp-accumulation',
] as const

const variants = [
  { groupId: 'progress-bars-framer', expectedTag: 'FRAMER' },
  { groupId: 'progress-bars-css', expectedTag: 'CSS' },
] as const

test.describe('Progress Bars', () => {
  test('renders representative cards for framer and css variants', async ({ page }) => {
    for (const variant of variants) {
      await gotoGroup(page, variant.groupId)

      const cards = page.locator('.pf-card[data-animation-id^="progress-bars__"]')
      expect(await cards.count()).toBeGreaterThan(10)

      for (const animationId of representativeAnimations) {
        const card = cardByAnimationId(page, animationId)
        await expect(card).toBeVisible()
        await expect(card.locator('.pf-card__meta')).toContainText(variant.expectedTag)

        const stage = await waitForRenderedStage(card)
        await expect(stage.locator('.pf-card__placeholder')).toHaveCount(0)
      }
    }
  })

  test('replay keeps representative progress bar rendered in each variant', async ({ page }) => {
    for (const variant of variants) {
      await gotoGroup(page, variant.groupId)

      const card = cardByAnimationId(page, 'progress-bars__progress-bounce')
      const stage = await waitForRenderedStage(card)
      const replayButton = card.locator('[data-role="replay"]')

      await expect(replayButton).toBeEnabled()
      await replayButton.click()

      await expect(stage).toBeVisible()
      await expect.poll(async () => stage.locator(':scope > *').count()).toBeGreaterThan(0)
    }
  })

  test('all visible sampled cards have non-empty uppercase tags', async ({ page }) => {
    for (const variant of variants) {
      await gotoGroup(page, variant.groupId)

      const cards = page.locator('.pf-card[data-animation-id^="progress-bars__"]')
      const sampleCount = Math.min(await cards.count(), 8)
      expect(sampleCount).toBeGreaterThan(0)

      for (let index = 0; index < sampleCount; index += 1) {
        const meta = cards.nth(index).locator('.pf-card__meta')
        const tags = await meta.locator('span').allTextContents()

        expect(tags.length).toBeGreaterThan(0)
        tags.forEach((tag) => {
          const trimmed = tag.trim()
          expect(trimmed.length).toBeGreaterThan(0)
          expect(trimmed).toBe(trimmed.toUpperCase())
        })
      }
    }
  })
})
