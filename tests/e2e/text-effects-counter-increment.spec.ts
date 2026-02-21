import { expect, test, type Locator, type Page } from '@playwright/test'

const currentPathname = (page: Page) => new URL(page.url()).pathname

const parseCounterValue = (value: string | null) => {
  if (!value) return 0
  return Number.parseInt(value.replace(/[^\d]/g, ''), 10) || 0
}

const cardById = (page: Page, animationId: string) =>
  page.locator(`.pf-card[data-animation-id="${animationId}"]`).first()

const stageForCard = (card: Locator) => card.locator('.pf-demo-stage')

const gotoTextEffectsCss = async (page: Page) => {
  await page.goto('/text-effects-css')
  await expect.poll(() => currentPathname(page)).toBe('/text-effects-css')
  await page.waitForSelector('.pf-card[data-animation-id="text-effects__counter-increment"]', { timeout: 10000 })
}

const waitForRenderedStage = async (card: Locator) => {
  await card.scrollIntoViewIfNeeded()

  const stage = stageForCard(card)
  await expect(stage).toBeVisible()
  await expect.poll(async () => stage.locator(':scope > *').count(), { timeout: 5000 }).toBeGreaterThan(0)

  return stage
}

test.describe('Text Effects - Counter Increment', () => {
  test.beforeEach(async ({ page }) => {
    await gotoTextEffectsCss(page)
  })

  test('renders continuous and 9999 counter cards with expected structure', async ({ page }) => {
    const counterIds = ['text-effects__counter-increment', 'text-effects__counter-increment-9999']

    for (const counterId of counterIds) {
      const card = cardById(page, counterId)
      const stage = await waitForRenderedStage(card)

      await expect(stage.locator(`.tfx-cinc-container[data-animation-id="${counterId}"]`)).toBeVisible()
      await expect(stage.locator('.tfx-cinc-value-wrapper')).toBeVisible()
      await expect(stage.locator('.tfx-cinc-value')).toBeVisible()
    }
  })

  test('continuous counter increments over time', async ({ page }) => {
    const card = cardById(page, 'text-effects__counter-increment')
    const stage = await waitForRenderedStage(card)
    const value = stage.locator('.tfx-cinc-value')

    const initialValue = parseCounterValue(await value.textContent())

    await expect
      .poll(async () => parseCounterValue(await value.textContent()), { timeout: 5000 })
      .toBeGreaterThan(initialValue)
  })

  test('9999 counter reaches its target value within expected duration', async ({ page }) => {
    const card = cardById(page, 'text-effects__counter-increment-9999')
    const stage = await waitForRenderedStage(card)
    const value = stage.locator('.tfx-cinc-value')

    await expect.poll(async () => parseCounterValue(await value.textContent()), { timeout: 8000 }).toBe(9999)
  })

  test('counter particles appear during updates', async ({ page }) => {
    const card = cardById(page, 'text-effects__counter-increment')
    const stage = await waitForRenderedStage(card)

    await expect
      .poll(async () => stage.locator('.tfx-cinc-particle').count(), { timeout: 4000 })
      .toBeGreaterThan(0)
  })

  test('replay keeps counter rendering active', async ({ page }) => {
    const card = cardById(page, 'text-effects__counter-increment')
    const stage = await waitForRenderedStage(card)
    const value = stage.locator('.tfx-cinc-value')
    const replayButton = card.locator('[data-role="replay"]')

    const valueBeforeReplay = parseCounterValue(await value.textContent())

    await expect(replayButton).toBeEnabled()
    await replayButton.click()

    await expect(stage).toBeVisible()
    await expect
      .poll(async () => parseCounterValue(await value.textContent()), { timeout: 3000 })
      .toBeGreaterThanOrEqual(0)

    const valueAfterReplay = parseCounterValue(await value.textContent())
    expect(valueAfterReplay).toBeLessThanOrEqual(Math.max(valueBeforeReplay, 1))
  })
})
