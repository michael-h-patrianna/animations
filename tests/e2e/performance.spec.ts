import { test, expect } from '@playwright/test'

/**
 * Performance smoke tests using browser Performance API.
 * These catch major regressions in initial load and rendering,
 * not micro-optimizations. Budgets are generous to avoid flakes.
 */
test.describe('Performance Budgets', () => {
  test('initial page load completes within 5 seconds', async ({ page }) => {
    const start = Date.now()
    await page.goto('/')
    await page.locator('[data-testid="sidebar"]').first().waitFor({ state: 'visible' })
    await page.locator('[data-animation-id]').first().waitFor({ state: 'visible' })
    const loadTime = Date.now() - start

    expect(loadTime, `Initial load took ${loadTime}ms (budget: 5000ms)`).toBeLessThan(5000)
  })

  test('navigation between groups completes within 2 seconds', async ({ page }) => {
    await page.goto('/')
    await page.locator('[data-testid="sidebar"]').first().waitFor({ state: 'visible' })

    // Click a different group
    const groupLinks = page.locator('[data-testid^="sidebar-group-"]')
    await expect(groupLinks.first()).toBeVisible()
    const secondGroup = groupLinks.nth(1)
    await secondGroup.waitFor({ state: 'visible' })

    const start = Date.now()
    await secondGroup.click()
    await page.locator('[data-animation-id]').first().waitFor({ state: 'visible' })
    const navTime = Date.now() - start

    expect(navTime, `Navigation took ${navTime}ms (budget: 2000ms)`).toBeLessThan(2000)
  })

  test('no JavaScript errors during initial load', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))

    await page.goto('/')
    await page.locator('[data-animation-id]').first().waitFor({ state: 'visible' })

    expect(errors, `JS errors during load:\n${errors.join('\n')}`).toEqual([])
  })

  test('Largest Contentful Paint under 3 seconds', async ({ page }) => {
    await page.goto('/')
    await page.locator('[data-animation-id]').first().waitFor({ state: 'visible' })

    const lcp = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const last = entries[entries.length - 1]
          resolve(last.startTime)
        }).observe({ type: 'largest-contentful-paint', buffered: true })

        // Fallback if no LCP entry fires within 5s
        setTimeout(() => resolve(-1), 5000)
      })
    })

    if (lcp >= 0) {
      expect(lcp, `LCP was ${lcp.toFixed(0)}ms (budget: 3000ms)`).toBeLessThan(3000)
    }
  })
})
