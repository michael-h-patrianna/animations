import { useMemo } from 'react'

import { coinImage } from '@/assets'
import { GOLDEN_COLORS, deg2rad, pickRandom, randBetween } from '../utils'
import './ModalCelebrationsCoinsSwirl.css'

/* ─── Types ─── */

type Coin = {
  id: number
  startAngle: number
  totalSpin: number
  rStart: number
  rEnd: number
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

const COIN_COUNT = 20
const TRAIL_COUNT = 16
const SPARKLE_COUNT = 12

/* ─── Generators ─── */

/**
 * 20 coins with per-coin CSS variables for the cs-coin spiral keyframe.
 * --start-angle, --total-spin (deg), --r-start, --r-end (px), --spin, --tumble, --om.
 */
function makeCoins(): Coin[] {
  const coins: Coin[] = []

  for (let i = 0; i < COIN_COUNT; i++) {
    const layer: 'bg' | 'fg' = i % 4 === 0 ? 'bg' : 'fg'
    const isBg = layer === 'bg'

    coins.push({
      id: i,
      startAngle: (i / COIN_COUNT) * 360 + randBetween(-8, 8),
      totalSpin: randBetween(540, 900),
      rStart: randBetween(6, 14),
      rEnd: isBg ? randBetween(60, 80) : randBetween(80, 120),
      spin: (isBg ? randBetween(2, 3) : randBetween(3, 4)) * 360,
      tumble: randBetween(-20, 20),
      size: isBg ? randBetween(14, 18) : randBetween(18, 26),
      delay: i * 40 + randBetween(0, 30),
      dur: randBetween(1300, 1800),
      om: isBg ? 0.55 : 1,
      layer,
    })
  }

  return coins
}

/** 16 golden trail motes along spiral paths. */
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
      delay: t * 1500 + randBetween(0, 100),
      size: randBetween(2, 4),
      color: pickRandom(GOLDEN_COLORS),
    })
  }

  return trails
}

/** 12 golden sparkles in the vortex area. */
function makeSparkles(): Mote[] {
  const sparkles: Mote[] = []

  for (let i = 0; i < SPARKLE_COUNT; i++) {
    const angleRad = deg2rad(randBetween(0, 360))
    const r = randBetween(30, 100)

    sparkles.push({
      id: i,
      x: Math.cos(angleRad) * r,
      y: Math.sin(angleRad) * r,
      delay: 300 + i * 60 + randBetween(0, 80),
      size: randBetween(2.5, 4.5),
      color: pickRandom(GOLDEN_COLORS),
    })
  }

  return sparkles
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
              top: '50%',
              width: `${c.size}px`,
              height: `${c.size}px`,
              pointerEvents: 'none',
              willChange: 'transform, opacity',
              '--start-angle': `${c.startAngle}deg`,
              '--total-spin': `${c.totalSpin}deg`,
              '--r-start': `${c.rStart}px`,
              '--r-end': `${c.rEnd}px`,
              '--spin': c.spin,
              '--tumble': c.tumble,
              '--om': c.om,
              animation: `cs-coin ${c.dur}ms linear ${c.delay}ms forwards`,
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
            top: `calc(50% + ${t.y}px)`,
            width: `${t.size}px`,
            height: `${t.size}px`,
            borderRadius: '50%',
            background: t.color,
            boxShadow: `0 0 ${t.size + 2}px ${Math.round(t.size * 0.5)}px ${t.color}`,
            pointerEvents: 'none',
            willChange: 'transform, opacity',
            animation: `cs-trail 400ms ease-out ${t.delay}ms forwards`,
          }}
        />
      ))}
    </>
  )
}

function SparkleLayer({ sparkles }: { sparkles: Mote[] }) {
  return (
    <>
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="pf-celebration__sparkle"
          style={{
            left: `calc(50% + ${s.x}px)`,
            top: `calc(50% + ${s.y}px)`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            background: s.color,
            boxShadow: `0 0 4px 1px ${s.color}`,
            animation: `cs-sparkle 700ms ease-out ${s.delay}ms forwards`,
          }}
        />
      ))}
    </>
  )
}

/* ─── Main ─── */

/**
 * Golden Vortex (CSS) — coins spiral outward from center using rotate()+translateX()
 * trick, with golden trail dust and sparkle twinkles.
 */
export function ModalCelebrationsCoinsSwirl() {
  const coins = useMemo(makeCoins, [])
  const trails = useMemo(makeTrails, [])
  const sparkles = useMemo(makeSparkles, [])
  const bgCoins = useMemo(() => coins.filter((c) => c.layer === 'bg'), [coins])
  const fgCoins = useMemo(() => coins.filter((c) => c.layer === 'fg'), [coins])

  return (
    <div className="pf-celebration" data-animation-id="modal-celebrations__coins-swirl">
      <span
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
          animation: 'cs-core-glow 1800ms ease-out forwards',
        }}
      />
      <div className="pf-celebration__depth-bg">
        <CoinLayer coins={bgCoins} />
      </div>
      <div className="pf-celebration__depth-fg">
        <CoinLayer coins={fgCoins} />
      </div>
      <div className="pf-celebration__effects">
        <TrailLayer trails={trails} />
        <SparkleLayer sparkles={sparkles} />
      </div>
    </div>
  )
}
