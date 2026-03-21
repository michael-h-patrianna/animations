import { test, expect } from './fixtures/catalog.fixture'

test.describe('Mobile Navigation', () => {
  test.beforeEach(async ({ mobilePage }) => {
    await mobilePage.gotoMobile('text-effects-framer')
  })

  test('shows mobile header with hamburger button', async ({ mobilePage, page }) => {
    await expect(mobilePage.header).toBeVisible()
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible()
  })

  test('hamburger opens drawer and close button closes it', async ({ mobilePage }) => {
    await mobilePage.expectDrawerClosed()

    await mobilePage.openDrawer()
    await mobilePage.expectDrawerOpen()

    await mobilePage.closeDrawer()
    await mobilePage.expectDrawerClosed()
  })

  test('selecting a group in drawer closes drawer and navigates', async ({ mobilePage, page }) => {
    await mobilePage.openDrawer()

    const groupLinks = mobilePage.drawerGroupLinks()
    expect(await groupLinks.count()).toBeGreaterThan(1)

    // Click the second group
    const label = await mobilePage.clickDrawerGroup(1)

    // Drawer should close
    await mobilePage.expectDrawerClosed()

    // Content should update
    const groupId = new URL(page.url()).pathname.slice(1)
    await expect(page.locator(`[data-testid="group-section-group-${groupId}"]`)).toBeVisible()
    await expect(page.locator('[data-testid="mobile-title"]')).toContainText(label)
  })

  test('Escape key closes the drawer', async ({ mobilePage, page }) => {
    await mobilePage.openDrawer()
    await mobilePage.expectDrawerOpen()

    await page.keyboard.press('Escape')
    await mobilePage.expectDrawerClosed()
  })

  test('clicking overlay closes the drawer', async ({ mobilePage }) => {
    await mobilePage.openDrawer()
    await mobilePage.expectDrawerOpen()

    await mobilePage.overlay.click({ force: true })
    await mobilePage.expectDrawerClosed()
  })

  test('opening drawer locks body scroll, closing restores it', async ({ mobilePage }) => {
    // Body scroll is not locked initially
    expect(await mobilePage.isScrollLocked()).toBe(false)

    await mobilePage.openDrawer()
    // Drawer open → body scroll locked
    expect(await mobilePage.isScrollLocked()).toBe(true)

    await mobilePage.closeDrawer()
    // Drawer closed → body scroll restored
    expect(await mobilePage.isScrollLocked()).toBe(false)
  })

  test('scroll lock releases after navigating via drawer group link', async ({ mobilePage }) => {
    await mobilePage.openDrawer()
    expect(await mobilePage.isScrollLocked()).toBe(true)

    // Navigate via group link (auto-closes drawer)
    await mobilePage.clickDrawerGroup(1)
    await mobilePage.expectDrawerClosed()

    // Scroll lock must be released after drawer auto-closes
    expect(await mobilePage.isScrollLocked()).toBe(false)
  })

  test('mobile drawer shows same group links as desktop sidebar', async ({
    catalogPage,
    mobilePage,
    page,
  }) => {
    // First, collect desktop sidebar group labels at normal viewport
    await catalogPage.gotoGroup('text-effects-framer')
    const desktopLinks = catalogPage.allGroupLinks()
    const desktopCount = await desktopLinks.count()
    const desktopLabels: string[] = []
    for (let i = 0; i < desktopCount; i++) {
      desktopLabels.push((await desktopLinks.nth(i).innerText()).trim())
    }
    expect(desktopLabels.length).toBeGreaterThan(5)

    // Switch to mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(mobilePage.header).toBeVisible({ timeout: 10_000 })

    // Open drawer and collect mobile group labels
    await mobilePage.openDrawer()
    const mobileLinks = mobilePage.drawerGroupLinks()
    const mobileCount = await mobileLinks.count()

    expect(mobileCount).toBe(desktopCount)

    for (let i = 0; i < mobileCount; i++) {
      const mobileLabel = (await mobileLinks.nth(i).innerText()).trim()
      expect(mobileLabel).toBe(desktopLabels[i])
    }
  })
})
