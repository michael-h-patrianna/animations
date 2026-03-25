import { test, expect } from './fixtures/catalog.fixture'

test.describe('Prize Reveal Controls', () => {
  test('inspector exposes the card-count prop for Card Pack Open', async ({
    catalogPage,
    page,
  }) => {
    await catalogPage.gotoGroup('prize-reveal-framer')
    await page.locator('[data-testid="toggle-right-panel"]').click()

    const card = catalogPage.card('prize-reveal__card-pack-open')
    await expect(card).toBeVisible()
    await card.click()

    const countInput = page.locator('[data-testid="prop-field-prizeCount"] input[type="number"]').first()
    await expect(countInput).toBeVisible()
    await expect(countInput).toHaveValue('5')
    await expect(page.locator('[data-testid="right-panel"]')).toContainText('Card Pack Open')
  })

  test('changing prize count through the inspector updates the rendered animation props', async ({
    catalogPage,
    page,
  }) => {
    await catalogPage.gotoGroup('prize-reveal-framer')
    await page.locator('[data-testid="toggle-right-panel"]').click()

    const card = catalogPage.card('prize-reveal__chest-gc-sc')
    await expect(card).toBeVisible()
    await card.click()

    const countInput = page.locator('[data-testid="prop-field-prizeCount"] input[type="number"]').first()
    const animationRoot = card.locator('[data-prize-count]')

    await expect(countInput).toHaveValue('3')
    await expect(animationRoot).toHaveAttribute('data-prize-count', '3')

    await countInput.fill('1')
    await countInput.blur()
    await expect(countInput).toHaveValue('1')
    await expect(animationRoot).toHaveAttribute('data-prize-count', '1')

    await countInput.fill('4')
    await countInput.blur()
    await expect(countInput).toHaveValue('4')
    await expect(animationRoot).toHaveAttribute('data-prize-count', '4')
    await expect(await catalogPage.cardStage(card)).toBeVisible()
  })

  test('Arcane Portal prize count stays editable through the inspector', async ({
    catalogPage,
    page,
  }) => {
    await catalogPage.gotoGroup('prize-reveal-framer')
    await page.locator('[data-testid="toggle-right-panel"]').click()

    const card = catalogPage.card('prize-reveal__arcane-portal')
    await expect(card).toBeVisible()
    await card.click()

    const countInput = page.locator('[data-testid="prop-field-prizeCount"] input[type="number"]').first()
    const animationRoot = card.locator('[data-prize-count]')

    await expect(countInput).toBeVisible()
    await expect(countInput).toHaveAttribute('aria-label', 'Prize Count value')
    await expect(animationRoot).toHaveAttribute('data-prize-count', '3')

    await countInput.fill('2')
    await countInput.blur()
    await expect(countInput).toHaveValue('2')
    await expect(animationRoot).toHaveAttribute('data-prize-count', '2')
  })
})
