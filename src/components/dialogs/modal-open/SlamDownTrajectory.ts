/**
 * SlamDown trajectory math — launch up, apex hang, gravity slam, aftershocks.
 * Used by both css/ and framer/ SlamDown variants.
 */

import type { ExtendedTrajectoryArrays, ResolvedPoint } from './SharedTypes'
import { DEFAULT_IMPACT_FORCE } from './SharedTypes'

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

  // ── Origin pop: modal appears at button before launching ──
  const popEnd = 0.07
  const originX = from.x - center.x
  const originY = from.y - center.y

  x.push(originX, originX, originX)
  y.push(originY, originY, originY)
  times.push(0, 0.03, popEnd)
  scale.push(0, 0.35, 0.3)
  opacity.push(0, 1, 1)
  ext()
  ext()
  ext()

  // Phase 1: LAUNCH UP from trigger (7%→22%)
  const launchStart = popEnd
  const launchEnd = 0.22
  const launchSamples = 8
  for (let i = 1; i <= launchSamples; i++) {
    const t = i / launchSamples
    const tl = launchStart + t * (launchEnd - launchStart)
    const xT = 1 - Math.pow(1 - t, 2)
    x.push(from.x + dx * xT - center.x)
    // Y: ease-out upward from trigger to apex
    const yT = 1 - Math.pow(1 - t, 2.5)
    y.push(from.y * (1 - yT) + (center.y - launchHeight) * yT - center.y)
    times.push(tl)
    scale.push(0.3 + 0.5 * t) // from pop scale upward
    opacity.push(1)
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
