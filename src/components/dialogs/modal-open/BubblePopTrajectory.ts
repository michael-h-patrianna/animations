/**
 * BubblePop trajectory math — inflate-in-place with wobble and jello settle.
 * Used by both css/ and framer/ BubblePop variants.
 */

import type { ExtendedTrajectoryArrays, ResolvedPoint } from './SharedTypes'
import { DEFAULT_IMPACT_FORCE } from './SharedTypes'

/**
 * Bubble Pop: visible seed emerges at button, travels to center, then inflates
 * in place with dramatic wobble and jello settle.
 *
 * Phase 1 (0→5%):   Seed appears at button — brief hold so the eye registers it.
 * Phase 1b (5→25%):  Ease-out travel from button to center, growing slightly.
 * Phase 2 (25→72%):  Inflation with asymmetric wobble (CRT-style halving decay).
 * Phase 3 (72→100%): Jello skew settle.
 *
 * The star is still SHAPE DEFORMATION — the spatial travel exists only to
 * establish origin connection, not as the main motion.
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

  // Seed scale: large enough to be visible at button, force-dependent
  const seedScale = 0.25 - f * 0.07 // 0.25 (soft) → 0.18 (hard)

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

  // Phase 1: Emerge at button (0→5%) — visible seed, hold for eye registration
  pushAt(originX, originY, 0, seedScale, 1, 1, 0, 1)
  pushAt(originX, originY, 0.05, seedScale + 0.02, 1, 1, 0, 1) // slight growth beat

  // Phase 1b: Travel from button to center (5→25%) — ease-out curve (fast departure,
  // slow arrival) so the motion reads as "launching from button" not "teleporting."
  // 8 samples for smooth interpolation with baked-in ease-out.
  const travelStart = 0.05
  const travelEnd = 0.25
  const travelSpan = travelEnd - travelStart
  const travelSamples = 8

  for (let i = 1; i <= travelSamples; i++) {
    const t = i / travelSamples // 0→1 linear progress
    const easeOut = 1 - Math.pow(1 - t, 2.2) // ease-out: fast start, slow arrival
    const tl = travelStart + t * travelSpan
    const posT = 1 - easeOut // 1→0 (button→center)
    pushAt(
      originX * posT,
      originY * posT,
      tl,
      seedScale + 0.02 * (1 - t), // gentle shrink: seedScale+0.02 → seedScale
      1,
      1,
      0,
      1
    )
  }

  // Phase 2: Inflation with wobble (25%→72%)
  // CRT-inspired: fewer, wider swings. One big overshoot then halving settle.
  const a = wobbleAmp
  const ah = a * 0.5
  const aq = a * 0.25

  //                   time   scale  scaleX       scaleY       skew  opacity
  push(0.34, 0.4, 1 + a, 1 - a, 0, 1) // big first overshoot
  push(0.44, 0.65, 1 - ah, 1 + ah, 0, 1) // bounce back (half amplitude)
  push(0.53, 0.82, 1 + aq, 1 - aq, 0, 1) // settle (quarter)
  push(0.63, 0.94, 1 - aq * 0.5, 1 + aq * 0.5, 0, 1) // micro
  push(0.72, 1.0, 1, 1, 0, 1) // wobble done, scale at 1

  // Phase 3: Jello settle — skewX with halving amplitude (72%→100%)
  // Same CRT feel: one big deformation, then halving decay
  const sk = skewAmp
  const skh = sk * 0.5
  const skq = sk * 0.25

  push(0.78, 1.03, 1, 1, -sk, 1) // big skew
  push(0.85, 0.98, 1, 1, skh, 1) // half bounce
  push(0.91, 1.01, 1, 1, -skq, 1) // quarter
  push(0.96, 1.0, 1, 1, 0, 1) // settle

  // Rest
  push(1.0, 1.0, 1, 1, 0, 1)

  return { x, y, times, scale, scaleX, scaleY, rotate, skewX, opacity }
}

/**
 * Bubble Pop CLOSE: deflates at center, flies back to button, vanishes.
 *
 * Phase 1 (0→18%):  Quick deflation at center with reverse wobble character.
 * Phase 2 (18→82%): Fly to button — modal stays visible throughout flight.
 * Phase 3 (82→100%): Hold at button, then vanish.
 *
 * Key difference from previous version: deflation phase is shorter (18% vs 30%)
 * so the spatial return dominates, and the modal stays at a recognizable scale
 * during flight (0.22→0.15) instead of shrinking to an invisible dot (0.08).
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
  // Match open seed scale so close "arrives" at same size open "departed"
  const seedScale = 0.25 - f * 0.07 // 0.25 (soft) → 0.18 (hard)

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

  // Phase 1: Deflation at center (0→18%) — reverse wobble, faster than before
  const a = wobbleAmp
  push(0, 0, 0, 1.0, 1, 1, 0, 1) // rest
  push(0, 0, 0.05, 0.92, 1 - a, 1 + a, 0, 1) // first squeeze
  push(0, 0, 0.11, 0.55, 1 + a * 0.5, 1 - a * 0.5, 0, 1) // bounce
  push(0, 0, 0.18, seedScale, 1, 1, 0, 1) // deflated to seed size

  // Phase 2: Fly to button (18%→82%) — visible throughout, gentle shrink
  const flightStart = 0.18
  const flightEnd = 0.82
  const flightSpan = flightEnd - flightStart
  const flightSamples = 8

  for (let i = 1; i <= flightSamples; i++) {
    const t = i / flightSamples
    const tl = flightStart + t * flightSpan
    const easeInPower = 1.8 - f * 0.3 // 1.8 (soft) → 1.5 (hard)
    const curveT = Math.pow(t, easeInPower)

    // Scale: seedScale → seedScale * 0.6 (visible throughout, not invisible dots)
    const flightScale = seedScale * (1 - 0.4 * curveT)

    // Opacity: holds at 1.0 until 60% of flight, then gentle fade
    const fadeStart = 0.6
    const flightOpacity = t < fadeStart ? 1 : 1 - ((t - fadeStart) / (1 - fadeStart)) * 0.5

    push(dx * curveT, dy * curveT, tl, flightScale, 1, 1, 0, flightOpacity)
  }

  // Phase 3: Hold at button, then vanish (82%→100%)
  push(dx, dy, 0.88, seedScale * 0.4, 1, 1, 0, 0.35)
  push(dx, dy, 0.94, seedScale * 0.15, 1, 1, 0, 0.12)
  push(dx, dy, 1.0, 0, 1, 1, 0, 0)

  return { x, y, times, scale, scaleX, scaleY, rotate, skewX, opacity }
}
