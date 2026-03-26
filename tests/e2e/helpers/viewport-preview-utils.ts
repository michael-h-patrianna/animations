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

      // Find the visible rect of an element after clipping by ancestors
      // with overflow: hidden/clip/auto/scroll between the element and the
      // animation root. Returns null if fully clipped away.
      const CLIP_VALUES = new Set(['hidden', 'clip', 'auto', 'scroll'])
      function visibleRect(
        el: Element,
        animRoot: Element
      ): { x: number; y: number; width: number; height: number } | null {
        const r = el.getBoundingClientRect()
        let left = r.x
        let top = r.y
        let right = r.x + r.width
        let bottom = r.y + r.height

        let ancestor = el.parentElement
        while (ancestor && ancestor !== animRoot) {
          const s = window.getComputedStyle(ancestor)
          if (CLIP_VALUES.has(s.overflowX) || CLIP_VALUES.has(s.overflowY)) {
            const ar = ancestor.getBoundingClientRect()
            if (CLIP_VALUES.has(s.overflowX)) {
              left = Math.max(left, ar.x)
              right = Math.min(right, ar.x + ar.width)
            }
            if (CLIP_VALUES.has(s.overflowY)) {
              top = Math.max(top, ar.y)
              bottom = Math.min(bottom, ar.y + ar.height)
            }
          }
          ancestor = ancestor.parentElement
        }

        if (left >= right || top >= bottom) return null
        return { x: left, y: top, width: right - left, height: bottom - top }
      }

      const descendants = animation.querySelectorAll('*')
      for (const el of descendants) {
        // Skip invisible/zero-size elements
        const style = window.getComputedStyle(el)
        if (style.display === 'none' || style.visibility === 'hidden') continue

        const r = el.getBoundingClientRect()
        if (r.width === 0 && r.height === 0) continue

        // Use the visible rect (after overflow clipping) instead of the raw rect
        const vr = visibleRect(el, animation)
        if (vr === null) continue

        const overLeft = cRect.x - vr.x
        const overTop = cRect.y - vr.y
        const overRight = vr.x + vr.width - (cRect.x + cRect.width)
        const overBottom = vr.y + vr.height - (cRect.y + cRect.height)

        if (overLeft > tol || overTop > tol || overRight > tol || overBottom > tol) {
          violations.push({
            tag: el.tagName.toLowerCase(),
            className:
              el.className && typeof el.className === 'string'
                ? el.className.split(' ').slice(0, 3).join(' ')
                : '',
            childRect: {
              x: Math.round(vr.x),
              y: Math.round(vr.y),
              width: Math.round(vr.width),
              height: Math.round(vr.height),
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
  center: { xMin: 0.15, xMax: 0.85, yMin: 0.15, yMax: 0.85 },
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

      // Compute the visible rect of an element after clipping by overflow
      // ancestors between it and the animation root.
      const CLIP_VALUES = new Set(['hidden', 'clip', 'auto', 'scroll'])
      function visibleRect(
        el: Element,
        animRoot: Element
      ): { x: number; y: number; width: number; height: number } | null {
        const r = el.getBoundingClientRect()
        let left = r.x
        let top = r.y
        let right = r.x + r.width
        let bottom = r.y + r.height

        let ancestor = el.parentElement
        while (ancestor && ancestor !== animRoot) {
          const s = window.getComputedStyle(ancestor)
          if (CLIP_VALUES.has(s.overflowX) || CLIP_VALUES.has(s.overflowY)) {
            const ar = ancestor.getBoundingClientRect()
            if (CLIP_VALUES.has(s.overflowX)) {
              left = Math.max(left, ar.x)
              right = Math.min(right, ar.x + ar.width)
            }
            if (CLIP_VALUES.has(s.overflowY)) {
              top = Math.max(top, ar.y)
              bottom = Math.min(bottom, ar.y + ar.height)
            }
          }
          ancestor = ancestor.parentElement
        }

        if (left >= right || top >= bottom) return null
        return { x: left, y: top, width: right - left, height: bottom - top }
      }

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

        // Use the visible rect (after overflow clipping) for accurate position.
        // Skip fully-clipped elements — they are not visually present.
        const vr = visibleRect(el, animation)
        if (vr === null) continue

        // Skip full-container wrappers
        const isWrapperWidth = vr.width >= cRect.width * 0.85
        const isWrapperHeight = vr.height >= cRect.height * 0.85
        if (isWrapperWidth && isWrapperHeight) continue

        hasContent = true
        unionLeft = Math.min(unionLeft, vr.x)
        unionTop = Math.min(unionTop, vr.y)
        unionRight = Math.max(unionRight, vr.x + vr.width)
        unionBottom = Math.max(unionBottom, vr.y + vr.height)
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
