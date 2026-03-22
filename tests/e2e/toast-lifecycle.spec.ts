import { test, expect } from './fixtures/catalog.fixture'

/**
 * Toast notification lifecycle tests.
 *
 * The app shows self-dismissing toasts (role="status", aria-live="polite")
 * on actions like copy-link. These tests verify:
 * - Toast appears with correct content and accessibility attributes
 * - Toast auto-dismisses after its animation lifecycle (~3.5s)
 * - Rapid actions don't stack multiple toasts or corrupt state
 */
test.describe('Toast Notification Lifecycle', () => {
  test.beforeEach(async ({ catalogPage, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await catalogPage.gotoGroup('modal-base-framer')
  })

  test('copy-link shows toast with correct role and aria-live attributes', async ({
    catalogPage,
  }) => {
    const card = catalogPage.card('modal-base__scale-gentle-pop')
    await catalogPage.copyLinkButton(card).click()

    const toast = catalogPage.toast()
    await expect(toast).toBeVisible({ timeout: 3_000 })

    // Accessibility: toast must be announced by screen readers
    await expect(toast).toHaveAttribute('role', 'status')
    await expect(toast).toHaveAttribute('aria-live', 'polite')

    // Content matches expected message
    await expect(toast).toContainText('copied')
  })

  test('toast auto-dismisses without user interaction', async ({ catalogPage }) => {
    const card = catalogPage.card('modal-base__scale-gentle-pop')
    await catalogPage.copyLinkButton(card).click()

    const toast = catalogPage.toast()
    await expect(toast).toBeVisible({ timeout: 3_000 })

    // Toast should auto-dismiss after its visible + exit animation cycle
    // (VISIBLE_MS=2800 + EXIT_MS=320 + ENTRY_MS=420 ≈ 3540ms, with buffer)
    await expect(toast).toHaveCount(0, { timeout: 8_000 })
  })

  test('rapid copy-link clicks do not stack multiple toasts', async ({ catalogPage }) => {
    const card = catalogPage.card('modal-base__scale-gentle-pop')
    const copyBtn = catalogPage.copyLinkButton(card)

    // Click copy-link 3 times rapidly
    await copyBtn.click()
    await copyBtn.click()
    await copyBtn.click()

    // At most one toast should be visible at any time (useToast replaces, not stacks)
    const toastCount = await catalogPage.toast().count()
    expect(toastCount).toBeLessThanOrEqual(1)

    // The one visible toast should have correct attributes
    if (toastCount === 1) {
      await expect(catalogPage.toast()).toHaveAttribute('role', 'status')
    }
  })

  test('toast from one card does not persist after navigating to another group', async ({
    catalogPage,
  }) => {
    const card = catalogPage.card('modal-base__scale-gentle-pop')
    await catalogPage.copyLinkButton(card).click()

    await expect(catalogPage.toast()).toBeVisible({ timeout: 3_000 })

    // Navigate to a different group — toast is portaled to body, should unmount
    // with the card component that owns it
    const before = catalogPage.currentPathname()
    const groupLinks = catalogPage.allGroupLinks()
    for (let i = 0; i < (await groupLinks.count()); i++) {
      const isActive = await groupLinks.nth(i).getAttribute('data-active')
      if (!isActive) {
        await groupLinks.nth(i).click()
        break
      }
    }
    await catalogPage.waitForPathnameChange(before)
    await catalogPage.waitForCards()

    // Toast should be gone (component unmounted)
    await expect(catalogPage.toast()).toHaveCount(0, { timeout: 3_000 })
    await catalogPage.expectNoErrorBoundary()
  })

  test('clipboard contains correct animation URL after copy-link', async ({
    catalogPage,
    page,
  }) => {
    const card = catalogPage.card('modal-base__scale-gentle-pop')
    await catalogPage.copyLinkButton(card).click()

    await expect(catalogPage.toast()).toBeVisible({ timeout: 3_000 })

    // Verify clipboard content matches expected URL pattern
    const clipboardUrl = await page.evaluate(() => navigator.clipboard.readText())
    expect(clipboardUrl).toContain('/modal-base-framer')
    expect(clipboardUrl).toContain('animation=modal-base__scale-gentle-pop')

    // URL should be fully qualified (starts with http)
    expect(clipboardUrl).toMatch(/^https?:\/\//)
  })

  test('copy-link in CSS mode generates URL with -css suffix', async ({ catalogPage, page }) => {
    await catalogPage.gotoGroup('modal-base-css')

    const card = catalogPage.card('modal-base__scale-gentle-pop')
    await catalogPage.copyLinkButton(card).click()

    await expect(catalogPage.toast()).toBeVisible({ timeout: 3_000 })

    // Clipboard URL should contain the CSS route, not the Framer route
    const clipboardUrl = await page.evaluate(() => navigator.clipboard.readText())
    expect(clipboardUrl).toContain('/modal-base-css')
    expect(clipboardUrl).not.toContain('/modal-base-framer')
    expect(clipboardUrl).toContain('animation=modal-base__scale-gentle-pop')
    expect(clipboardUrl).toMatch(/^https?:\/\//)
  })

  test('copy-link on different cards produces correct URL per card', async ({
    catalogPage,
    page,
  }) => {
    const cards = catalogPage.scopedCards('modal-base-framer')
    const count = await cards.count()
    expect(count).toBeGreaterThan(1)

    // Copy link from first card
    const firstCard = cards.first()
    const firstId = await firstCard.getAttribute('data-animation-id')
    await catalogPage.copyLinkButton(firstCard).click()
    await expect(catalogPage.toast()).toBeVisible({ timeout: 3_000 })

    const firstUrl = await page.evaluate(() => navigator.clipboard.readText())
    expect(firstUrl).toContain(`animation=${firstId}`)

    // Wait for toast to dismiss before clicking second card
    await expect(catalogPage.toast()).toHaveCount(0, { timeout: 8_000 })

    // Copy link from second card — URL should differ
    const secondCard = cards.nth(1)
    const secondId = await secondCard.getAttribute('data-animation-id')
    await secondCard.scrollIntoViewIfNeeded()
    await catalogPage.copyLinkButton(secondCard).click()
    await expect(catalogPage.toast()).toBeVisible({ timeout: 3_000 })

    const secondUrl = await page.evaluate(() => navigator.clipboard.readText())
    expect(secondUrl).toContain(`animation=${secondId}`)
    expect(secondUrl).not.toBe(firstUrl)
  })

  test('copy-link works on mobile viewport with correct clipboard and toast', async ({
    catalogPage,
    mobilePage,
    page,
  }) => {
    await mobilePage.gotoMobile('modal-base-framer')

    const card = catalogPage.card('modal-base__scale-gentle-pop')
    await card.scrollIntoViewIfNeeded()

    const copyBtn = catalogPage.copyLinkButton(card)
    await expect(copyBtn).toBeVisible()
    await copyBtn.click()

    // Toast appears on mobile
    const toast = catalogPage.toast()
    await expect(toast).toBeVisible({ timeout: 3_000 })
    await expect(toast).toContainText('copied')

    // Clipboard contains valid URL
    const clipboardUrl = await page.evaluate(() => navigator.clipboard.readText())
    expect(clipboardUrl).toContain('/modal-base-framer')
    expect(clipboardUrl).toContain('animation=modal-base__scale-gentle-pop')
    expect(clipboardUrl).toMatch(/^https?:\/\//)
  })
})
