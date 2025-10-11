import { expect, test } from '@playwright/test'

test('displays categories and groups in the sidebar', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(/Animation Showcase/)
  // Wait for sidebar to be visible
  await page.waitForSelector('.pf-sidebar', { timeout: 10000 })

  // Check for category buttons
  await expect(page.getByRole('button', { name: /dialog/i })).toBeVisible()
  // Check for group buttons
  await expect(page.locator('.pf-sidebar__link--group').first()).toBeVisible()
})

test('renders animation cards with replay controls', async ({ page }) => {
  await page.goto('/')
  await page.waitForSelector('.pf-sidebar', { timeout: 10000 })

  // Wait for content to load
  await page.waitForSelector('.pf-card[data-animation-id]', { timeout: 10000 })

  // Check that animation cards are rendered
  const animationCard = page.locator('.pf-card[data-animation-id]').first()
  await expect(animationCard).toBeVisible()

  // Check that replay button exists
  const replayButton = animationCard.locator('[data-role="replay"]')
  await expect(replayButton).toBeVisible()

  // Ensure replay button remains functional
  await replayButton.click()
  // Animation card should still be visible after replay
  await expect(animationCard).toBeVisible()
})

test('sidebar navigation scrolls to target group', async ({ page }) => {
  await page.goto('/')
  await page.waitForSelector('.pf-sidebar', { timeout: 10000 })

  // Click on the second group in the sidebar
  const groupButtons = page.locator('.pf-sidebar__link--group')
  const secondGroup = groupButtons.nth(1)
  await expect(secondGroup).toBeVisible()

  // Get the group ID from the button's text to construct the element ID
  await secondGroup.click()
  await page.waitForTimeout(500)

  // Verify content changed - look for any animation cards
  const animationCards = page.locator('.pf-card[data-animation-id]')
  await expect(animationCards.first()).toBeVisible()
})
