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

    // Top bar title contains the group label (title format: "Group Title (count)")
    await expect(catalogPage.groupTitle()).toContainText(targetLabel)
  })

  test('clicking a group in a different category navigates there', async ({ catalogPage }) => {
    // Find the currently active group link's section
    const activeLink = catalogPage.activeGroupLink()
    await expect(activeLink).toHaveCount(1)

    // Identify which section contains the active group
    const sections = catalogPage.sidebarSections()
    const sectionCount = await sections.count()
    expect(sectionCount).toBeGreaterThan(1)

    let activeSectionIndex = -1
    for (let i = 0; i < sectionCount; i++) {
      const section = sections.nth(i)
      const activeInSection = section.locator('[data-testid^="sidebar-group-"][data-active]')
      if ((await activeInSection.count()) > 0) {
        activeSectionIndex = i
        break
      }
    }
    expect(activeSectionIndex).toBeGreaterThanOrEqual(0)

    // Click a group link in a DIFFERENT section
    const otherIndex = activeSectionIndex === 0 ? 1 : 0
    const otherSection = sections.nth(otherIndex)
    const otherGroups = catalogPage.groupLinksInSection(otherSection)
    expect(await otherGroups.count()).toBeGreaterThan(0)

    const before = catalogPage.currentPathname()
    await otherGroups.first().click()
    await catalogPage.waitForPathnameChange(before)

    // The clicked group should now be active
    await expect(otherGroups.first()).toHaveAttribute('data-active', 'true')

    // Only one group link should be active across the entire sidebar
    expect(await catalogPage.activeGroupLink().count()).toBe(1)
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

      // Top bar title contains the link text (format: "Group Title (count)")
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

  test('navigating between categories moves the active group link', async ({ catalogPage }) => {
    const sections = catalogPage.sidebarSections()
    const sectionCount = await sections.count()
    expect(sectionCount).toBeGreaterThan(1)

    // Find the section containing the currently active group
    let activeSectionIndex = -1
    for (let i = 0; i < sectionCount; i++) {
      const section = sections.nth(i)
      const activeInSection = section.locator('[data-testid^="sidebar-group-"][data-active]')
      if ((await activeInSection.count()) > 0) {
        activeSectionIndex = i
        break
      }
    }
    expect(activeSectionIndex).toBeGreaterThanOrEqual(0)

    // Click a group in a DIFFERENT category
    const otherIndex = activeSectionIndex === 0 ? 1 : 0
    const otherSection = sections.nth(otherIndex)
    const otherGroups = catalogPage.groupLinksInSection(otherSection)
    expect(await otherGroups.count()).toBeGreaterThan(0)

    const before = catalogPage.currentPathname()
    await otherGroups.first().click()
    await catalogPage.waitForPathnameChange(before)
    await catalogPage.waitForCards()

    // Wait for the active group link in the OTHER section to appear
    const newActive = otherSection.locator('[data-testid^="sidebar-group-"][data-active]')
    await expect.poll(async () => newActive.count(), { timeout: 5_000 }).toBe(1)

    // The old section should have no active group links
    const oldSection = sections.nth(activeSectionIndex)
    const oldActive = oldSection.locator('[data-testid^="sidebar-group-"][data-active]')
    await expect.poll(async () => oldActive.count(), { timeout: 5_000 }).toBe(0)

    // Globally, only one group link should be active
    expect(await catalogPage.activeGroupLink().count()).toBe(1)
  })

  test('category collapse/expand toggles group visibility', async ({ catalogPage }) => {
    const sections = catalogPage.sidebarSections()
    const firstSection = sections.first()
    const categoryToggle = firstSection.locator('[data-testid="control-group-toggle"]')

    // Categories are expanded by default (aria-expanded=true)
    await expect(categoryToggle).toHaveAttribute('aria-expanded', 'true')

    const groupsBefore = await catalogPage.groupLinksInSection(firstSection).count()
    expect(groupsBefore).toBeGreaterThan(0)

    // Click to collapse
    await categoryToggle.click()
    await expect(categoryToggle).toHaveAttribute('aria-expanded', 'false')

    // Group links should be hidden after collapse (subnav removed from DOM)
    const subnav = firstSection.locator('[data-testid^="sidebar-subnav-"]')
    await expect(subnav).toHaveCount(0)

    // Click to expand again
    await categoryToggle.click()
    await expect(categoryToggle).toHaveAttribute('aria-expanded', 'true')
    expect(await catalogPage.groupLinksInSection(firstSection).count()).toBe(groupsBefore)
  })
})
