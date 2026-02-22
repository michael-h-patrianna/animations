import * as m from 'motion/react-m'
import { useMemo } from 'react'

import {
  CELEBRATION_COLORS,
  CONFETTI_SHAPES,
  deg2rad,
  pickRandom,
  randBetween,
  type ConfettiShape,
} from '../utils'

/* ─── Types ─── */

type BurstConfig = {
  cx: number
  cy: number
  delay: number
  colors: readonly string[]
}

type Ray = {
  id: number
  angle: number
  length: number
  color: string
  cx: number
  cy: number
  delay: number
  dur: number
  layer: 'bg' | 'fg'
}

type Trail = {
  id: number
  shape: ConfettiShape
  color: string
  xs: number[]
  ys: number[]
  scales: number[]
  opacities: number[]
  rotZ: number
  delay: number
  dur: number
  layer: 'bg' | 'fg'
}

type Sparkle = {
  id: number
  x: number
  y: number
  delay: number
  size: number
}

/* ─── Constants ─── */

/** Three burst positions offset from card center, staggered in time. */
const BURSTS: BurstConfig[] = [
  { cx: -35, cy: -18, delay: 0, colors: [CELEBRATION_COLORS[0], CELEBRATION_COLORS[3], CELEBRATION_COLORS[4]] },
  { cx: 32, cy: -28, delay: 0.3, colors: [CELEBRATION_COLORS[2], CELEBRATION_COLORS[4], CELEBRATION_COLORS[1]] },
  { cx: 4, cy: 8, delay: 0.55, colors: [CELEBRATION_COLORS[3], CELEBRATION_COLORS[0], CELEBRATION_COLORS[2]] },
]

const RAYS_PER_BURST = 14
const TRAILS_PER_BURST = 10
const SPARKLES_PER_BURST = 8

/** 12 stops for trail paths — minimal curvature (straight radial + gravity droop). */
const NUM_STOPS = 12
const STOPS = Array.from({ length: NUM_STOPS }, (_, i) => i / (NUM_STOPS - 1))

/* ─── Helpers ─── */

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

/** Scale envelope for trail particles. */
function trailScaleAt(t: number, peak: number): number {
  if (t < 0.08) return peak * (t / 0.08) * 0.4
  if (t < 0.2) return peak * (0.4 + 0.6 * ((t - 0.08) / 0.12))
  if (t < 0.5) return peak
  if (t < 0.75) return peak * (1 - 0.3 * ((t - 0.5) / 0.25))
  return peak * (0.7 - 0.7 * ((t - 0.75) / 0.25))
}

/** Opacity envelope for trail particles. */
function trailOpacityAt(t: number, peak: number): number {
  if (t < 0.06) return peak * (t / 0.06) * 0.5
  if (t < 0.15) return peak * (0.5 + 0.5 * ((t - 0.06) / 0.09))
  if (t < 0.45) return peak
  if (t < 0.7) return peak * (1 - 0.5 * ((t - 0.45) / 0.25))
  return peak * (0.5 - 0.5 * ((t - 0.7) / 0.3))
}

/* ─── Generators ─── */

/**
 * 14 spark rays per burst — thin gradient lines shooting radially outward.
 * Angles use "screen-clockwise from up" convention (0°=up, 90°=right).
 */
function makeRays(): Ray[] {
  const rays: Ray[] = []
  let id = 0

  for (const burst of BURSTS) {
    for (let j = 0; j < RAYS_PER_BURST; j++) {
      const layer: 'bg' | 'fg' = j % 3 === 0 ? 'bg' : 'fg'
      const isBg = layer === 'bg'
      rays.push({
        id: id++,
        angle: (j / RAYS_PER_BURST) * 360 + randBetween(-6, 6),
        length: isBg ? randBetween(35, 65) : randBetween(55, 110),
        color: burst.colors[j % burst.colors.length],
        cx: burst.cx,
        cy: burst.cy,
        delay: burst.delay + randBetween(0, 0.06),
        dur: isBg ? randBetween(0.6, 0.9) : randBetween(0.5, 0.8),
        layer,
      })
    }
  }

  return rays
}

/**
 * 10 trail confetti particles per burst — fly outward along ray paths then
 * droop with gravity. Positions sampled at 12 stops.
 * Trail directions use "screen-clockwise from up" to match rays.
 */
function makeTrails(): Trail[] {
  const trails: Trail[] = []
  let id = 0

  for (const burst of BURSTS) {
    for (let j = 0; j < TRAILS_PER_BURST; j++) {
      const layer: 'bg' | 'fg' = j % 3 === 0 ? 'bg' : 'fg'
      const isBg = layer === 'bg'

      /* Screen-clockwise angle (0°=up). Convert for x,y: x=sin(a), y=-cos(a) */
      const angleDeg = (j / TRAILS_PER_BURST) * 360 + randBetween(-12, 12)
      const angleRad = deg2rad(angleDeg)
      const maxDist = isBg ? randBetween(40, 70) : randBetween(60, 115)
      const peakScale = isBg ? randBetween(0.5, 0.8) : randBetween(0.7, 1.1)
      const peakOp = isBg ? 0.5 : 1

      const xs: number[] = []
      const ys: number[] = []
      const scales: number[] = []
      const opacities: number[] = []

      for (const t of STOPS) {
        const r = maxDist * easeOutCubic(t)
        const gravity = t > 0.5 ? Math.pow((t - 0.5) / 0.5, 2) * 35 : 0
        xs.push(burst.cx + Math.sin(angleRad) * r)
        ys.push(burst.cy + -Math.cos(angleRad) * r + gravity)
        scales.push(trailScaleAt(t, peakScale))
        opacities.push(trailOpacityAt(t, peakOp))
      }

      trails.push({
        id: id++,
        shape: pickRandom(CONFETTI_SHAPES),
        color: burst.colors[j % burst.colors.length],
        xs,
        ys,
        scales,
        opacities,
        rotZ: randBetween(-180, 180),
        delay: burst.delay + 0.04 + j * 0.015 + randBetween(0, 0.02),
        dur: isBg ? randBetween(1.4, 1.8) : randBetween(1.1, 1.5),
        layer,
      })
    }
  }

  return trails
}

/** 8 sparkle twinkle dots per burst at outer reaches. */
function makeSparkles(): Sparkle[] {
  const sparkles: Sparkle[] = []
  let id = 0

  for (const burst of BURSTS) {
    for (let j = 0; j < SPARKLES_PER_BURST; j++) {
      const angleDeg = (j / SPARKLES_PER_BURST) * 360 + randBetween(-15, 15)
      const angleRad = deg2rad(angleDeg)
      const r = randBetween(65, 115)
      sparkles.push({
        id: id++,
        x: burst.cx + Math.sin(angleRad) * r,
        y: burst.cy + -Math.cos(angleRad) * r + randBetween(-3, 8),
        delay: burst.delay + 0.2 + j * 0.06 + randBetween(0, 0.08),
        size: randBetween(2.5, 5),
      })
    }
  }

  return sparkles
}

/* ─── Sub-components ─── */

/** Flash at burst ignition point. */
function BurstFlash({ cx, cy, delay }: { cx: number; cy: number; delay: number }) {
  return (
    <m.div
      className="pf-celebration__flash"
      style={{ left: `calc(50% + ${cx}px)`, top: `calc(50% + ${cy}px)` }}
      initial={{ x: '-50%', y: '-50%', scale: 0, opacity: 0 }}
      animate={{ x: '-50%', y: '-50%', scale: [0, 1.2, 1.6], opacity: [0, 0.8, 0] }}
      transition={{ duration: 0.22, delay, times: [0, 0.35, 1], ease: 'easeOut' }}
    />
  )
}

/** Expanding shockwave ring per burst. */
function BurstRing({ cx, cy, delay, color }: { cx: number; cy: number; delay: number; color: string }) {
  return (
    <m.div
      className="pf-celebration__ring"
      style={{ left: `calc(50% + ${cx}px)`, top: `calc(50% + ${cy}px)`, borderColor: color }}
      initial={{ x: '-50%', y: '-50%', scale: 0, opacity: 0 }}
      animate={{ x: '-50%', y: '-50%', scale: [0, 3.5, 5], opacity: [0, 0.6, 0] }}
      transition={{ duration: 0.6, delay: delay + 0.02, times: [0, 0.4, 1], ease: 'easeOut' }}
    />
  )
}

/**
 * Spark ray — thin gradient line that shoots outward from burst center.
 * Positioned with its bottom at the burst center via y: '-100%'.
 * Rotated to aim in the target direction, scaled along Y to extend/retract.
 */
function RayBeam({ ray }: { ray: Ray }) {
  return (
    <m.span
      className="pf-celebration__ray"
      style={{
        left: `calc(50% + ${ray.cx}px)`,
        top: `calc(50% + ${ray.cy}px)`,
        height: `${ray.length}px`,
        background: `linear-gradient(to top, transparent 0%, ${ray.color} 35%, var(--pf-base-50) 94%)`,
        transformOrigin: '50% 100%',
      }}
      initial={{ x: '-50%', y: '-100%', scaleY: 0, rotate: ray.angle, opacity: 0 }}
      animate={{
        x: '-50%',
        y: '-100%',
        scaleY: [0, 1, 0.85, 0.15, 0],
        rotate: ray.angle,
        opacity: [0, 0.95, 0.7, 0.25, 0],
      }}
      transition={{
        duration: ray.dur,
        delay: ray.delay,
        scaleY: { duration: ray.dur, delay: ray.delay, times: [0, 0.2, 0.45, 0.75, 1], ease: 'easeOut' },
        opacity: { duration: ray.dur, delay: ray.delay, times: [0, 0.2, 0.45, 0.75, 1], ease: 'easeOut' },
      }}
    />
  )
}

/** Trail confetti particle — follows ray path outward with gravity droop. */
function TrailPiece({ t }: { t: Trail }) {
  return (
    <m.span
      className={`pf-celebration__confetti pf-celebration__confetti--${t.shape}`}
      style={{
        left: '50%',
        top: '50%',
        background: t.color,
        transformStyle: 'preserve-3d' as const,
      }}
      initial={{ x: t.xs[0], y: t.ys[0], scale: 0, rotate: 0, opacity: 0 }}
      animate={{
        x: t.xs,
        y: t.ys,
        scale: t.scales,
        opacity: t.opacities,
        rotate: [0, t.rotZ],
      }}
      transition={{
        duration: t.dur,
        delay: t.delay,
        times: STOPS,
        x: { duration: t.dur, delay: t.delay, times: STOPS, ease: 'linear' },
        y: { duration: t.dur, delay: t.delay, times: STOPS, ease: 'linear' },
        scale: { duration: t.dur, delay: t.delay, times: STOPS, ease: 'linear' },
        opacity: { duration: t.dur, delay: t.delay, times: STOPS, ease: 'linear' },
        rotate: { duration: t.dur, delay: t.delay, ease: 'linear' },
      }}
    />
  )
}

/** Sparkle twinkle dot at burst outer reaches. */
function SparkleDot({ s }: { s: Sparkle }) {
  return (
    <m.span
      className="pf-celebration__sparkle"
      style={{
        left: `calc(50% + ${s.x}px)`,
        top: `calc(50% + ${s.y}px)`,
        width: `${s.size}px`,
        height: `${s.size}px`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1.3, 0.4, 1.0, 0], opacity: [0, 0.9, 0.25, 0.6, 0] }}
      transition={{ duration: 1.0, delay: s.delay, times: [0, 0.2, 0.5, 0.75, 1], ease: 'easeOut' }}
    />
  )
}

/* ─── Main ─── */

/** Triple starburst — 3 staggered firework explosions with radial spark rays, trailing confetti, and sparkle twinkles. */
export function ModalCelebrationsFireworksTriple() {
  const rays = useMemo(makeRays, [])
  const trails = useMemo(makeTrails, [])
  const sparkles = useMemo(makeSparkles, [])
  const bgRays = useMemo(() => rays.filter((r) => r.layer === 'bg'), [rays])
  const fgRays = useMemo(() => rays.filter((r) => r.layer === 'fg'), [rays])
  const bgTrails = useMemo(() => trails.filter((t) => t.layer === 'bg'), [trails])
  const fgTrails = useMemo(() => trails.filter((t) => t.layer === 'fg'), [trails])

  return (
    <div className="pf-celebration" data-animation-id="modal-celebrations__fireworks-triple">
      {BURSTS.map((b, i) => (
        <BurstFlash key={`flash-${i}`} cx={b.cx} cy={b.cy} delay={b.delay} />
      ))}
      {BURSTS.map((b, i) => (
        <BurstRing key={`ring-${i}`} cx={b.cx} cy={b.cy} delay={b.delay} color={b.colors[0]} />
      ))}

      <div className="pf-celebration__depth-bg">
        {bgRays.map((r) => (
          <RayBeam key={`ray-${r.id}`} ray={r} />
        ))}
        {bgTrails.map((t) => (
          <TrailPiece key={`trail-${t.id}`} t={t} />
        ))}
      </div>
      <div className="pf-celebration__depth-fg">
        {fgRays.map((r) => (
          <RayBeam key={`ray-${r.id}`} ray={r} />
        ))}
        {fgTrails.map((t) => (
          <TrailPiece key={`trail-${t.id}`} t={t} />
        ))}
      </div>
      <div className="pf-celebration__effects">
        {sparkles.map((s) => (
          <SparkleDot key={s.id} s={s} />
        ))}
      </div>
    </div>
  )
}
