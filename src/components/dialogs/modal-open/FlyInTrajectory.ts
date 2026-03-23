/**
 * FlyIn trajectory math — arc flight from trigger to center with impact settle.
 * Used by both css/ and framer/ FlyIn variants.
 */

import type { ResolvedPoint, TrajectoryArrays } from './SharedTypes'
import { DEFAULT_IMPACT_FORCE, MIN_ARC_DISTANCE } from './SharedTypes'

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

/**
 * Computes a densely-sampled arc trajectory from `from` to `center`.
 *
 * `force` (0–1) shapes every aspect of the motion character:
 *
 * | Property | force=0 (Soft) | force=0.5 | force=1 (Extreme) |
 * |-|-|-|-|
 * | Initial scale | 0.15 (gentle pop) | 0.11 | 0.07 (visible at button) |
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
): TrajectoryArrays {
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
  // Modal starts visible at the button (scale 0.35, full opacity) so the flight
  // itself IS the "emerging from button" — no separate pop phase needed.
  const flightEnd = 0.7
  const x: number[] = []
  const y: number[] = []
  const times: number[] = []
  const scale: number[] = []
  const opacity: number[] = []

  for (let i = 0; i <= ARC_SAMPLES; i++) {
    const linearT = i / ARC_SAMPLES
    const timelineT = linearT * flightEnd

    const curveT = invertSpeedCurve(linearT, f)
    x.push(cBezier(curveT, from.x, cp1.x, cp2.x, center.x) - center.x)
    y.push(cBezier(curveT, from.y, cp1.y, cp2.y, center.y) - center.y)
    times.push(timelineT)

    // Scale: start at 0.35 (visible at button) and grow via ease-out
    const growthT = 1 - Math.pow(1 - linearT, scaleGrowthPower)
    scale.push(0.35 + 0.65 * growthT)

    // Full opacity from the start — the modal is immediately visible at the button
    opacity.push(1)
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
