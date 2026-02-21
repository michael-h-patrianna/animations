import { expect, test, type Page } from '@playwright/test'

const desktopSidebar = (page: Page) => page.locator('.pf-main .pf-sidebar')

const activeSidebarSection = (page: Page) =>
  desktopSidebar(page)
    .locator('.pf-sidebar__section')
    .filter({ has: desktopSidebar(page).locator('.pf-sidebar__link--category.pf-sidebar__link--active') })
    .first()

test.describe('Metadata System - Desktop Sidebar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.pf-main .pf-sidebar', { timeout: 10000 })
  })

  test('displays expected categories in desktop sidebar', async ({ page }) => {
    const sidebar = desktopSidebar(page)
    await expect(sidebar.locator('.pf-sidebar__link--category:has-text("Base effects")')).toBeVisible()
    await expect(
      sidebar.locator('.pf-sidebar__link--category:has-text("Dialog & Modal Animations")')
    ).toBeVisible()
    await expect(
      sidebar.locator('.pf-sidebar__link--category:has-text("Progress & Loading Animations")')
    ).toBeVisible()
    await expect(
      sidebar.locator('.pf-sidebar__link--category:has-text("Real-time Updates & Timers")')
    ).toBeVisible()
    await expect(
      sidebar.locator('.pf-sidebar__link--category:has-text("Game Elements & Rewards")')
    ).toBeVisible()
  })

  test('shows group links only for the active category section', async ({ page }) => {
    const sections = desktopSidebar(page).locator('.pf-sidebar__section')
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

})

test.describe('Metadata System - Desktop Routing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.pf-main .pf-sidebar', { timeout: 10000 })
  })

  test('clicking category switches active category and updates route', async ({ page }) => {
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

  test('clicking visible group updates route and group header', async ({ page }) => {
    const section = activeSidebarSection(page)
    const groupButtons = section.locator('.pf-sidebar__link--group')
    const groupCount = await groupButtons.count()
    expect(groupCount).toBeGreaterThan(1)

    const targetGroup = groupButtons.nth(1)
    const targetLabel = (await targetGroup.innerText()).trim()
    const initialPath = new URL(page.url()).pathname

    await targetGroup.click()

    await expect.poll(() => new URL(page.url()).pathname).not.toBe(initialPath)
    await expect(targetGroup).toHaveClass(/pf-sidebar__link--active/)

    const groupId = new URL(page.url()).pathname.slice(1)
    await expect(page.locator(`#group-${groupId}`)).toBeVisible()
    await expect(page.locator('.pf-group__title')).toContainText(targetLabel)
  })
})

test.describe('Metadata System - Desktop Cards', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/text-effects-framer')
    await page.waitForSelector('.pf-card[data-animation-id]', { timeout: 10000 })
  })

  test('metadata-driven replay state and tags are rendered', async ({ page }) => {
    await page.goto('/button-effects-framer')
    await page.waitForSelector('.pf-card[data-animation-id]', { timeout: 10000 })

    const rippleCard = page.locator('[data-animation-id="button-effects__ripple"]')
    await expect(rippleCard).toBeVisible()
    await expect(rippleCard.locator('[data-role="replay"]')).toBeDisabled()

    await page.goto('/text-effects-framer')
    await page.waitForSelector('.pf-card[data-animation-id]', { timeout: 10000 })

    const textCard = page.locator('[data-animation-id="text-effects__character-reveal"]')
    await expect(textCard).toBeVisible()
    await expect(textCard.locator('[data-role="replay"]')).toBeEnabled()
    await expect(textCard.locator('.pf-card__meta')).toContainText('FRAMER')
  })

  test('description toggle expands and collapses card description', async ({ page }) => {
    const card = page.locator('[data-animation-id="text-effects__character-reveal"]')
    const description = card.locator('.pf-card__description')
    const toggle = card.locator('button[aria-label*="description"]')

    await expect(description).toHaveClass(/line-clamp-1/)
    await toggle.click()
    await expect(description).not.toHaveClass(/line-clamp-1/)
    await toggle.click()
    await expect(description).toHaveClass(/line-clamp-1/)
  })

  test('animation cards have unique data-animation-id values on current page', async ({ page }) => {
    const ids = await page.locator('.pf-card[data-animation-id]').evaluateAll((cards) => {
      return cards
        .map((card) => card.getAttribute('data-animation-id'))
        .filter((id): id is string => typeof id === 'string' && id.length > 0)
    })

    expect(ids.length).toBeGreaterThan(0)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

test.describe('Metadata System - Mobile Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/text-effects-framer')
    await page.waitForSelector('.pf-mobile-header', { timeout: 10000 })
  })

  test('displays mobile header and open-menu control', async ({ page }) => {
    await expect(page.locator('.pf-mobile-header')).toBeVisible()
    await expect(page.locator('.pf-hamburger[aria-label="Open menu"]')).toBeVisible()
  })

  test('hamburger opens drawer and close button closes it', async ({ page }) => {
    const drawer = page.locator('#pf-sidebar-drawer')
    await expect(drawer).toHaveAttribute('aria-hidden', 'true')

    await page.locator('.pf-hamburger[aria-label="Open menu"]').click()
    await expect(drawer).toHaveAttribute('aria-hidden', 'false')
    await expect(drawer).toHaveClass(/is-open/)

    await page.locator('.pf-hamburger[aria-label="Close menu"]').click()
    await expect(drawer).toHaveAttribute('aria-hidden', 'true')
  })

  test('drawer group selection closes drawer and navigates to that group', async ({ page }) => {
    const drawer = page.locator('#pf-sidebar-drawer')
    await page.locator('.pf-hamburger[aria-label="Open menu"]').click()
    await expect(drawer).toHaveAttribute('aria-hidden', 'false')

    const groups = drawer.locator('.pf-sidebar__link--group')
    const groupCount = await groups.count()
    expect(groupCount).toBeGreaterThan(1)

    const target = groups.nth(1)
    const targetLabel = (await target.innerText()).trim()
    await target.click()

    await expect(drawer).toHaveAttribute('aria-hidden', 'true')
    const groupId = new URL(page.url()).pathname.slice(1)
    await expect(page.locator(`#group-${groupId}`)).toBeVisible()
    await expect(page.locator('.pf-group__title')).toContainText(targetLabel)
  })

  test('escape key and overlay close the drawer', async ({ page }) => {
    const drawer = page.locator('#pf-sidebar-drawer')

    await page.locator('.pf-hamburger[aria-label="Open menu"]').click()
    await expect(drawer).toHaveAttribute('aria-hidden', 'false')
    await page.keyboard.press('Escape')
    await expect(drawer).toHaveAttribute('aria-hidden', 'true')

    await page.locator('.pf-hamburger[aria-label="Open menu"]').click()
    await expect(drawer).toHaveAttribute('aria-hidden', 'false')
    await page.locator('.pf-drawer__overlay').click()
    await expect(drawer).toHaveAttribute('aria-hidden', 'true')
  })
})
