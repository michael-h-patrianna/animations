/**
 * Pure particle generators for Coin Cascade.
 * No React dependency — physics math only.
 */

import { pickRandom, randBetween } from '../utils'

/* ─── Types ─── */

export type Coin = {
  id: number
  xs: number[]
  ys: number[]
  scales: number[]
  opacities: number[]
  spins: number
  tumble: number
  size: number
  delay: number
  dur: number
  layer: 'bg' | 'fg'
}

export type Mote = {
  id: number
  x: number
  y: number
  delay: number
  size: number
  color: string
}

/* ─── Constants ─── */

export const STOPS = [0, 0.05, 0.13, 0.24, 0.37, 0.5, 0.65, 0.72, 0.78, 0.86, 0.93, 1.0]
export const STREAMS = [-55, 0, 55]

/* ─── Fall distance measurement ─── */

export function measureFallDistance(
  container: HTMLElement,
  emitYPct: number,
  boundary: HTMLElement | null | undefined
): number {
  const rect = container.getBoundingClientRect()
  const emitYPx = rect.height * (emitYPct / 100)
  // Coins bounce off a visible floor — default to container height so the bounce
  // stays in view. Viewport behavior happens naturally when the consumer wraps
  // the component in a full-screen overlay.
  const bottomBound = boundary
    ? boundary.getBoundingClientRect().bottom - rect.top
    : rect.height
  return Math.max(bottomBound - emitYPx, 100)
}

/* ─── Generators ─── */

export function makeCoins(count: number, fallDistance: number, timeScale: number): Coin[] {
  const coins: Coin[] = []

  for (let i = 0; i < count; i++) {
    const streamIdx = i % 3
    const stream = STREAMS[streamIdx]!
    const layer: 'bg' | 'fg' = i % 4 === 0 ? 'bg' : 'fg'
    const isBg = layer === 'bg'

    const startX = stream + randBetween(-16, 16)
    const fallDist = fallDistance * randBetween(0.65, 0.75)
    const wobbleAmp = randBetween(6, 15) * (Math.random() > 0.5 ? 1 : -1)
    const wobbleFreq = randBetween(1.5, 2.8)
    const bounceH = fallDist * randBetween(0.1, 0.2)
    const basePeak = isBg ? 0.55 : 1.0

    const xs: number[] = []
    const ys: number[] = []
    const scales: number[] = []
    const opacities: number[] = []

    for (const t of STOPS) {
      if (t <= 0.65) {
        const ft = t / 0.65
        ys.push(fallDist * ft * ft)
        xs.push(startX + wobbleAmp * Math.sin(wobbleFreq * Math.PI * ft))
      } else if (t <= 0.86) {
        const bt = (t - 0.65) / 0.21
        ys.push(fallDist - bounceH * Math.sin(Math.PI * bt))
        xs.push(startX + wobbleAmp * Math.sin(wobbleFreq * Math.PI) * (1 - bt * 0.3))
      } else {
        const st = (t - 0.86) / 0.14
        ys.push(fallDist - bounceH * 0.12 * Math.sin(Math.PI * st))
        xs.push(startX + wobbleAmp * Math.sin(wobbleFreq * Math.PI) * 0.7 * (1 - st))
      }

      if (t < 0.05) scales.push(0.3 + 0.7 * (t / 0.05))
      else if (t < 0.65) scales.push(1.0)
      else if (t < 0.86) scales.push(0.85 + 0.15 * Math.cos((Math.PI * (t - 0.65)) / 0.21))
      else scales.push(0.85 - 0.55 * ((t - 0.86) / 0.14))

      if (t < 0.05) opacities.push(basePeak * (t / 0.05))
      else if (t < 0.78) opacities.push(basePeak)
      else opacities.push(basePeak * Math.max(0, 1 - (t - 0.78) / 0.22))
    }

    coins.push({
      id: i,
      xs,
      ys,
      scales,
      opacities,
      spins: (isBg ? randBetween(2, 3) : randBetween(3, 5)) * 360,
      tumble: randBetween(-30, 30),
      size: isBg ? randBetween(14, 18) : randBetween(18, 26),
      delay: (streamIdx * 0.06 + Math.floor(i / 3) * 0.055 + randBetween(0, 0.03)) * timeScale,
      dur: randBetween(1.1, 1.5) * timeScale,
      layer,
    })
  }

  return coins
}

export function makeTrails(
  colors: readonly string[],
  fallDistance: number,
  timeScale: number
): Mote[] {
  const trails: Mote[] = []

  for (let i = 0; i < 18; i++) {
    const stream = STREAMS[i % 3]!
    const fallFrac = randBetween(0.15, 0.6)
    const coinFall = fallDistance * randBetween(0.65, 0.75)

    trails.push({
      id: i,
      x: stream + randBetween(-18, 18),
      y: coinFall * fallFrac * fallFrac,
      delay: ((i % 3) * 0.06 + fallFrac * 1.2 + randBetween(0, 0.1)) * timeScale,
      size: randBetween(2, 4),
      color: pickRandom(colors),
    })
  }

  return trails
}

export function makeImpacts(
  colors: readonly string[],
  fallDistance: number,
  timeScale: number
): Mote[] {
  const impacts: Mote[] = []

  for (let i = 0; i < 10; i++) {
    const stream = STREAMS[i % 3]!

    impacts.push({
      id: i,
      x: stream + randBetween(-22, 22),
      y: fallDistance * randBetween(0.65, 0.75),
      delay: ((i % 3) * 0.06 + Math.floor(i / 3) * 0.07 + randBetween(0.7, 0.95)) * timeScale,
      size: randBetween(3, 6),
      color: pickRandom(colors),
    })
  }

  return impacts
}

export function makeShimmers(
  colors: readonly string[],
  fallDistance: number,
  timeScale: number
): Mote[] {
  const shimmers: Mote[] = []

  for (let i = 0; i < 14; i++) {
    shimmers.push({
      id: i,
      x: randBetween(-70, 70),
      y: fallDistance * randBetween(0.12, 0.94),
      delay: (0.25 + i * 0.05 + randBetween(0, 0.08)) * timeScale,
      size: randBetween(2, 4),
      color: pickRandom(colors),
    })
  }

  return shimmers
}
