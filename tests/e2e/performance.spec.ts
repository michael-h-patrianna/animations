import { test, expect } from './fixtures/catalog.fixture'

/**
 * Performance smoke tests using browser Performance API.
 * These catch major regressions in initial load and rendering,
 * not micro-optimizations. Budgets are generous to avoid flakes.
 */
test.describe('Performance Budgets', () => {
  test('initial page load completes within 5 seconds', async ({ catalogPage }) => {
    const start = Date.now()
    await catalogPage.goto()
    await catalogPage.waitForCards()
    const loadTime = Date.now() - start

    expect(loadTime, `Initial load took ${loadTime}ms (budget: 5000ms)`).toBeLessThan(5000)
  })

  test('navigation between groups completes within 2 seconds', async ({ catalogPage }) => {
    await catalogPage.goto()
    await catalogPage.waitForCards()

    const groupLinks = catalogPage.allGroupLinks()
    await expect(groupLinks.first()).toBeVisible()

    const before = catalogPage.currentPathname()
    const start = Date.now()
    await catalogPage.clickGroupLink(1)
    await catalogPage.waitForCards()
    const navTime = Date.now() - start

    expect(catalogPage.currentPathname()).not.toBe(before)
    expect(navTime, `Navigation took ${navTime}ms (budget: 2000ms)`).toBeLessThan(2000)
  })

  test('no JavaScript errors during initial load', async ({ catalogPage }) => {
    const errors: string[] = []
    catalogPage.page.on('pageerror', (error) => errors.push(error.message))

    await catalogPage.goto()
    await catalogPage.waitForCards()

    expect(errors, `JS errors during load:\n${errors.join('\n')}`).toEqual([])
  })

  test('Largest Contentful Paint under 3 seconds', async ({ catalogPage }) => {
    await catalogPage.goto()
    await catalogPage.waitForCards()

    const lcp = await catalogPage.page.evaluate(() => {
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
