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
