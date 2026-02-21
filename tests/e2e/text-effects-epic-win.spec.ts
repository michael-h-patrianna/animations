import { expect, test, type Locator, type Page } from '@playwright/test'

const animationId = 'text-effects__epic-win'

const currentPathname = (page: Page) => new URL(page.url()).pathname

const epicWinCard = (page: Page) => page.locator(`.pf-card[data-animation-id="${animationId}"]`).first()

const stageForCard = (card: Locator) => card.locator('.pf-demo-stage')

const gotoGroup = async (page: Page, groupId: string) => {
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

test.describe('TextEffectsEpicWin - Visual Rendering', () => {
  test('renders framer variant with layered text structure', async ({ page }) => {
    await gotoGroup(page, 'text-effects-framer')

    const card = epicWinCard(page)
    const stage = await waitForRenderedStage(card)

    const container = stage.locator('.epic-win-container')
    await expect(container).toBeVisible()
    await expect(container.locator('.epic-main-text')).toContainText('EPIC WIN')
    await expect(container.locator('.epic-char')).toHaveCount(8)
    await expect(container.locator('.epic-char-glow')).toHaveCount(8)
  })

  test('renders css variant with namespaced epic-win classes', async ({ page }) => {
    await gotoGroup(page, 'text-effects-css')

    const card = epicWinCard(page)
    const stage = await waitForRenderedStage(card)

    const container = stage.locator('.tfe-epic-win')
    await expect(container).toBeVisible()
    await expect(container).toHaveClass(/tfe-epic-win--animate/)
    await expect(container.locator('.tfe-epic-win__main-text')).toContainText('EPIC WIN')
    await expect(container.locator('.tfe-epic-win__char')).toHaveCount(8)
    await expect(container.locator('.tfe-epic-win__char-glow')).toHaveCount(8)
  })

  test('replay keeps epic-win rendering mounted in both variants', async ({ page }) => {
    const variants = [
      { groupId: 'text-effects-framer', rootSelector: '.epic-win-container' },
      { groupId: 'text-effects-css', rootSelector: '.tfe-epic-win' },
    ] as const

    for (const variant of variants) {
      await gotoGroup(page, variant.groupId)

      const card = epicWinCard(page)
      const stage = await waitForRenderedStage(card)
      const replayButton = card.locator('[data-role="replay"]')

      await expect(replayButton).toBeEnabled()
      await replayButton.click()

      await expect(stage).toBeVisible()
      await expect(stage.locator(variant.rootSelector)).toBeVisible()
    }
  })

  test('css variant exposes GPU-friendly character style hints', async ({ page }) => {
    await gotoGroup(page, 'text-effects-css')

    const card = epicWinCard(page)
    const stage = await waitForRenderedStage(card)
    const firstChar = stage.locator('.tfe-epic-win__char').first()

    await expect(firstChar).toBeVisible()

    const transformStyle = await firstChar.evaluate((element) => window.getComputedStyle(element).transformStyle)
    const willChange = await firstChar.evaluate((element) => window.getComputedStyle(element).willChange)

    expect(transformStyle).toBe('preserve-3d')
    expect(willChange).toContain('transform')
  })
})
