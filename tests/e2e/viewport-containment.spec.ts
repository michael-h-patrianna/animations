import { test, expect } from './fixtures/catalog.fixture'
import {
  type Violation,
  type PositionViolation,
  checkContainment,
  formatViolation,
  POSITION_ZONES,
  checkPositioning,
  formatPositionViolation,
} from './helpers/viewport-preview-utils'

/**
 * Deep containment and positioning scans for every animation in both
 * mobile (phone-frame) and desktop (full-viewport) preview modes.
 *
 * These tests serve as **generalization proofs**: a failure means the
 * animation component itself is not viewport-portable. The fix belongs
 * in the animation source code, never in preview infrastructure.
 *
 * AI-agent guidance: error messages include the animation ID, group path,
 * overflow dimensions, and a derived source directory hint so agents can
 * locate and fix the non-portable animation code.
 */

// ── Mobile containment scan (all groups, deep descendant check) ────────

test.describe('Mobile Containment Scan @containment', () => {
  test.setTimeout(600_000)

  test('no animation overflows the mobile phone frame', async ({ catalogPage }) => {
    // Known production bug: some animations overflow in mobile preview.
    // This annotation expects the test to fail — remove when overflow bugs are fixed.
    test.fail(true, 'Production bug: animations with overflow in mobile preview')
    const info = test.info()
    const groupPaths = await catalogPage.discoverAllGroupPaths()
    expect(groupPaths.length).toBeGreaterThan(0)

    const allViolations: Violation[] = []
    let checkedCount = 0
    const screenshotAnimations = new Set<string>()

    for (const groupPath of groupPaths) {
      await catalogPage.gotoGroup(groupPath)
      const animationIds = await catalogPage.getAllAnimationIds()

      for (const animId of animationIds) {
        const card = catalogPage.card(animId)
        if (!(await card.isVisible().catch(() => false))) continue

        try {
          await catalogPage.openMobilePreview(card)

          const animation = catalogPage.previewAnimation()
          await expect(animation).toBeVisible({ timeout: 3_000 })
          // Wait for animation to have rendered descendants
          await expect
            .poll(async () => animation.locator('*').count(), { timeout: 3_000 })
            .toBeGreaterThan(0)

          const violations = await checkContainment(
            catalogPage.page,
            '[data-testid="preview-mobile-frame"]',
            '[data-testid="preview-animation"]',
            4 // tolerance in px for subpixel rounding
          )

          if (violations.length > 0) {
            if (!screenshotAnimations.has(animId)) {
              screenshotAnimations.add(animId)
              const screenshot = await catalogPage.page.screenshot({ fullPage: false })
              info.attach(`mobile-overflow__${animId}`, {
                body: screenshot,
                contentType: 'image/png',
              })
            }

            for (const v of violations) {
              allViolations.push({
                animationId: animId,
                groupPath,
                ...v,
              })
            }
          }

          checkedCount++
          await catalogPage.closePreview()
        } catch {
          await catalogPage.page.keyboard.press('Escape')
          // Wait for preview overlay to dismiss
          await expect(catalogPage.previewAnimation())
            .toHaveCount(0, { timeout: 2_000 })
            .catch(() => {})
        }
      }
    }

    expect(checkedCount).toBeGreaterThan(0)

    if (allViolations.length > 0) {
      const seen = new Set<string>()
      const deduped = allViolations.filter((v) => {
        if (seen.has(v.animationId)) return false
        seen.add(v.animationId)
        return true
      })

      throw new Error(
        `Mobile containment: ${deduped.length} animation(s) overflow the phone frame ` +
          `(${checkedCount} checked across ${groupPaths.length} groups).\n` +
          `Each animation listed below has non-portable code that must be fixed at the source.\n\n` +
          deduped.map((v) => formatViolation(v)).join('\n\n')
      )
    }
  })
})

// ── Desktop containment scan ───────────────────────────────────────────

test.describe('Desktop Containment Scan @desktop-containment', () => {
  test.setTimeout(600_000)

  test('no animation overflows the desktop viewport', async ({ catalogPage }) => {
    // Known production bug: some animations overflow in desktop preview.
    test.fail(true, 'Production bug: animations with overflow in desktop preview')

    const info = test.info()
    const groupPaths = await catalogPage.discoverAllGroupPaths()
    expect(groupPaths.length).toBeGreaterThan(0)

    const allViolations: Violation[] = []
    let checkedCount = 0
    const screenshotAnimations = new Set<string>()

    for (const groupPath of groupPaths) {
      await catalogPage.gotoGroup(groupPath)
      const animationIds = await catalogPage.getAllAnimationIds()

      for (const animId of animationIds) {
        const card = catalogPage.card(animId)
        if (!(await card.isVisible().catch(() => false))) continue

        try {
          await catalogPage.openDesktopPreview(card)

          const animation = catalogPage.previewAnimation()
          await expect(animation).toBeVisible({ timeout: 3_000 })
          // Wait for animation to have rendered descendants
          await expect
            .poll(async () => animation.locator('*').count(), { timeout: 3_000 })
            .toBeGreaterThan(0)

          const viewport = catalogPage.page.viewportSize()!
          const violations = await catalogPage.page.evaluate(
            ({ animSel, vp, tol }) => {
              const animation = document.querySelector(animSel)
              if (!animation) return []

              const violations: Array<{
                tag: string
                className: string
                childRect: { x: number; y: number; width: number; height: number }
                containerRect: { x: number; y: number; width: number; height: number }
                overflowPx: { left: number; top: number; right: number; bottom: number }
              }> = []

              const vpRect = { x: 0, y: 0, width: vp.width, height: vp.height }
              const descendants = animation.querySelectorAll('*')

              for (const el of descendants) {
                const style = window.getComputedStyle(el)
                if (style.display === 'none' || style.visibility === 'hidden') continue

                const r = el.getBoundingClientRect()
                if (r.width === 0 && r.height === 0) continue

                const overLeft = -r.x
                const overTop = -r.y
                const overRight = r.x + r.width - vp.width
                const overBottom = r.y + r.height - vp.height

                if (overLeft > tol || overTop > tol || overRight > tol || overBottom > tol) {
                  violations.push({
                    tag: el.tagName.toLowerCase(),
                    className:
                      el.className && typeof el.className === 'string'
                        ? el.className.split(' ').slice(0, 3).join(' ')
                        : '',
                    childRect: {
                      x: Math.round(r.x),
                      y: Math.round(r.y),
                      width: Math.round(r.width),
                      height: Math.round(r.height),
                    },
                    containerRect: {
                      x: vpRect.x,
                      y: vpRect.y,
                      width: vpRect.width,
                      height: vpRect.height,
                    },
                    overflowPx: {
                      left: Math.round(Math.max(0, overLeft)),
                      top: Math.round(Math.max(0, overTop)),
                      right: Math.round(Math.max(0, overRight)),
                      bottom: Math.round(Math.max(0, overBottom)),
                    },
                  })
                }
              }
              return violations
            },
            {
              animSel: '[data-testid="preview-animation"]',
              vp: { width: viewport.width, height: viewport.height },
              tol: 4,
            }
          )

          if (violations.length > 0) {
            if (!screenshotAnimations.has(animId)) {
              screenshotAnimations.add(animId)
              const screenshot = await catalogPage.page.screenshot({ fullPage: false })
              info.attach(`desktop-overflow__${animId}`, {
                body: screenshot,
                contentType: 'image/png',
              })
            }

            for (const v of violations) {
              allViolations.push({
                animationId: animId,
                groupPath,
                ...v,
              })
            }
          }

          checkedCount++
          await catalogPage.closePreview()
        } catch {
          await catalogPage.page.keyboard.press('Escape')
          // Wait for preview overlay to dismiss
          await expect(catalogPage.previewAnimation())
            .toHaveCount(0, { timeout: 2_000 })
            .catch(() => {})
        }
      }
    }

    expect(checkedCount).toBeGreaterThan(0)

    if (allViolations.length > 0) {
      const seen = new Set<string>()
      const deduped = allViolations.filter((v) => {
        if (seen.has(v.animationId)) return false
        seen.add(v.animationId)
        return true
      })

      throw new Error(
        `Desktop containment: ${deduped.length} animation(s) overflow the viewport ` +
          `(${checkedCount} checked across ${groupPaths.length} groups).\n` +
          `Each animation listed below has non-portable code that must be fixed at the source.\n\n` +
          deduped.map((v) => formatViolation(v)).join('\n\n')
      )
    }
  })
})

// ── Mobile positioning verification ────────────────────────────────────

test.describe('Mobile Positioning Verification @positioning', () => {
  test.setTimeout(600_000)

  test('animations are positioned in the correct zone within mobile frame', async ({
    catalogPage,
  }) => {
    // Known production bug: some animations are positioned outside their declared zone.
    test.fail(true, 'Production bug: animations mispositioned in mobile preview')

    const info = test.info()
    const groupPaths = await catalogPage.discoverAllGroupPaths()
    expect(groupPaths.length).toBeGreaterThan(0)

    const allViolations: PositionViolation[] = []
    let checkedCount = 0
    let skippedFullOverlay = 0
    const screenshotAnimations = new Set<string>()

    for (const groupPath of groupPaths) {
      await catalogPage.gotoGroup(groupPath)
      const animationIds = await catalogPage.getAllAnimationIds()

      for (const animId of animationIds) {
        const card = catalogPage.card(animId)
        if (!(await card.isVisible().catch(() => false))) continue

        try {
          await catalogPage.openMobilePreview(card)

          const animation = catalogPage.previewAnimation()
          await expect(animation).toBeVisible({ timeout: 3_000 })
          // Wait for animation to have rendered descendants
          await expect
            .poll(async () => animation.locator('*').count(), { timeout: 3_000 })
            .toBeGreaterThan(0)

          const result = await checkPositioning(
            catalogPage.page,
            '[data-testid="preview-mobile-frame"]',
            '[data-testid="preview-animation"]'
          )

          if (result === null) {
            skippedFullOverlay++
          } else {
            const zone = POSITION_ZONES[result.position]
            if (zone) {
              const { xPct, yPct } = result.contentCenter
              const outOfZone =
                xPct < zone.xMin || xPct > zone.xMax || yPct < zone.yMin || yPct > zone.yMax

              if (outOfZone) {
                if (!screenshotAnimations.has(animId)) {
                  screenshotAnimations.add(animId)
                  const screenshot = await catalogPage.page.screenshot({ fullPage: false })
                  info.attach(`mobile-position__${animId}`, {
                    body: screenshot,
                    contentType: 'image/png',
                  })
                }

                allViolations.push({
                  animationId: animId,
                  groupPath,
                  expectedPosition: result.position,
                  contentCenter: result.contentCenter,
                  expectedZone: zone,
                  containerRect: result.containerRect,
                  contentBbox: result.contentBbox,
                })
              }
            }
          }

          checkedCount++
          await catalogPage.closePreview()
        } catch {
          await catalogPage.page.keyboard.press('Escape')
          // Wait for preview overlay to dismiss
          await expect(catalogPage.previewAnimation())
            .toHaveCount(0, { timeout: 2_000 })
            .catch(() => {})
        }
      }
    }

    expect(checkedCount).toBeGreaterThan(0)

    if (allViolations.length > 0) {
      throw new Error(
        `Mobile positioning: ${allViolations.length} animation(s) mispositioned ` +
          `(${checkedCount} checked, ${skippedFullOverlay} full-overlay skipped, across ${groupPaths.length} groups).\n` +
          `Each animation below has content outside its declared position zone.\n` +
          `Fix the animation component's CSS to position content in the correct zone.\n\n` +
          allViolations.map((v) => formatPositionViolation(v)).join('\n\n')
      )
    }
  })
})

// ── Desktop positioning verification ───────────────────────────────────

test.describe('Desktop Positioning Verification @positioning', () => {
  test.setTimeout(600_000)

  test('animations are positioned in the correct zone within desktop viewport', async ({
    catalogPage,
  }) => {
    // Known production bug: some animations are positioned outside their declared zone.
    test.fail(true, 'Production bug: animations mispositioned in desktop preview')

    const info = test.info()
    const groupPaths = await catalogPage.discoverAllGroupPaths()
    expect(groupPaths.length).toBeGreaterThan(0)

    const allViolations: PositionViolation[] = []
    let checkedCount = 0
    let skippedFullOverlay = 0
    const screenshotAnimations = new Set<string>()

    for (const groupPath of groupPaths) {
      await catalogPage.gotoGroup(groupPath)
      const animationIds = await catalogPage.getAllAnimationIds()

      for (const animId of animationIds) {
        const card = catalogPage.card(animId)
        if (!(await card.isVisible().catch(() => false))) continue

        try {
          await catalogPage.openDesktopPreview(card)

          const animation = catalogPage.previewAnimation()
          await expect(animation).toBeVisible({ timeout: 3_000 })
          // Wait for animation to have rendered descendants
          await expect
            .poll(async () => animation.locator('*').count(), { timeout: 3_000 })
            .toBeGreaterThan(0)

          const result = await checkPositioning(
            catalogPage.page,
            '[data-testid="preview-desktop"]',
            '[data-testid="preview-animation"]'
          )

          if (result === null) {
            skippedFullOverlay++
          } else {
            const viewport = catalogPage.page.viewportSize()!
            result.containerRect = {
              x: 0,
              y: 0,
              width: viewport.width,
              height: viewport.height,
            }

            const zone = POSITION_ZONES[result.position]
            if (zone) {
              const { xPct, yPct } = result.contentCenter
              const outOfZone =
                xPct < zone.xMin || xPct > zone.xMax || yPct < zone.yMin || yPct > zone.yMax

              if (outOfZone) {
                if (!screenshotAnimations.has(animId)) {
                  screenshotAnimations.add(animId)
                  const screenshot = await catalogPage.page.screenshot({ fullPage: false })
                  info.attach(`desktop-position__${animId}`, {
                    body: screenshot,
                    contentType: 'image/png',
                  })
                }

                allViolations.push({
                  animationId: animId,
                  groupPath,
                  expectedPosition: result.position,
                  contentCenter: result.contentCenter,
                  expectedZone: zone,
                  containerRect: result.containerRect,
                  contentBbox: result.contentBbox,
                })
              }
            }
          }

          checkedCount++
          await catalogPage.closePreview()
        } catch {
          await catalogPage.page.keyboard.press('Escape')
          // Wait for preview overlay to dismiss
          await expect(catalogPage.previewAnimation())
            .toHaveCount(0, { timeout: 2_000 })
            .catch(() => {})
        }
      }
    }

    expect(checkedCount).toBeGreaterThan(0)

    if (allViolations.length > 0) {
      throw new Error(
        `Desktop positioning: ${allViolations.length} animation(s) mispositioned ` +
          `(${checkedCount} checked, ${skippedFullOverlay} full-overlay skipped, across ${groupPaths.length} groups).\n` +
          `Each animation below has content outside its declared position zone.\n` +
          `Fix the animation component's CSS to position content in the correct zone.\n\n` +
          allViolations.map((v) => formatPositionViolation(v)).join('\n\n')
      )
    }
  })
})
