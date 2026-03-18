import { test, expect } from './fixtures/catalog.fixture'

test.describe('Mobile Navigation', () => {
  test.beforeEach(async ({ mobilePage }) => {
    await mobilePage.gotoMobile('text-effects-framer')
  })

  test('shows mobile header with hamburger button', async ({ mobilePage, page }) => {
    await expect(mobilePage.header).toBeVisible()
    await expect(page.locator('.pf-hamburger[aria-label="Open menu"]')).toBeVisible()
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
    await expect(page.locator(`#group-${groupId}`)).toBeVisible()
    await expect(page.locator('.pf-group__title')).toContainText(label)
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
})
