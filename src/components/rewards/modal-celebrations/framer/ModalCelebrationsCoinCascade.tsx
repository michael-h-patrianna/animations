/**
 * Jackpot Cascade — coins pour from 3 stream sources, gravity fall with wobble and bounce.
 *
 * Copy-paste files: this file + ../SharedCelebrationTypes.ts + ../SharedFallbackCoin.tsx + ../utils.ts + ../shared.css
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { memo, useEffect, useMemo } from 'react'

import type { CelebrationBaseProps } from '../SharedCelebrationTypes'
import { GOLDEN_COLORS_HEX } from '../SharedCelebrationTypes'
import { FallbackCoin } from '../SharedFallbackCoin'
import { GOLDEN_COLORS, pickRandom, randBetween } from '../utils'

/* ─── Props ─── */

interface ModalCelebrationsCoinCascadeProps extends CelebrationBaseProps {
  /** Number of coin particles. Default 24. */
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

const DEFAULT_COIN_COUNT = 24
const DEFAULT_DURATION_MS = 1400
const STOPS = [0, 0.05, 0.13, 0.24, 0.37, 0.5, 0.65, 0.72, 0.78, 0.86, 0.93, 1.0]
const STREAMS = [-55, 0, 55]

/* ─── Generators ─── */

function makeCoins(count: number, timeScale: number): Coin[] {
  const coins: Coin[] = []

  for (let i = 0; i < count; i++) {
    const streamIdx = i % 3
    const stream = STREAMS[streamIdx]!
    const layer: 'bg' | 'fg' = i % 4 === 0 ? 'bg' : 'fg'
    const isBg = layer === 'bg'

    const startX = stream + randBetween(-16, 16)
    const fallDist = randBetween(150, 185)
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

function makeTrails(colors: readonly string[], timeScale: number): Mote[] {
  const trails: Mote[] = []

  for (let i = 0; i < 18; i++) {
    const stream = STREAMS[i % 3]!
    const fallFrac = randBetween(0.15, 0.6)
    const fallDist = randBetween(150, 185)

    trails.push({
      id: i,
      x: stream + randBetween(-18, 18),
      y: fallDist * fallFrac * fallFrac,
      delay: ((i % 3) * 0.06 + fallFrac * 1.2 + randBetween(0, 0.1)) * timeScale,
      size: randBetween(2, 4),
      color: pickRandom(colors),
    })
  }

  return trails
}

function makeImpacts(colors: readonly string[], timeScale: number): Mote[] {
  const impacts: Mote[] = []

  for (let i = 0; i < 10; i++) {
    const stream = STREAMS[i % 3]!

    impacts.push({
      id: i,
      x: stream + randBetween(-22, 22),
      y: randBetween(150, 185),
      delay: ((i % 3) * 0.06 + Math.floor(i / 3) * 0.07 + randBetween(0.7, 0.95)) * timeScale,
      size: randBetween(3, 6),
      color: pickRandom(colors),
    })
  }

  return impacts
}

function makeShimmers(colors: readonly string[], timeScale: number): Mote[] {
  const shimmers: Mote[] = []

  for (let i = 0; i < 14; i++) {
    shimmers.push({
      id: i,
      x: randBetween(-70, 70),
      y: randBetween(20, 160),
      delay: (0.25 + i * 0.05 + randBetween(0, 0.08)) * timeScale,
      size: randBetween(2, 4),
      color: pickRandom(colors),
    })
  }

  return shimmers
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
        top: '10%',
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
        top: '10%',
        marginTop: t.y,
        width: `${t.size}px`,
        height: `${t.size}px`,
        borderRadius: '50%',
        background: t.color,
        filter: `drop-shadow(0 0 ${Math.round(t.size * 1.5) + 2}px ${t.color})`,
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

function ImpactBurst({ imp, timeScale }: { imp: Mote; timeScale: number }) {
  return (
    <m.span
      style={{
        position: 'absolute',
        left: '50%',
        marginLeft: imp.x,
        top: '10%',
        marginTop: imp.y,
        width: `${imp.size}px`,
        height: `${imp.size}px`,
        borderRadius: '50%',
        background: imp.color,
        filter: `drop-shadow(0 0 ${Math.round(imp.size * 1.8) + 4}px ${imp.color})`,
        pointerEvents: 'none',
        willChange: 'transform, opacity',
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 2, 0.8, 0], opacity: [0, 1, 0.4, 0] }}
      transition={{
        duration: 0.35 * timeScale,
        delay: imp.delay,
        times: [0, 0.25, 0.6, 1],
        ease: 'easeOut',
      }}
    />
  )
}

function ShimmerDot({ s, timeScale }: { s: Mote; timeScale: number }) {
  return (
    <m.span
      className="pf-celebration__sparkle"
      style={{
        left: '50%',
        marginLeft: s.x,
        top: '10%',
        marginTop: s.y,
        width: `${s.size}px`,
        height: `${s.size}px`,
        background: s.color,
        filter: `drop-shadow(0 0 5px ${s.color})`,
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

function SourceGlow({ x, delay, timeScale }: { x: number; delay: number; timeScale: number }) {
  return (
    <m.span
      style={{
        position: 'absolute',
        left: '50%',
        marginLeft: x,
        top: '10%',
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: 'var(--pf-anim-gold, #ffd700)',
        filter: 'drop-shadow(0 0 18px var(--pf-anim-gold, #ffd700))',
        pointerEvents: 'none',
        willChange: 'opacity',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.5, 0.35, 0.12, 0] }}
      transition={{
        duration: 1.5 * timeScale,
        delay,
        times: [0, 0.12, 0.35, 0.65, 1],
        ease: 'easeOut',
      }}
    />
  )
}

/* ─── Main ─── */

function ModalCelebrationsCoinCascadeComponent({
  coinCount = DEFAULT_COIN_COUNT,
  coinImage,
  particleImages = [],
  particleMaxWidth = 24,
  particleMaxHeight = 24,
  colors = GOLDEN_COLORS_HEX,
  duration,
  onComplete,
}: ModalCelebrationsCoinCascadeProps) {
  const timeScale = (duration ?? DEFAULT_DURATION_MS) / DEFAULT_DURATION_MS
  const effectiveColors = colors.length > 0 ? colors : GOLDEN_COLORS
  const hasParticleImages = particleImages.length > 0
  const resolveCoinSrc = (index: number): string | undefined =>
    hasParticleImages ? particleImages[index % particleImages.length] : coinImage

  const coins = useMemo(() => makeCoins(coinCount, timeScale), [coinCount, timeScale])
  const trails = useMemo(() => makeTrails(effectiveColors, timeScale), [effectiveColors, timeScale])
  const impacts = useMemo(
    () => makeImpacts(effectiveColors, timeScale),
    [effectiveColors, timeScale]
  )
  const shimmers = useMemo(
    () => makeShimmers(effectiveColors, timeScale),
    [effectiveColors, timeScale]
  )
  const bgCoins = useMemo(() => coins.filter((c) => c.layer === 'bg'), [coins])
  const fgCoins = useMemo(() => coins.filter((c) => c.layer === 'fg'), [coins])

  useEffect(() => {
    if (onComplete === undefined) return
    const maxTime = Math.max(
      ...coins.map((c) => c.delay + c.dur),
      ...shimmers.map((s) => s.delay + 0.7 * timeScale)
    )
    const timer = setTimeout(onComplete, maxTime * 1000 + 50)
    return () => clearTimeout(timer)
  }, [coins, shimmers, timeScale, onComplete])

  return (
    <div className="pf-celebration" data-animation-id="modal-celebrations__coin-cascade">
      {STREAMS.map((x, i) => (
        <SourceGlow key={i} x={x} delay={i * 0.05 * timeScale} timeScale={timeScale} />
      ))}
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
        {impacts.map((imp) => (
          <ImpactBurst key={imp.id} imp={imp} timeScale={timeScale} />
        ))}
        {shimmers.map((s) => (
          <ShimmerDot key={s.id} s={s} timeScale={timeScale} />
        ))}
      </div>
    </div>
  )
}

export const ModalCelebrationsCoinCascade = memo(ModalCelebrationsCoinCascadeComponent)
