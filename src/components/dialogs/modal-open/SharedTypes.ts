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

  /** Overlay backdrop opacity at rest (0–1). Default 0.5. */
  overlayOpacity?: number

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

/** Default overlay opacity. */
export const DEFAULT_OVERLAY_OPACITY = 0.5

/** Minimum distance (px) from center to use arc trajectory. Below this, falls back to scale-pop. */
export const MIN_ARC_DISTANCE = 30

/** Arc offset as fraction of travel distance (controls curve intensity). */
export const ARC_OFFSET_RATIO = 0.2

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

/** Cubic Bezier interpolation: evaluates B(t) for control points p0, p1, p2, p3. */
function cBezier(t: number, p0: number, p1: number, p2: number, p3: number): number {
  const u = 1 - t
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3
}

interface ArcControlPoints {
  cp1: ResolvedPoint
  cp2: ResolvedPoint
}

/**
 * Computes two cubic Bezier control points for the arc from→center.
 *
 * CP1 sits ~1/3 along the path from `from`, offset perpendicular (controls departure).
 * CP2 sits ~2/3 along the path toward `center`, with minimal offset (arrives straight).
 *
 * This distributes the curve evenly — no midpoint bulge like a quadratic Bezier.
 * `force` scales arc intensity: soft = wider sweeping arc, hard = tighter direct path.
 */
function computeArcControlPoints(
  from: ResolvedPoint,
  center: ResolvedPoint,
  force: number
): ArcControlPoints {
  const dx = center.x - from.x
  const dy = center.y - from.y
  const distance = Math.sqrt(dx * dx + dy * dy)

  // Perpendicular direction — always arc "upward" (lower Y)
  const perpX = -dy / distance
  const perpY = dx / distance
  const sign = perpY <= 0 ? 1 : -1

  // Arc offset: soft = wider, hard = tighter
  const arcRatio = 0.25 - force * 0.15
  const arcOffset = distance * arcRatio

  // CP1: 1/3 along path + full perpendicular offset (departure curve)
  const cp1: ResolvedPoint = {
    x: from.x + dx * 0.33 + perpX * arcOffset * sign,
    y: from.y + dy * 0.33 + perpY * arcOffset * sign,
  }

  // CP2: 2/3 along path + small perpendicular offset (arrival straightens out)
  const cp2: ResolvedPoint = {
    x: from.x + dx * 0.67 + perpX * arcOffset * 0.25 * sign,
    y: from.y + dy * 0.67 + perpY * arcOffset * 0.25 * sign,
  }

  return { cp1, cp2 }
}

/** Dense curve sampling resolution. 24 samples over a cubic Bezier. */
const ARC_SAMPLES = 24

/** Parallel arrays defining a trajectory: position, timing, scale, and opacity keyframes. */
export interface TrajectoryArrays {
  x: number[]
  y: number[]
  times: number[]
  scale: number[]
  opacity: number[]
}

/**
 * Appends the settle phase to trajectory arrays.
 * `force` (0–1) controls everything: timing, overshoot magnitude, and shake.
 *
 * - Soft (0): long, gentle glide into position. Overshoot starts late (t=0.85),
 *   very small, no shake. Feels like floating into place.
 * - Hard (1): fast slam. Overshoot at t=0.74, large magnitude, strong shake.
 */
function appendSettlePhase(
  t: TrajectoryArrays,
  force: number,
  dx: number,
  dy: number,
  posOvershoot: number,
  scaleOvershoot: number,
  scaleBounce: number,
  shakeAmplitude: number,
  shakeCycles: number,
  perpX: number,
  perpY: number
): void {
  // Settle timing scales with force: soft = slow/late, hard = fast/early
  const overshootT = 0.85 - force * 0.11 // 0.85 (soft) → 0.74 (hard)
  const bounceT = overshootT + 0.05 + force * 0.03 // soft: +0.05, hard: +0.08

  // Primary overshoot
  t.x.push(dx * posOvershoot)
  t.y.push(dy * posOvershoot)
  t.times.push(overshootT)
  t.scale.push(scaleOvershoot)
  t.opacity.push(1)

  // Primary bounce-back
  t.x.push(-dx * posOvershoot * 0.3)
  t.y.push(-dy * posOvershoot * 0.3)
  t.times.push(bounceT)
  t.scale.push(scaleBounce)
  t.opacity.push(1)

  // Impact shake: scales with force. None at soft, strong at hard.
  if (shakeCycles > 0 && shakeAmplitude > 0) {
    const shakeStart = bounceT + 0.02
    const shakeSpan = 1.0 - shakeStart - 0.04 // fill remaining time minus rest

    for (let i = 0; i < shakeCycles * 2; i++) {
      const progress = (i + 1) / (shakeCycles * 2 + 1)
      const decay = 1 - progress
      const amp = shakeAmplitude * decay * decay
      const dir = i % 2 === 0 ? 1 : -1

      t.x.push(perpX * amp * dir)
      t.y.push(perpY * amp * dir)
      t.times.push(shakeStart + progress * shakeSpan)
      t.scale.push(1.0 + (scaleOvershoot - 1.0) * 0.05 * decay)
      t.opacity.push(1)
    }
  } else {
    // Soft: gentle drift to rest (no shake, no abrupt stop)
    const settleT = bounceT + (1.0 - bounceT) * 0.5
    t.x.push(dx * posOvershoot * 0.02)
    t.y.push(dy * posOvershoot * 0.02)
    t.times.push(settleT)
    t.scale.push(1.0 + (scaleOvershoot - 1.0) * 0.02)
    t.opacity.push(1)
  }

  // Final rest
  t.x.push(0)
  t.y.push(0)
  t.times.push(1)
  t.scale.push(1)
  t.opacity.push(1)
}

/**
 * Speed curve: maps "progress along timeline" (0–1) to "position along Bezier" (0–1).
 *
 * - force=0 (soft): quintic smootherstep (6t⁵-15t⁴+10t³) — very flat in the middle,
 *   nearly constant speed through the arc. Gentle acceleration AND deceleration.
 *   No "drop" feel because there's barely any speed peak to come down from.
 * - force=1 (extreme): aggressive ease-out — explosive launch, dramatic deceleration.
 * - Intermediate: linear blend between the two shapes.
 */
function speedCurve(t: number, force: number): number {
  if (t <= 0) return 0
  if (t >= 1) return 1
  // Quintic smootherstep: flatter in the middle than cubic smoothstep.
  // Max velocity at t=0.5 is only ~1.875x average (vs 1.5x for smoothstep).
  // Result: the arc feels like floating, not rising-then-dropping.
  const smootherstep = t * t * t * (t * (t * 6 - 15) + 10)
  const easeOut = 1 - Math.pow(1 - t, 2.0 + force * 2.5)
  return smootherstep * (1 - force) + easeOut * force
}

/**
 * Inverts speedCurve via binary search: given a target output value,
 * finds the input t that produces it. Used to sample the Bezier at
 * uniform TIME intervals (smooth playback) while baking speed character
 * into the spatial positions.
 */
export function invertSpeedCurve(target: number, force: number): number {
  if (target <= 0) return 0
  if (target >= 1) return 1
  let lo = 0
  let hi = 1
  for (let i = 0; i < 16; i++) {
    // 16 iterations → ~1e-5 precision
    const mid = (lo + hi) / 2
    if (speedCurve(mid, force) < target) lo = mid
    else hi = mid
  }
  return (lo + hi) / 2
}

/** Default impact force (0–1). */
export const DEFAULT_IMPACT_FORCE = 0.5

/**
 * Computes a densely-sampled arc trajectory from `from` to `center`.
 *
 * `force` (0–1) shapes every aspect of the motion character:
 *
 * | Property | force=0 (Soft) | force=0.5 | force=1 (Extreme) |
 * |-|-|-|-|
 * | Initial scale | 0.15 (gentle pop) | 0.06 | 0.01 (explosive) |
 * | Speed curve power | 1.8 (gentle ease) | 3.0 | 4.5 (dramatic decel) |
 * | Scale growth curve | 1.5 (gradual) | 2.2 | 3.0 (explosive) |
 * | Arc width | 28% (sweeping) | 20% | 12% (tight) |
 * | Positional overshoot | 0.5% | 4.5% | 9% |
 * | Scale overshoot | 1.01 | 1.06 | 1.14 |
 * | Impact shake | none | subtle | 4-cycle decaying shudder |
 */
export function computeArcTrajectory(
  from: ResolvedPoint,
  center: ResolvedPoint,
  force = DEFAULT_IMPACT_FORCE
): { x: number[]; y: number[]; times: number[]; scale: number[]; opacity: number[] } {
  const f = Math.max(0, Math.min(1, force))
  const dx = center.x - from.x
  const dy = center.y - from.y
  const distance = Math.sqrt(dx * dx + dy * dy)

  // ── Force-derived physics ──
  const initialScale = 0.15 - f * 0.08 // 0.15 (soft) → 0.07 (extreme) — floor at 0.07 so it's visible at button
  const scaleGrowthPower = 1.5 + f * 1.5 // 1.5 (gradual) → 3.0 (explosive)
  const posOvershoot = 0.005 + f * 0.085 // 0.5% → 9%
  const scaleOvershoot = 1.0 + 0.01 + f * 0.13 // 1.01 → 1.14
  const scaleBounce = 1.0 - (0.005 + f * 0.045) // 0.995 → 0.95

  // Perpendicular shake amplitude (pixels) — zero for soft, up to 6px for extreme
  const shakeAmplitude = f > 0.3 ? (f - 0.3) * 8.5 : 0 // 0 → ~6px
  const shakeCycles = f > 0.3 ? Math.round(2 + f * 2) : 0 // 0 → 4 cycles

  // Below threshold — no arc, just scale-pop at center
  if (distance < MIN_ARC_DISTANCE) {
    return {
      x: [0, 0, 0, 0, 0],
      y: [0, 0, 0, 0, 0],
      times: [0, 0.3, 0.65, 0.85, 1],
      scale: [initialScale, 0.6, scaleOvershoot, scaleBounce, 1.0],
      opacity: [0, 1, 1, 1, 1],
    }
  }

  const { cp1, cp2 } = computeArcControlPoints(from, center, f)

  // Perpendicular unit vector for impact shake direction
  const perpShakeX = -dy / distance
  const perpShakeY = dx / distance

  // ── Flight phase: dense Bezier sampling with force-dependent speed ──
  const flightEnd = 0.7
  const x: number[] = []
  const y: number[] = []
  const times: number[] = []
  const scale: number[] = []
  const opacity: number[] = []

  for (let i = 0; i <= ARC_SAMPLES; i++) {
    const linearT = i / ARC_SAMPLES // 0→1, uniform time progress
    const timelineT = linearT * flightEnd

    // Position: speed character baked into WHERE on the Bezier we are at each time step
    const curveT = invertSpeedCurve(linearT, f)
    x.push(cBezier(curveT, from.x, cp1.x, cp2.x, center.x) - center.x)
    y.push(cBezier(curveT, from.y, cp1.y, cp2.y, center.y) - center.y)
    times.push(timelineT)

    // Scale: follows LINEAR time with its own smooth ease-out (decoupled from trajectory speed)
    const scaleVal =
      initialScale + (1 - initialScale) * (1 - Math.pow(1 - linearT, scaleGrowthPower))
    scale.push(scaleVal)

    // Opacity: start visible at button (0.4) so the spatial origin is clear
    opacity.push(Math.min(1, 0.4 + linearT * 8))
  }

  // ── Settle phase: overshoot + bounce + optional impact shake + rest ──
  const arrays: TrajectoryArrays = { x, y, times, scale, opacity }
  appendSettlePhase(
    arrays,
    f,
    dx,
    dy,
    posOvershoot,
    scaleOvershoot,
    scaleBounce,
    shakeAmplitude,
    shakeCycles,
    perpShakeX,
    perpShakeY
  )

  return arrays
}

/**
 * Generates an SVG path string (cubic Bezier) for CSS offset-path.
 * Coordinates are relative to grid center (0,0).
 */
export function computeSvgArcPath(
  from: ResolvedPoint,
  center: ResolvedPoint,
  force = DEFAULT_IMPACT_FORCE
): string {
  const { cp1, cp2 } = computeArcControlPoints(from, center, force)

  const r = (n: number) => Math.round(n * 100) / 100
  const fx = r(from.x - center.x)
  const fy = r(from.y - center.y)
  const c1x = r(cp1.x - center.x)
  const c1y = r(cp1.y - center.y)
  const c2x = r(cp2.x - center.x)
  const c2y = r(cp2.y - center.y)

  return `path("M ${fx} ${fy} C ${c1x} ${c1y} ${c2x} ${c2y} 0 0")`
}

/**
 * Reverses a trajectory: values play backwards, times remapped to 0→1.
 * Used for the fly-out (close) animation.
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

/**
 * FlyIn CLOSE: dedicated trajectory that arcs back to the trigger button.
 *
 * Unlike reverseTrajectory (which replays the settle phase in reverse for 30%
 * before any spatial movement), this trajectory prioritizes the return flight:
 *
 * Phase 1 (0→10%): Anticipation at center — slight scale bump.
 * Phase 2 (10%→82%): Reverse arc to button, accelerating. Scale shrinks.
 * Phase 3 (82%→100%): Vanish at button.
 */
export function computeArcCloseTrajectory(
  from: ResolvedPoint,
  center: ResolvedPoint,
  force = DEFAULT_IMPACT_FORCE
): TrajectoryArrays {
  const f = Math.max(0, Math.min(1, force))
  const dx = from.x - center.x // direction: center → button
  const dy = from.y - center.y
  const distance = Math.sqrt(dx * dx + dy * dy)

  // Below threshold — just scale-pop
  if (distance < MIN_ARC_DISTANCE) {
    return {
      x: [0, 0, 0],
      y: [0, 0, 0],
      times: [0, 0.6, 1],
      scale: [1, 0.5, 0],
      opacity: [1, 0.5, 0],
    }
  }

  // Reverse the arc control points (center → from)
  const { cp1, cp2 } = computeArcControlPoints(from, center, f)
  // Swap and mirror: fly from center to `from` using reversed control points
  const rCp1 = { x: cp2.x, y: cp2.y }
  const rCp2 = { x: cp1.x, y: cp1.y }

  const x: number[] = []
  const y: number[] = []
  const times: number[] = []
  const scale: number[] = []
  const opacity: number[] = []

  // Phase 1: Anticipation at center (0→10%)
  x.push(0)
  y.push(0)
  times.push(0)
  scale.push(1)
  opacity.push(1)

  x.push(0)
  y.push(0)
  times.push(0.1)
  scale.push(1.04)
  opacity.push(1)

  // Phase 2: Reverse arc to button (10%→82%)
  const flightStart = 0.1
  const flightEnd = 0.82
  const flightSpan = flightEnd - flightStart
  const flightSamples = 16

  for (let i = 1; i <= flightSamples; i++) {
    const t = i / flightSamples
    const tl = flightStart + t * flightSpan

    // Ease-in: accelerates toward button (lower power at high force for trackability)
    const easeInPower = 2.0 - f * 0.4 // 2.0 (soft) → 1.6 (hard)
    const curveT = Math.pow(t, easeInPower)

    // Arc from center to button
    x.push(cBezier(curveT, center.x, rCp1.x, rCp2.x, from.x) - center.x)
    y.push(cBezier(curveT, center.y, rCp1.y, rCp2.y, from.y) - center.y)
    times.push(tl)

    // Scale shrinks: 1.0 → 0.12
    scale.push(1.0 - 0.88 * curveT)

    // Opacity holds until 55% of flight, then fades
    const fadeStart = 0.55
    opacity.push(t < fadeStart ? 1 : 1 - ((t - fadeStart) / (1 - fadeStart)) * 0.6)
  }

  // Phase 3: Vanish at button (82%→100%)
  x.push(dx)
  y.push(dy)
  times.push(0.9)
  scale.push(0.06)
  opacity.push(0.15)

  x.push(dx)
  y.push(dy)
  times.push(1)
  scale.push(0)
  opacity.push(0)

  return { x, y, times, scale, opacity }
}

// ============================================================================
// Extended trajectory (adds scaleX, scaleY, rotate, skewX for richer animations)
// ============================================================================

/** Extended trajectory with per-axis scale, rotation, and skew. */
export interface ExtendedTrajectoryArrays extends TrajectoryArrays {
  scaleX: number[]
  scaleY: number[]
  rotate: number[]
  skewX: number[]
}

/** Reverses an extended trajectory for close animations. */
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

// ============================================================================
// Bubble Pop trajectory
// ============================================================================

/**
 * Bubble Pop: the modal is already AT CENTER from the start. It inflates in
 * place with dramatic wobble — no position movement. The "from" connection
 * is shown by a quick initial translate-snap (first 10% of timeline) from
 * trigger to center, then the remaining 90% is pure inflation + wobble + jello.
 *
 * This is architecturally different from fly-in: the star is SHAPE DEFORMATION,
 * not spatial trajectory.
 */
export function computeBubblePopTrajectory(
  from: ResolvedPoint,
  center: ResolvedPoint,
  force = DEFAULT_IMPACT_FORCE
): ExtendedTrajectoryArrays {
  const f = Math.max(0, Math.min(1, force))

  // Gentle wobble during inflation, jello skew on landing
  const wobbleAmp = 0.03 + f * 0.08 // ±3% (soft) → ±11% — subtle, not jittery
  const skewAmp = 4 + f * 8 // 4° → 12° — the jello IS the character

  const x: number[] = [],
    y: number[] = [],
    times: number[] = []
  const scale: number[] = [],
    opacity: number[] = []
  const scaleX: number[] = [],
    scaleY: number[] = []
  const rotate: number[] = [],
    skewX: number[] = []

  const push = (tl: number, s: number, sx: number, sy: number, sk: number, op: number) => {
    x.push(0)
    y.push(0)
    times.push(tl)
    scale.push(s)
    scaleX.push(sx)
    scaleY.push(sy)
    rotate.push(0)
    skewX.push(sk)
    opacity.push(op)
  }

  // Phase 1: Quick snap from trigger to center (0→12%)
  // Start visible at button so the spatial origin is clear
  x.push(from.x - center.x)
  y.push(from.y - center.y)
  times.push(0)
  scale.push(0.08)
  scaleX.push(1)
  scaleY.push(1)
  rotate.push(0)
  skewX.push(0)
  opacity.push(0.6)

  // Midway: moving toward center, growing
  x.push((from.x - center.x) * 0.3)
  y.push((from.y - center.y) * 0.3)
  times.push(0.06)
  scale.push(0.1)
  scaleX.push(1)
  scaleY.push(1)
  rotate.push(0)
  skewX.push(0)
  opacity.push(0.9)

  push(0.12, 0.15, 1, 1, 0, 1)

  // Phase 2: Inflation with wobble (8%→62%)
  // CRT-inspired: fewer, wider swings. One big overshoot then halving settle.
  const a = wobbleAmp
  const ah = a * 0.5
  const aq = a * 0.25

  //                  time  scale  scaleX       scaleY       skew  opacity
  push(0.2, 0.4, 1 + a, 1 - a, 0, 1) // big first overshoot
  push(0.34, 0.65, 1 - ah, 1 + ah, 0, 1) // bounce back (half amplitude)
  push(0.46, 0.82, 1 + aq, 1 - aq, 0, 1) // settle (quarter)
  push(0.56, 0.94, 1 - aq * 0.5, 1 + aq * 0.5, 0, 1) // micro
  push(0.64, 1.0, 1, 1, 0, 1) // wobble done, scale at 1

  // Phase 3: Jello settle — skewX with halving amplitude (64%→100%)
  // Same CRT feel: one big deformation, then halving decay
  const sk = skewAmp
  const skh = sk * 0.5
  const skq = sk * 0.25

  push(0.72, 1.03, 1, 1, -sk, 1) // big skew
  push(0.81, 0.98, 1, 1, skh, 1) // half bounce
  push(0.89, 1.01, 1, 1, -skq, 1) // quarter
  push(0.95, 1.0, 1, 1, 0, 1) // settle

  // Rest
  push(1.0, 1.0, 1, 1, 0, 1)

  return { x, y, times, scale, scaleX, scaleY, rotate, skewX, opacity }
}

/**
 * Bubble Pop CLOSE: deflates at center then snaps back to button.
 *
 * Unlike reverseExtended (92% reversed wobble/jello at center, 8% snap),
 * this prioritizes the spatial return:
 *
 * Phase 1 (0→30%): Quick deflation at center with reverse wobble character.
 * Phase 2 (30%→82%): Fly to button while shrinking.
 * Phase 3 (82%→100%): Vanish at button.
 */
export function computeBubblePopCloseTrajectory(
  from: ResolvedPoint,
  center: ResolvedPoint,
  force = DEFAULT_IMPACT_FORCE
): ExtendedTrajectoryArrays {
  const f = Math.max(0, Math.min(1, force))
  const dx = from.x - center.x // direction: center → button
  const dy = from.y - center.y

  const wobbleAmp = 0.02 + f * 0.05

  const x: number[] = [],
    y: number[] = [],
    times: number[] = []
  const scale: number[] = [],
    opacity: number[] = []
  const scaleX: number[] = [],
    scaleY: number[] = []
  const rotate: number[] = [],
    skewX: number[] = []

  const push = (
    px: number,
    py: number,
    tl: number,
    s: number,
    sx: number,
    sy: number,
    sk: number,
    op: number
  ) => {
    x.push(px)
    y.push(py)
    times.push(tl)
    scale.push(s)
    scaleX.push(sx)
    scaleY.push(sy)
    rotate.push(0)
    skewX.push(sk)
    opacity.push(op)
  }

  // Phase 1: Deflation at center (0→30%) — reverse of the inflation wobble
  const a = wobbleAmp
  push(0, 0, 0, 1.0, 1, 1, 0, 1) // rest
  push(0, 0, 0.08, 0.92, 1 - a, 1 + a, 0, 1) // first squeeze
  push(0, 0, 0.18, 0.6, 1 + a * 0.5, 1 - a * 0.5, 0, 1) // bounce
  push(0, 0, 0.3, 0.2, 1, 1, 0, 1) // deflated

  // Phase 2: Fly to button (30%→82%)
  const flightStart = 0.3
  const flightEnd = 0.82
  const flightSpan = flightEnd - flightStart
  const flightSamples = 8

  for (let i = 1; i <= flightSamples; i++) {
    const t = i / flightSamples
    const tl = flightStart + t * flightSpan
    const easeInPower = 1.8 - f * 0.3 // 1.8 (soft) → 1.5 (hard)
    const curveT = Math.pow(t, easeInPower)

    push(
      dx * curveT,
      dy * curveT,
      tl,
      0.2 - 0.12 * curveT, // 0.2 → 0.08
      1,
      1,
      0,
      t < 0.5 ? 1 : 1 - ((t - 0.5) / 0.5) * 0.6
    )
  }

  // Phase 3: Vanish at button (82%→100%)
  push(dx, dy, 0.9, 0.04, 1, 1, 0, 0.15)
  push(dx, dy, 1.0, 0, 1, 1, 0, 0)

  return { x, y, times, scale, scaleX, scaleY, rotate, skewX, opacity }
}

// ============================================================================
// Comic Punch trajectory
// ============================================================================

/**
 * Comic Punch: FAST straight-line arrival (first 25%), then the ENTIRE
 * remaining 75% is dominated by exaggerated squash-stretch impact.
 * The squash-stretch is the star — not the travel.
 */
export function computeComicPunchTrajectory(
  from: ResolvedPoint,
  center: ResolvedPoint,
  force = DEFAULT_IMPACT_FORCE
): ExtendedTrajectoryArrays {
  const f = Math.max(0, Math.min(1, force))
  const dx = center.x - from.x
  const dy = center.y - from.y
  const angle = Math.atan2(dy, dx)

  // Force-derived physics
  const tiltAngle = 3 + f * 8 // 3° → 11° rotation during flight
  const squashX = 0.88 - f * 0.18 // scaleX squash: 0.88 (soft) → 0.70 (hard)
  const stretchY = 1 + (1 - squashX) * 1.3 // proportional stretch
  const bounceCycles = Math.round(1 + f * 3) // 1 → 4

  const x: number[] = [],
    y: number[] = [],
    times: number[] = []
  const scale: number[] = [],
    opacity: number[] = []
  const scaleX: number[] = [],
    scaleY: number[] = []
  const rotate: number[] = [],
    skewX: number[] = []

  // Phase 1: FAST punch flight — scales with force so higher force still has trackable movement
  // Soft: 25% of timeline = long enough to see. Hard: 32% to compensate for shorter durations.
  const flightEnd = 0.25 + f * 0.07
  const flightSamples = 8
  // Ease-out power: soft = cubic (punchy), hard = slightly less aggressive so the eye can track
  const easeOutPower = 3 - f * 0.7 // 3.0 (soft) → 2.3 (hard)

  for (let i = 0; i <= flightSamples; i++) {
    const t = i / flightSamples
    const tl = t * flightEnd
    const curveT = 1 - Math.pow(1 - t, easeOutPower)

    x.push(from.x + dx * curveT - center.x)
    y.push(from.y + dy * curveT - center.y)
    times.push(tl)

    // Larger initial scale at higher force — more visible at button origin
    const initialScale = 0.3 + f * 0.12 // 0.3 (soft) → 0.42 (hard)
    scale.push(initialScale + (1 - initialScale) * curveT)
    scaleX.push(1)
    scaleY.push(1)
    const tiltDir = angle > 0 ? 1 : -1
    rotate.push(tiltAngle * tiltDir * (1 - curveT))
    skewX.push(0)
    // Start visible at button so the spatial origin is clear — comic panels don't fade in
    opacity.push(Math.min(1, 0.5 + t * 4))
  }

  // Phase 2: IMPACT squash-stretch bounces — this IS the animation
  const impactStart = flightEnd
  const impactSpan = 0.98 - flightEnd

  for (let cycle = 0; cycle < bounceCycles; cycle++) {
    const cycleProgress = cycle / bounceCycles
    const decay = Math.pow(1 - cycleProgress, 1.5)
    const cycleDuration = impactSpan / bounceCycles
    const cycleStart = impactStart + cycleProgress * impactSpan

    // Squash peak (scaleX compresses, scaleY extends)
    const squashT = cycleStart + cycleDuration * 0.35
    x.push(0)
    y.push(0)
    times.push(squashT)
    scale.push(1)
    scaleX.push(1 - (1 - squashX) * decay)
    scaleY.push(1 + (stretchY - 1) * decay)
    rotate.push(0)
    skewX.push(0)
    opacity.push(1)

    // Rebound peak (scaleX extends, scaleY compresses)
    const reboundT = cycleStart + cycleDuration * 0.7
    x.push(0)
    y.push(0)
    times.push(reboundT)
    scale.push(1)
    scaleX.push(1 + (stretchY - 1) * decay * 0.6)
    scaleY.push(1 - (1 - squashX) * decay * 0.5)
    rotate.push(0)
    skewX.push(0)
    opacity.push(1)
  }

  // Rest
  x.push(0)
  y.push(0)
  times.push(1)
  scale.push(1)
  scaleX.push(1)
  scaleY.push(1)
  rotate.push(0)
  skewX.push(0)
  opacity.push(1)

  return { x, y, times, scale, scaleX, scaleY, rotate, skewX, opacity }
}

/**
 * Comic Punch CLOSE: dedicated trajectory that flies the modal back INTO
 * the trigger button, creating a clear spatial connection on dismiss.
 *
 * Unlike the generic reverseExtended (which replays squash-stretch for 75%
 * of the close before any spatial movement), this trajectory prioritizes
 * the return-to-button flight:
 *
 * Phase 1 (0→12%): Anticipation squash at center — gathers energy.
 * Phase 2 (12%→78%): Fly back to button with ease-in acceleration (sucked back).
 * Phase 3 (78%→100%): Vanish at button — shrink to nothing.
 */
export function computeComicPunchCloseTrajectory(
  from: ResolvedPoint,
  center: ResolvedPoint,
  force = DEFAULT_IMPACT_FORCE
): ExtendedTrajectoryArrays {
  const f = Math.max(0, Math.min(1, force))
  const dx = from.x - center.x // direction: center → button
  const dy = from.y - center.y
  const angle = Math.atan2(dy, dx)

  // Force-derived close physics
  const anticipationSquash = 0.9 - f * 0.08 // scaleX: 0.90 (soft) → 0.82 (hard)
  const anticipationStretch = 1 + (1 - anticipationSquash) * 1.2 // scaleY: proportional
  const tiltAngle = 2 + f * 6 // rotation during flight: 2° → 8°

  const x: number[] = [],
    y: number[] = [],
    times: number[] = []
  const scale: number[] = [],
    opacity: number[] = []
  const scaleX: number[] = [],
    scaleY: number[] = []
  const rotate: number[] = [],
    skewX: number[] = []

  // Phase 1: Anticipation squash at center (0→12%)
  // Rest position
  x.push(0)
  y.push(0)
  times.push(0)
  scale.push(1)
  scaleX.push(1)
  scaleY.push(1)
  rotate.push(0)
  skewX.push(0)
  opacity.push(1)

  // Squash: compress toward button direction (gathering energy)
  x.push(0)
  y.push(0)
  times.push(0.07)
  scale.push(1)
  scaleX.push(anticipationSquash)
  scaleY.push(anticipationStretch)
  rotate.push(0)
  skewX.push(0)
  opacity.push(1)

  // Release: snap back toward normal before launching
  x.push(0)
  y.push(0)
  times.push(0.12)
  scale.push(1.02)
  scaleX.push(1.03)
  scaleY.push(0.97)
  rotate.push(0)
  skewX.push(0)
  opacity.push(1)

  // Phase 2: Fly back to button (12%→78%) — ease-in (accelerating = sucked back)
  const flightStart = 0.12
  const flightEnd = 0.78
  const flightSpan = flightEnd - flightStart
  const flightSamples = 10

  for (let i = 1; i <= flightSamples; i++) {
    const t = i / flightSamples // 0→1 within flight phase
    const tl = flightStart + t * flightSpan

    // Ease-in: starts slow, accelerates — like being pulled/sucked into button.
    // Power is LOWER at high force so the flight stays trackable with shorter durations.
    // At t=0.5: soft → 0.5^2.0 = 25% traveled, hard → 0.5^1.6 = 33% traveled.
    const curveT = Math.pow(t, 2.0 - f * 0.4) // 2.0 (soft) → 1.6 (hard)

    x.push(dx * curveT)
    y.push(dy * curveT)
    times.push(tl)

    // Scale shrinks along flight: 1.0 → 0.3
    const flightScale = 1.0 - 0.7 * curveT
    scale.push(flightScale)
    scaleX.push(1)
    scaleY.push(1)

    // Tilt toward button direction
    const tiltDir = angle > 0 ? 1 : -1
    rotate.push(tiltAngle * tiltDir * curveT)
    skewX.push(0)

    // Opacity holds until 55% of flight, then fades
    const fadeStart = 0.55
    opacity.push(t < fadeStart ? 1 : 1 - ((t - fadeStart) / (1 - fadeStart)) * 0.6)
  }

  // Phase 3: Vanish at button (78%→100%)
  // Quick shrink to near-zero
  x.push(dx)
  y.push(dy)
  times.push(0.88)
  scale.push(0.12)
  scaleX.push(1)
  scaleY.push(1)
  rotate.push(0)
  skewX.push(0)
  opacity.push(0.2)

  // Final vanish
  x.push(dx)
  y.push(dy)
  times.push(1)
  scale.push(0)
  scaleX.push(1)
  scaleY.push(1)
  rotate.push(0)
  skewX.push(0)
  opacity.push(0)

  return { x, y, times, scale, scaleX, scaleY, rotate, skewX, opacity }
}

// ============================================================================
// Slam Down trajectory
// ============================================================================

/**
 * Slam Down: dramatically different two-phase trajectory.
 * Phase 1: modal ROCKETS upward from trigger (quick, explosive).
 * Phase 2: apex HANG — the modal floats at the top, building tension.
 * Phase 3: GRAVITY SLAM — accelerating fall to center (cubic ease-in = gravity).
 * Phase 4: AFTERSHOCK — heavy bounces with scaleY compression on each impact.
 *
 * The apex hang and gravity-slam are what make this visually unique.
 */
export function computeSlamDownTrajectory(
  from: ResolvedPoint,
  center: ResolvedPoint,
  force = DEFAULT_IMPACT_FORCE
): ExtendedTrajectoryArrays {
  const f = Math.max(0, Math.min(1, force))
  const dx = center.x - from.x

  // Force-derived physics — much more dramatic ranges
  const launchHeight = 60 + f * 200 // 60px (soft) → 260px (hard) above center
  const apexHangPct = 0.06 + f * 0.1 // 6% → 16% of timeline as dramatic pause
  const aftershocks = Math.round(1 + f * 3) // 1 → 4
  const aftershockAmp = 8 + f * 30 // 8px → 38px
  // Impact scaleY compression: the modal squishes vertically on each slam
  const impactSquashY = 0.95 - f * 0.12 // 0.95 → 0.83

  const x: number[] = [],
    y: number[] = [],
    times: number[] = []
  const scale: number[] = [],
    opacity: number[] = []
  const scaleX: number[] = [],
    scaleY: number[] = []
  const rotate: number[] = [],
    skewX: number[] = []

  const ext = () => {
    scaleX.push(1)
    scaleY.push(1)
    rotate.push(0)
    skewX.push(0)
  }
  const extSq = (sy: number) => {
    scaleX.push(1)
    scaleY.push(sy)
    rotate.push(0)
    skewX.push(0)
  }

  // Phase 1: LAUNCH UP from trigger (0→22%)
  const launchEnd = 0.22
  const launchSamples = 8
  for (let i = 0; i <= launchSamples; i++) {
    const t = i / launchSamples
    const tl = t * launchEnd
    const xT = 1 - Math.pow(1 - t, 2)
    x.push(from.x + dx * xT - center.x)
    // Y: ease-out upward from trigger to apex
    const yT = 1 - Math.pow(1 - t, 2.5)
    y.push(from.y * (1 - yT) + (center.y - launchHeight) * yT - center.y)
    times.push(tl)
    scale.push(0.3 + 0.5 * t)
    // Start visible at button (0.5 opacity) so the spatial origin is clear
    opacity.push(Math.min(1, 0.5 + t * 3))
    ext()
  }

  // Phase 2: APEX HANG — dramatic tension pause (22→22+hang%)
  const hangEnd = launchEnd + apexHangPct
  // Gentle float at apex
  x.push(0)
  y.push(-launchHeight)
  times.push(launchEnd + apexHangPct * 0.3)
  scale.push(0.85)
  opacity.push(1)
  ext()
  x.push(0)
  y.push(-launchHeight + 3)
  times.push(launchEnd + apexHangPct * 0.6)
  scale.push(0.87)
  opacity.push(1)
  ext()
  x.push(0)
  y.push(-launchHeight)
  times.push(hangEnd)
  scale.push(0.85)
  opacity.push(1)
  ext()

  // Phase 3: GRAVITY SLAM (hangEnd→65%) — cubic ease-in (accelerating fall)
  const slamEnd = 0.65
  const slamSamples = 10
  for (let i = 1; i <= slamSamples; i++) {
    const t = i / slamSamples
    const tl = hangEnd + t * (slamEnd - hangEnd)
    const gravity = t * t * t // cubic ease-in = gravity acceleration
    x.push(0)
    y.push(-launchHeight * (1 - gravity))
    times.push(tl)
    scale.push(0.85 + 0.15 * gravity)
    opacity.push(1)
    // Slight scaleY stretch during fall (anticipation of impact)
    extSq(1 + 0.05 * gravity)
  }

  // Phase 4: AFTERSHOCK bounces with scaleY compression
  const bounceStart = slamEnd
  const bounceSpan = 1 - bounceStart - 0.03
  for (let i = 0; i < aftershocks; i++) {
    const p = i / aftershocks
    const decay = Math.pow(1 - p, 1.8)

    // Impact: squish down
    const impactT = bounceStart + p * bounceSpan + (bounceSpan / aftershocks) * 0.15
    x.push(0)
    y.push(0)
    times.push(impactT)
    scale.push(1)
    opacity.push(1)
    extSq(impactSquashY + (1 - impactSquashY) * (1 - decay))

    // Rebound: bounce up
    const reboundT = bounceStart + p * bounceSpan + (bounceSpan / aftershocks) * 0.6
    x.push(0)
    y.push(-aftershockAmp * decay)
    times.push(reboundT)
    scale.push(1 + 0.02 * decay)
    opacity.push(1)
    ext()
  }

  // Rest
  x.push(0)
  y.push(0)
  times.push(1)
  scale.push(1)
  opacity.push(1)
  ext()

  return { x, y, times, scale, scaleX, scaleY, rotate, skewX, opacity }
}

/**
 * Slam Down CLOSE: lifts from center, then drops to button with gravity.
 *
 * Unlike reverseExtended (which replays aftershock bounces for 35% before
 * any spatial movement), this prioritizes the return flight:
 *
 * Phase 1 (0→8%): Brief anticipation at center.
 * Phase 2 (8%→35%): Rise upward from center (reverse of the slam).
 * Phase 3 (35%→80%): Accelerating fall to button (gravity curve).
 * Phase 4 (80%→100%): Vanish at button.
 */
export function computeSlamDownCloseTrajectory(
  from: ResolvedPoint,
  center: ResolvedPoint,
  force = DEFAULT_IMPACT_FORCE
): ExtendedTrajectoryArrays {
  const f = Math.max(0, Math.min(1, force))
  const dx = from.x - center.x // direction: center → button
  const dy = from.y - center.y

  // Rise height: proportional to force, but shorter than open's launch
  const riseHeight = 40 + f * 100 // 40px (soft) → 140px (hard) — less than open's 60→260

  const x: number[] = [],
    y: number[] = [],
    times: number[] = []
  const scale: number[] = [],
    opacity: number[] = []
  const scaleX: number[] = [],
    scaleY: number[] = []
  const rotate: number[] = [],
    skewX: number[] = []

  const ext = () => {
    scaleX.push(1)
    scaleY.push(1)
    rotate.push(0)
    skewX.push(0)
  }

  // Phase 1: Anticipation at center (0→8%)
  x.push(0)
  y.push(0)
  times.push(0)
  scale.push(1)
  opacity.push(1)
  ext()

  // Slight scaleY stretch (anticipation of lift-off)
  x.push(0)
  y.push(0)
  times.push(0.08)
  scale.push(1.02)
  opacity.push(1)
  scaleX.push(1)
  scaleY.push(1.04)
  rotate.push(0)
  skewX.push(0)

  // Phase 2: Rise upward (8%→35%) — ease-out lift
  const riseStart = 0.08
  const riseEnd = 0.35
  const riseSpan = riseEnd - riseStart
  const riseSamples = 6

  for (let i = 1; i <= riseSamples; i++) {
    const t = i / riseSamples
    const tl = riseStart + t * riseSpan
    const curveT = 1 - Math.pow(1 - t, 2) // ease-out rise

    x.push(dx * 0.15 * curveT) // slight horizontal drift toward button
    y.push(-riseHeight * curveT) // rise upward
    times.push(tl)
    scale.push(1.0 - 0.15 * curveT) // slight shrink during rise
    opacity.push(1)
    ext()
  }

  // Phase 3: Gravity fall to button (35%→80%) — ease-in (accelerating)
  const fallStart = riseEnd
  const fallEnd = 0.8
  const fallSpan = fallEnd - fallStart
  const fallSamples = 8

  // Start position: slightly drifted horizontally, risen vertically
  const riseEndX = dx * 0.15
  const riseEndY = -riseHeight

  for (let i = 1; i <= fallSamples; i++) {
    const t = i / fallSamples
    const tl = fallStart + t * fallSpan
    // Gravity: cubic ease-in (accelerating fall)
    const gravity = t * t * t

    // X: ease toward button
    const xEase = Math.pow(t, 1.5)
    x.push(riseEndX + (dx - riseEndX) * xEase)
    // Y: fall from rise apex to button Y
    y.push(riseEndY + (dy - riseEndY) * gravity)
    times.push(tl)

    // Scale shrinks: 0.85 → 0.2
    scale.push(0.85 - 0.65 * gravity)
    // Opacity fades in second half
    opacity.push(t < 0.5 ? 1 : 1 - ((t - 0.5) / 0.5) * 0.6)
    ext()
  }

  // Phase 4: Vanish at button (80%→100%)
  x.push(dx)
  y.push(dy)
  times.push(0.9)
  scale.push(0.08)
  opacity.push(0.15)
  ext()

  x.push(dx)
  y.push(dy)
  times.push(1)
  scale.push(0)
  opacity.push(0)
  ext()

  return { x, y, times, scale, scaleX, scaleY, rotate, skewX, opacity }
}

// Wanted Poster unroll logic is in the component files (uses height animation, not scaleY).
