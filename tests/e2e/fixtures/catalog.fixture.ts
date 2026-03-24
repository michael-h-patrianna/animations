import { test as base, expect } from '@playwright/test'
import { CatalogPage } from '../page-objects/CatalogPage'
import { MobilePage } from '../page-objects/MobilePage'

/** Noise patterns that are benign and should not fail tests. */
const BENIGN_CONSOLE_ERRORS = /Failed to load resource|favicon|net::ERR|ResizeObserver loop/i

type ErrorCollector = {
  /** Uncaught JS exceptions (window.onerror). */
  pageErrors: string[]
  /** console.error() calls, with benign noise filtered out. */
  consoleErrors: string[]
  /**
   * Assert that no critical errors were recorded.
   * Call at the end of the test after all interactions complete.
   */
  expectNoErrors: () => void
}

type CatalogFixtures = {
  catalogPage: CatalogPage
  mobilePage: MobilePage
  /**
   * Attaches page error and console error listeners at test start.
   * Call `errorCollector.expectNoErrors()` at the end of the test
   * to assert no uncaught JS errors or console.error() calls occurred.
   */
  errorCollector: ErrorCollector
  /**
   * Auto-fixture: asserts no uncaught JS errors or console.error() calls
   * after every test. No opt-in required.
   */
  _autoErrorGuard: void
}

/**
 * Extended Playwright test with page object fixtures.
 * Use `catalogPage` for desktop and `mobilePage` for mobile interactions.
 */
export const test = base.extend<CatalogFixtures>({
  catalogPage: async ({ page }, use) => {
    await use(new CatalogPage(page))
  },
  mobilePage: async ({ page }, use) => {
    await use(new MobilePage(page))
  },
  errorCollector: async ({ page }, use) => {
    const pageErrors: string[] = []
    const consoleErrors: string[] = []

    page.on('pageerror', (err) => pageErrors.push(err.message))
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text()
        if (!BENIGN_CONSOLE_ERRORS.test(text)) {
          consoleErrors.push(text)
        }
      }
    })

    await use({
      pageErrors,
      consoleErrors,
      expectNoErrors() {
        expect(pageErrors, `Uncaught JS errors:\n${pageErrors.join('\n')}`).toHaveLength(0)
        expect(consoleErrors, `Console errors:\n${consoleErrors.join('\n')}`).toHaveLength(0)
      },
    })
  },
  _autoErrorGuard: [
    async ({ errorCollector }, use) => {
      await use()
      errorCollector.expectNoErrors()
    },
    { auto: true },
  ],
})

export { expect } from '@playwright/test'
