import { test, expect } from './fixtures/catalog.fixture'

async function suppressExpectedBoundaryConsole(page: import('@playwright/test').Page, marker: string) {
  await page.addInitScript((expectedMarker) => {
    // eslint-disable-next-line no-console -- intentionally intercepting console.error to suppress expected React ErrorBoundary noise
    const originalError = console.error.bind(console)
    // eslint-disable-next-line no-console -- replacing console.error to filter expected ErrorBoundary messages
    console.error = (...args: unknown[]) => {
      const text = args.map((value) => String(value)).join(' ')
      if (
        text.includes(expectedMarker) ||
        text.includes('ErrorBoundary caught an error:') ||
        text.includes('The above error occurred in the <AnimationCardComponent> component.')
      ) {
        return
      }
      originalError(...args)
    }
  }, marker)
}

test.describe('ErrorBoundary', () => {
  test('does not show fallback UI during healthy app render', async ({ catalogPage }) => {
    await catalogPage.goto()
    await catalogPage.waitForCards()

    await catalogPage.expectNoErrorBoundary()
    await expect(catalogPage.page.locator('[data-testid="error-retry-button"]')).toHaveCount(0)
  })

  test('shows fallback UI when a child lifecycle error is thrown', async ({ catalogPage }) => {
    await suppressExpectedBoundaryConsole(
      catalogPage.page,
      'Forced IntersectionObserver failure for ErrorBoundary test'
    )
    await catalogPage.page.addInitScript(() => {
      const OriginalObserver = window.IntersectionObserver
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

    await catalogPage.page.goto('/')

    await expect(catalogPage.page.locator('[data-testid="error-heading"]')).toBeVisible()
    await expect(catalogPage.page.locator('[data-testid="error-retry-button"]')).toBeVisible()
  })

  test('recovers after clicking Try Again when injected failure is one-time', async ({
    catalogPage,
  }) => {
    await suppressExpectedBoundaryConsole(
      catalogPage.page,
      'Forced one-time failure for ErrorBoundary recovery test'
    )
    await catalogPage.page.addInitScript(() => {
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

    await catalogPage.page.goto('/')
    await expect(catalogPage.page.locator('[data-testid="error-heading"]')).toBeVisible()

    await catalogPage.page.locator('[data-testid="error-retry-button"]').click()

    await catalogPage.waitForShell()
    await catalogPage.expectNoErrorBoundary()
  })
})
