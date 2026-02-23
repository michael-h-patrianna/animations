import * as m from 'motion/react-m'
import { useMemo } from 'react'

import { coinImage } from '@/assets'
import { GOLDEN_COLORS, deg2rad, pickRandom, randBetween } from '../utils'

/* ─── Types ─── */

type Coin = {
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

type Mote = {
  id: number
  x: number
  y: number
  delay: number
  size: number
  color: string
}

/* ─── Constants ─── */

const COIN_COUNT = 20
const TRAIL_COUNT = 16
const SPARKLE_COUNT = 12
const NUM_STOPS = 12
const STOPS = Array.from({ length: NUM_STOPS }, (_, i) => i / (NUM_STOPS - 1))

/* ─── Generators ─── */

/**
 * 20 coins spiral outward from center. Radius expands with t^1.3 (accelerating),
 * angular velocity decelerates via 1-(1-t)^1.5 (fast near core, slow at edge).
 */
function makeCoins(): Coin[] {
  const coins: Coin[] = []

  for (let i = 0; i < COIN_COUNT; i++) {
    const layer: 'bg' | 'fg' = i % 4 === 0 ? 'bg' : 'fg'
    const isBg = layer === 'bg'

    const startAngleDeg = (i / COIN_COUNT) * 360 + randBetween(-8, 8)
    const rStart = randBetween(6, 14)
    const rEnd = isBg ? randBetween(60, 80) : randBetween(80, 120)
    const totalSpinDeg = randBetween(540, 900)
    const basePeak = isBg ? 0.55 : 1.0

    const xs: number[] = []
    const ys: number[] = []
    const scales: number[] = []
    const opacities: number[] = []

    for (const t of STOPS) {
      const rFrac = Math.pow(t, 1.3)
      const r = rStart + (rEnd - rStart) * rFrac
      const angleFrac = 1 - Math.pow(1 - t, 1.5)
      const angleRad = deg2rad(startAngleDeg + totalSpinDeg * angleFrac)

      xs.push(Math.cos(angleRad) * r)
      ys.push(Math.sin(angleRad) * r)

      if (t < 0.06) scales.push(0.3 + 0.7 * (t / 0.06))
      else if (t < 0.6) scales.push(1.0)
      else scales.push(1.0 - 0.7 * ((t - 0.6) / 0.4))

      if (t < 0.06) opacities.push(basePeak * (t / 0.06))
      else if (t < 0.65) opacities.push(basePeak)
      else opacities.push(basePeak * Math.max(0, 1 - (t - 0.65) / 0.35))
    }

    coins.push({
      id: i,
      xs,
      ys,
      scales,
      opacities,
      spins: (isBg ? randBetween(2, 3) : randBetween(3, 4)) * 360,
      tumble: randBetween(-20, 20),
      size: isBg ? randBetween(14, 18) : randBetween(18, 26),
      delay: i * 0.04 + randBetween(0, 0.03),
      dur: randBetween(1.3, 1.8),
      layer,
    })
  }

  return coins
}

/** 16 golden dust motes along spiral paths. */
function makeTrails(): Mote[] {
  const trails: Mote[] = []

  for (let i = 0; i < TRAIL_COUNT; i++) {
    const t = randBetween(0.12, 0.6)
    const startAngle = (i / TRAIL_COUNT) * 360 + randBetween(-15, 15)
    const totalSpin = randBetween(540, 900)
    const rStart = randBetween(6, 14)
    const rEnd = randBetween(70, 110)

    const r = rStart + (rEnd - rStart) * Math.pow(t, 1.3)
    const angleFrac = 1 - Math.pow(1 - t, 1.5)
    const angleRad = deg2rad(startAngle + totalSpin * angleFrac)

    trails.push({
      id: i,
      x: Math.cos(angleRad) * r,
      y: Math.sin(angleRad) * r,
      delay: t * 1.5 + randBetween(0, 0.1),
      size: randBetween(2, 4),
      color: pickRandom(GOLDEN_COLORS),
    })
  }

  return trails
}

/** 12 golden sparkles scattered around the vortex area. */
function makeSparkles(): Mote[] {
  const sparkles: Mote[] = []

  for (let i = 0; i < SPARKLE_COUNT; i++) {
    const angleRad = deg2rad(randBetween(0, 360))
    const r = randBetween(30, 100)

    sparkles.push({
      id: i,
      x: Math.cos(angleRad) * r,
      y: Math.sin(angleRad) * r,
      delay: 0.3 + i * 0.06 + randBetween(0, 0.08),
      size: randBetween(2.5, 4.5),
      color: pickRandom(GOLDEN_COLORS),
    })
  }

  return sparkles
}

/* ─── Sub-components ─── */

/** Coin spiraling outward with 3D metallic spin. */
function CoinPiece({ c }: { c: Coin }) {
  return (
    <m.img
      src={coinImage}
      alt=""
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: `${c.size}px`,
        height: `${c.size}px`,
        pointerEvents: 'none',
        willChange: 'transform, opacity',
      }}
      initial={{ x: 0, y: 0, scale: 0.3, rotateY: 0, rotateZ: 0, opacity: 0 }}
      animate={{
        x: c.xs,
        y: c.ys,
        scale: c.scales,
        rotateY: [0, c.spins],
        rotateZ: [0, c.tumble],
        opacity: c.opacities,
      }}
      transition={{
        duration: c.dur,
        delay: c.delay,
        times: STOPS,
        x: { duration: c.dur, delay: c.delay, times: STOPS, ease: 'linear' },
        y: { duration: c.dur, delay: c.delay, times: STOPS, ease: 'linear' },
        scale: { duration: c.dur, delay: c.delay, times: STOPS, ease: 'linear' },
        opacity: { duration: c.dur, delay: c.delay, times: STOPS, ease: 'linear' },
        rotateY: { duration: c.dur, delay: c.delay, ease: 'linear' },
        rotateZ: { duration: c.dur, delay: c.delay, ease: 'linear' },
      }}
    />
  )
}

/** Golden dust mote along a spiral trail. */
function TrailDot({ t }: { t: Mote }) {
  return (
    <m.span
      style={{
        position: 'absolute',
        left: `calc(50% + ${t.x}px)`,
        top: `calc(50% + ${t.y}px)`,
        width: `${t.size}px`,
        height: `${t.size}px`,
        borderRadius: '50%',
        background: t.color,
        boxShadow: `0 0 ${t.size + 2}px ${Math.round(t.size * 0.5)}px ${t.color}`,
        pointerEvents: 'none',
        willChange: 'transform, opacity',
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1.4, 0.6, 0], opacity: [0, 0.8, 0.3, 0] }}
      transition={{ duration: 0.4, delay: t.delay, times: [0, 0.3, 0.6, 1], ease: 'easeOut' }}
    />
  )
}

/** Golden sparkle twinkle in the vortex area. */
function SparkleDot({ s }: { s: Mote }) {
  return (
    <m.span
      className="pf-celebration__sparkle"
      style={{
        left: `calc(50% + ${s.x}px)`,
        top: `calc(50% + ${s.y}px)`,
        width: `${s.size}px`,
        height: `${s.size}px`,
        background: s.color,
        boxShadow: `0 0 4px 1px ${s.color}`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1.2, 0.4, 0.9, 0], opacity: [0, 0.8, 0.2, 0.5, 0] }}
      transition={{ duration: 0.7, delay: s.delay, times: [0, 0.2, 0.45, 0.7, 1], ease: 'easeOut' }}
    />
  )
}

/** Pulsing golden core at the vortex center. */
function VortexCore() {
  return (
    <m.span
      style={{
        position: 'absolute',
        left: 'calc(50% - 4px)',
        top: 'calc(50% - 4px)',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: 'var(--pf-anim-gold)',
        boxShadow: '0 0 24px 16px var(--pf-anim-gold)',
        pointerEvents: 'none',
        willChange: 'opacity',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.6, 0.45, 0.2, 0] }}
      transition={{ duration: 1.8, times: [0, 0.1, 0.3, 0.6, 1], ease: 'easeOut' }}
    />
  )
}

/* ─── Main ─── */

/**
 * Golden Vortex — coins spiral outward from a glowing center in expanding
 * orbits with decelerating angular velocity and 3D metallic spin, accompanied
 * by golden trail dust and sparkle twinkles.
 */
export function ModalCelebrationsCoinsSwirl() {
  const coins = useMemo(makeCoins, [])
  const trails = useMemo(makeTrails, [])
  const sparkles = useMemo(makeSparkles, [])
  const bgCoins = useMemo(() => coins.filter((c) => c.layer === 'bg'), [coins])
  const fgCoins = useMemo(() => coins.filter((c) => c.layer === 'fg'), [coins])

  return (
    <div className="pf-celebration" data-animation-id="modal-celebrations__coins-swirl">
      <VortexCore />
      <div className="pf-celebration__depth-bg" style={{ perspective: 300 }}>
        {bgCoins.map((c) => (
          <CoinPiece key={c.id} c={c} />
        ))}
      </div>
      <div className="pf-celebration__depth-fg" style={{ perspective: 300 }}>
        {fgCoins.map((c) => (
          <CoinPiece key={c.id} c={c} />
        ))}
      </div>
      <div className="pf-celebration__effects">
        {trails.map((t) => (
          <TrailDot key={t.id} t={t} />
        ))}
        {sparkles.map((s) => (
          <SparkleDot key={s.id} s={s} />
        ))}
      </div>
    </div>
  )
}
