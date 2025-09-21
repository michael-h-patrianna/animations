import { expect, Locator, Page, test } from '@playwright/test';

// Helper to find the Mission Checkpoints card
async function getMissionCard(page: Page): Promise<Locator> {
  const card = page.locator('.pf-card[data-animation-id="progress-bars__mission-checkpoints"]');
  await expect(card).toBeVisible();
  return card;
}

// Extract activation times from data attributes on checkpoint containers
async function getActivationTimes(page: Page, card: Locator) {
  const containers = card.locator('.pf-demo-stage .pf-mission-checkpoints .track-container .pf-mission-checkpoint-container');
  const count = await containers.count();
  const times: Array<number | null> = [];
  for (let i = 0; i < count; i++) {
    const el = containers.nth(i);
    const timeStr = await el.getAttribute('data-activation-time');
    const secured = await el.getAttribute('data-secured');
    if (secured === 'true' && timeStr) {
      times.push(parseInt(timeStr, 10));
    } else {
      times.push(null);
    }
  }
  return times;
}

// We expect activations roughly at 0ms, 500ms, 1000ms, 1500ms, 2000ms (duration 2000ms)
const expectedMs = [0, 500, 1000, 1500, 2000];
const tolerance = 200; // allow some timing variance

test.describe('Mission Checkpoints', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.pf-sidebar', { timeout: 10000 });
  });

  test('milestones activate in sync with progress fill', async ({ page }) => {
    // Navigate to Progress category and Progress bars group
    await page.click('.pf-sidebar button:has-text("Progress & Loading Animations")');
    await page.waitForTimeout(200);
    await page.click('.pf-sidebar button:has-text("Progress bars")');

    const card = await getMissionCard(page);

    // Replay to start fresh
    await card.locator('[data-role="replay"]').click();

    // Wait for full duration + buffer
    await page.waitForTimeout(2400);

    const times = await getActivationTimes(page, card);
    expect(times.length).toBe(5);

    // Validate each checkpoint roughly matches expected schedule
    for (let i = 0; i < expectedMs.length; i++) {
      const t = times[i];
      expect(t).not.toBeNull();
      if (t !== null) {
        const diff = Math.abs(t - expectedMs[i]);
        expect(diff).toBeLessThanOrEqual(tolerance);
      }
    }

  // Status message is removed in the simplified UI
  await expect(card.locator('.pf-mission-status')).toHaveCount(0);
  });

  test('ui remains compact and pristine', async ({ page }) => {
    await page.click('.pf-sidebar button:has-text("Progress & Loading Animations")');
    await page.waitForTimeout(200);
    await page.click('.pf-sidebar button:has-text("Progress bars")');

    const card = await getMissionCard(page);

    // Check marker size is compact (24x24)
    const marker = card.locator('.pf-mission-checkpoint').first();
    const box = await marker.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      expect(box.width).toBeLessThanOrEqual(26);
      expect(box.height).toBeLessThanOrEqual(26);
    }

    // Labels should be small and not overlapping the track excessively
    const label = card.locator('.pf-mission-checkpoint-label').first();
    await expect(label).toBeVisible();

    // Each marker should include an icon image
    const icons = card.locator('.pf-mission-checkpoint img');
    await expect(icons.first()).toBeVisible();
    await expect(await icons.count()).toBeGreaterThanOrEqual(5);
  });
});
