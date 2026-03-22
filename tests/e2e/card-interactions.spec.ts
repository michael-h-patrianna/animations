import { test, expect } from './fixtures/catalog.fixture'

test.describe('Card Interactions', () => {
  test('description toggle expands and collapses card text with correct aria-label', async ({
    catalogPage,
  }) => {
    await catalogPage.gotoGroup('text-effects-framer')

    const card = catalogPage.card('text-effects__character-reveal')
    const description = catalogPage.cardDescription(card)
    const toggle = catalogPage.descriptionToggle(card)

    // Starts collapsed
    await expect(description).not.toHaveAttribute('data-expanded')
    await expect(toggle).toHaveAttribute('aria-label', 'Expand description')

    // Expand
    await toggle.click()
    await expect(description).toHaveAttribute('data-expanded', 'true')
    await expect(toggle).toHaveAttribute('aria-label', 'Collapse description')

    // Collapse again
    await toggle.click()
    await expect(description).not.toHaveAttribute('data-expanded')
    await expect(toggle).toHaveAttribute('aria-label', 'Expand description')
  })

  test('card tier badge displays valid tier label', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('text-effects-framer')

    const card = catalogPage.card('text-effects__character-reveal')
    const tierBadge = card.locator('[data-testid="tier-badge"]')
    await expect(tierBadge).toBeVisible()

    // Tier badge has a data-tier attribute with valid tier number (1-4)
    const tier = await tierBadge.getAttribute('data-tier')
    expect(Number(tier)).toBeGreaterThanOrEqual(1)
    expect(Number(tier)).toBeLessThanOrEqual(4)

    // Badge has an aria-label with a descriptive tooltip (long enough to be useful)
    const ariaLabel = await tierBadge.getAttribute('aria-label')
    expect(ariaLabel?.length).toBeGreaterThan(10)
  })

  test('disabled replay button is correctly marked on interactive-only animations', async ({
    catalogPage,
  }) => {
    await catalogPage.gotoGroup('button-effects-framer')

    // Button ripple is interactive (click-to-trigger), replay is disabled
    const card = catalogPage.card('button-effects__ripple')
    await expect(card).toBeVisible()
    await expect(catalogPage.replayButton(card)).toBeDisabled()
  })

  test('cards with source entries have code viewer buttons', async ({ catalogPage }) => {
    // modal-base group is known to have source entries for all animations
    await catalogPage.gotoGroup('modal-base-framer')

    const cards = catalogPage.allCards()
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)

    // At least the first card should have a code viewer button
    const firstCard = cards.first()
    await firstCard.scrollIntoViewIfNeeded()
    await expect(catalogPage.codeViewerButton(firstCard)).toBeVisible({ timeout: 3_000 })

    // Verify all cards with code viewer buttons are consistently styled
    let cardsWithBtn = 0
    for (let i = 0; i < count; i++) {
      const card = cards.nth(i)
      await card.scrollIntoViewIfNeeded()
      const codeBtn = catalogPage.codeViewerButton(card)
      const btnCount = await codeBtn.count()
      if (btnCount > 0) {
        await expect(codeBtn).toBeVisible()
        cardsWithBtn++
      }
    }

    // At least some cards should have code viewer buttons
    expect(cardsWithBtn).toBeGreaterThan(0)
  })

  test('tier badge hover shows tooltip with descriptive text', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('text-effects-framer')

    const card = catalogPage.card('text-effects__character-reveal')
    const tierBadge = card.locator('[data-testid="tier-badge"]')
    await expect(tierBadge).toBeVisible()

    // No tooltip initially
    await expect(tierBadge.locator('[role="tooltip"]')).toHaveCount(0)

    // Hover over badge to show tooltip
    await tierBadge.hover()
    const tooltip = tierBadge.locator('[role="tooltip"]')
    await expect(tooltip).toBeVisible()

    // Tooltip contains meaningful descriptive text
    const tooltipText = await tooltip.textContent()
    expect(tooltipText!.length).toBeGreaterThan(20)

    // Move mouse away to dismiss
    await card.locator('[data-testid="card-title"]').hover()
    await expect(tooltip).not.toBeVisible()
  })

  test('all cards in a group have tier badges with valid tier numbers', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('standard-effects-framer')

    const groupSection = catalogPage.groupSection('standard-effects-framer')
    const cards = groupSection.locator('[data-testid="card-grid"] > [data-animation-id]')
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)

    // Check all cards (not a sample)
    for (let i = 0; i < count; i++) {
      const card = cards.nth(i)
      await card.scrollIntoViewIfNeeded()
      const tierBadge = card.locator('[data-testid="tier-badge"]')
      await expect(tierBadge).toBeVisible()

      const tier = await tierBadge.getAttribute('data-tier')
      expect(Number(tier)).toBeGreaterThanOrEqual(1)
      expect(Number(tier)).toBeLessThanOrEqual(4)
    }
  })
})
