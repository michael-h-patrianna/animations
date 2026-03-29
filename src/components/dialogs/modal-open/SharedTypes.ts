import type { CSSProperties, ReactNode, RefObject } from 'react'

/** A spatial reference: either a React ref to a mounted DOM element, or explicit coordinates. */
export type PointRef = RefObject<HTMLElement | null> | { x: number; y: number }

/** Resolved pixel coordinates within a coordinate space. */
export interface ResolvedPoint {
  x: number
  y: number
}

/**
 * Shared props for modal-open animations.
 *
 * The animation wraps `children` in a fly-in entrance. When `children` and `from`
 * are omitted, a demo trigger button + mock modal render so the effect is visible in the catalog.
 *
 * Consumer usage:
 * ```tsx
 * const btnRef = useRef<HTMLButtonElement>(null)
 * <button ref={btnRef} onClick={() => setOpen(true)}>Open</button>
 * {open && (
 *   <ModalOpenFlyIn from={btnRef} duration={600}>
 *     <MyModalContent />
 *   </ModalOpenFlyIn>
 * )}
 * ```
 */
export interface ModalOpenProps {
  /**
   * Origin element or coordinates. The modal launches from this position.
   * Accepts a ref to a DOM element or `{x, y}` coordinates.
   * When omitted, renders a demo trigger button as the origin.
   */
  from?: PointRef

  /** Total fly-in duration in ms. Default 600. */
  duration?: number

  /** Modal content. When omitted, renders mock demo content with stagger reveal. */
  children?: ReactNode

  /** Additional CSS class name on the modal wrapper. */
  className?: string

  /** Additional inline styles on the modal wrapper. */
  style?: CSSProperties

  /**
   * When to start revealing modal content, as a percentage of total fly-in duration (0–100).
   * Lower values start the content reveal earlier (while the modal is still flying).
   * Default: 60 (content starts appearing at 60% of the fly-in).
   */
  contentRevealAt?: number

  /**
   * Landing impact intensity (0–1). Controls overshoot distance, scale bounce,
   * glow brightness, and speed curve aggressiveness.
   * - 0: feather-light landing — minimal overshoot, no glow
   * - 0.5: default — visible bounce and glow
   * - 1: extreme impact — large overshoot, dramatic glow, aggressive deceleration
   */
  impactForce?: number

  /** Fires after the fly-in animation completes (before content reveal). */
  onAnimationComplete?: () => void
}

/** Default fly-in duration in ms. */
export const DEFAULT_DURATION = 600

/** Minimum distance (px) from center to use arc trajectory. Below this, falls back to scale-pop. */
export const MIN_ARC_DISTANCE = 30

/**
 * Resolves a PointRef to pixel coordinates.
 * For `{x, y}` objects: returns as-is.
 * For RefObjects: returns the element's center via getBoundingClientRect.
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
 */
export function resolvePointRelative(ref: PointRef, container: HTMLElement): ResolvedPoint | null {
  const absolute = resolvePoint(ref)
  if (!absolute) return null
  const containerRect = container.getBoundingClientRect()
  return {
    x: absolute.x - containerRect.left,
    y: absolute.y - containerRect.top,
  }
}

/** Returns the center point of a container element. */
export function containerCenter(container: HTMLElement): ResolvedPoint {
  return { x: container.offsetWidth / 2, y: container.offsetHeight / 2 }
}

/** Parallel arrays defining a trajectory: position, timing, scale, and opacity keyframes. */
export interface TrajectoryArrays {
  x: number[]
  y: number[]
  times: number[]
  scale: number[]
  opacity: number[]
}

/** Default impact force (0–1). */
export const DEFAULT_IMPACT_FORCE = 0.5

/**
 * Returns true when reduced motion is preferred.
 * Checks OS media query (works in consumer apps) and the catalog's
 * data-reduced-motion attribute (works in the demo harness).
 * Pass the animation's container element for the attribute check.
 */
export function shouldReduceMotion(el?: Element | null): boolean {
  if (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  ) {
    return true
  }
  return el?.closest("[data-reduced-motion='reduce']") !== null
}

/**
 * Reverses a trajectory: values play backwards, times remapped to 0→1.
 */
export function reverseTrajectory(t: TrajectoryArrays): TrajectoryArrays {
  const n = t.times.length
  const maxTime = t.times[n - 1]!
  return {
    x: [...t.x].reverse(),
    y: [...t.y].reverse(),
    times: [...t.times].reverse().map((v) => (maxTime - v) / maxTime),
    scale: [...t.scale].reverse(),
    opacity: [...t.opacity].reverse(),
  }
}

/** Extended trajectory with per-axis scale, rotation, and skew. */
export interface ExtendedTrajectoryArrays extends TrajectoryArrays {
  scaleX: number[]
  scaleY: number[]
  rotate: number[]
  skewX: number[]
}

/** Reverses an extended trajectory. */
export function reverseExtended(t: ExtendedTrajectoryArrays): ExtendedTrajectoryArrays {
  const n = t.times.length
  const maxTime = t.times[n - 1]!
  const revTimes = [...t.times].reverse().map((v) => (maxTime - v) / maxTime)
  return {
    x: [...t.x].reverse(),
    y: [...t.y].reverse(),
    times: revTimes,
    scale: [...t.scale].reverse(),
    opacity: [...t.opacity].reverse(),
    scaleX: [...t.scaleX].reverse(),
    scaleY: [...t.scaleY].reverse(),
    rotate: [...t.rotate].reverse(),
    skewX: [...t.skewX].reverse(),
  }
}
