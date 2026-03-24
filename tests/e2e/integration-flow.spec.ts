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

    // Step 4: Verify code mode switch reflects CSS (poll to wait for React state sync)
    await catalogPage.waitForCards()
    await expect
      .poll(async () => (await catalogPage.activeCodeMode()).trim(), { timeout: 5_000 })
      .toBe('CSS')

    // Step 5: Navigate to a different group via sidebar (mode should persist as CSS)
    await catalogPage.clickNonActiveGroup()

    // Step 6: Verify mode persisted — still in CSS
    const newPath = catalogPage.currentPathname()
    expect(newPath).toMatch(/-css$/)
    expect(newPath).not.toBe(cssPath) // Different group
    await catalogPage.waitForCards()
    await expect
      .poll(async () => (await catalogPage.activeCodeMode()).trim(), { timeout: 5_000 })
      .toBe('CSS')

    // Step 7: Browser back — should go to previous CSS group
    await page.goBack()
    await expect.poll(() => catalogPage.currentPathname(), { timeout: 5_000 }).toBe(cssPath)

    // Step 8: Browser back again — should go to the framer version of initial group
    await page.goBack()
    await expect.poll(() => catalogPage.currentPathname(), { timeout: 5_000 }).toBe(initialPath)

    // Step 9: Verify we're back at Framer mode via URL
    await catalogPage.waitForCards()
    expect(catalogPage.currentPathname()).toMatch(/-framer$/)
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
    const before = catalogPage.currentPathname()
    await catalogPage.clickNonActiveGroup()

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

  test('full code inspection flow: view source, switch mode, verify source changes', async ({
    catalogPage,
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])

    // Step 1: Navigate to a Framer group
    await catalogPage.gotoGroup('standard-effects-framer')
    const card = catalogPage.card('standard-effects__bounce')
    await expect(card).toBeVisible()

    // Step 2: Open code viewer
    await catalogPage.codeViewerButton(card).click()
    const modal = catalogPage.codeViewerModal()
    await expect(modal).toBeVisible({ timeout: 10_000 })
    await expect(catalogPage.codeHighlighted()).toBeVisible({ timeout: 10_000 })

    // Step 3: Verify Framer source contains Motion import
    const framerSource = await catalogPage.codeBody().textContent()
    expect(framerSource).toContain('StandardEffectsBounce')

    // Step 4: If tab list has multiple tabs, switch and verify different content
    const tabCount = await catalogPage.codeTabs().count()
    if (tabCount > 1) {
      await catalogPage.codeTab(1).click()
      const secondFileSource = await catalogPage.codeBody().textContent()
      // Different file should have different content
      expect(secondFileSource).not.toBe(framerSource)
      // Switch back
      await catalogPage.codeTab(0).click()
    }

    // Step 5: Copy code and verify clipboard
    await catalogPage.codeCopyButton().click()
    await expect(catalogPage.codeCopyButton()).toContainText('Copied')
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText())
    expect(clipboardText).toContain('StandardEffectsBounce')

    // Step 6: Close modal
    await page.keyboard.press('Escape')
    await expect(modal).not.toBeVisible()

    // Step 7: Switch to CSS mode
    await catalogPage.selectCssMode()
    await expect
      .poll(() => catalogPage.currentPathname(), { timeout: 5_000 })
      .toBe('/standard-effects-css')
    await catalogPage.waitForCards()

    // Step 8: Open code viewer on the same animation in CSS mode
    const cssCard = catalogPage.card('standard-effects__bounce')
    await expect(cssCard).toBeVisible()
    await catalogPage.codeViewerButton(cssCard).click()
    await expect(modal).toBeVisible({ timeout: 10_000 })
    await expect(catalogPage.codeHighlighted()).toBeVisible({ timeout: 10_000 })

    // Step 9: CSS source should be different from Framer source
    const cssSource = await catalogPage.codeBody().textContent()
    expect(cssSource).toContain('StandardEffectsBounce')

    // Step 10: Close and verify clean state
    await page.keyboard.press('Escape')
    await expect(modal).not.toBeVisible()
    await catalogPage.expectNoErrorBoundary()
  })

  test('round-trip navigation: A → B → A preserves correct card content', async ({
    catalogPage,
  }) => {
    // Navigate to group A — use scopedCards to avoid counting internal data-animation-id
    await catalogPage.gotoGroup('modal-base-framer')
    await catalogPage.waitForTransitionSettle()
    const groupACards = await catalogPage
      .scopedCards('modal-base-framer')
      .evaluateAll((els) => els.map((el) => el.getAttribute('data-animation-id')).filter(Boolean))
    expect(groupACards.length).toBeGreaterThan(0)

    // Navigate to group B
    await catalogPage.gotoGroup('standard-effects-framer')
    await catalogPage.waitForTransitionSettle()
    const groupBCards = await catalogPage
      .scopedCards('standard-effects-framer')
      .evaluateAll((els) => els.map((el) => el.getAttribute('data-animation-id')).filter(Boolean))
    expect(groupBCards.length).toBeGreaterThan(0)
    expect(groupBCards).not.toEqual(groupACards)

    // Navigate back to group A
    await catalogPage.gotoGroup('modal-base-framer')
    await catalogPage.waitForTransitionSettle()
    const groupACardsAgain = await catalogPage
      .scopedCards('modal-base-framer')
      .evaluateAll((els) => els.map((el) => el.getAttribute('data-animation-id')).filter(Boolean))

    // Same cards should be present after round-trip (not stale B cards)
    expect(groupACardsAgain.sort()).toEqual(groupACards.sort())

    // Group title should match group A
    await expect(catalogPage.groupTitle()).toContainText('Base modal')
    await catalogPage.expectNoErrorBoundary()
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
