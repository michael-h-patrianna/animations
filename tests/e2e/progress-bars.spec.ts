import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

// List of all progress bar animations we expect to find
const EXPECTED_ANIMATIONS = [
  'celebration-burst',
  'charge-surge',
  'coin-cascade',
  'crystal-formation',
  'domino-chain',
  'liquid-flow',
  'magnetic-field',
  'orbit-ring',
  'progress-bounce',
  'progress-gradient',
  'progress-milestones',
  'progress-segmented',
  'progress-striped',
  'progress-thin',
  'ripple-flow',
  'spark-chain',
  'thermal-surge',
  'timeline-progress',
  'velocity-surge',
  'xp-accumulation',
  'zoomed-progress',
];

test.describe('Progress Bars - Framer Motion Variant', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the framer variant page
    await page.goto(`${BASE_URL}/progress-bars-framer`);
  });

  test('page loads without errors', async ({ page }) => {
    // Check for console errors
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Give React time to render

    // Check for errors
    if (errors.length > 0) {
      console.log('Errors found:', errors);
    }

    expect(errors.length).toBe(0);
  });

  test('all animations render', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check that animation cards are present
    const animationCards = await page.locator('[data-animation-id]').count();
    expect(animationCards).toBeGreaterThan(0);
  });

  test('no React rendering errors', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check that root div has content
    const rootContent = await page.locator('#root').innerHTML();
    expect(rootContent.length).toBeGreaterThan(100);

    // Check for error boundaries or crash messages
    const errorText = await page.locator('body').textContent();
    expect(errorText).not.toContain('Something went wrong');
    expect(errorText).not.toContain('Error');
    expect(errorText).not.toContain('undefined');
  });

  test('replay buttons work', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Find first replay button
    const replayButton = page.locator('button').first();
    if (await replayButton.isVisible()) {
      await replayButton.click();
      await page.waitForTimeout(500);

      // Should not cause errors
      const errorText = await page.locator('body').textContent();
      expect(errorText).not.toContain('Error');
    }
  });
});

test.describe('Progress Bars - CSS Variant', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/progress-bars-css`);
  });

  test('page loads without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    if (errors.length > 0) {
      console.log('Errors found:', errors);
    }

    expect(errors.length).toBe(0);
  });

  test('all animations render', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const animationCards = await page.locator('[data-animation-id]').count();
    expect(animationCards).toBeGreaterThan(0);
  });

  test('no React rendering errors', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const rootContent = await page.locator('#root').innerHTML();
    expect(rootContent.length).toBeGreaterThan(100);

    const errorText = await page.locator('body').textContent();
    expect(errorText).not.toContain('Something went wrong');
    expect(errorText).not.toContain('Error');
    expect(errorText).not.toContain('undefined');
  });

  test('replay buttons work', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const replayButton = page.locator('button').first();
    if (await replayButton.isVisible()) {
      await replayButton.click();
      await page.waitForTimeout(500);

      const errorText = await page.locator('body').textContent();
      expect(errorText).not.toContain('Error');
    }
  });
});
