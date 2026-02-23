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

type Ember = {
  id: number
  xs: number[]
  ys: number[]
  scales: number[]
  opacities: number[]
  tailOpacities: number[]
  color: string
  delay: number
  size: number
  tailSize: number
  layer: 'bg' | 'fg'
}

type Shimmer = {
  id: number
  x: number
  y: number
  delay: number
  size: number
  color: string
}

type Burst = {
  id: number
  shape: ConfettiShape
  color: string
  startX: number
  startY: number
  xs: number[]
  ys: number[]
  scales: number[]
  opacities: number[]
  rotZ: number
  delay: number
  dur: number
}

type Sparkle = {
  id: number
  x: number
  y: number
  delay: number
  size: number
}

/* ─── Constants ─── */

const RING_RADIUS = 48
const EMBER_COUNT = 22
const SHIMMER_COUNT = 16
const BURST_COUNT = 18
const SPARKLE_COUNT = 16
const DURATION = 2.0

/**
 * 8-stop timeline: converge → hold → ignite → explode → fade.
 * Stops spaced for fast inward rush, dramatic hold, punchy explosion.
 */
const TIMES: number[] = [0, 0.14, 0.28, 0.34, 0.42, 0.60, 0.80, 1.0]

const BURST_NUM_STOPS = 8
const BURST_TIMES = Array.from({ length: BURST_NUM_STOPS }, (_, i) => i / (BURST_NUM_STOPS - 1))

/* ─── Helpers ─── */

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

function burstScaleAt(t: number, peak: number): number {
  if (t < 0.1) return peak * 0.5 * (t / 0.1)
  if (t < 0.25) return peak * (0.5 + 0.5 * ((t - 0.1) / 0.15))
  if (t < 0.5) return peak
  if (t < 0.75) return peak * (1 - 0.3 * ((t - 0.5) / 0.25))
  return peak * (0.7 - 0.7 * ((t - 0.75) / 0.25))
}

function burstOpacityAt(t: number, peak: number): number {
  if (t < 0.08) return peak * 0.5 * (t / 0.08)
  if (t < 0.2) return peak * (0.5 + 0.5 * ((t - 0.08) / 0.12))
  if (t < 0.45) return peak
  if (t < 0.7) return peak * (1 - 0.5 * ((t - 0.45) / 0.25))
  return peak * (0.5 - 0.5 * ((t - 0.7) / 0.3))
}

/* ─── Generators ─── */

/**
 * 22 ember dots — each converges inward from a random outer position onto
 * the ring circle, holds with a pulse, then bursts outward with gravity.
 * Pre-computes both primary and tail opacity arrays.
 */
function makeEmbers(): Ember[] {
  const embers: Ember[] = []

  for (let i = 0; i < EMBER_COUNT; i++) {
    const baseAngle = (i / EMBER_COUNT) * Math.PI * 2
    const ringAngle = baseAngle + deg2rad(randBetween(-4, 4))
    const layer: 'bg' | 'fg' = i % 3 === 0 ? 'bg' : 'fg'
    const isBg = layer === 'bg'

    const ringX = Math.cos(ringAngle) * RING_RADIUS
    const ringY = Math.sin(ringAngle) * RING_RADIUS

    const startAngle = baseAngle + deg2rad(randBetween(-25, 25))
    const startR = isBg ? randBetween(110, 135) : randBetween(130, 160)
    const startX = Math.cos(startAngle) * startR
    const startY = Math.sin(startAngle) * startR

    const endR = isBg ? randBetween(75, 100) : randBetween(95, 135)
    const endX = Math.cos(ringAngle) * endR
    const endY = Math.sin(ringAngle) * endR + randBetween(12, 28)

    const midX = startX * 0.3 + ringX * 0.7
    const midY = startY * 0.3 + ringY * 0.7
    const exp1X = endX * 0.6 + ringX * 0.4
    const exp1Y = endY * 0.45 + ringY * 0.55

    const opacities = isBg
      ? [0.15, 0.4, 0.6, 0.5, 0.6, 0.45, 0.18, 0]
      : [0.25, 0.7, 1.0, 0.85, 1.0, 0.75, 0.3, 0]

    const size = isBg ? randBetween(4, 6) : randBetween(5, 8)

    embers.push({
      id: i,
      xs: [startX, midX, ringX, ringX, ringX, exp1X, endX, endX * 1.05],
      ys: [startY, midY, ringY, ringY, ringY, exp1Y, endY, endY + 8],
      scales: [0.2, 0.7, 1.3, 0.9, 1.6, 1.0, 0.45, 0],
      opacities,
      tailOpacities: opacities.map((o) => o * 0.4),
      color: pickRandom(CELEBRATION_COLORS),
      delay: (i / EMBER_COUNT) * 0.22,
      size,
      tailSize: Math.round(size * 0.55),
      layer,
    })
  }

  return embers
}

/** 16 shimmer dots positioned between embers on the ring — glitter during hold phase. */
function makeShimmers(): Shimmer[] {
  const shimmers: Shimmer[] = []

  for (let i = 0; i < SHIMMER_COUNT; i++) {
    const angle = (i / SHIMMER_COUNT) * Math.PI * 2 + Math.PI / SHIMMER_COUNT
    const jitter = deg2rad(randBetween(-3, 3))
    shimmers.push({
      id: i,
      x: Math.cos(angle + jitter) * RING_RADIUS,
      y: Math.sin(angle + jitter) * RING_RADIUS,
      delay: 0.02 * i,
      size: randBetween(2, 3.5),
      color: pickRandom(CELEBRATION_COLORS),
    })
  }

  return shimmers
}

/** 18 burst confetti particles — erupt from ring positions at ignition. */
function makeBursts(): Burst[] {
  const bursts: Burst[] = []

  for (let i = 0; i < BURST_COUNT; i++) {
    const angle = (i / BURST_COUNT) * Math.PI * 2 + deg2rad(randBetween(-8, 8))
    const startR = RING_RADIUS + randBetween(-3, 3)
    const startX = Math.cos(angle) * startR
    const startY = Math.sin(angle) * startR

    const maxDist = randBetween(55, 100)
    const peakScale = randBetween(0.7, 1.1)
    const peakOp = randBetween(0.7, 1.0)

    const xs: number[] = []
    const ys: number[] = []
    const scales: number[] = []
    const opacities: number[] = []

    for (const t of BURST_TIMES) {
      const r = maxDist * easeOutCubic(t)
      const gravity = t > 0.4 ? Math.pow((t - 0.4) / 0.6, 2) * 30 : 0
      xs.push(Math.cos(angle) * r)
      ys.push(Math.sin(angle) * r + gravity)
      scales.push(burstScaleAt(t, peakScale))
      opacities.push(burstOpacityAt(t, peakOp))
    }

    bursts.push({
      id: i,
      shape: pickRandom(CONFETTI_SHAPES),
      color: pickRandom(CELEBRATION_COLORS),
      startX,
      startY,
      xs,
      ys,
      scales,
      opacities,
      rotZ: randBetween(-180, 180),
      delay: 0.82 + randBetween(0, 0.06),
      dur: randBetween(0.9, 1.2),
    })
  }

  return bursts
}

/** 16 sparkle dots at outer positions — twinkle after the explosion. */
function makeSparkles(): Sparkle[] {
  const sparkles: Sparkle[] = []

  for (let i = 0; i < SPARKLE_COUNT; i++) {
    const angle = (i / SPARKLE_COUNT) * Math.PI * 2 + deg2rad(randBetween(-10, 10))
    const r = randBetween(70, 125)
    sparkles.push({
      id: i,
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r + randBetween(-4, 8),
      delay: 0.9 + i * 0.05 + randBetween(0, 0.06),
      size: randBetween(2.5, 4.5),
    })
  }

  return sparkles
}

/* ─── Sub-components ─── */

/**
 * Glowing ember dot or its ghost tail.
 * Primary embers have a boxShadow glow; tails are smaller and dimmer.
 */
function EmberDot({ e, isTail }: { e: Ember; isTail?: boolean }) {
  const size = isTail ? e.tailSize : e.size
  const delay = isTail ? e.delay + 0.05 : e.delay
  const opacities = isTail ? e.tailOpacities : e.opacities

  return (
    <m.span
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: e.color,
        boxShadow: isTail ? undefined : `0 0 ${size + 2}px ${Math.round(size * 0.5)}px ${e.color}`,
        pointerEvents: 'none',
        willChange: 'transform, opacity',
      }}
      initial={{ x: e.xs[0], y: e.ys[0], scale: 0, opacity: 0 }}
      animate={{ x: e.xs, y: e.ys, scale: e.scales, opacity: opacities }}
      transition={{
        duration: DURATION,
        delay,
        times: TIMES,
        x: { duration: DURATION, delay, times: TIMES, ease: 'linear' },
        y: { duration: DURATION, delay, times: TIMES, ease: 'linear' },
        scale: { duration: DURATION, delay, times: TIMES, ease: 'linear' },
        opacity: { duration: DURATION, delay, times: TIMES, ease: 'linear' },
      }}
    />
  )
}

/** Renders both tails and primary dots for a set of embers. */
function EmberLayer({ embers }: { embers: Ember[] }) {
  return (
    <>
      {embers.map((e) => (
        <EmberDot key={`t-${e.id}`} e={e} isTail />
      ))}
      {embers.map((e) => (
        <EmberDot key={`e-${e.id}`} e={e} />
      ))}
    </>
  )
}

/** Shimmer dot on ring — appears during hold phase, fades at explosion. */
function ShimmerDot({ s }: { s: Shimmer }) {
  return (
    <m.span
      style={{
        position: 'absolute',
        left: `calc(50% + ${s.x}px)`,
        top: `calc(50% + ${s.y}px)`,
        width: `${s.size}px`,
        height: `${s.size}px`,
        borderRadius: '50%',
        background: s.color,
        boxShadow: `0 0 4px 1px ${s.color}`,
        pointerEvents: 'none',
        willChange: 'transform, opacity',
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: [0, 0, 0.5, 1.2, 1.5, 0.3, 0, 0],
        opacity: [0, 0, 0.5, 0.8, 1.0, 0.15, 0, 0],
      }}
      transition={{
        duration: DURATION,
        delay: s.delay,
        times: TIMES,
        scale: { duration: DURATION, delay: s.delay, times: TIMES, ease: 'linear' },
        opacity: { duration: DURATION, delay: s.delay, times: TIMES, ease: 'linear' },
      }}
    />
  )
}

/** Burst confetti piece — erupts from ring at ignition moment. */
function BurstPiece({ b }: { b: Burst }) {
  return (
    <m.span
      className={`pf-celebration__confetti pf-celebration__confetti--${b.shape}`}
      style={{
        left: `calc(50% + ${b.startX}px)`,
        top: `calc(50% + ${b.startY}px)`,
        background: b.color,
      }}
      initial={{ x: 0, y: 0, scale: 0, rotate: 0, opacity: 0 }}
      animate={{
        x: b.xs,
        y: b.ys,
        scale: b.scales,
        opacity: b.opacities,
        rotate: [0, b.rotZ],
      }}
      transition={{
        duration: b.dur,
        delay: b.delay,
        times: BURST_TIMES,
        x: { duration: b.dur, delay: b.delay, times: BURST_TIMES, ease: 'linear' },
        y: { duration: b.dur, delay: b.delay, times: BURST_TIMES, ease: 'linear' },
        scale: { duration: b.dur, delay: b.delay, times: BURST_TIMES, ease: 'linear' },
        opacity: { duration: b.dur, delay: b.delay, times: BURST_TIMES, ease: 'linear' },
        rotate: { duration: b.dur, delay: b.delay, ease: 'linear' },
      }}
    />
  )
}

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
      transition={{ duration: 0.9, delay: s.delay, times: [0, 0.2, 0.5, 0.75, 1], ease: 'easeOut' }}
    />
  )
}

function CenterFlash() {
  return (
    <m.div
      className="pf-celebration__flash"
      style={{ left: '50%', top: '50%' }}
      initial={{ x: '-50%', y: '-50%', scale: 0, opacity: 0 }}
      animate={{
        x: '-50%',
        y: '-50%',
        scale: [0, 0, 0, 0.2, 1.5, 0.7, 0.15, 0],
        opacity: [0, 0, 0, 0.15, 0.9, 0.35, 0.05, 0],
      }}
      transition={{
        duration: DURATION,
        times: TIMES,
        scale: { duration: DURATION, times: TIMES, ease: 'linear' },
        opacity: { duration: DURATION, times: TIMES, ease: 'linear' },
      }}
    />
  )
}

function CenterGlow() {
  return (
    <m.div
      className="pf-celebration__glow"
      style={{ left: '50%', top: '50%' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.05, 0.3, 0.2, 0.55, 0.25, 0.08, 0] }}
      transition={{
        duration: DURATION,
        times: TIMES,
        opacity: { duration: DURATION, times: TIMES, ease: 'linear' },
      }}
    />
  )
}

/* ─── Main ─── */

/**
 * Chrysanthemum Ring — embers fly inward from all directions to form a
 * glowing ring, the ring ignites with a pulse of light, then everything
 * explodes outward with burst confetti and sparkle aftermath.
 */
export function ModalCelebrationsFireworksRing() {
  const embers = useMemo(makeEmbers, [])
  const shimmers = useMemo(makeShimmers, [])
  const bursts = useMemo(makeBursts, [])
  const sparkles = useMemo(makeSparkles, [])
  const bgEmbers = useMemo(() => embers.filter((e) => e.layer === 'bg'), [embers])
  const fgEmbers = useMemo(() => embers.filter((e) => e.layer === 'fg'), [embers])

  return (
    <div className="pf-celebration" data-animation-id="modal-celebrations__fireworks-ring">
      <CenterGlow />
      <CenterFlash />
      <div className="pf-celebration__depth-bg">
        <EmberLayer embers={bgEmbers} />
      </div>
      <div className="pf-celebration__effects">
        {shimmers.map((s) => (
          <ShimmerDot key={s.id} s={s} />
        ))}
      </div>
      <div className="pf-celebration__depth-fg">
        <EmberLayer embers={fgEmbers} />
        {bursts.map((b) => (
          <BurstPiece key={b.id} b={b} />
        ))}
      </div>
      <div className="pf-celebration__layer">
        {sparkles.map((s) => (
          <SparkleDot key={s.id} s={s} />
        ))}
      </div>
    </div>
  )
}
