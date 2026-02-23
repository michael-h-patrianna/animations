import { useMemo } from 'react'

import { coinImage } from '@/assets'
import { GOLDEN_COLORS, pickRandom, randBetween } from '../utils'
import './ModalCelebrationsCoinCascade.css'

/* ─── Types ─── */

type Coin = {
  id: number
  sx: number
  wx: number
  ex: number
  fall: number
  bounce: number
  spin: number
  tumble: number
  size: number
  delay: number
  dur: number
  om: number
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
const STREAMS = [-55, 0, 55]

/* ─── Generators ─── */

/**
 * 24 coins in 3 streams with per-coin CSS variables for the cc-coin keyframe.
 * --sx: start x, --wx: wobble peak, --ex: end x, --fall, --bounce, --spin, --tumble, --om.
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
    const endX = wobbleAmp * Math.sin(wobbleFreq * Math.PI)
    const bounceH = fallDist * randBetween(0.1, 0.2)

    coins.push({
      id: i,
      sx: startX,
      wx: wobbleAmp,
      ex: endX,
      fall: fallDist,
      bounce: bounceH,
      spin: (isBg ? randBetween(2, 3) : randBetween(3, 5)) * 360,
      tumble: randBetween(-30, 30),
      size: isBg ? randBetween(14, 18) : randBetween(18, 26),
      delay: streamIdx * 60 + Math.floor(i / 3) * 55 + randBetween(0, 30),
      dur: randBetween(1100, 1500),
      om: isBg ? 0.55 : 1,
      layer,
    })
  }

  return coins
}

/** 18 golden trail motes along coin fall paths. */
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
      delay: (i % 3) * 60 + fallFrac * 1200 + randBetween(0, 100),
      size: randBetween(2, 4),
      color: pickRandom(GOLDEN_COLORS),
    })
  }

  return trails
}

/** 10 impact sparkles at coin bounce points. */
function makeImpacts(): Mote[] {
  const impacts: Mote[] = []

  for (let i = 0; i < IMPACT_COUNT; i++) {
    const stream = STREAMS[i % 3]

    impacts.push({
      id: i,
      x: stream + randBetween(-22, 22),
      y: randBetween(150, 185),
      delay: (i % 3) * 60 + Math.floor(i / 3) * 70 + randBetween(700, 950),
      size: randBetween(3, 6),
      color: pickRandom(GOLDEN_COLORS),
    })
  }

  return impacts
}

/** 14 ambient shimmer dots in the cascade zone. */
function makeShimmers(): Mote[] {
  const shimmers: Mote[] = []

  for (let i = 0; i < SHIMMER_COUNT; i++) {
    shimmers.push({
      id: i,
      x: randBetween(-70, 70),
      y: randBetween(20, 160),
      delay: 250 + i * 50 + randBetween(0, 80),
      size: randBetween(2, 4),
      color: pickRandom(GOLDEN_COLORS),
    })
  }

  return shimmers
}

/* ─── Sub-components ─── */

function CoinLayer({ coins }: { coins: Coin[] }) {
  return (
    <>
      {coins.map((c) => (
        <img
          key={c.id}
          src={coinImage}
          alt=""
          style={
            {
              position: 'absolute',
              left: '50%',
              top: '10%',
              width: `${c.size}px`,
              height: `${c.size}px`,
              pointerEvents: 'none',
              willChange: 'transform, opacity',
              '--sx': `${c.sx}px`,
              '--wx': `${c.wx}px`,
              '--ex': `${c.ex}px`,
              '--fall': `${c.fall}px`,
              '--bounce': `${c.bounce}px`,
              '--spin': c.spin,
              '--tumble': c.tumble,
              '--om': c.om,
              animation: `cc-coin ${c.dur}ms linear ${c.delay}ms forwards`,
            } as React.CSSProperties
          }
        />
      ))}
    </>
  )
}

function TrailLayer({ trails }: { trails: Mote[] }) {
  return (
    <>
      {trails.map((t) => (
        <span
          key={t.id}
          style={{
            position: 'absolute',
            left: `calc(50% + ${t.x}px)`,
            top: `calc(10% + ${t.y}px)`,
            width: `${t.size}px`,
            height: `${t.size}px`,
            borderRadius: '50%',
            background: t.color,
            boxShadow: `0 0 ${t.size + 2}px ${Math.round(t.size * 0.5)}px ${t.color}`,
            pointerEvents: 'none',
            willChange: 'transform, opacity',
            animation: `cc-trail 400ms ease-out ${t.delay}ms forwards`,
          }}
        />
      ))}
    </>
  )
}

function ImpactLayer({ impacts }: { impacts: Mote[] }) {
  return (
    <>
      {impacts.map((imp) => (
        <span
          key={imp.id}
          style={{
            position: 'absolute',
            left: `calc(50% + ${imp.x}px)`,
            top: `calc(10% + ${imp.y}px)`,
            width: `${imp.size}px`,
            height: `${imp.size}px`,
            borderRadius: '50%',
            background: imp.color,
            boxShadow: `0 0 ${imp.size + 4}px ${Math.round(imp.size * 0.8)}px ${imp.color}`,
            pointerEvents: 'none',
            willChange: 'transform, opacity',
            animation: `cc-impact 350ms ease-out ${imp.delay}ms forwards`,
          }}
        />
      ))}
    </>
  )
}

function ShimmerLayer({ shimmers }: { shimmers: Mote[] }) {
  return (
    <>
      {shimmers.map((s) => (
        <span
          key={s.id}
          className="pf-celebration__sparkle"
          style={{
            left: `calc(50% + ${s.x}px)`,
            top: `calc(10% + ${s.y}px)`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            background: s.color,
            boxShadow: `0 0 4px 1px ${s.color}`,
            animation: `cc-shimmer 700ms ease-out ${s.delay}ms forwards`,
          }}
        />
      ))}
    </>
  )
}

/* ─── Main ─── */

/**
 * Jackpot Cascade (CSS) — coins pour from 3 stream sources, fall with gravity
 * and wobble, bounce off the floor, with golden trail dust and impact sparkles.
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
        <span
          key={i}
          style={{
            position: 'absolute',
            left: `calc(50% + ${x}px)`,
            top: '10%',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'var(--pf-anim-gold)',
            boxShadow: '0 0 18px 12px var(--pf-anim-gold)',
            pointerEvents: 'none',
            animation: `cc-source-glow 1500ms ease-out ${i * 50}ms forwards`,
          }}
        />
      ))}
      <div className="pf-celebration__depth-bg">
        <CoinLayer coins={bgCoins} />
      </div>
      <div className="pf-celebration__depth-fg">
        <CoinLayer coins={fgCoins} />
      </div>
      <div className="pf-celebration__effects">
        <TrailLayer trails={trails} />
        <ImpactLayer impacts={impacts} />
        <ShimmerLayer shimmers={shimmers} />
      </div>
    </div>
  )
}
