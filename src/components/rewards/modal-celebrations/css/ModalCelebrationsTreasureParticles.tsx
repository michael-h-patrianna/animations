import { useMemo } from 'react'

import {
  coinImage,
  gemDiamondImage,
  gemEmeraldImage,
  gemRubyImage,
  gemSapphireImage,
} from '@/assets'
import { deg2rad, GEM_TYPES, GOLDEN_COLORS, pickRandom, randBetween } from '../utils'
import './ModalCelebrationsTreasureParticles.css'

/* ─── Types ─── */

type Coin = {
  id: number
  vx: number
  vy: number
  grav: number
  spin: number
  size: number
  delay: number
  dur: number
  om: number
  layer: 'bg' | 'fg'
}

type Gem = {
  id: number
  vx: number
  vy: number
  grav: number
  spin: number
  image: string
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

const COIN_COUNT = 12
const GEM_COUNT = 12
const TRAIL_COUNT = 20
const SPARKLE_COUNT = 12

const GEM_IMAGES: Record<string, string> = {
  diamond: gemDiamondImage,
  ruby: gemRubyImage,
  emerald: gemEmeraldImage,
  sapphire: gemSapphireImage,
}

/* ─── Generators ─── */

/** 12 coins with radial velocity and gravity for the tp-coin keyframe. */
function makeCoins(): Coin[] {
  return Array.from({ length: COIN_COUNT }, (_, i) => {
    const angle = deg2rad((i / COIN_COUNT) * 360 + randBetween(-15, 15))
    const speed = randBetween(100, 200)
    const isBg = i % 4 === 0
    return {
      id: i,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      grav: randBetween(300, 500),
      spin: (isBg ? randBetween(2, 3) : randBetween(3, 5)) * 360,
      size: isBg ? randBetween(14, 18) : randBetween(18, 24),
      delay: randBetween(0, 120),
      dur: randBetween(1400, 2000),
      om: isBg ? 0.55 : 1,
      layer: isBg ? ('bg' as const) : ('fg' as const),
    }
  })
}

/** 12 gems (3 per type) with radial burst for the tp-gem keyframe. */
function makeGems(): Gem[] {
  return Array.from({ length: GEM_COUNT }, (_, i) => {
    const gemType = GEM_TYPES[i % 4]
    const angle = deg2rad((i / GEM_COUNT) * 360 + randBetween(-20, 20))
    const speed = randBetween(80, 180)
    const isBg = i % 3 === 0
    return {
      id: i,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      grav: randBetween(250, 400),
      spin: randBetween(1, 3) * 360,
      image: GEM_IMAGES[gemType.name],
      size: isBg ? randBetween(12, 16) : randBetween(16, 24),
      delay: 50 + randBetween(0, 150),
      dur: randBetween(1500, 2200),
      layer: isBg ? ('bg' as const) : ('fg' as const),
    }
  })
}

/** 20 colored trail motes scattered along burst paths. */
function makeTrails(): Mote[] {
  return Array.from({ length: TRAIL_COUNT }, (_, i) => {
    const angle = deg2rad(randBetween(0, 360))
    const r = randBetween(20, 90)
    const gem = GEM_TYPES[i % 4]
    return {
      id: i,
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r,
      delay: 100 + i * 40 + randBetween(0, 80),
      size: randBetween(2, 4),
      color: pickRandom([gem.color1, gem.color2]),
    }
  })
}

/** 12 golden sparkles in the burst area. */
function makeSparkles(): Mote[] {
  return Array.from({ length: SPARKLE_COUNT }, (_, i) => {
    const angle = deg2rad(randBetween(0, 360))
    const r = randBetween(30, 100)
    return {
      id: i,
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r,
      delay: 200 + i * 50 + randBetween(0, 100),
      size: randBetween(2.5, 4.5),
      color: pickRandom(GOLDEN_COLORS),
    }
  })
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
              '--vx': `${c.vx}px`,
              '--vy': `${c.vy}px`,
              '--grav': `${c.grav}px`,
              '--spin': c.spin,
              '--om': c.om,
              animation: `tp-coin ${c.dur}ms linear ${c.delay}ms both`,
            } as React.CSSProperties
          }
        />
      ))}
    </>
  )
}

function GemLayer({ gems }: { gems: Gem[] }) {
  return (
    <>
      {gems.map((g) => (
        <img
          key={g.id}
          src={g.image}
          alt=""
          style={
            {
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: `${g.size}px`,
              height: `${g.size}px`,
              pointerEvents: 'none',
              willChange: 'transform, opacity',
              '--vx': `${g.vx}px`,
              '--vy': `${g.vy}px`,
              '--grav': `${g.grav}px`,
              '--spin': g.spin,
              animation: `tp-gem ${g.dur}ms linear ${g.delay}ms both`,
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
            animation: `tp-trail 400ms ease-out ${t.delay}ms both`,
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
            animation: `tp-sparkle 700ms ease-out ${s.delay}ms both`,
          }}
        />
      ))}
    </>
  )
}

/* ─── Main ─── */

/**
 * Treasure Eruption (CSS) — mixed coins and gems erupt in a radial burst
 * with parabolic gravity arcs using CSS calc() and custom properties.
 */
export function ModalCelebrationsTreasureParticles() {
  const coins = useMemo(makeCoins, [])
  const gems = useMemo(makeGems, [])
  const trails = useMemo(makeTrails, [])
  const sparkles = useMemo(makeSparkles, [])
  const bgCoins = useMemo(() => coins.filter((c) => c.layer === 'bg'), [coins])
  const fgCoins = useMemo(() => coins.filter((c) => c.layer === 'fg'), [coins])
  const bgGems = useMemo(() => gems.filter((g) => g.layer === 'bg'), [gems])
  const fgGems = useMemo(() => gems.filter((g) => g.layer === 'fg'), [gems])

  return (
    <div className="pf-celebration" data-animation-id="modal-celebrations__treasure-particles">
      {/* Center flash */}
      <span
        className="pf-celebration__flash"
        style={{ animation: 'tp-core-flash 500ms ease-out both' }}
      />
      {/* Ambient glow */}
      <span
        className="pf-celebration__glow"
        style={{ animation: 'tp-glow 1800ms ease-out both' }}
      />
      {/* Background depth */}
      <div className="pf-celebration__depth-bg">
        <CoinLayer coins={bgCoins} />
        <GemLayer gems={bgGems} />
      </div>
      {/* Effects */}
      <div className="pf-celebration__effects">
        <TrailLayer trails={trails} />
        <SparkleLayer sparkles={sparkles} />
      </div>
      {/* Foreground depth */}
      <div className="pf-celebration__depth-fg">
        <CoinLayer coins={fgCoins} />
        <GemLayer gems={fgGems} />
      </div>
    </div>
  )
}
