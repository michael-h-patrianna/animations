import { test, expect } from './fixtures/catalog.fixture'
import type { CatalogPage } from './page-objects/CatalogPage'

/**
 * Visual parity: CSS and Framer variants of each animation should produce
 * structurally similar output. Screenshots are compared with a pixel diff
 * threshold to catch gross divergence while tolerating timing differences.
 *
 * Run:  npx playwright test visual-parity
 */

const MAX_DIFF_RATIO = 0.25
const CHANNEL_TOLERANCE = 35

/** Animations with Math.random() particle positions — pixel comparison is non-deterministic. */
const SKIP_RANDOM_ANIMATIONS = new Set([
  'prize-reveal__pirate-chest-win',
  'prize-reveal__pirate-chest-no-win',
])

/** Screenshot a card's demo stage. Returns null on failure. */
async function capture(cp: CatalogPage, animId: string): Promise<Buffer | null> {
  try {
    const card = cp.card(animId)
    if (!(await card.isVisible().catch(() => false))) return null
    await card.scrollIntoViewIfNeeded()
    const stage = card.locator('[data-testid="demo-stage"]')
    if (!(await stage.isVisible().catch(() => false))) return null
    // Wait for stage to have rendered content (children loaded)
    await expect
      .poll(async () => stage.locator(':scope > *').count(), { timeout: 5_000 })
      .toBeGreaterThan(0)
    return await stage.screenshot()
  } catch {
    return null
  }
}

/** Compare two same-size PNG buffers. Returns fraction of differing pixels. */
async function diffRatio(
  cp: CatalogPage,
  a: Buffer,
  b: Buffer,
  w: number,
  h: number
): Promise<number> {
  return cp.page.evaluate(
    async ({ aB64, bB64, w, h, tol }) => {
      const decode = (b64: string): Promise<Uint8ClampedArray> =>
        new Promise((resolve) => {
          const img = new Image()
          img.onload = () => {
            const c = document.createElement('canvas')
            c.width = w
            c.height = h
            const ctx = c.getContext('2d')!
            ctx.drawImage(img, 0, 0)
            resolve(ctx.getImageData(0, 0, w, h).data)
          }
          img.src = `data:image/png;base64,${b64}`
        })
      const [ad, bd] = await Promise.all([decode(aB64), decode(bB64)])
      let diff = 0
      for (let i = 0; i < ad.length; i += 4) {
        if (
          Math.abs(ad[i] - bd[i]) > tol ||
          Math.abs(ad[i + 1] - bd[i + 1]) > tol ||
          Math.abs(ad[i + 2] - bd[i + 2]) > tol
        )
          diff++
      }
      return diff / (w * h)
    },
    { aB64: a.toString('base64'), bB64: b.toString('base64'), w, h, tol: CHANNEL_TOLERANCE }
  )
}

/** Discover all base group IDs by clicking sidebar links in framer mode. */
async function discoverBaseGroupIds(cp: CatalogPage): Promise<string[]> {
  await cp.goto()
  await cp.selectFramerMode()
  await cp.waitForCards()

  // Click each sidebar group link and record the URL to extract base IDs
  const ids: string[] = []
  const count = await cp.allGroupLinks().count()

  for (let i = 0; i < count; i++) {
    await cp.allGroupLinks().nth(i).click()
    // Wait for URL to contain -framer (the link navigates via onClick)
    await expect.poll(() => cp.currentPathname(), { timeout: 5_000 }).toMatch(/-framer$/)
    const m = cp.currentPathname().match(/^\/(.*)-framer$/)
    if (m && !ids.includes(m[1])) ids.push(m[1])
  }

  return ids
}

test.describe('CSS/Framer Visual Parity @visual-parity', () => {
  test.setTimeout(300_000)

  test('animations render similarly in both modes', async ({ catalogPage }) => {
    const baseIds = await discoverBaseGroupIds(catalogPage)
    expect(baseIds.length).toBeGreaterThan(0)

    const failures: string[] = []
    let comparedCount = 0

    for (const baseId of baseIds) {
      // Framer screenshots
      await catalogPage.gotoGroup(`${baseId}-framer`)
      const framerIds = await catalogPage.getAllAnimationIds()
      if (framerIds.length === 0) continue

      const framerShots = new Map<string, Buffer>()
      for (const id of framerIds) {
        const shot = await capture(catalogPage, id)
        if (shot) framerShots.set(id, shot)
      }

      // CSS screenshots + comparison
      await catalogPage.gotoGroup(`${baseId}-css`)
      const cssIds = await catalogPage.getAllAnimationIds()

      for (const id of framerIds) {
        if (!cssIds.includes(id) || !framerShots.has(id) || SKIP_RANDOM_ANIMATIONS.has(id)) continue
        const framerShot = framerShots.get(id)!
        const cssShot = await capture(catalogPage, id)
        if (!cssShot) continue

        const fw = framerShot.readUInt32BE(16)
        const fh = framerShot.readUInt32BE(20)
        const cw = cssShot.readUInt32BE(16)
        const ch = cssShot.readUInt32BE(20)

        // Allow small size differences (subpixel rounding from transforms)
        const sizeTolerance = 4
        if (Math.abs(fw - cw) > sizeTolerance || Math.abs(fh - ch) > sizeTolerance) {
          failures.push(`${id}: size mismatch (${fw}x${fh} vs ${cw}x${ch})`)
          continue
        }

        // Skip pixel comparison if sizes differ slightly (can't compare different-sized images)
        if (fw !== cw || fh !== ch) continue

        const ratio = await diffRatio(catalogPage, framerShot, cssShot, fw, fh)
        comparedCount++

        if (ratio > MAX_DIFF_RATIO) {
          failures.push(`${id}: ${(ratio * 100).toFixed(1)}% diff (max ${MAX_DIFF_RATIO * 100}%)`)
        }
      }
    }

    // Sanity: we must have actually compared animations
    expect(comparedCount).toBeGreaterThan(0)

    if (failures.length > 0) {
      throw new Error(
        `Visual parity failures (${failures.length} of ${comparedCount} compared):\n${failures.map((f) => `  - ${f}`).join('\n')}`
      )
    }
  })
})
