import { expect, test } from '@playwright/test'

test.describe('ErrorBoundary', () => {
  test('does not show fallback UI during healthy app render', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[data-testid="sidebar"]', { timeout: 10000 })

    await expect(page.locator('[data-testid="error-fallback"]')).toHaveCount(0)
    await expect(page.locator('[data-testid="error-retry-button"]')).toHaveCount(0)
  })

  test('shows fallback UI when a child lifecycle error is thrown', async ({ page }) => {
    await page.addInitScript(() => {
      const OriginalObserver = window.IntersectionObserver
      // Throw exactly once to trigger ErrorBoundary, then allow recovery path.
      ;(window as Window & { __ioThrowOnce?: boolean }).__ioThrowOnce = true

      window.IntersectionObserver = class extends OriginalObserver {
        constructor(...args: ConstructorParameters<typeof OriginalObserver>) {
          const state = window as Window & { __ioThrowOnce?: boolean }
          if (state.__ioThrowOnce) {
            state.__ioThrowOnce = false
            throw new Error('Forced IntersectionObserver failure for ErrorBoundary test')
          }
          super(...args)
        }
      }
    })

    await page.goto('/')

    await expect(page.locator('[data-testid="error-heading"]')).toBeVisible()
    await expect(page.locator('[data-testid="error-retry-button"]')).toBeVisible()
  })

  test('recovers after clicking Try Again when injected failure is one-time', async ({ page }) => {
    await page.addInitScript(() => {
      const OriginalObserver = window.IntersectionObserver
      ;(window as Window & { __ioThrowOnce?: boolean }).__ioThrowOnce = true

      window.IntersectionObserver = class extends OriginalObserver {
        constructor(...args: ConstructorParameters<typeof OriginalObserver>) {
          const state = window as Window & { __ioThrowOnce?: boolean }
          if (state.__ioThrowOnce) {
            state.__ioThrowOnce = false
            throw new Error('Forced one-time failure for ErrorBoundary recovery test')
          }
          super(...args)
        }
      }
    })

    await page.goto('/')
    await expect(page.locator('[data-testid="error-heading"]')).toBeVisible()

    await page.locator('[data-testid="error-retry-button"]').click()

    await page.waitForSelector('[data-testid="sidebar"]', { timeout: 10000 })
    await expect(page.locator('[data-testid="error-heading"]')).toHaveCount(0)
  })
})
