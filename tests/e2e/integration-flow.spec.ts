import { test, expect } from './fixtures/catalog.fixture'

/**
 * Multi-step integration flows testing state consistency across
 * navigation, mode switching, replay, and browser history.
 *
 * These catch bugs that individual feature tests miss — race conditions
 * between navigation and mode switching, stale state after back-navigation,
 * and state corruption during compound interactions.
 */
test.describe('Integration: Full User Journey', () => {
  test('navigate → switch mode → navigate → back → verify state', async ({ catalogPage, page }) => {
    // Step 1: Load app, land on default group
    await catalogPage.goto()
    await catalogPage.waitForCards()
    const initialPath = catalogPage.currentPathname()
    expect(initialPath).toMatch(/-framer$/)

    // Step 2: Verify Framer mode is active
    const initialMode = await catalogPage.activeCodeMode()
    expect(initialMode.trim()).toBe('Framer')

    // Step 3: Switch to CSS mode — URL should update
    await catalogPage.selectCssMode()
    await expect.poll(() => catalogPage.currentPathname(), { timeout: 5_000 }).toMatch(/-css$/)
    const cssPath = catalogPage.currentPathname()

    // Step 4: Verify card tags now show CSS
    await catalogPage.waitForCards()
    const firstCard = catalogPage.allCards().first()
    await expect(catalogPage.cardMeta(firstCard)).toContainText('CSS')

    // Step 5: Navigate to a different group via sidebar (mode should persist as CSS)
    const groupLinks = catalogPage.allGroupLinks()
    const count = await groupLinks.count()
    expect(count).toBeGreaterThan(1)

    // Find and click a non-active group
    for (let i = 0; i < count; i++) {
      const link = groupLinks.nth(i)
      const isActive = await link.getAttribute('data-active')
      if (!isActive) {
        await link.click()
        break
      }
    }
    await catalogPage.waitForPathnameChange(cssPath)

    // Step 6: Verify mode persisted — still in CSS
    const newPath = catalogPage.currentPathname()
    expect(newPath).toMatch(/-css$/)
    expect(newPath).not.toBe(cssPath) // Different group
    await catalogPage.waitForCards()
    await expect(catalogPage.cardMeta(catalogPage.allCards().first())).toContainText('CSS')

    // Step 7: Browser back — should go to previous CSS group
    await page.goBack()
    await expect.poll(() => catalogPage.currentPathname(), { timeout: 5_000 }).toBe(cssPath)

    // Step 8: Browser back again — should go to the framer version of initial group
    await page.goBack()
    await expect.poll(() => catalogPage.currentPathname(), { timeout: 5_000 }).toBe(initialPath)

    // Step 9: Verify we're back at Framer mode with correct cards
    await catalogPage.waitForCards()
    await expect(catalogPage.cardMeta(catalogPage.allCards().first())).toContainText('FRAMER')
  })

  test('replay animation, navigate away, come back — animation still works', async ({
    catalogPage,
    page,
  }) => {
    // Navigate to a group with a known animation
    await catalogPage.gotoGroup('standard-effects-framer')

    const card = catalogPage.card('standard-effects__bounce')
    await expect(card).toBeVisible()

    // Replay the animation
    const replay = catalogPage.replayButton(card)
    await expect(replay).toBeEnabled()
    await replay.click()

    // Verify animation content exists after replay
    const stage = await catalogPage.cardStage(card)
    await expect(stage).toBeVisible()
    await expect.poll(async () => stage.locator(':scope > *').count()).toBeGreaterThan(0)

    // Navigate to a different group
    const groupLinks = catalogPage.allGroupLinks()
    const before = catalogPage.currentPathname()
    for (let i = 0; i < (await groupLinks.count()); i++) {
      const isActive = await groupLinks.nth(i).getAttribute('data-active')
      if (!isActive) {
        await groupLinks.nth(i).click()
        break
      }
    }
    await catalogPage.waitForPathnameChange(before)

    // Navigate back
    await page.goBack()
    await expect.poll(() => catalogPage.currentPathname(), { timeout: 5_000 }).toBe(before)
    await catalogPage.waitForCards()

    // Animation card is still functional — can replay again
    const cardAfterBack = catalogPage.card('standard-effects__bounce')
    await expect(cardAfterBack).toBeVisible()
    const replayAfterBack = catalogPage.replayButton(cardAfterBack)
    await expect(replayAfterBack).toBeEnabled()
    await replayAfterBack.click()

    const stageAfterBack = await catalogPage.cardStage(cardAfterBack)
    await expect.poll(async () => stageAfterBack.locator(':scope > *').count()).toBeGreaterThan(0)
  })

  test('mode switch during navigation does not corrupt state', async ({ catalogPage }) => {
    await catalogPage.gotoGroup('text-effects-framer')

    // Rapid: switch mode + click group link almost simultaneously
    const groupLinks = catalogPage.allGroupLinks()
    const count = await groupLinks.count()
    expect(count).toBeGreaterThan(2)

    // Switch to CSS
    await catalogPage.selectCssMode()
    // Immediately click a different group before CSS navigation completes
    await groupLinks.nth(2).click()

    // Wait for UI to settle — should end on a valid page
    await catalogPage.waitForCards()

    const finalPath = catalogPage.currentPathname()
    // Path should end with -css or -framer (not be empty or broken)
    expect(finalPath).toMatch(/-(css|framer)$/)

    // Page should have no error boundary
    await catalogPage.expectNoErrorBoundary()

    // Cards should be visible
    const cardCount = await catalogPage.allCards().count()
    expect(cardCount).toBeGreaterThan(0)
  })
})
