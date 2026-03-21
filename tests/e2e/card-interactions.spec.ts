import { test, expect } from './fixtures/catalog.fixture'

test.describe('Card Interactions', () => {
  test('description toggle expands and collapses card text', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('text-effects-framer')

    const card = catalogPage.card('text-effects__character-reveal')
    const description = catalogPage.cardDescription(card)
    const toggle = catalogPage.descriptionToggle(card)

    // Starts collapsed (no data-expanded attribute)
    await expect(description).not.toHaveAttribute('data-expanded')

    // Expand
    await toggle.click()
    await expect(description).toHaveAttribute('data-expanded', 'true')

    // Collapse again
    await toggle.click()
    await expect(description).not.toHaveAttribute('data-expanded')
  })

  test('card tags display correct technology badges', async ({ catalogPage }) => {
    // Framer card should show FRAMER tag
    await catalogPage.gotoGroup('text-effects-framer')
    const framerCard = catalogPage.card('text-effects__character-reveal')
    const framerMeta = catalogPage.cardMeta(framerCard)
    await expect(framerMeta).toContainText('FRAMER')

    // CSS card should show CSS tag
    await catalogPage.gotoGroup('button-effects-css')
    const cssCard = catalogPage.card('button-effects__jitter')
    const cssMeta = catalogPage.cardMeta(cssCard)
    await expect(cssMeta).toContainText('CSS')

    // CSS card should NOT show FRAMER
    const cssText = ((await cssMeta.textContent()) ?? '').toUpperCase()
    expect(cssText).not.toContain('FRAMER')
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

  test('cards have non-empty uppercase tag labels', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('standard-effects-css')

    const cards = catalogPage.allCards()
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)

    // Check all cards (not a sample)
    for (let i = 0; i < count; i++) {
      const meta = catalogPage.cardMeta(cards.nth(i))
      const tags = await meta.locator('span').allTextContents()
      expect(tags.length).toBeGreaterThan(0)

      for (const tag of tags) {
        const trimmed = tag.trim()
        expect(trimmed.length).toBeGreaterThan(0)
        expect(trimmed).toBe(trimmed.toUpperCase())
      }
    }
  })
})
