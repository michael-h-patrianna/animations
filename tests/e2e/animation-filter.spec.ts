import { test, expect } from './fixtures/catalog.fixture'

/**
 * Animation filter banner tests.
 *
 * When ?animation=<id> is in the URL, GroupSection shows a filter banner
 * with a "Show all animations" button. These tests verify:
 * - Filter banner appears with correct text
 * - "Show all" button removes the filter and shows all cards
 * - Filter banner disappears after removal
 * - Invalid filter shows "not found" message with remove button
 * - Remove filter button is keyboard-accessible
 *
 * Bug this catches: filter state corruption where removing the filter
 * doesn't clear the URL param, or the banner stays visible after navigation.
 */
test.describe('Animation Filter Banner', () => {
  test('filter banner shows animation ID when filter is active', async ({ catalogPage, page }) => {
    const targetId = 'text-effects__character-reveal'
    await page.goto(`/text-effects-framer?animation=${encodeURIComponent(targetId)}`)
    await catalogPage.waitForShell()

    const banner = catalogPage.filterBanner()
    await expect(banner).toBeVisible({ timeout: 10_000 })
    await expect(banner).toContainText(targetId)
  })

  test('remove filter button clears filter and shows all cards', async ({ catalogPage, page }) => {
    const targetId = 'text-effects__character-reveal'
    await page.goto(`/text-effects-framer?animation=${encodeURIComponent(targetId)}`)
    await catalogPage.waitForShell()

    const banner = catalogPage.filterBanner()
    await expect(banner).toBeVisible({ timeout: 10_000 })

    // Click "Show all animations"
    const removeBtn = catalogPage.removeFilterButton()
    await expect(removeBtn).toBeVisible()
    await removeBtn.click()

    // URL should no longer have ?animation= param
    await expect
      .poll(() => new URL(page.url()).searchParams.has('animation'), { timeout: 5_000 })
      .toBe(false)

    // Banner should be gone
    await expect(banner).toHaveCount(0)

    // All cards should be visible (more than 1)
    await catalogPage.waitForCards()
    const cards = catalogPage.allCards()
    expect(await cards.count()).toBeGreaterThan(1)
  })

  test('invalid filter shows not-found message with remove button', async ({
    catalogPage,
    page,
  }) => {
    await page.goto('/text-effects-framer?animation=nonexistent-id')
    await catalogPage.waitForShell()

    const banner = catalogPage.filterBanner()
    await expect(banner).toBeVisible({ timeout: 10_000 })
    await expect(banner).toContainText('not found')

    // Remove button should still work
    const removeBtn = catalogPage.removeFilterButton()
    await expect(removeBtn).toBeVisible()
    await removeBtn.click()

    // After removing invalid filter, all cards appear
    await catalogPage.waitForCards()
    expect(await catalogPage.allCards().count()).toBeGreaterThan(1)
    await expect(banner).toHaveCount(0)
  })

  test('filter banner disappears after sidebar navigation', async ({ catalogPage, page }) => {
    const targetId = 'text-effects__character-reveal'
    await page.goto(`/text-effects-framer?animation=${encodeURIComponent(targetId)}`)
    await catalogPage.waitForShell()

    const banner = catalogPage.filterBanner()
    await expect(banner).toBeVisible({ timeout: 10_000 })

    // Navigate to a different group via sidebar
    const groupLinks = catalogPage.allGroupLinks()
    const before = new URL(page.url()).pathname
    for (let i = 0; i < (await groupLinks.count()); i++) {
      const isActive = await groupLinks.nth(i).getAttribute('data-active')
      if (!isActive) {
        await groupLinks.nth(i).click()
        break
      }
    }
    await catalogPage.waitForPathnameChange(before)
    await catalogPage.waitForCards()

    // Banner should be gone on the new group
    await expect(banner).toHaveCount(0)
  })

  test('remove filter button is keyboard-accessible', async ({ catalogPage, page }) => {
    const targetId = 'text-effects__character-reveal'
    await page.goto(`/text-effects-framer?animation=${encodeURIComponent(targetId)}`)
    await catalogPage.waitForShell()

    const banner = catalogPage.filterBanner()
    await expect(banner).toBeVisible({ timeout: 10_000 })

    // Focus the remove filter button and activate via Enter
    const removeBtn = catalogPage.removeFilterButton()
    await removeBtn.focus()
    await expect(removeBtn).toBeFocused()

    await page.keyboard.press('Enter')

    // Filter should be removed
    await expect
      .poll(() => new URL(page.url()).searchParams.has('animation'), { timeout: 5_000 })
      .toBe(false)
    await expect(banner).toHaveCount(0)
    await catalogPage.waitForCards()
    expect(await catalogPage.allCards().count()).toBeGreaterThan(1)
  })

  test('filter banner works on mobile viewport', async ({ mobilePage, catalogPage, page }) => {
    const targetId = 'text-effects__character-reveal'
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto(`/text-effects-framer?animation=${encodeURIComponent(targetId)}`)
    await expect(mobilePage.header).toBeVisible({ timeout: 10_000 })

    // Filter banner visible on mobile
    const banner = catalogPage.filterBanner()
    await expect(banner).toBeVisible({ timeout: 10_000 })
    await expect(banner).toContainText(targetId)

    // Remove filter button works on mobile
    const removeBtn = catalogPage.removeFilterButton()
    await expect(removeBtn).toBeVisible()
    await removeBtn.click()

    await expect
      .poll(() => new URL(page.url()).searchParams.has('animation'), { timeout: 5_000 })
      .toBe(false)
    await expect(banner).toHaveCount(0)

    // All cards visible after removing filter
    await catalogPage.waitForCards()
    expect(await catalogPage.allCards().count()).toBeGreaterThan(1)
  })

  test('browser back from filtered URL returns to previous unfiltered state', async ({
    catalogPage,
    page,
  }) => {
    // Navigate to an unfiltered group first
    await catalogPage.gotoGroup('text-effects-framer')
    const unfilteredPath = catalogPage.currentPathname()
    const unfilteredCardCount = await catalogPage.allCards().count()

    // Navigate to a filtered URL
    const targetId = 'text-effects__character-reveal'
    await page.goto(`/text-effects-framer?animation=${encodeURIComponent(targetId)}`)
    await catalogPage.waitForShell()
    await expect(catalogPage.filterBanner()).toBeVisible({ timeout: 10_000 })

    // Go back — should return to unfiltered state
    await page.goBack()
    await expect.poll(() => catalogPage.currentPathname(), { timeout: 10_000 }).toBe(unfilteredPath)

    // Filter should be gone
    expect(new URL(page.url()).searchParams.has('animation')).toBe(false)
    await catalogPage.waitForCards()
    const cardCountAfterBack = await catalogPage.allCards().count()
    expect(cardCountAfterBack).toBe(unfilteredCardCount)
  })
})
