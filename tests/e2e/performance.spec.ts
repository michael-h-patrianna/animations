import { test, expect } from './fixtures/catalog.fixture'

/**
 * Performance smoke tests using wall-clock timing and browser Performance API.
 * These catch major regressions in initial load and rendering,
 * not micro-optimizations. Budgets are generous to avoid flakes.
 *
 * NOTE: Wall-clock timing (Date.now()) is inherently environment-dependent.
 * Under CI load or slow hardware, these tests may be flaky. Budgets are set
 * generously to account for this. If flaking in CI, increase budgets rather
 * than disabling tests.
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
    // Install the LCP observer via addInitScript so it runs before any page JS.
    // The observer stores the latest LCP startTime on window for later retrieval.
    await catalogPage.page.addInitScript(() => {
      ;(window as Window & { __lcpValue?: number }).__lcpValue = -1
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          ;(window as Window & { __lcpValue?: number }).__lcpValue = entry.startTime
        }
      })
      observer.observe({ type: 'largest-contentful-paint', buffered: true })
    })

    await catalogPage.goto()
    await catalogPage.waitForCards()

    // LCP entries arrive asynchronously. Wait for the observer to capture one.
    const lcp = await catalogPage.page.evaluate(async () => {
      // Give the browser time to report LCP (may be delayed by opacity animations)
      await new Promise((r) => setTimeout(r, 1000))
      return (window as Window & { __lcpValue?: number }).__lcpValue ?? -1
    })

    // The observer must have captured at least one LCP entry
    expect(lcp, 'No LCP entry captured — observer setup failed').toBeGreaterThan(0)
    expect(lcp, `LCP was ${lcp.toFixed(0)}ms (budget: 3000ms)`).toBeLessThan(3000)
  })
})
