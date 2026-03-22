import { test, expect } from './fixtures/catalog.fixture'

/**
 * Metadata URL slug validation: verifies that urlSlugFramer and urlSlugCss
 * values in animation metadata produce working navigation URLs.
 *
 * Bug this catches: metadata declares a urlSlugFramer or urlSlugCss that
 * doesn't match any actual route, so deep-links from external sources
 * (documentation, marketing) lead to 404/redirect-to-default behavior.
 *
 * This test uses the copy-link button which generates URLs from metadata,
 * then navigates to those URLs and verifies they resolve correctly.
 */
test.describe('Metadata URL Slugs', () => {
  test('copy-link URLs for multiple animations across groups all resolve correctly', async ({
    catalogPage,
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])

    // Test cards across different categories to catch routing issues in diverse groups
    const testCases = [
      { group: 'modal-base-framer', animId: 'modal-base__scale-gentle-pop' },
      { group: 'text-effects-framer', animId: 'text-effects__character-reveal' },
      { group: 'standard-effects-framer', animId: 'standard-effects__bounce' },
      { group: 'progress-bars-framer', animId: 'progress-bars__timeline-progress' },
      { group: 'button-effects-framer', animId: 'button-effects__jitter' },
    ]

    for (const { group, animId } of testCases) {
      await catalogPage.gotoGroup(group)

      const card = catalogPage.card(animId)
      await card.scrollIntoViewIfNeeded()
      await catalogPage.copyLinkButton(card).click()
      await expect(catalogPage.toast()).toBeVisible({ timeout: 3_000 })

      const clipboardUrl = await page.evaluate(() => navigator.clipboard.readText())
      const parsed = new URL(clipboardUrl)

      // Navigate to the generated URL
      await page.goto(`${parsed.pathname}${parsed.search}`)
      await catalogPage.waitForShell()

      // Must not redirect to default group (URL must be preserved)
      expect(new URL(page.url()).pathname).toBe(parsed.pathname)

      // The targeted animation must be visible
      await expect(catalogPage.card(animId)).toBeVisible({ timeout: 10_000 })

      // No error boundary
      await catalogPage.expectNoErrorBoundary()

      // Wait for toast to dismiss before next iteration
      await expect(catalogPage.toast()).toHaveCount(0, { timeout: 8_000 })
    }
  })
})
