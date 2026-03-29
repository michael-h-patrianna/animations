import { test, expect } from './fixtures/catalog.fixture'

/**
 * Tests code mode switching via the mobile drawer. The mobile drawer has its own
 * CodeModeSwitch instance — mode changes there must propagate to URL and card content.
 */
test.describe('Mobile Code Mode Switching', () => {
  test('switching to CSS mode in mobile nav updates URL and cards', async ({
    catalogPage,
    mobilePage,
    page,
  }) => {
    await mobilePage.gotoMobile('text-effects-framer')

    // Open drawer and switch to CSS
    await mobilePage.openDrawer()

    // Verify starting in Framer mode
    const initialMode = await mobilePage.activeCodeMode()
    expect(initialMode.trim()).toBe('Framer')

    await mobilePage.selectCssMode()

    // URL should change to -css
    await expect
      .poll(() => new URL(page.url()).pathname, { timeout: 5_000 })
      .toBe('/text-effects-css')

    // Close drawer and verify CSS mode is active via URL
    await mobilePage.closeDrawer()
    await expect(catalogPage.allCards().first()).toBeVisible({ timeout: 5_000 })
    expect(new URL(page.url()).pathname).toMatch(/-css$/)
  })

  test('mode persists when navigating via mobile nav group links', async ({ mobilePage, page }) => {
    await mobilePage.gotoMobile('text-effects-framer')

    // Switch to CSS mode
    await mobilePage.openDrawer()
    await mobilePage.selectCssMode()
    await expect.poll(() => new URL(page.url()).pathname, { timeout: 5_000 }).toMatch(/-css$/)

    // Navigate to a different group while the mobile nav is open
    await mobilePage.clickDrawerGroup(1)
    await mobilePage.expectDrawerOpen()

    // New group should also be in CSS mode
    const pathname = new URL(page.url()).pathname
    expect(pathname).toMatch(/-css$/)

    await mobilePage.closeDrawer()
    await mobilePage.expectDrawerClosed()
  })

  test('switching back to Framer mode in mobile nav restores framer URL', async ({
    catalogPage,
    mobilePage,
    page,
  }) => {
    await mobilePage.gotoMobile('text-effects-css')

    await mobilePage.openDrawer()
    await mobilePage.selectFramerMode()

    await expect
      .poll(() => new URL(page.url()).pathname, { timeout: 5_000 })
      .toBe('/text-effects-framer')

    // Verify Framer mode is active via URL
    await mobilePage.closeDrawer()
    await expect(catalogPage.allCards().first()).toBeVisible({ timeout: 5_000 })
    expect(new URL(page.url()).pathname).toMatch(/-framer$/)
  })

  test('code viewer modal works on mobile viewport', async ({ catalogPage, mobilePage }) => {
    await mobilePage.gotoMobile('modal-base-framer')

    const card = catalogPage.card('modal-base__scale-gentle-pop')
    await expect(card).toBeVisible({ timeout: 10_000 })

    await catalogPage.codeViewerButton(card).click()

    const modal = catalogPage.codeViewerModal()
    await expect(modal).toBeVisible({ timeout: 10_000 })

    // Native <dialog> is open
    await expect(modal).toHaveAttribute('open', '')

    // Syntax-highlighted code is visible
    await expect(catalogPage.codeHighlighted()).toBeVisible({ timeout: 10_000 })

    // Code body contains the component name
    const bodyText = await catalogPage.codeBody().textContent()
    expect(bodyText).toContain('ModalBaseScaleGentlePop')

    // Close via close button
    await catalogPage.codeCloseButton().click()
    await expect(modal).not.toBeVisible()

    // Page is still functional after closing
    await expect(card).toBeVisible()
  })

  test('mobile mode switch updates the code artifact for the same animation', async ({
    catalogPage,
    mobilePage,
    page,
  }) => {
    const animationId = 'standard-effects__bounce'

    await mobilePage.gotoMobile(`standard-effects-framer?animation=${animationId}`)

    const framerCard = catalogPage.card(animationId)
    await expect(framerCard).toBeVisible({ timeout: 10_000 })

    await catalogPage.codeViewerButton(framerCard).click()
    await expect(catalogPage.codeViewerModal()).toBeVisible()
    await expect(catalogPage.codeHighlighted()).toBeVisible()

    const framerCode = await catalogPage.codeBody().innerText()
    expect(framerCode).toContain("from 'motion/react-m'")
    expect(framerCode).not.toContain("import './StandardEffectsBounce.css'")

    await catalogPage.codeCloseButton().click()
    await expect(catalogPage.codeViewerModal()).not.toBeVisible()

    await mobilePage.openDrawer()
    await mobilePage.selectCssMode()
    await expect.poll(() => new URL(page.url()).pathname, { timeout: 5_000 }).toMatch(/-css$/)
    await mobilePage.closeDrawer()

    const cssCard = catalogPage.card(animationId)
    await expect(cssCard).toBeVisible({ timeout: 10_000 })

    await catalogPage.codeViewerButton(cssCard).click()
    await expect(catalogPage.codeViewerModal()).toBeVisible()
    await expect(catalogPage.codeHighlighted()).toBeVisible()

    const cssCode = await catalogPage.codeBody().innerText()
    expect(cssCode).toContain("import styles from './StandardEffectsBounce.module.css'")
    expect(cssCode).not.toContain("from 'motion/react-m'")
  })

  test('code viewer copy works on mobile viewport', async ({
    catalogPage,
    mobilePage,
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await mobilePage.gotoMobile('standard-effects-framer')

    const card = catalogPage.card('standard-effects__bounce')
    await expect(card).toBeVisible({ timeout: 10_000 })

    await catalogPage.codeViewerButton(card).click()

    const modal = catalogPage.codeViewerModal()
    await expect(modal).toBeVisible({ timeout: 10_000 })
    await expect(catalogPage.codeHighlighted()).toBeVisible({ timeout: 10_000 })

    // Copy code
    const copyBtn = catalogPage.codeCopyButton()
    await copyBtn.click()
    await expect(copyBtn).toContainText('Copied')

    // Clipboard has valid source
    const clipboard = await page.evaluate(() => navigator.clipboard.readText())
    expect(clipboard).toContain('StandardEffectsBounce')

    // Close and verify no error state
    await page.keyboard.press('Escape')
    await expect(modal).not.toBeVisible()
  })
})
