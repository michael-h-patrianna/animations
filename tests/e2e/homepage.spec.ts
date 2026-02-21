import { expect, test, type Page } from '@playwright/test'

const desktopSidebar = (page: Page) => page.locator('.pf-main .pf-sidebar')

const currentPathname = (page: Page) => new URL(page.url()).pathname

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.pf-main .pf-sidebar', { timeout: 10000 })
  })

  test('loads shell and canonicalizes root route to a group route', async ({ page }) => {
    await expect(page).toHaveTitle(/Animation Showcase/)

    await expect.poll(() => currentPathname(page)).not.toBe('/')

    const sidebar = desktopSidebar(page)
    await expect(sidebar.locator('.pf-sidebar__link--category.pf-sidebar__link--active')).toHaveCount(1)

    const visibleGroupLinks = sidebar.locator('.pf-sidebar__link--group')
    expect(await visibleGroupLinks.count()).toBeGreaterThan(0)

    const groupId = currentPathname(page).slice(1)
    await expect(page.locator(`#group-${groupId}`)).toBeVisible()
  })

  test('renders animation cards with replay controls for the active group', async ({ page }) => {
    await page.waitForSelector('.pf-card[data-animation-id]', { timeout: 10000 })

    const cards = page.locator('.pf-card[data-animation-id]')
    expect(await cards.count()).toBeGreaterThan(0)

    const firstCard = cards.first()
    await expect(firstCard).toBeVisible()
    await expect(firstCard.locator('[data-role="replay"]')).toBeVisible()

    const groupId = currentPathname(page).slice(1)
    await expect(page.locator(`#group-${groupId}`)).toBeVisible()
  })

  test('clicking a sidebar group updates route and active group content', async ({ page }) => {
    const sidebar = desktopSidebar(page)
    const groupButtons = sidebar.locator('.pf-sidebar__link--group')

    expect(await groupButtons.count()).toBeGreaterThan(1)

    const targetGroup = groupButtons.nth(1)
    const targetLabel = (await targetGroup.innerText()).trim()
    const initialPath = currentPathname(page)

    await targetGroup.click()

    await expect.poll(() => currentPathname(page)).not.toBe(initialPath)

    const groupId = currentPathname(page).slice(1)
    await expect(page.locator(`#group-${groupId}`)).toBeVisible()
    await expect(page.locator('.pf-group__title')).toContainText(targetLabel)
    await expect(targetGroup).toHaveClass(/pf-sidebar__link--active/)
  })
})
