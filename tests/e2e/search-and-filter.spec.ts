import { expect, test, type Page } from '@playwright/test'

const currentPathname = (page: Page) => new URL(page.url()).pathname

const gotoGroup = async (page: Page, groupId: string) => {
  await page.goto(`/${groupId}`)
  await expect.poll(() => currentPathname(page)).toBe(`/${groupId}`)
  await page.waitForSelector('.pf-card[data-animation-id]', { timeout: 10000 })
}

test.describe('Tag Metadata Verification', () => {
  test('does not render search/filter controls in current UI', async ({ page }) => {
    await gotoGroup(page, 'text-effects-framer')

    await expect(page.locator('input[type="search"]')).toHaveCount(0)
    await expect(page.locator('[data-filter]')).toHaveCount(0)
    await expect(page.locator('[data-action="clear-filters"]')).toHaveCount(0)
  })

  test('text effects framer card shows FRAMER tag only', async ({ page }) => {
    await gotoGroup(page, 'text-effects-framer')

    const card = page.locator('[data-animation-id="text-effects__character-reveal"]')
    const meta = card.locator('.pf-card__meta')

    await expect(card).toBeVisible()
    await expect(meta).toContainText('FRAMER')

    const metaText = ((await meta.textContent()) ?? '').toUpperCase()
    expect(metaText).not.toContain('CSS')
    expect(metaText).not.toContain('JS')
  })

  test('button effects css cards expose expected CSS and JS tags', async ({ page }) => {
    await gotoGroup(page, 'button-effects-css')

    const jitterMeta = page.locator('[data-animation-id="button-effects__jitter"] .pf-card__meta')
    await expect(jitterMeta).toContainText('CSS')

    const jitterText = ((await jitterMeta.textContent()) ?? '').toUpperCase()
    expect(jitterText).not.toContain('FRAMER')
    expect(jitterText).not.toContain('JS')

    const rippleMeta = page.locator('[data-animation-id="button-effects__ripple"] .pf-card__meta')
    await expect(rippleMeta).toContainText('CSS')
    await expect(rippleMeta).toContainText('JS')
  })

  test('visible standard-effects css cards have uppercase non-empty tag labels', async ({ page }) => {
    await gotoGroup(page, 'standard-effects-css')

    const cards = page.locator('.pf-card[data-animation-id^="standard-effects__"]')
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)

    const sampleCount = Math.min(count, 8)
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
  })
})
