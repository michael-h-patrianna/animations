import { test, expect } from './fixtures/catalog.fixture'
import type { CatalogPage } from './page-objects/CatalogPage'
import {
  type PresenceViolation,
  checkVisualPresence,
  classifyViolation,
  formatPresenceViolation,
} from './helpers/visual-presence-utils'

/**
 * Visual Presence: verifies that every animation draws meaningful visible
 * content in both desktop and mobile preview modes.
 *
 * Catches two failure classes that DOM-only checks miss:
 * 1. Animations that mount DOM elements but render nothing visible
 * 2. Animations that render as a thin line due to sizing bugs
 *
 * Method: navigates to each animation via URL with ?preview=desktop|mobile&opaque=1,
 * which auto-opens the preview with a solid black background. Screenshots the
 * preview-animation container and analyzes pixel content against the known
 * black background. Asserts minimum content dimensions and pixel count.
 *
 * AI-agent guidance: error messages include animation ID, group path,
 * content dimensions, and source directory hint. The fix belongs in
 * the animation component source code.
 */

type PreviewMode = 'desktop' | 'mobile'

type AnimationEntry = { groupPath: string; animId: string }

/**
 * Phase 1: Discover all (groupPath, animationId) pairs via sidebar navigation.
 * No preview is opened during this phase.
 */
async function discoverAllAnimations(catalogPage: CatalogPage): Promise<AnimationEntry[]> {
  const groupPaths = await catalogPage.discoverAllGroupPaths()
  expect(groupPaths.length).toBeGreaterThan(0)

  const entries: AnimationEntry[] = []
  for (const groupPath of groupPaths) {
    try {
      await catalogPage.gotoGroup(groupPath)
      const animationIds = await catalogPage.getAllAnimationIds()
      for (const animId of animationIds) {
        entries.push({ groupPath, animId })
      }
    } catch {
      // Some groups may have no cards or fail to load — skip during discovery
    }
  }
  return entries
}

/**
 * Phase 2: Check each animation's visual presence via direct URL navigation
 * with ?preview=mode&opaque=1. Each navigation is independent.
 */
async function checkAllPresence(
  catalogPage: CatalogPage,
  entries: AnimationEntry[],
  mode: PreviewMode,
  info: ReturnType<typeof test.info>
): Promise<{ violations: PresenceViolation[]; checkedCount: number }> {
  const allViolations: PresenceViolation[] = []
  let checkedCount = 0
  const screenshotAnimations = new Set<string>()

  for (const { groupPath, animId } of entries) {
    try {
      // Navigate directly — auto-opens preview with opaque black background
      const url = `/${groupPath}?animation=${encodeURIComponent(animId)}&preview=${mode}&opaque=1`
      await catalogPage.page.goto(url)

      const animation = catalogPage.previewAnimation()
      await expect(animation).toBeVisible({ timeout: 5_000 })
      // Allow animation to reach a visible state
      await catalogPage.page.waitForTimeout(800)

      // Pixel-level analysis against opaque black background
      const screenshotBuffer = await animation.screenshot()
      const result = await checkVisualPresence(catalogPage.page, screenshotBuffer)

      if (result) {
        const reason = classifyViolation(result)
        if (reason) {
          if (!screenshotAnimations.has(animId)) {
            screenshotAnimations.add(animId)
            const fullScreenshot = await catalogPage.page.screenshot({ fullPage: false })
            info.attach(`${mode}-presence__${animId}`, {
              body: fullScreenshot,
              contentType: 'image/png',
            })
          }

          allViolations.push({
            animationId: animId,
            groupPath,
            mode,
            reason,
            contentBox: result.contentBox,
            contentPixelCount: result.contentPixelCount,
            screenshotWidth: result.screenshotWidth,
            screenshotHeight: result.screenshotHeight,
          })
        }
      }

      checkedCount++
    } catch {
      // If preview fails to open, try to recover
      try {
        await catalogPage.page.keyboard.press('Escape')
        await catalogPage.page.waitForTimeout(200)
      } catch {
        // Page may be in an unrecoverable state — continue to next animation
      }
    }
  }

  return { violations: allViolations, checkedCount }
}

// ── Desktop visual presence scan ──────────────────────────────────────

test.describe('Desktop Visual Presence @visual-presence', () => {
  test.setTimeout(600_000)

  test('every animation draws visible content in desktop preview', async ({ catalogPage }) => {
    const info = test.info()
    const entries = await discoverAllAnimations(catalogPage)
    const { violations, checkedCount } = await checkAllPresence(
      catalogPage,
      entries,
      'desktop',
      info
    )

    expect(checkedCount).toBeGreaterThan(0)

    if (violations.length > 0) {
      const seen = new Set<string>()
      const deduped = violations.filter((v) => {
        if (seen.has(v.animationId)) return false
        seen.add(v.animationId)
        return true
      })

      const groupCount = new Set(entries.map((e) => e.groupPath)).size
      throw new Error(
        `Desktop visual presence: ${deduped.length} animation(s) not visually rendered ` +
          `(${checkedCount} checked across ${groupCount} groups).\n` +
          `Each animation listed below has a rendering or sizing issue in desktop preview.\n` +
          `Fix the animation component's code so it renders visible content at preview scale.\n\n` +
          deduped.map((v) => formatPresenceViolation(v)).join('\n\n')
      )
    }
  })
})

// ── Mobile visual presence scan ───────────────────────────────────────

test.describe('Mobile Visual Presence @visual-presence', () => {
  test.setTimeout(600_000)

  test('every animation draws visible content in mobile preview', async ({ catalogPage }) => {
    const info = test.info()
    const entries = await discoverAllAnimations(catalogPage)
    const { violations, checkedCount } = await checkAllPresence(
      catalogPage,
      entries,
      'mobile',
      info
    )

    expect(checkedCount).toBeGreaterThan(0)

    if (violations.length > 0) {
      const seen = new Set<string>()
      const deduped = violations.filter((v) => {
        if (seen.has(v.animationId)) return false
        seen.add(v.animationId)
        return true
      })

      const groupCount = new Set(entries.map((e) => e.groupPath)).size
      throw new Error(
        `Mobile visual presence: ${deduped.length} animation(s) not visually rendered ` +
          `(${checkedCount} checked across ${groupCount} groups).\n` +
          `Each animation listed below has a rendering or sizing issue in mobile preview.\n` +
          `Fix the animation component's code so it renders visible content at mobile scale.\n\n` +
          deduped.map((v) => formatPresenceViolation(v)).join('\n\n')
      )
    }
  })
})
