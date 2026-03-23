/** Shared data model for the FireworksRing animation (framer + CSS variants). */

import {
  CELEBRATION_COLORS,
  CONFETTI_SHAPES,
  deg2rad,
  pickRandom,
  randBetween,
  type ConfettiShape,
} from './utils'

/* ─── Types ─── */

/** Converging ember dot with pre-computed keyframe arrays and tail ghost. */
export type Ember = {
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

/** Glitter dot on the ring perimeter during the hold phase. */
export type Shimmer = {
  id: number
  x: number
  y: number
  delay: number
  size: number
  color: string
}

/** Confetti particle erupting from the ring at ignition, with pre-computed multi-stop keyframes. */
export type Burst = {
  id: number
  shape: ConfettiShape
  color: string
  imageUrl: string | undefined
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

/** Twinkling dot at an outer position after the explosion phase. */
export type Sparkle = {
  id: number
  x: number
  y: number
  delay: number
  size: number
}

/* ─── Constants ─── */

export const RING_RADIUS = 48
const EMBER_COUNT = 22
const SHIMMER_COUNT = 16
const BURST_COUNT = 18
const SPARKLE_COUNT = 16
export const DURATION = 2.0

/**
 * 8-stop timeline: converge → hold → ignite → explode → fade.
 * Stops spaced for fast inward rush, dramatic hold, punchy explosion.
 */
export const TIMES: number[] = [0, 0.14, 0.28, 0.34, 0.42, 0.6, 0.8, 1.0]

const BURST_NUM_STOPS = 8
export const BURST_TIMES = Array.from(
  { length: BURST_NUM_STOPS },
  (_, i) => i / (BURST_NUM_STOPS - 1)
)

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
export function makeEmbers(): Ember[] {
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
export function makeShimmers(): Shimmer[] {
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
export function makeBursts(images: readonly string[]): Burst[] {
  const hasImages = images.length > 0
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
      imageUrl: hasImages ? images[i % images.length] : undefined,
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
export function makeSparkles(): Sparkle[] {
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
