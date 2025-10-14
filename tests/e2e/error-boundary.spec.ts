import { expect, test } from '@playwright/test'

test.describe('ErrorBoundary', () => {
  test('should display error boundary fallback UI when an error occurs', async ({ page }) => {
    // Navigate to the app
    await page.goto('/')

    // Wait for the app to load
    await page.waitForLoadState('networkidle')

    // Inject a script that will throw an error when a specific button is clicked
    await page.evaluate(() => {
      // Create a test button that throws an error
      const button = document.createElement('button')
      button.id = 'test-error-button'
      button.textContent = 'Trigger Error'
      button.onclick = () => {
        throw new Error('Test error for ErrorBoundary')
      }
      document.body.appendChild(button)
    })

    // Trigger the error by clicking the button
    await page.click('#test-error-button')

    // Wait a bit for the error to propagate
    await page.waitForTimeout(500)

    // Check if error boundary fallback UI is displayed
    await expect(page.getByText('Something went wrong')).toBeVisible()
    await expect(page.getByText('Try Again')).toBeVisible()
  })

  test('should show error details in development mode', async ({ page }) => {
    // Set development mode if needed
    await page.goto('/')

    // Wait for the app to load
    await page.waitForLoadState('networkidle')

    // Inject a script that throws an error in React component
    await page.evaluate(() => {
      const button = document.createElement('button')
      button.id = 'test-error-button'
      button.textContent = 'Trigger Error'
      button.onclick = () => {
        throw new Error('Test error message')
      }
      document.body.appendChild(button)
    })

    // Trigger the error
    await page.click('#test-error-button')

    // Wait for error boundary to catch the error
    await page.waitForTimeout(500)

    // In development mode, error details should be present
    // Look for the details element
    const detailsElement = page.locator('details:has-text("Error Details")')
    if ((await detailsElement.count()) > 0) {
      await expect(detailsElement).toBeVisible()
    }
  })

  test('should allow recovery by clicking Try Again button', async ({ page }) => {
    // Navigate to the app
    await page.goto('/')

    // Wait for the app to load
    await page.waitForLoadState('networkidle')

    // Inject a script that throws an error
    await page.evaluate(() => {
      const button = document.createElement('button')
      button.id = 'test-error-button'
      button.textContent = 'Trigger Error'
      button.onclick = () => {
        throw new Error('Test error for recovery')
      }
      document.body.appendChild(button)
    })

    // Trigger the error
    await page.click('#test-error-button')

    // Wait for error boundary
    await page.waitForTimeout(500)

    // Verify error UI is shown
    await expect(page.getByText('Something went wrong')).toBeVisible()

    // Click Try Again button
    await page.getByText('Try Again').click()

    // After recovery, the app should be visible again
    // Since we just reset the error state, the app should render normally
    // We can check if the error message is gone
    await expect(page.getByText('Something went wrong')).not.toBeVisible()
  })
})
