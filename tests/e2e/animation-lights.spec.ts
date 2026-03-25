import { test, expect } from './fixtures/catalog.fixture'

test.describe('Lights Animation Controls', () => {
  test('lights inspector exposes configurable bulb props', async ({ catalogPage, page }) => {
    await catalogPage.gotoGroup('lights-framer')
    await page.locator('[data-testid="toggle-right-panel"]').click()

    const card = catalogPage.card('lights__circle-static-1')
    await expect(card).toBeVisible()
    await card.click()

    const rightPanel = page.locator('[data-testid="right-panel"]')
    await expect(rightPanel).toBeVisible()
    await expect(rightPanel).toContainText('Alternating Carnival')
    await expect(page.locator('[data-testid="prop-field-numBulbs"]')).toBeVisible()
    await expect(page.locator('[data-testid="prop-field-onColor"]')).toBeVisible()
  })

  test('inspector color picker shows a valid default light color', async ({
    catalogPage,
    page,
  }) => {
    await catalogPage.gotoGroup('lights-framer')
    await page.locator('[data-testid="toggle-right-panel"]').click()

    const card = catalogPage.card('lights__circle-static-1')
    await expect(card).toBeVisible()
    await card.click()

    const colorField = page.locator('[data-testid="prop-field-onColor"]')
    await expect(colorField).toBeVisible()
    const valueText = (await colorField.textContent()) ?? ''
    expect(valueText).toMatch(/#[0-9a-f]{6}/i)
  })

  test('Number of Bulbs inspector updates and clamps the rendered light count', async ({
    catalogPage,
    page,
  }) => {
    await catalogPage.gotoGroup('lights-framer')
    await page.locator('[data-testid="toggle-right-panel"]').click()

    const card = catalogPage.card('lights__circle-static-1')
    await expect(card).toBeVisible()
    await card.click()

    const bulbInput = page
      .locator('[data-testid="prop-field-numBulbs"] input[type="number"]')
      .first()
    const bulbs = card.locator('.lights-circle-static-1__bulb-wrapper')

    await expect(bulbInput).toHaveValue('16')
    await expect.poll(async () => bulbs.count(), { timeout: 5_000 }).toBe(16)

    await bulbInput.fill('18')
    await bulbInput.blur()
    await expect(bulbInput).toHaveValue('18')
    await expect.poll(async () => bulbs.count(), { timeout: 5_000 }).toBe(18)

    await bulbInput.fill('100')
    await bulbInput.blur()
    await expect(bulbInput).toHaveValue('40')
    await expect.poll(async () => bulbs.count(), { timeout: 5_000 }).toBe(40)

    await bulbInput.fill('1')
    await bulbInput.blur()
    await expect(bulbInput).toHaveValue('4')
    await expect.poll(async () => bulbs.count(), { timeout: 5_000 }).toBe(4)
  })

  test('lights-framer route loads without ErrorBoundary', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('lights-framer')

    await catalogPage.expectNoErrorBoundary()

    const cards = catalogPage.allCards()
    expect(await cards.count()).toBeGreaterThan(0)
  })
})
