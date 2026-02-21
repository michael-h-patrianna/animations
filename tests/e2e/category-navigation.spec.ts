import { expect, test, type Page } from '@playwright/test'

const desktopSidebar = (page: Page) => page.locator('.pf-main .pf-sidebar')

test.describe('Category Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.pf-main .pf-sidebar', { timeout: 10000 })
  })

  test('loads with one active category and one visible group section', async ({ page }) => {
    const sidebar = desktopSidebar(page)
    await expect(sidebar.locator('.pf-sidebar__link--category').first()).toBeVisible()
    await expect(sidebar.locator('.pf-sidebar__link--category.pf-sidebar__link--active')).toHaveCount(1)
    await expect(page.locator('.pf-group')).toHaveCount(1)

    const currentPath = new URL(page.url()).pathname
    expect(currentPath).not.toBe('/')
    await expect(page.locator(`#group-${currentPath.slice(1)}`)).toBeVisible()
  })

  test('switches active category and updates route to that category context', async ({ page }) => {
    const sidebar = desktopSidebar(page)
    const categoryButtons = sidebar.locator('.pf-sidebar__link--category')
    const categoryCount = await categoryButtons.count()
    expect(categoryCount).toBeGreaterThan(1)

    const initialPath = new URL(page.url()).pathname
    await categoryButtons.nth(1).click()

    await expect.poll(() => new URL(page.url()).pathname).not.toBe(initialPath)
    await expect(sidebar.locator('.pf-sidebar__link--category.pf-sidebar__link--active')).toHaveCount(1)
    await expect(categoryButtons.nth(1)).toHaveClass(/pf-sidebar__link--active/)
  })

  test('renders group links only for the active category section', async ({ page }) => {
    const sidebar = desktopSidebar(page)
    const sections = sidebar.locator('.pf-sidebar__section')
    const sectionCount = await sections.count()
    expect(sectionCount).toBeGreaterThan(0)

    for (let index = 0; index < sectionCount; index += 1) {
      const section = sections.nth(index)
      const isActive = await section
        .locator('.pf-sidebar__link--category')
        .evaluate((el) => el.classList.contains('pf-sidebar__link--active'))
      const groupCount = await section.locator('.pf-sidebar__link--group').count()

      if (isActive) {
        expect(groupCount).toBeGreaterThan(0)
      } else {
        expect(groupCount).toBe(0)
      }
    }
  })

  test('clicking a visible group updates route and active group state', async ({ page }) => {
    const sidebar = desktopSidebar(page)
    const activeSection = sidebar
      .locator('.pf-sidebar__section')
      .filter({ has: sidebar.locator('.pf-sidebar__link--category.pf-sidebar__link--active') })
      .first()
    const groupButtons = activeSection.locator('.pf-sidebar__link--group')

    const groupCount = await groupButtons.count()
    expect(groupCount).toBeGreaterThan(1)

    const targetGroup = groupButtons.nth(1)
    const targetLabel = (await targetGroup.innerText()).trim()
    const initialPath = new URL(page.url()).pathname

    await targetGroup.click()

    await expect.poll(() => new URL(page.url()).pathname).not.toBe(initialPath)
    await expect(targetGroup).toHaveClass(/pf-sidebar__link--active/)
    await expect(page.locator('.pf-group__title')).toContainText(targetLabel)
  })
})
