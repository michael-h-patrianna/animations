import { test } from '@playwright/test'

test('capture console errors', async ({ page }) => {
  const errors: string[] = []
  const pageErrors: string[] = []

  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(`CONSOLE ERROR: ${msg.text()}`)
    }
  })

  page.on('pageerror', error => {
    pageErrors.push(`PAGE ERROR: ${error.message}\n${error.stack}`)
  })

  await page.goto('http://127.0.0.1:5173/')

  // Wait a bit for the app to try to load
  await page.waitForTimeout(5000)

  console.log('\n=== CONSOLE ERRORS ===')
  errors.forEach(e => console.log(e))

  console.log('\n=== PAGE ERRORS ===')
  pageErrors.forEach(e => console.log(e))

  console.log('\n=== PAGE HTML (first 500 chars) ===')
  const html = await page.content()
  console.log(html.substring(0, 500))
})
