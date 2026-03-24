import { test, expect } from './fixtures/catalog.fixture'

/**
 * LocalStorage migration and corruption resilience tests.
 *
 * The layout store (zustand/persist) persists theme, accent, and panel state
 * to localStorage under key 'animation-catalog-layout'. When the app updates,
 * users may have stale or corrupt localStorage data. The store's merge function
 * must handle:
 * - Legacy theme values ('dark', 'light') → migrated to 'dark-purple'
 * - Missing fields → filled with defaults
 * - Corrupt JSON → graceful fallback to defaults
 * - Valid persisted state → applied correctly
 *
 * Bug this catches: zustand persist merge function that crashes on unexpected
 * localStorage data, causing the app to fail to load or render with broken theme.
 */
test.describe('LocalStorage Migration', () => {
  test('legacy theme value is migrated to valid theme on load', async ({ catalogPage, page }) => {
    // Seed localStorage with a legacy theme value before the app loads
    await page.addInitScript(() => {
      localStorage.setItem(
        'animation-catalog-layout',
        JSON.stringify({
          state: {
            showLeftPanel: true,
            theme: 'dark', // Legacy value — should be migrated
            accent: 'cyan',
          },
          version: 0,
        })
      )
    })

    await catalogPage.goto()
    await catalogPage.waitForCards()

    // Theme should be migrated to the default 'dark-purple' (not the invalid 'dark')
    const theme = await catalogPage.currentTheme()
    expect(theme).toBe('dark-purple')

    // App should function normally
    await catalogPage.expectNoErrorBoundary()
    expect(await catalogPage.allCards().count()).toBeGreaterThan(0)
  })

  test('corrupt localStorage JSON does not crash the app', async ({ catalogPage, page }) => {
    // Seed corrupt JSON
    await page.addInitScript(() => {
      localStorage.setItem('animation-catalog-layout', '{invalid json!!!}')
    })

    await catalogPage.goto()
    await catalogPage.waitForCards()

    // App loads with defaults
    const theme = await catalogPage.currentTheme()
    expect(theme).toBeTruthy() // Any valid theme
    await catalogPage.expectNoErrorBoundary()
  })

  test('missing fields in persisted state are filled with defaults', async ({
    catalogPage,
    page,
  }) => {
    // Seed partial state — only theme, missing accent and panel
    await page.addInitScript(() => {
      localStorage.setItem(
        'animation-catalog-layout',
        JSON.stringify({
          state: { theme: 'dark-blue' },
          version: 0,
        })
      )
    })

    await catalogPage.goto()
    await catalogPage.waitForCards()

    // Theme from stored state should be applied
    expect(await catalogPage.currentTheme()).toBe('dark-blue')

    // Accent should fall back to default (cyan)
    expect(await catalogPage.currentAccent()).toBeTruthy()

    // App functions normally
    await catalogPage.expectNoErrorBoundary()
  })

  test('valid persisted accent color is applied on load', async ({ catalogPage, page }) => {
    // Seed state with a non-default accent
    await page.addInitScript(() => {
      localStorage.setItem(
        'animation-catalog-layout',
        JSON.stringify({
          state: {
            showLeftPanel: true,
            theme: 'dark-purple',
            accent: 'magenta',
          },
          version: 0,
        })
      )
    })

    await catalogPage.goto()
    await catalogPage.waitForCards()

    // Persisted accent should be applied
    expect(await catalogPage.currentAccent()).toBe('magenta')
    await catalogPage.expectNoErrorBoundary()
  })
})
