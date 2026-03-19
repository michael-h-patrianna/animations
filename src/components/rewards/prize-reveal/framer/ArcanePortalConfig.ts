import {
  arcanePortalFreeSpinsImage,
  arcanePortalGcImage,
  arcanePortalRandomRewardImage,
  arcanePortalScImage,
} from '@/assets'

import type { ParticleData, RevealPhase } from '../ArcanePortalParts'

import { useEffect, useRef, useState } from 'react'

/* ─── Types ─── */

export type MoteData = { id: number; angle: number; radius: number; size: number }
export type PrizeConfig = {
  id: string
  label: string | null
  src: string
  value: number | null
  decimals: number
  modifier: string
}
export type PrizeSlot = { x: number; y: number; delay: number }

/* ─── Constants ─── */

export const CHARGE_DELAY_MS = 700
export const ERUPT_DELAY_MS = 1500
const CONVERGE_PARTICLE_COUNT = 20
const MOTES_PER_PRIZE = 6
export const DEFAULT_PRIZE_COUNT = 3
export const CLAIM_APPEAR_DELAY_MS = 800
export const CLAIM_FLY_STAGGER = 0.06

export const PRIZE_POOL: PrizeConfig[] = [
  {
    id: 'gc',
    label: 'GC',
    src: arcanePortalGcImage,
    value: 1500,
    decimals: 0,
    modifier: 'pf-arcane-portal__prize--gc',
  },
  {
    id: 'sc',
    label: 'SC',
    src: arcanePortalScImage,
    value: 2.5,
    decimals: 2,
    modifier: 'pf-arcane-portal__prize--sc',
  },
  {
    id: 'fs',
    label: 'FS',
    src: arcanePortalFreeSpinsImage,
    value: 50,
    decimals: 0,
    modifier: 'pf-arcane-portal__prize--fs',
  },
  {
    id: 'rr',
    label: null,
    src: arcanePortalRandomRewardImage,
    value: null,
    decimals: 0,
    modifier: 'pf-arcane-portal__prize--rr',
  },
]

export function getPrizeSlots(count: number): PrizeSlot[] {
  const layouts: Record<number, PrizeSlot[]> = {
    1: [{ x: 0, y: 30, delay: 0 }],
    2: [
      { x: -72, y: 28, delay: 0 },
      { x: 72, y: 28, delay: 0.1 },
    ],
    3: [
      { x: -88, y: 32, delay: 0 },
      { x: 0, y: 22, delay: 0.08 },
      { x: 88, y: 32, delay: 0.16 },
    ],
    4: [
      { x: -110, y: 34, delay: 0 },
      { x: -37, y: 24, delay: 0.07 },
      { x: 37, y: 24, delay: 0.14 },
      { x: 110, y: 34, delay: 0.21 },
    ],
  }
  return layouts[count] ?? layouts[DEFAULT_PRIZE_COUNT]
}

/* ─── Hooks ─── */

export function useRevealPhase() {
  const [phase, setPhase] = useState<RevealPhase>('materialize')
  useEffect(() => {
    const t1 = window.setTimeout(() => setPhase('charge'), CHARGE_DELAY_MS)
    const t2 = window.setTimeout(() => setPhase('erupt'), ERUPT_DELAY_MS)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [])
  return phase
}

export function useCountUp(target: number, durationMs: number, delayMs: number, decimals: number) {
  const [display, setDisplay] = useState(decimals > 0 ? '0.00' : '0')
  const rafRef = useRef(0)
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const start = performance.now()
      const tick = () => {
        const elapsed = performance.now() - start
        const t = Math.min(elapsed / durationMs, 1)
        const eased = 1 - (1 - t) ** 3
        const current = target * eased
        if (t < 1) {
          setDisplay(
            decimals > 0 ? current.toFixed(decimals) : Math.round(current).toLocaleString()
          )
          rafRef.current = requestAnimationFrame(tick)
        } else {
          setDisplay(decimals > 0 ? target.toFixed(decimals) : target.toLocaleString())
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }, delayMs)
    return () => {
      window.clearTimeout(timeout)
      cancelAnimationFrame(rafRef.current)
    }
  }, [target, durationMs, delayMs, decimals])
  return display
}

/* ─── Data generators ─── */

export function createConvergeParticles(): ParticleData[] {
  return Array.from({ length: CONVERGE_PARTICLE_COUNT }, (_, i) => {
    const angle = (i / CONVERGE_PARTICLE_COUNT) * Math.PI * 2
    const distance = 120 + Math.random() * 60
    return {
      id: i,
      startX: Math.cos(angle) * distance,
      startY: Math.sin(angle) * distance,
      size: 2.5 + Math.random() * 3.5,
      delay: Math.random() * 0.3,
    }
  })
}

export function createOrbitMotes(): MoteData[] {
  return Array.from({ length: MOTES_PER_PRIZE }, (_, i) => ({
    id: i,
    angle: (i / MOTES_PER_PRIZE) * 360,
    radius: 34 + Math.random() * 10,
    size: 2.5 + Math.random() * 2.5,
  }))
}
