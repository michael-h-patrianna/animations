import { expect, test, type Locator, type Page } from '@playwright/test'

const animationId = 'text-effects__xp-number-pop'

const currentPathname = (page: Page) => new URL(page.url()).pathname

const xpCard = (page: Page) => page.locator(`.pf-card[data-animation-id="${animationId}"]`).first()

const stageForCard = (card: Locator) => card.locator('.pf-demo-stage')

const parseDisplayValue = (raw: string | null) => {
  if (!raw) return 0
  return Number.parseInt(raw.replace(/[^\d]/g, ''), 10) || 0
}

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

test.describe('Text Effects - XP Number Pop', () => {
  test('framer variant renders expected xp-pop structure', async ({ page }) => {
    await gotoGroup(page, 'text-effects-framer')

    const card = xpCard(page)
    const stage = await waitForRenderedStage(card)

    await expect(stage.locator('.xp-pop-container')).toBeVisible()
    await expect(stage.locator('.xp-pop-number-wrapper')).toBeVisible()
    await expect(stage.locator('.xp-pop-number-value')).toBeVisible()
    await expect(stage.locator('.xp-pop-label')).toHaveText('XP')
  })

  test('css variant renders expected tfx structure', async ({ page }) => {
    await gotoGroup(page, 'text-effects-css')

    const card = xpCard(page)
    const stage = await waitForRenderedStage(card)

    await expect(stage.locator('.tfx-xp-container')).toBeVisible()
    await expect(stage.locator('.tfx-xp-number-wrapper')).toBeVisible()
    await expect(stage.locator('.tfx-xp-number-value')).toBeVisible()
    await expect(stage.locator('.tfx-xp-label')).toHaveText('XP')
  })

  test('css variant counts up close to final value', async ({ page }) => {
    await gotoGroup(page, 'text-effects-css')

    const card = xpCard(page)
    const stage = await waitForRenderedStage(card)
    const value = stage.locator('.tfx-xp-number-value')

    await expect
      .poll(async () => parseDisplayValue(await value.textContent()), { timeout: 4500 })
      .toBeGreaterThanOrEqual(235)
  })

  test('css variant particles include positional CSS variables', async ({ page }) => {
    await gotoGroup(page, 'text-effects-css')

    const card = xpCard(page)
    const stage = await waitForRenderedStage(card)
    const particles = stage.locator('.tfx-xp-particle')

    await expect.poll(async () => particles.count(), { timeout: 3000 }).toBeGreaterThan(0)

    const style = await particles.first().getAttribute('style')
    expect(style).toContain('--particle-x')
    expect(style).toContain('--particle-y')
    expect(style).toContain('animation-delay')
  })

  test('replay keeps xp number pop rendered in both variants', async ({ page }) => {
    const variants = [
      { groupId: 'text-effects-framer', rootSelector: '.xp-pop-container' },
      { groupId: 'text-effects-css', rootSelector: '.tfx-xp-container' },
    ] as const

    for (const variant of variants) {
      await gotoGroup(page, variant.groupId)

      const card = xpCard(page)
      const stage = await waitForRenderedStage(card)
      const replayButton = card.locator('[data-role="replay"]')

      await expect(replayButton).toBeEnabled()
      await replayButton.click()

      await expect(stage).toBeVisible()
      await expect(stage.locator(variant.rootSelector)).toBeVisible()
    }
  })
})
