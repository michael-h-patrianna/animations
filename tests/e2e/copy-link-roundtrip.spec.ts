import { test, expect } from './fixtures/catalog.fixture'

/**
 * Copy-link round-trip tests: verify the full data flow from clicking
 * "copy link" to navigating to the copied URL and seeing the correct state.
 *
 * Bug this catches: copy-link generates a URL that doesn't actually work —
 * e.g., wrong group path, missing animation param, or URL that loads but
 * shows "not found" instead of the filtered animation.
 */
test.describe('Copy-Link Round Trip', () => {
  test.beforeEach(async ({ context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  })

  test('copied Framer URL loads the correct animation in filtered view', async ({
    catalogPage,
    page,
  }) => {
    await catalogPage.gotoGroup('modal-base-framer')

    const targetId = 'modal-base__scale-gentle-pop'
    const card = catalogPage.card(targetId)
    await catalogPage.copyLinkButton(card).click()
    await expect(catalogPage.toast()).toBeVisible({ timeout: 3_000 })

    const clipboardUrl = await page.evaluate(() => navigator.clipboard.readText())
    expect(clipboardUrl).toContain(`animation=${targetId}`)

    // Navigate to the copied URL (extract path + query from full URL)
    const parsed = new URL(clipboardUrl)
    await page.goto(`${parsed.pathname}${parsed.search}`)
    await catalogPage.waitForShell()

    // Filter banner should be visible showing the animation ID
    await expect(catalogPage.filterBanner()).toBeVisible({ timeout: 10_000 })
    await expect(catalogPage.filterBanner()).toContainText(targetId)

    // The filtered card should be visible
    await expect(catalogPage.card(targetId)).toBeVisible({ timeout: 10_000 })

    // URL confirms framer mode
    expect(new URL(page.url()).pathname).toMatch(/-framer$/)
  })

  test('copied CSS URL loads the CSS variant in filtered view', async ({ catalogPage, page }) => {
    await catalogPage.gotoGroup('standard-effects-css')

    const targetId = 'standard-effects__bounce'
    const card = catalogPage.card(targetId)
    await catalogPage.copyLinkButton(card).click()
    await expect(catalogPage.toast()).toBeVisible({ timeout: 3_000 })

    const clipboardUrl = await page.evaluate(() => navigator.clipboard.readText())
    expect(clipboardUrl).toContain('standard-effects-css')

    // Navigate to the copied URL
    const parsed = new URL(clipboardUrl)
    await page.goto(`${parsed.pathname}${parsed.search}`)
    await catalogPage.waitForShell()

    // Filter banner visible
    await expect(catalogPage.filterBanner()).toBeVisible({ timeout: 10_000 })

    // Card visible
    await expect(catalogPage.card(targetId)).toBeVisible({ timeout: 10_000 })

    // Code mode is CSS (URL suffix)
    expect(new URL(page.url()).pathname).toMatch(/-css$/)
  })

  test('copied URL works after page reload (simulates sharing link)', async ({
    catalogPage,
    page,
  }) => {
    await catalogPage.gotoGroup('text-effects-framer')

    const targetId = 'text-effects__character-reveal'
    const card = catalogPage.card(targetId)
    await catalogPage.copyLinkButton(card).click()
    await expect(catalogPage.toast()).toBeVisible({ timeout: 3_000 })

    const clipboardUrl = await page.evaluate(() => navigator.clipboard.readText())

    // Open the URL in a fresh navigation context (simulates pasting into browser)
    const parsed = new URL(clipboardUrl)
    await page.goto(`${parsed.pathname}${parsed.search}`)
    await catalogPage.waitForShell()

    // Reload to simulate a completely fresh load of the shared link
    await page.reload()
    await catalogPage.waitForShell()

    // The animation should still be filtered and visible after reload
    await expect(catalogPage.filterBanner()).toBeVisible({ timeout: 10_000 })
    await expect(catalogPage.card(targetId)).toBeVisible({ timeout: 10_000 })
    await catalogPage.expectNoErrorBoundary()
  })
})
