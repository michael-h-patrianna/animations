/**
 * Treasure Eruption — mixed coins and gems erupt radially — CSS variant.
 *
 * Copy-paste files: this file + ModalCelebrationsTreasureParticles.css + ../SharedCelebrationTypes.ts + ../SharedFallbackCoin.tsx + ../utils.ts + ../shared.css
 * Runtime deps: react
 */

import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import type { CelebrationBaseProps } from '@/components/rewards/modal-celebrations/SharedCelebrationTypes'
import { FallbackCoin } from '@/components/rewards/modal-celebrations/SharedFallbackCoin'
import {
  deg2rad,
  GEM_TYPES,
  GOLDEN_COLORS,
  pickRandom,
  randBetween,
} from '@/components/rewards/modal-celebrations/utils'
import './ModalCelebrationsTreasureParticles.css'

/* ─── Props ─── */

interface ModalCelebrationsTreasureParticlesProps extends CelebrationBaseProps {
  /** Number of coin particles. Default 12. */
  coinCount?: number
  /** Number of gem particles. Default 12. */
  gemCount?: number
  /** URL for coin image. When omitted, renders SVG fallback coin. */
  coinImage?: string
}

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
  gemColor1: string
  gemColor2: string
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
    const gemType = GEM_TYPES[i % 4]!
    const angle = deg2rad((i / GEM_COUNT) * 360 + randBetween(-20, 20))
    const speed = randBetween(80, 180)
    const isBg = i % 3 === 0
    return {
      id: i,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      grav: randBetween(250, 400),
      spin: randBetween(1, 3) * 360,
      gemColor1: gemType.color1,
      gemColor2: gemType.color2,
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
    const gem = GEM_TYPES[i % 4]!
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

function CoinLayer({
  coins,
  resolveImg,
  maxW,
  maxH,
}: {
  coins: Coin[]
  resolveImg: (id: number) => string | undefined
  maxW: number
  maxH: number
}) {
  return (
    <>
      {coins.map((c) => {
        const src = resolveImg(c.id)
        const w = src !== undefined ? Math.min(c.size, maxW) : c.size
        const h = src !== undefined ? Math.min(c.size, maxH) : c.size
        return (
          <div
            key={c.id}
            style={
              {
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: w,
                height: h,
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
          >
            {src !== undefined ? (
              <img
                src={src}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <FallbackCoin size={c.size} />
            )}
          </div>
        )
      })}
    </>
  )
}

function GemLayer({
  gems,
  resolveImg,
  maxW,
  maxH,
}: {
  gems: Gem[]
  resolveImg: (id: number) => string | undefined
  maxW: number
  maxH: number
}) {
  return (
    <>
      {gems.map((g) => {
        const src = resolveImg(g.id)
        const w = src !== undefined ? Math.min(g.size, maxW) : g.size
        const h = src !== undefined ? Math.min(g.size, maxH) : g.size
        return (
          <div
            key={g.id}
            style={
              {
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: w,
                height: h,
                pointerEvents: 'none',
                willChange: 'transform, opacity',
                '--vx': `${g.vx}px`,
                '--vy': `${g.vy}px`,
                '--grav': `${g.grav}px`,
                '--spin': g.spin,
                animation: `tp-gem ${g.dur}ms linear ${g.delay}ms both`,
              } as React.CSSProperties
            }
          >
            {src !== undefined ? (
              <img
                src={src}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 24 24"
                fill={g.gemColor1}
                aria-hidden="true"
                style={{ display: 'block' }}
              >
                <polygon points="12,2 22,9 18,22 6,22 2,9" />
                <polygon points="12,2 17,9 12,22 7,9" fill={g.gemColor2} opacity="0.6" />
              </svg>
            )}
          </div>
        )
      })}
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
function ModalCelebrationsTreasureParticlesComponent({
  coinImage,
  particleImages = [],
  particleMaxWidth = 24,
  particleMaxHeight = 24,
  onComplete,
}: ModalCelebrationsTreasureParticlesProps) {
  const hasParticleImages = particleImages.length > 0
  const resolveCoinImg = (id: number): string | undefined =>
    hasParticleImages ? particleImages[id % particleImages.length] : coinImage
  const resolveGemImg = (id: number): string | undefined =>
    hasParticleImages ? particleImages[id % particleImages.length] : undefined

  const coins = useMemo(makeCoins, [])
  const gems = useMemo(makeGems, [])
  const trails = useMemo(makeTrails, [])
  const sparkles = useMemo(makeSparkles, [])

  useEffect(() => {
    if (onComplete === undefined) return
    const maxTime = Math.max(
      ...coins.map((c) => c.delay + c.dur),
      ...gems.map((g) => g.delay + g.dur),
      ...sparkles.map((s) => s.delay + 700)
    )
    const timer = setTimeout(onComplete, maxTime + 50)
    return () => clearTimeout(timer)
  }, [coins, gems, sparkles, onComplete])

  const containerRef = useRef<HTMLDivElement>(null)
  const [skip, setSkip] = useState(
    () => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  )
  useLayoutEffect(() => {
    if (!skip && containerRef.current?.closest("[data-reduced-motion='reduce']")) setSkip(true)
  }, [skip])
  useEffect(() => {
    if (skip && onComplete) onComplete()
  }, [skip, onComplete])

  const bgCoins = useMemo(() => coins.filter((c) => c.layer === 'bg'), [coins])
  const fgCoins = useMemo(() => coins.filter((c) => c.layer === 'fg'), [coins])
  const bgGems = useMemo(() => gems.filter((g) => g.layer === 'bg'), [gems])
  const fgGems = useMemo(() => gems.filter((g) => g.layer === 'fg'), [gems])

  if (skip) {
    return (
      <div
        ref={containerRef}
        className="pf-celebration"
        data-animation-id="modal-celebrations__treasure-particles"
      />
    )
  }

  return (
    <div
      ref={containerRef}
      className="pf-celebration"
      data-animation-id="modal-celebrations__treasure-particles"
    >
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
        <CoinLayer
          coins={bgCoins}
          resolveImg={resolveCoinImg}
          maxW={particleMaxWidth}
          maxH={particleMaxHeight}
        />
        <GemLayer
          gems={bgGems}
          resolveImg={resolveGemImg}
          maxW={particleMaxWidth}
          maxH={particleMaxHeight}
        />
      </div>
      {/* Effects */}
      <div className="pf-celebration__effects">
        <TrailLayer trails={trails} />
        <SparkleLayer sparkles={sparkles} />
      </div>
      {/* Foreground depth */}
      <div className="pf-celebration__depth-fg">
        <CoinLayer
          coins={fgCoins}
          resolveImg={resolveCoinImg}
          maxW={particleMaxWidth}
          maxH={particleMaxHeight}
        />
        <GemLayer
          gems={fgGems}
          resolveImg={resolveGemImg}
          maxW={particleMaxWidth}
          maxH={particleMaxHeight}
        />
      </div>
    </div>
  )
}

export const ModalCelebrationsTreasureParticles = memo(ModalCelebrationsTreasureParticlesComponent)
