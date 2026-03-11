import * as m from 'motion/react-m'
import { useMemo } from 'react'

import { coinImage } from '@/assets'
import { GOLDEN_COLORS, pickRandom, randBetween } from '../utils'

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

const COIN_COUNT = 24
const TRAIL_COUNT = 18
const IMPACT_COUNT = 10
const SHIMMER_COUNT = 14
const STOPS = [0, 0.05, 0.13, 0.24, 0.37, 0.50, 0.65, 0.72, 0.78, 0.86, 0.93, 1.0]
const STREAMS = [-55, 0, 55]

/* ─── Generators ─── */

/**
 * 24 coins in 3 streams — gravity fall with sinusoidal air wobble and floor bounce.
 * Fall: y(t) = fallDist * (t/0.65)^2. Bounce: parabolic rebound at 65% mark.
 */
function makeCoins(): Coin[] {
  const coins: Coin[] = []

  for (let i = 0; i < COIN_COUNT; i++) {
    const streamIdx = i % 3
    const stream = STREAMS[streamIdx]
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
      else if (t < 0.86) scales.push(0.85 + 0.15 * Math.cos(Math.PI * (t - 0.65) / 0.21))
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
      delay: streamIdx * 0.06 + Math.floor(i / 3) * 0.055 + randBetween(0, 0.03),
      dur: randBetween(1.1, 1.5),
      layer,
    })
  }

  return coins
}

/** 18 golden dust motes trailing behind falling coins. */
function makeTrails(): Mote[] {
  const trails: Mote[] = []

  for (let i = 0; i < TRAIL_COUNT; i++) {
    const stream = STREAMS[i % 3]
    const fallFrac = randBetween(0.15, 0.6)
    const fallDist = randBetween(150, 185)

    trails.push({
      id: i,
      x: stream + randBetween(-18, 18),
      y: fallDist * fallFrac * fallFrac,
      delay: (i % 3) * 0.06 + fallFrac * 1.2 + randBetween(0, 0.1),
      size: randBetween(2, 4),
      color: pickRandom(GOLDEN_COLORS),
    })
  }

  return trails
}

/** 10 impact sparkles at coin bounce points near the floor. */
function makeImpacts(): Mote[] {
  const impacts: Mote[] = []

  for (let i = 0; i < IMPACT_COUNT; i++) {
    const stream = STREAMS[i % 3]

    impacts.push({
      id: i,
      x: stream + randBetween(-22, 22),
      y: randBetween(150, 185),
      delay: (i % 3) * 0.06 + Math.floor(i / 3) * 0.07 + randBetween(0.7, 0.95),
      size: randBetween(3, 6),
      color: pickRandom(GOLDEN_COLORS),
    })
  }

  return impacts
}

/** 14 ambient golden shimmer dots floating in the cascade zone. */
function makeShimmers(): Mote[] {
  const shimmers: Mote[] = []

  for (let i = 0; i < SHIMMER_COUNT; i++) {
    shimmers.push({
      id: i,
      x: randBetween(-70, 70),
      y: randBetween(20, 160),
      delay: 0.25 + i * 0.05 + randBetween(0, 0.08),
      size: randBetween(2, 4),
      color: pickRandom(GOLDEN_COLORS),
    })
  }

  return shimmers
}

/* ─── Sub-components ─── */

/** Coin with gravity fall, sinusoidal wobble, bounce, and 3D spin. */
function CoinPiece({ c }: { c: Coin }) {
  return (
    <m.img
      src={coinImage}
      alt=""
      style={{
        position: 'absolute',
        left: '50%',
        top: '10%',
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

/** Golden dust mote trailing behind a falling coin. */
function TrailDot({ t }: { t: Mote }) {
  return (
    <m.span
      style={{
        position: 'absolute',
        left: '50%', marginLeft: t.x,
        top: '10%', marginTop: t.y,
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
      transition={{ duration: 0.4, delay: t.delay, times: [0, 0.3, 0.6, 1], ease: 'easeOut' }}
    />
  )
}

/** Impact sparkle burst at coin bounce point. */
function ImpactBurst({ imp }: { imp: Mote }) {
  return (
    <m.span
      style={{
        position: 'absolute',
        left: '50%', marginLeft: imp.x,
        top: '10%', marginTop: imp.y,
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
      transition={{ duration: 0.35, delay: imp.delay, times: [0, 0.25, 0.6, 1], ease: 'easeOut' }}
    />
  )
}

/** Ambient golden shimmer twinkle. */
function ShimmerDot({ s }: { s: Mote }) {
  return (
    <m.span
      className="pf-celebration__sparkle"
      style={{
        left: '50%', marginLeft: s.x,
        top: '10%', marginTop: s.y,
        width: `${s.size}px`,
        height: `${s.size}px`,
        background: s.color,
        filter: `drop-shadow(0 0 5px ${s.color})`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1.2, 0.4, 0.9, 0], opacity: [0, 0.8, 0.2, 0.5, 0] }}
      transition={{ duration: 0.7, delay: s.delay, times: [0, 0.2, 0.45, 0.7, 1], ease: 'easeOut' }}
    />
  )
}

/** Golden glow at a pour-point stream source. */
function SourceGlow({ x, delay }: { x: number; delay: number }) {
  return (
    <m.span
      style={{
        position: 'absolute',
        left: '50%', marginLeft: x,
        top: '10%',
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: 'var(--pf-anim-gold)',
        filter: 'drop-shadow(0 0 18px var(--pf-anim-gold))',
        pointerEvents: 'none',
        willChange: 'opacity',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.5, 0.35, 0.12, 0] }}
      transition={{ duration: 1.5, delay, times: [0, 0.12, 0.35, 0.65, 1], ease: 'easeOut' }}
    />
  )
}

/* ─── Main ─── */

/**
 * Jackpot Cascade — coins pour from 3 stream sources at the top, accelerate
 * with gravity, wobble through air, and bounce off the floor with golden
 * trail dust, impact sparkles, and ambient shimmer.
 */
export function ModalCelebrationsCoinCascade() {
  const coins = useMemo(makeCoins, [])
  const trails = useMemo(makeTrails, [])
  const impacts = useMemo(makeImpacts, [])
  const shimmers = useMemo(makeShimmers, [])
  const bgCoins = useMemo(() => coins.filter((c) => c.layer === 'bg'), [coins])
  const fgCoins = useMemo(() => coins.filter((c) => c.layer === 'fg'), [coins])

  return (
    <div className="pf-celebration" data-animation-id="modal-celebrations__coin-cascade">
      {STREAMS.map((x, i) => (
        <SourceGlow key={i} x={x} delay={i * 0.05} />
      ))}
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
        {impacts.map((imp) => (
          <ImpactBurst key={imp.id} imp={imp} />
        ))}
        {shimmers.map((s) => (
          <ShimmerDot key={s.id} s={s} />
        ))}
      </div>
    </div>
  )
}
