import { expect, test } from '@playwright/test'

test('app boots without page errors or critical console errors', async ({ page }) => {
  const consoleErrors: string[] = []
  const pageErrors: string[] = []

  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text())
    }
  })

  page.on('pageerror', (error) => {
    pageErrors.push(error.message)
  })

  await page.goto('/')
  await page.waitForSelector('.pf-main .pf-sidebar', { timeout: 10000 })
  await page.waitForSelector('.pf-card[data-animation-id]', { timeout: 10000 })

  const criticalConsoleErrors = consoleErrors.filter((errorText) => {
    return !/Failed to load resource|favicon|net::ERR|ResizeObserver loop limit exceeded/i.test(errorText)
  })

  expect(pageErrors).toHaveLength(0)
  expect(criticalConsoleErrors).toHaveLength(0)

  await expect(page.getByText('Something went wrong')).toHaveCount(0)
})
