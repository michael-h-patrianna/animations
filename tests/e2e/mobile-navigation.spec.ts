import { test, expect } from './fixtures/catalog.fixture'

test.describe('Mobile Navigation', () => {
  test.beforeEach(async ({ mobilePage }) => {
    await mobilePage.gotoMobile('text-effects-framer')
  })

  test('shows top bar with panel toggle button at mobile viewport', async ({
    mobilePage,
    page,
  }) => {
    await expect(mobilePage.topBar).toBeVisible()
    await expect(page.locator('[data-testid="toggle-left-panel"]')).toBeVisible()
    await mobilePage.expectDrawerClosed()
  })

  test('panel toggle opens and closes the mobile navigation panel', async ({ mobilePage }) => {
    await mobilePage.expectDrawerClosed()

    await mobilePage.openDrawer()
    await mobilePage.expectDrawerOpen()

    await mobilePage.closeDrawer()
    await mobilePage.expectDrawerClosed()
  })

  test('selecting a group in the mobile navigation panel updates the route', async ({
    mobilePage,
    page,
  }) => {
    await mobilePage.openDrawer()

    const groupLinks = mobilePage.drawerGroupLinks()
    expect(await groupLinks.count()).toBeGreaterThan(1)

    // Click the second group
    await mobilePage.clickDrawerGroup(1)

    // Content should update — group section for the new route is visible
    const groupId = new URL(page.url()).pathname.slice(1)
    await expect(page.locator(`[data-testid="group-section-group-${groupId}"]`)).toBeVisible()

    // The responsive nav panel remains available until explicitly toggled closed.
    await mobilePage.expectDrawerOpen()
  })

  test('Escape key does not corrupt the mobile navigation panel state', async ({
    mobilePage,
    page,
  }) => {
    await mobilePage.openDrawer()
    await mobilePage.expectDrawerOpen()

    await page.keyboard.press('Escape')
    await mobilePage.expectDrawerOpen()

    await mobilePage.closeDrawer()
    await mobilePage.expectDrawerClosed()
  })

  test('mobile navigation panel contains group links and code mode switch', async ({
    mobilePage,
  }) => {
    await mobilePage.openDrawer()
    await mobilePage.expectDrawerOpen()

    await expect(mobilePage.drawerCodeModeSwitch()).toBeVisible()
    expect(await mobilePage.drawerGroupLinks().count()).toBeGreaterThan(5)
  })

  test('mobile drawer shows same group links as desktop sidebar', async ({
    catalogPage,
    mobilePage,
  }) => {
    // Collect desktop sidebar group labels at normal viewport
    await catalogPage.gotoGroup('text-effects-framer')
    await catalogPage.ensureSidebarOpen()
    const desktopLinks = catalogPage.allGroupLinks()
    const desktopCount = await desktopLinks.count()
    const desktopLabels: string[] = []
    for (let i = 0; i < desktopCount; i++) {
      desktopLabels.push((await desktopLinks.nth(i).innerText()).trim())
    }
    expect(desktopLabels.length).toBeGreaterThan(5)

    // Navigate fresh at mobile viewport (avoids viewport-resize mid-test issues)
    await mobilePage.gotoMobile('text-effects-framer')

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

  test('mobile panel toggle button closes the nav after selecting a group', async ({
    mobilePage,
    page,
  }) => {
    await mobilePage.openDrawer()
    await mobilePage.clickDrawerGroup(1)

    const currentPath = new URL(page.url()).pathname
    expect(currentPath).toMatch(/^\/.+-(framer|css)$/)

    await mobilePage.closeDrawer()
    await mobilePage.expectDrawerClosed()
  })
})
