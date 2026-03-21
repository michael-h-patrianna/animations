import { test, expect } from './fixtures/catalog.fixture'

test.describe('Sidebar Navigation', () => {
  test.beforeEach(async ({ catalogPage }) => {
    await catalogPage.goto()
    await catalogPage.waitForCards()
  })

  test('clicking a group link updates the route and main content', async ({ catalogPage }) => {
    const groupLinks = catalogPage.allGroupLinks()
    expect(await groupLinks.count()).toBeGreaterThan(1)

    const target = groupLinks.nth(1)
    const targetLabel = (await target.innerText()).trim()
    const before = catalogPage.currentPathname()

    await target.click()
    await catalogPage.waitForPathnameChange(before)

    // Group link is now active
    await expect(target).toHaveAttribute('data-active', 'true')

    // Main content shows the correct group
    const groupId = catalogPage.currentPathname().slice(1)
    await expect(catalogPage.groupSection(groupId)).toBeVisible()
    await expect(catalogPage.groupTitle()).toContainText(targetLabel)
  })

  test('expanding a different category and clicking its group navigates there', async ({
    catalogPage,
  }) => {
    const sections = catalogPage.sidebarSections()
    const sectionCount = await sections.count()
    expect(sectionCount).toBeGreaterThan(1)

    // Find a section that is NOT active
    let targetSection: import('@playwright/test').Locator | null = null
    for (let i = 0; i < sectionCount; i++) {
      const section = sections.nth(i)
      const categoryBtn = section.locator('[data-testid^="sidebar-category-"]')
      const isActive = await categoryBtn.getAttribute('data-active')
      if (!isActive) {
        targetSection = section
        break
      }
    }

    expect(targetSection).not.toBeNull()
    if (!targetSection) return

    // Click first group link in non-active section
    const groupLinks = catalogPage.groupLinksInSection(targetSection)
    const groupCount = await groupLinks.count()
    expect(groupCount).toBeGreaterThan(0)

    const before = catalogPage.currentPathname()
    await groupLinks.first().click()
    await catalogPage.waitForPathnameChange(before)

    // Category should now be active
    await expect(targetSection.locator('[data-testid^="sidebar-category-"]')).toHaveAttribute(
      'data-active',
      'true'
    )
  })

  test('active sidebar link text matches group title in main content', async ({ catalogPage }) => {
    const groupLinks = catalogPage.allGroupLinks()
    const count = await groupLinks.count()
    expect(count).toBeGreaterThan(2)

    // Navigate to 3 different groups and verify title matches
    let checkedCount = 0
    for (let i = 0; i < count && checkedCount < 3; i++) {
      const link = groupLinks.nth(i)
      const isActive = await link.getAttribute('data-active')

      // Skip already-active links (first one on initial load)
      if (isActive) continue

      const linkText = (await link.innerText()).trim()
      const before = catalogPage.currentPathname()

      await link.click()
      await catalogPage.waitForPathnameChange(before)
      await catalogPage.waitForCards()

      // Active link should be marked
      await expect(link).toHaveAttribute('data-active', 'true')

      // Group title in main content should contain the link text
      // (wait for AnimatePresence transition to complete)
      await expect
        .poll(
          async () => {
            const title = await catalogPage.groupTitle().textContent()
            return title?.trim().toLowerCase() ?? ''
          },
          { timeout: 5_000 }
        )
        .toContain(linkText.toLowerCase())

      checkedCount++
    }

    expect(checkedCount).toBe(3)
  })

  test('category collapse/expand toggles group visibility', async ({ catalogPage }) => {
    const sections = catalogPage.sidebarSections()
    const firstSection = sections.first()
    const categoryBtn = firstSection.locator('[data-testid^="sidebar-category-"]')

    // Categories are expanded by default (aria-expanded=true)
    await expect(categoryBtn).toHaveAttribute('aria-expanded', 'true')

    const groupsBefore = await catalogPage.groupLinksInSection(firstSection).count()
    expect(groupsBefore).toBeGreaterThan(0)

    // Click to collapse
    await categoryBtn.click()
    await expect(categoryBtn).toHaveAttribute('aria-expanded', 'false')

    // Group links should be hidden after collapse (subnav removed from DOM)
    const subnav = firstSection.locator('[data-testid^="sidebar-subnav-"]')
    await expect(subnav).toHaveCount(0)

    // Click to expand again
    await categoryBtn.click()
    await expect(categoryBtn).toHaveAttribute('aria-expanded', 'true')
    expect(await catalogPage.groupLinksInSection(firstSection).count()).toBe(groupsBefore)
  })
})
