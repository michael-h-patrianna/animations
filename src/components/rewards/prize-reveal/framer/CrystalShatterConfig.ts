import {
  arcanePortalFreeSpinsImage,
  arcanePortalGcImage,
  arcanePortalRandomRewardImage,
  arcanePortalScImage,
  crystalShatterShard1Image,
  crystalShatterShard2Image,
  crystalShatterShard3Image,
  crystalShatterShard4Image,
} from '@/assets'

import type {
  DustData,
  FragmentData,
  MoteData,
  OrbitDustData,
  ShatterPhase,
} from '../CrystalShatterParts'

import { useEffect, useRef, useState } from 'react'

/* ─── Types ─── */

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

export const SHARD_IMAGES = [
  crystalShatterShard1Image,
  crystalShatterShard2Image,
  crystalShatterShard3Image,
  crystalShatterShard4Image,
]

export const CHARGE_START_MS = 1200
export const SHATTER_START_MS = 2400
export const REVEAL_START_MS = 3200
export const IDLE_START_MS = 5200
export const CLAIM_APPEAR_DELAY_MS = 800
export const CLAIM_FLY_STAGGER = 0.08
export const DEFAULT_PRIZE_COUNT = 3

const FRAGMENT_COUNT = 9
const CONVERGE_MOTE_COUNT = 14
const DUST_SPRAY_COUNT = 24
export const ORBIT_DUST_PER_PRIZE = 3

export const PRIZE_POOL: PrizeConfig[] = [
  {
    id: 'gc',
    label: 'GC',
    src: arcanePortalGcImage,
    value: 1500,
    decimals: 0,
    modifier: 'pf-crystal-shatter__prize--gc',
  },
  {
    id: 'sc',
    label: 'SC',
    src: arcanePortalScImage,
    value: 2.5,
    decimals: 2,
    modifier: 'pf-crystal-shatter__prize--sc',
  },
  {
    id: 'fs',
    label: 'FS',
    src: arcanePortalFreeSpinsImage,
    value: 50,
    decimals: 0,
    modifier: 'pf-crystal-shatter__prize--fs',
  },
  {
    id: 'rr',
    label: null,
    src: arcanePortalRandomRewardImage,
    value: null,
    decimals: 0,
    modifier: 'pf-crystal-shatter__prize--rr',
  },
]

export function getPrizeSlots(count: number): PrizeSlot[] {
  const layouts: Record<number, PrizeSlot[]> = {
    1: [{ x: 0, y: -10, delay: 0 }],
    2: [
      { x: -80, y: -10, delay: 0 },
      { x: 80, y: -10, delay: 0.15 },
    ],
    3: [
      { x: -120, y: -10, delay: 0 },
      { x: 0, y: -10, delay: 0.15 },
      { x: 120, y: -10, delay: 0.3 },
    ],
    4: [
      { x: -140, y: -10, delay: 0 },
      { x: -47, y: -10, delay: 0.15 },
      { x: 47, y: -10, delay: 0.3 },
      { x: 140, y: -10, delay: 0.45 },
    ],
  }
  return (layouts[count] ?? layouts[DEFAULT_PRIZE_COUNT])!
}

/* ─── Hooks ─── */

export function useRevealPhase() {
  const [phase, setPhase] = useState<ShatterPhase>('descent')
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('charge'), CHARGE_START_MS),
      setTimeout(() => setPhase('shatter'), SHATTER_START_MS),
      setTimeout(() => setPhase('reveal'), REVEAL_START_MS),
      setTimeout(() => setPhase('idle'), IDLE_START_MS),
    ]
    return () => timers.forEach((id) => clearTimeout(id))
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

export function createFragments(): FragmentData[] {
  return Array.from({ length: FRAGMENT_COUNT }, (_, i) => {
    const baseAngle = (i / FRAGMENT_COUNT) * Math.PI * 2
    const angle = baseAngle + (Math.random() - 0.5) * 0.5
    return {
      id: i,
      angle,
      distance: 150 + Math.random() * 100,
      rotation: (Math.random() > 0.5 ? 1 : -1) * (60 + Math.random() * 180),
      shardIndex: i % 4,
    }
  })
}

export function createConvergeMotes(): MoteData[] {
  return Array.from({ length: CONVERGE_MOTE_COUNT }, (_, i) => {
    const angle = (i / CONVERGE_MOTE_COUNT) * Math.PI * 2
    const distance = 200 + Math.random() * 80
    const startX = Math.cos(angle) * distance
    const startY = Math.sin(angle) * distance
    const perpAngle = angle + Math.PI / 2
    const offset = (Math.random() - 0.5) * 60
    return {
      id: i,
      startX,
      startY,
      midX: Math.cos(angle) * distance * 0.4 + Math.cos(perpAngle) * offset,
      midY: Math.sin(angle) * distance * 0.4 + Math.sin(perpAngle) * offset,
      size: 10 + Math.random() * 14,
      delay: (i / CONVERGE_MOTE_COUNT) * 0.6,
    }
  })
}

export function createDustSpray(): DustData[] {
  return Array.from({ length: DUST_SPRAY_COUNT }, (_, i) => ({
    id: i,
    angle: Math.random() * Math.PI * 2,
    distance: 80 + Math.random() * 160,
    speed: 0.5 + Math.random(),
    size: 3 + Math.random() * 5,
  }))
}

export function createOrbitDust(): OrbitDustData[] {
  return Array.from({ length: ORBIT_DUST_PER_PRIZE }, (_, i) => ({
    id: i,
    angle: (i / ORBIT_DUST_PER_PRIZE) * 360,
    radius: 30 + Math.random() * 8,
    size: 2.5 + Math.random() * 2,
  }))
}
