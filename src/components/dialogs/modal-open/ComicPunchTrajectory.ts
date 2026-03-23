/**
 * ComicPunch trajectory math — fast punch flight with squash-stretch impact.
 * Used by both css/ and framer/ ComicPunch variants.
 */

import type { ExtendedTrajectoryArrays, ResolvedPoint } from './SharedTypes'
import { DEFAULT_IMPACT_FORCE } from './SharedTypes'

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

  // ── Origin pop: modal appears at button before punching ──
  const popEnd = 0.07
  const originX = from.x - center.x
  const originY = from.y - center.y

  x.push(originX, originX, originX)
  y.push(originY, originY, originY)
  times.push(0, 0.03, popEnd)
  scale.push(0, 0.35, 0.30)
  scaleX.push(1, 1, 1)
  scaleY.push(1, 1, 1)
  rotate.push(0, 0, 0)
  skewX.push(0, 0, 0)
  opacity.push(0, 1, 1)

  // Phase 1: FAST punch flight from button to center
  const flightStart = popEnd
  const flightEnd = flightStart + 0.25 + f * 0.07
  const flightSamples = 8
  const easeOutPower = 3 - f * 0.7 // 3.0 (soft) → 2.3 (hard)

  for (let i = 1; i <= flightSamples; i++) {
    const t = i / flightSamples
    const tl = flightStart + t * (flightEnd - flightStart)
    const curveT = 1 - Math.pow(1 - t, easeOutPower)

    x.push(from.x + dx * curveT - center.x)
    y.push(from.y + dy * curveT - center.y)
    times.push(tl)

    scale.push(0.30 + 0.70 * curveT) // from pop scale to 1.0
    scaleX.push(1)
    scaleY.push(1)
    const tiltDir = angle > 0 ? 1 : -1
    rotate.push(tiltAngle * tiltDir * (1 - curveT))
    skewX.push(0)
    opacity.push(1)
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
