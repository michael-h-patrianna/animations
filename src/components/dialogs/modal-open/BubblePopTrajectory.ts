/**
 * BubblePop trajectory math — inflate-in-place with wobble and jello settle.
 * Used by both css/ and framer/ BubblePop variants.
 */

import type { ExtendedTrajectoryArrays, ResolvedPoint } from './SharedTypes'
import { DEFAULT_IMPACT_FORCE } from './SharedTypes'

/**
 * Bubble Pop: the modal is already AT CENTER from the start. It inflates in
 * place with dramatic wobble — no position movement. The "from" connection
 * is shown by a quick initial translate-snap (first 12% of timeline) from
 * trigger to center, then the remaining 88% is pure inflation + wobble + jello.
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

  const originX = from.x - center.x
  const originY = from.y - center.y

  // Phase 1: Snap from button to center (0→10%)
  // Modal starts visible at button (scale 0.35, full opacity) — the snap IS the emergence.
  const pushAt = (
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

  pushAt(originX, originY, 0, 0.12, 1, 1, 0, 1) // visible seed at button
  pushAt(originX * 0.3, originY * 0.3, 0.05, 0.14, 1, 1, 0, 1) // growing toward center
  push(0.1, 0.15, 1, 1, 0, 1) // at center, ready to inflate

  // Phase 2: Inflation with wobble (10%→64%)
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
