import type { Page } from '@playwright/test'

// ── Types ─────────────────────────────────────────────────────────────

export type Rect = { x: number; y: number; width: number; height: number }

export type Violation = {
  animationId: string
  groupPath: string
  tag: string
  className: string
  childRect: Rect
  containerRect: Rect
  overflowPx: { left: number; top: number; right: number; bottom: number }
}

export type PositionZone = { xMin: number; xMax: number; yMin: number; yMax: number }

export type PositionViolation = {
  animationId: string
  groupPath: string
  expectedPosition: string
  contentCenter: { xPct: number; yPct: number }
  expectedZone: PositionZone
  containerRect: Rect
  contentBbox: Rect
}

// ── Helpers ────────────────────────────────────────────────────────────

/**
 * Derive the expected source directory from a group URL path.
 * E.g. "modal-base-framer" → "src/components/ ** /modal-base/framer/"
 *      "loading-states-css" → "src/components/ ** /loading-states/css/"
 */
export function deriveSourceDir(groupPath: string): string {
  const match = groupPath.match(/^(.+)-(framer|css)$/)
  if (!match) return `src/components/**/${groupPath}/`
  return `src/components/**/${match[1]}/${match[2]}/`
}

/**
 * Run deep containment check inside the browser.
 * Returns violations where any descendant of the animation container
 * extends beyond the reference container's bounding box.
 *
 * Runs as a single page.evaluate() — zero cross-process IPC per element.
 */
export async function checkContainment(
  page: Page,
  containerSelector: string,
  animationSelector: string,
  tolerance: number
): Promise<
  Array<{
    tag: string
    className: string
    childRect: Rect
    containerRect: Rect
    overflowPx: { left: number; top: number; right: number; bottom: number }
  }>
> {
  return page.evaluate(
    ({ containerSel, animSel, tol }) => {
      const container = document.querySelector(containerSel)
      const animation = document.querySelector(animSel)
      if (!container || !animation) return []

      const cRect = container.getBoundingClientRect()

      const violations: Array<{
        tag: string
        className: string
        childRect: { x: number; y: number; width: number; height: number }
        containerRect: { x: number; y: number; width: number; height: number }
        overflowPx: { left: number; top: number; right: number; bottom: number }
      }> = []

      const descendants = animation.querySelectorAll('*')
      for (const el of descendants) {
        // Skip invisible/zero-size elements
        const style = window.getComputedStyle(el)
        if (style.display === 'none' || style.visibility === 'hidden') continue

        const r = el.getBoundingClientRect()
        if (r.width === 0 && r.height === 0) continue

        const overLeft = cRect.x - r.x
        const overTop = cRect.y - r.y
        const overRight = r.x + r.width - (cRect.x + cRect.width)
        const overBottom = r.y + r.height - (cRect.y + cRect.height)

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
              x: Math.round(cRect.x),
              y: Math.round(cRect.y),
              width: Math.round(cRect.width),
              height: Math.round(cRect.height),
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
    { containerSel: containerSelector, animSel: animationSelector, tol: tolerance }
  )
}

/** Format a single violation into an actionable error line. */
export function formatViolation(v: Violation): string {
  const sourceDir = deriveSourceDir(v.groupPath)
  const overflow = Object.entries(v.overflowPx)
    .filter(([, px]) => px > 0)
    .map(([side, px]) => `${side}:${px}px`)
    .join(', ')
  return (
    `${v.animationId} [${v.groupPath}]\n` +
    `    overflow: ${overflow}\n` +
    `    element: <${v.tag} class="${v.className}">\n` +
    `    child rect: (${v.childRect.x},${v.childRect.y}) ${v.childRect.width}×${v.childRect.height}\n` +
    `    container:  (${v.containerRect.x},${v.containerRect.y}) ${v.containerRect.width}×${v.containerRect.height}\n` +
    `    source: ${sourceDir}`
  )
}

/**
 * Position zones: where the content center should fall as a fraction of
 * the container dimensions. Generous to avoid false positives on
 * intentionally slightly-off-center artistic choices.
 */
export const POSITION_ZONES: Record<string, PositionZone> = {
  center: { xMin: 0.2, xMax: 0.8, yMin: 0.2, yMax: 0.8 },
  'top-left': { xMin: 0.0, xMax: 0.6, yMin: 0.0, yMax: 0.6 },
  'top-right': { xMin: 0.4, xMax: 1.0, yMin: 0.0, yMax: 0.6 },
  'top-center': { xMin: 0.2, xMax: 0.8, yMin: 0.0, yMax: 0.6 },
  'bottom-left': { xMin: 0.0, xMax: 0.6, yMin: 0.4, yMax: 1.0 },
  'bottom-right': { xMin: 0.4, xMax: 1.0, yMin: 0.4, yMax: 1.0 },
  'bottom-center': { xMin: 0.2, xMax: 0.8, yMin: 0.4, yMax: 1.0 },
}

/**
 * Compute the content center of an animation within its container.
 * Returns the content's bounding box center as a fraction of the container.
 *
 * "Content" elements are descendants that are NOT full-container wrappers
 * (width < 85% of container OR height < 85% of container). This filters
 * out overlay/wrapper divs that fill the container and would always appear centered.
 *
 * Returns null if no content elements were found (pure overlay animation).
 */
export async function checkPositioning(
  page: Page,
  containerSelector: string,
  animationSelector: string
): Promise<{
  position: string
  contentCenter: { xPct: number; yPct: number }
  contentBbox: Rect
  containerRect: Rect
} | null> {
  return page.evaluate(
    ({ containerSel, animSel }) => {
      const container = document.querySelector(containerSel)
      const animation = document.querySelector(animSel)
      if (!container || !animation) return null

      const position = animation.getAttribute('data-position') || 'center'
      const cRect = container.getBoundingClientRect()

      // Find "content" elements: descendants that are smaller than 85% of container
      const descendants = animation.querySelectorAll('*')
      let unionLeft = Infinity
      let unionTop = Infinity
      let unionRight = -Infinity
      let unionBottom = -Infinity
      let hasContent = false

      for (const el of descendants) {
        const style = window.getComputedStyle(el)
        if (style.display === 'none' || style.visibility === 'hidden') continue

        const r = el.getBoundingClientRect()
        if (r.width === 0 && r.height === 0) continue

        // Skip full-container wrappers
        const isWrapperWidth = r.width >= cRect.width * 0.85
        const isWrapperHeight = r.height >= cRect.height * 0.85
        if (isWrapperWidth && isWrapperHeight) continue

        hasContent = true
        unionLeft = Math.min(unionLeft, r.x)
        unionTop = Math.min(unionTop, r.y)
        unionRight = Math.max(unionRight, r.x + r.width)
        unionBottom = Math.max(unionBottom, r.y + r.height)
      }

      if (!hasContent) return null

      const contentCenterX = (unionLeft + unionRight) / 2
      const contentCenterY = (unionTop + unionBottom) / 2

      // Express center as fraction of container
      const xPct = (contentCenterX - cRect.x) / cRect.width
      const yPct = (contentCenterY - cRect.y) / cRect.height

      return {
        position,
        contentCenter: {
          xPct: Math.round(xPct * 100) / 100,
          yPct: Math.round(yPct * 100) / 100,
        },
        contentBbox: {
          x: Math.round(unionLeft),
          y: Math.round(unionTop),
          width: Math.round(unionRight - unionLeft),
          height: Math.round(unionBottom - unionTop),
        },
        containerRect: {
          x: Math.round(cRect.x),
          y: Math.round(cRect.y),
          width: Math.round(cRect.width),
          height: Math.round(cRect.height),
        },
      }
    },
    { containerSel: containerSelector, animSel: animationSelector }
  )
}

/** Format a positioning violation into an actionable error line. */
export function formatPositionViolation(v: PositionViolation): string {
  const sourceDir = deriveSourceDir(v.groupPath)
  const zone = v.expectedZone
  return (
    `${v.animationId} [${v.groupPath}]\n` +
    `    expected position: ${v.expectedPosition}\n` +
    `    content center: (${(v.contentCenter.xPct * 100).toFixed(0)}%, ${(v.contentCenter.yPct * 100).toFixed(0)}%)\n` +
    `    expected zone: x=${(zone.xMin * 100).toFixed(0)}-${(zone.xMax * 100).toFixed(0)}%, y=${(zone.yMin * 100).toFixed(0)}-${(zone.yMax * 100).toFixed(0)}%\n` +
    `    content bbox: (${v.contentBbox.x},${v.contentBbox.y}) ${v.contentBbox.width}×${v.contentBbox.height}\n` +
    `    container:    (${v.containerRect.x},${v.containerRect.y}) ${v.containerRect.width}×${v.containerRect.height}\n` +
    `    source: ${sourceDir}`
  )
}
