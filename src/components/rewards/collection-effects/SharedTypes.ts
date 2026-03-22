import type { RefObject } from 'react'

/** A spatial reference: either a React ref to a mounted DOM element, or explicit coordinates. */
export type PointRef = RefObject<HTMLElement | null> | { x: number; y: number }

/** Resolved pixel coordinates within a coordinate space. */
export interface ResolvedPoint {
  x: number
  y: number
}

/**
 * Shared props for all collection-effect animations.
 * When `from` is omitted, the animation defaults to the center of its container.
 */
export interface CollectionEffectProps {
  /**
   * Emission origin. Accepts a ref to a DOM element or `{x, y}` coordinates.
   * When omitted, defaults to center of the animation container.
   */
  from?: PointRef

  /**
   * Collection target. Accepts a ref to a DOM element or `{x, y}` coordinates.
   * Not all animations use a target (e.g., CoinBurst ignores it).
   * When omitted for animations that need it, defaults to same as `from`.
   */
  to?: PointRef

  /** Number of particles to emit. Each animation has its own default. */
  count?: number

  /**
   * Up to 10 image URLs assigned randomly to particles.
   * The animation preloads all images before starting.
   * When omitted, renders colored SVG confetti shapes using `colors` palette.
   */
  particleImages?: string[]

  /**
   * Color palette for SVG confetti fallback particles.
   * Used when `particleImages` is not provided.
   * Default: `['#FFD700', '#FF6B6B', '#4ECDC4']` (gold, coral, teal).
   */
  colors?: string[]

  /**
   * How far particles travel from their origin, in pixels.
   * Interpretation varies by animation:
   * - CoinBurst: radial burst distance (default 130)
   * - CoinMagnet: scatter radius around the `from` point (default 80)
   * - CoinTrail: pop-up height above source (default 50)
   * - CoinsFountain: eruption height (default 160)
   */
  spread?: number

  /**
   * Total animation duration in milliseconds.
   * Each animation has its own default (typically 1000–1500ms).
   * For CSS variants, applied as inline `animationDuration` override.
   */
  duration?: number

  /** Fires after the last particle finishes its animation. */
  onComplete?: () => void
}

/** Maximum allowed particle images. Extra entries are silently ignored. */
export const MAX_PARTICLE_IMAGES = 10

/**
 * Resolves a PointRef to pixel coordinates.
 *
 * - For `{x, y}` objects: returns as-is.
 * - For RefObjects: calls `getBoundingClientRect()` and returns the element's center.
 * - Returns `null` if the ref has no mounted element.
 */
export function resolvePoint(ref: PointRef): ResolvedPoint | null {
  if ('x' in ref && 'y' in ref) {
    return { x: ref.x, y: ref.y }
  }
  const el = ref.current
  if (!el) return null
  const rect = el.getBoundingClientRect()
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  }
}

/**
 * Resolves a PointRef to coordinates relative to a container element.
 * Converts viewport-absolute coordinates to container-relative.
 */
export function resolvePointRelative(
  ref: PointRef,
  container: HTMLElement
): ResolvedPoint | null {
  const absolute = resolvePoint(ref)
  if (!absolute) return null
  const containerRect = container.getBoundingClientRect()
  return {
    x: absolute.x - containerRect.left,
    y: absolute.y - containerRect.top,
  }
}

/** Returns the center point of an element in container-relative coordinates. */
export function containerCenter(container: HTMLElement): ResolvedPoint {
  return { x: container.offsetWidth / 2, y: container.offsetHeight / 2 }
}

/**
 * Returns true if two resolved points are close enough to be considered the same position.
 * Uses a 5px Euclidean distance threshold.
 */
export function pointsAreEqual(
  a: ResolvedPoint | null,
  b: ResolvedPoint | null
): boolean {
  if (!a || !b) return false
  const dx = a.x - b.x
  const dy = a.y - b.y
  return Math.sqrt(dx * dx + dy * dy) < 5
}

/** Clamps particleImages to MAX_PARTICLE_IMAGES and returns the usable subset. */
export function clampImages(images?: string[]): string[] {
  if (!images || images.length === 0) return []
  return images.slice(0, MAX_PARTICLE_IMAGES)
}

/** Picks a random image from the array, or returns undefined if empty. */
export function randomImage(images: string[]): string | undefined {
  if (images.length === 0) return undefined
  return images[Math.floor(Math.random() * images.length)]
}
