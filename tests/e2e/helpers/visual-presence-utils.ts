import type { Page } from '@playwright/test'
import { deriveSourceDir, type Rect } from './viewport-preview-utils'

// ── Types ─────────────────────────────────────────────────────────────

export type PresenceResult = {
  /** Bounding box of non-background content pixels */
  contentBox: { x: number; y: number; width: number; height: number }
  /** Total pixels that differ from background */
  contentPixelCount: number
  /** Screenshot dimensions */
  screenshotWidth: number
  screenshotHeight: number
}

export type PresenceViolation = {
  animationId: string
  groupPath: string
  mode: 'desktop' | 'mobile'
  reason: 'no-content' | 'too-narrow' | 'too-short' | 'too-few-pixels'
  contentBox: Rect
  contentPixelCount: number
  screenshotWidth: number
  screenshotHeight: number
}

// ── Thresholds ────────────────────────────────────────────────────────

/** Minimum content width in pixels — narrower indicates a sizing bug */
export const MIN_CONTENT_WIDTH = 20

/** Minimum content height in pixels — shorter indicates a sizing bug */
export const MIN_CONTENT_HEIGHT = 20

/** Minimum non-background pixels to qualify as "visible" */
export const MIN_CONTENT_PIXELS = 100

/**
 * Per-channel difference threshold to distinguish content from background.
 * With opaque=1, background is solid black (#000000), so even dark content
 * (channel value > 25) is detected.
 */
const CHANNEL_TOLERANCE = 25

// ── Core analysis ─────────────────────────────────────────────────────

/**
 * Analyze a screenshot buffer for visual content presence.
 *
 * Designed for use with ?opaque=1 (solid black background). Decodes the
 * PNG in the browser via canvas, then scans all pixels to find the
 * bounding box and count of pixels that differ from black.
 */
export async function checkVisualPresence(
  page: Page,
  screenshotBuffer: Buffer
): Promise<PresenceResult | null> {
  const b64 = screenshotBuffer.toString('base64')

  return page.evaluate(
    ({ imgB64, chanTol }) => {
      return new Promise<{
        contentBox: { x: number; y: number; width: number; height: number }
        contentPixelCount: number
        screenshotWidth: number
        screenshotHeight: number
      } | null>((resolve) => {
        const img = new Image()
        img.onload = () => {
          const w = img.naturalWidth
          const h = img.naturalHeight
          if (w === 0 || h === 0) {
            resolve(null)
            return
          }

          const canvas = document.createElement('canvas')
          canvas.width = w
          canvas.height = h
          const ctx = canvas.getContext('2d')!
          ctx.drawImage(img, 0, 0)
          const data = ctx.getImageData(0, 0, w, h).data

          // Background is opaque black (0, 0, 0) — no corner sampling needed
          let minX = w,
            minY = h,
            maxX = -1,
            maxY = -1
          let contentPixels = 0

          for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
              const idx = (y * w + x) * 4
              const r = data[idx]
              const g = data[idx + 1]
              const b = data[idx + 2]

              if (r > chanTol || g > chanTol || b > chanTol) {
                contentPixels++
                if (x < minX) minX = x
                if (x > maxX) maxX = x
                if (y < minY) minY = y
                if (y > maxY) maxY = y
              }
            }
          }

          if (contentPixels === 0 || maxX < 0) {
            resolve({
              contentBox: { x: 0, y: 0, width: 0, height: 0 },
              contentPixelCount: 0,
              screenshotWidth: w,
              screenshotHeight: h,
            })
            return
          }

          resolve({
            contentBox: {
              x: minX,
              y: minY,
              width: maxX - minX + 1,
              height: maxY - minY + 1,
            },
            contentPixelCount: contentPixels,
            screenshotWidth: w,
            screenshotHeight: h,
          })
        }
        img.onerror = () => resolve(null)
        img.src = `data:image/png;base64,${imgB64}`
      })
    },
    { imgB64: b64, chanTol: CHANNEL_TOLERANCE }
  )
}

/**
 * Determine the violation reason from a presence result, or null if acceptable.
 */
export function classifyViolation(
  result: PresenceResult
): PresenceViolation['reason'] | null {
  if (result.contentPixelCount === 0) return 'no-content'
  if (result.contentBox.width < MIN_CONTENT_WIDTH) return 'too-narrow'
  if (result.contentBox.height < MIN_CONTENT_HEIGHT) return 'too-short'
  if (result.contentPixelCount < MIN_CONTENT_PIXELS) return 'too-few-pixels'
  return null
}

// ── Formatting ────────────────────────────────────────────────────────

const REASON_LABELS: Record<PresenceViolation['reason'], string> = {
  'no-content': 'No visible content — nothing renders in preview',
  'too-narrow': `Content too narrow (< ${MIN_CONTENT_WIDTH}px wide) — likely a sizing bug`,
  'too-short': `Content too short (< ${MIN_CONTENT_HEIGHT}px tall) — likely a sizing bug`,
  'too-few-pixels': `Too few visible pixels (< ${MIN_CONTENT_PIXELS}) — content barely visible`,
}

/** Format a presence violation into an actionable error message. */
export function formatPresenceViolation(v: PresenceViolation): string {
  const sourceDir = deriveSourceDir(v.groupPath)
  const { contentBox: cb } = v
  return (
    `${v.animationId} [${v.groupPath}] (${v.mode})\n` +
    `    ${REASON_LABELS[v.reason]}\n` +
    `    content box: (${cb.x},${cb.y}) ${cb.width}×${cb.height}\n` +
    `    content pixels: ${v.contentPixelCount}\n` +
    `    screenshot: ${v.screenshotWidth}×${v.screenshotHeight}\n` +
    `    source: ${sourceDir}`
  )
}
