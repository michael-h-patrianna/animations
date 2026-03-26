/**
 * Golden Vortex — coins spiral outward from center with decelerating angular velocity.
 *
 * Copy-paste files: this file + ../SharedCelebrationTypes.ts + ../SharedFallbackCoin.tsx + ../utils.ts + ../shared.css
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, useEffect, useMemo } from 'react'

import type { CelebrationBaseProps } from '@/components/rewards/modal-celebrations/SharedCelebrationTypes'
import { GOLDEN_COLORS_HEX } from '@/components/rewards/modal-celebrations/SharedCelebrationTypes'
import { FallbackCoin } from '@/components/rewards/modal-celebrations/SharedFallbackCoin'
import {
  GOLDEN_COLORS,
  deg2rad,
  pickRandom,
  randBetween,
} from '@/components/rewards/modal-celebrations/utils'

/* ─── Props ─── */

interface ModalCelebrationsCoinsSwirlProps extends CelebrationBaseProps {
  /** Number of coin particles. Default 20. */
  coinCount?: number
  /** URL for a single coin image. Overridden by `particleImages` when both are provided. When omitted, renders SVG fallback coin. */
  coinImage?: string
}

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

const DEFAULT_COIN_COUNT = 20
const DEFAULT_DURATION_MS = 1550
const NUM_STOPS = 12
const STOPS = Array.from({ length: NUM_STOPS }, (_, i) => i / (NUM_STOPS - 1))

/* ─── Generators ─── */

function makeCoins(count: number, timeScale: number): Coin[] {
  const coins: Coin[] = []

  for (let i = 0; i < count; i++) {
    const layer: 'bg' | 'fg' = i % 4 === 0 ? 'bg' : 'fg'
    const isBg = layer === 'bg'

    const startAngleDeg = (i / count) * 360 + randBetween(-8, 8)
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
      delay: (i * 0.04 + randBetween(0, 0.03)) * timeScale,
      dur: randBetween(1.3, 1.8) * timeScale,
      layer,
    })
  }

  return coins
}

function makeTrails(colors: readonly string[], timeScale: number): Mote[] {
  const trails: Mote[] = []

  for (let i = 0; i < 16; i++) {
    const t = randBetween(0.12, 0.6)
    const startAngle = (i / 16) * 360 + randBetween(-15, 15)
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
      delay: (t * 1.5 + randBetween(0, 0.1)) * timeScale,
      size: randBetween(2, 4),
      color: pickRandom(colors),
    })
  }

  return trails
}

function makeSparkles(colors: readonly string[], timeScale: number): Mote[] {
  const sparkles: Mote[] = []

  for (let i = 0; i < 12; i++) {
    const angleRad = deg2rad(randBetween(0, 360))
    const r = randBetween(30, 100)

    sparkles.push({
      id: i,
      x: Math.cos(angleRad) * r,
      y: Math.sin(angleRad) * r,
      delay: (0.3 + i * 0.06 + randBetween(0, 0.08)) * timeScale,
      size: randBetween(2.5, 4.5),
      color: pickRandom(colors),
    })
  }

  return sparkles
}

/* ─── Sub-components ─── */

function CoinPiece({
  c,
  coinSrc,
  maxW,
  maxH,
}: {
  c: Coin
  coinSrc?: string
  maxW: number
  maxH: number
}) {
  const w = coinSrc !== undefined ? Math.min(c.size, maxW) : c.size
  const h = coinSrc !== undefined ? Math.min(c.size, maxH) : c.size
  return (
    <m.div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: w,
        height: h,
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
    >
      {coinSrc !== undefined ? (
        <img
          src={coinSrc}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
        />
      ) : (
        <FallbackCoin size={c.size} />
      )}
    </m.div>
  )
}

function TrailDot({ t, timeScale }: { t: Mote; timeScale: number }) {
  return (
    <m.span
      style={{
        position: 'absolute',
        left: '50%',
        marginLeft: t.x,
        top: '50%',
        marginTop: t.y,
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
      transition={{
        duration: 0.4 * timeScale,
        delay: t.delay,
        times: [0, 0.3, 0.6, 1],
        ease: 'easeOut',
      }}
    />
  )
}

function SparkleDot({ s, timeScale }: { s: Mote; timeScale: number }) {
  return (
    <m.span
      className="pf-celebration__sparkle"
      style={{
        left: '50%',
        marginLeft: s.x,
        top: '50%',
        marginTop: s.y,
        width: `${s.size}px`,
        height: `${s.size}px`,
        background: s.color,
        boxShadow: `0 0 4px 1px ${s.color}`,
        animation: 'none',
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1.2, 0.4, 0.9, 0], opacity: [0, 0.8, 0.2, 0.5, 0] }}
      transition={{
        duration: 0.7 * timeScale,
        delay: s.delay,
        times: [0, 0.2, 0.45, 0.7, 1],
        ease: 'easeOut',
      }}
    />
  )
}

function VortexCore({ timeScale }: { timeScale: number }) {
  return (
    <m.span
      style={{
        position: 'absolute',
        left: '50%',
        marginLeft: -4,
        top: '50%',
        marginTop: -4,
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: 'var(--pf-anim-gold, #ffd700)',
        boxShadow: '0 0 24px 16px var(--pf-anim-gold, #ffd700)',
        pointerEvents: 'none',
        willChange: 'opacity',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.6, 0.45, 0.2, 0] }}
      transition={{ duration: 1.8 * timeScale, times: [0, 0.1, 0.3, 0.6, 1], ease: 'easeOut' }}
    />
  )
}

/* ─── Main ─── */

function ModalCelebrationsCoinsSwirlComponent({
  coinCount = DEFAULT_COIN_COUNT,
  coinImage,
  particleImages = [],
  particleMaxWidth = 24,
  particleMaxHeight = 24,
  colors = GOLDEN_COLORS_HEX,
  duration,
  onComplete,
}: ModalCelebrationsCoinsSwirlProps) {
  const prefersReducedMotion = useReducedMotion()
  const timeScale = (duration ?? DEFAULT_DURATION_MS) / DEFAULT_DURATION_MS
  const effectiveColors = colors.length > 0 ? colors : GOLDEN_COLORS
  const hasParticleImages = particleImages.length > 0
  const resolveCoinSrc = (index: number): string | undefined =>
    hasParticleImages ? particleImages[index % particleImages.length] : coinImage

  const coins = useMemo(() => makeCoins(coinCount, timeScale), [coinCount, timeScale])
  const trails = useMemo(() => makeTrails(effectiveColors, timeScale), [effectiveColors, timeScale])
  const sparkles = useMemo(
    () => makeSparkles(effectiveColors, timeScale),
    [effectiveColors, timeScale]
  )
  const bgCoins = useMemo(() => coins.filter((c) => c.layer === 'bg'), [coins])
  const fgCoins = useMemo(() => coins.filter((c) => c.layer === 'fg'), [coins])

  useEffect(() => {
    if (onComplete === undefined) return
    const maxTime = Math.max(
      ...coins.map((c) => c.delay + c.dur),
      ...sparkles.map((s) => s.delay + 0.7 * timeScale)
    )
    const timer = setTimeout(onComplete, maxTime * 1000 + 50)
    return () => clearTimeout(timer)
  }, [coins, sparkles, timeScale, onComplete])

  useEffect(() => {
    if (prefersReducedMotion && onComplete) onComplete()
  }, [prefersReducedMotion, onComplete])
  if (prefersReducedMotion)
    return <div className="pf-celebration" data-animation-id="modal-celebrations__coins-swirl" />

  return (
    <div className="pf-celebration" data-animation-id="modal-celebrations__coins-swirl">
      <VortexCore timeScale={timeScale} />
      <div className="pf-celebration__depth-bg" style={{ perspective: 300 }}>
        {bgCoins.map((c) => (
          <CoinPiece
            key={c.id}
            c={c}
            coinSrc={resolveCoinSrc(c.id)}
            maxW={particleMaxWidth}
            maxH={particleMaxHeight}
          />
        ))}
      </div>
      <div className="pf-celebration__depth-fg" style={{ perspective: 300 }}>
        {fgCoins.map((c) => (
          <CoinPiece
            key={c.id}
            c={c}
            coinSrc={resolveCoinSrc(c.id)}
            maxW={particleMaxWidth}
            maxH={particleMaxHeight}
          />
        ))}
      </div>
      <div className="pf-celebration__effects">
        {trails.map((t) => (
          <TrailDot key={t.id} t={t} timeScale={timeScale} />
        ))}
        {sparkles.map((s) => (
          <SparkleDot key={s.id} s={s} timeScale={timeScale} />
        ))}
      </div>
    </div>
  )
}

export const ModalCelebrationsCoinsSwirl = memo(ModalCelebrationsCoinsSwirlComponent)
