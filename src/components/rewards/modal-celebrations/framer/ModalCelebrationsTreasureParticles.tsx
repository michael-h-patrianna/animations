/**
 * Treasure Eruption — mixed coins and gems erupt radially with parabolic gravity.
 *
 * Copy-paste files: this file + ../SharedCelebrationTypes.ts + ../SharedFallbackCoin.tsx + ../utils.ts + ../shared.css
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { memo, useEffect, useMemo } from 'react'

import type { CelebrationBaseProps } from '@/components/rewards/modal-celebrations/SharedCelebrationTypes'
import { FallbackCoin } from '@/components/rewards/modal-celebrations/SharedFallbackCoin'
import { deg2rad, GEM_TYPES, GOLDEN_COLORS, pickRandom, randBetween } from '@/components/rewards/modal-celebrations/utils'

/* ─── Props ─── */

interface ModalCelebrationsTreasureParticlesProps extends CelebrationBaseProps {
  /** Number of coin particles. Default 12. */
  coinCount?: number
  /** Number of gem particles. Default 12. */
  gemCount?: number
  /** URL for a single coin image. Overridden by `particleImages` when both are provided. When omitted, renders SVG fallback coin. */
  coinImage?: string
}

/* ─── Types ─── */

type Coin = {
  id: number
  xs: number[]
  ys: number[]
  spins: number[]
  size: number
  delay: number
  dur: number
  layer: 'bg' | 'fg'
}

type Gem = {
  id: number
  xs: number[]
  ys: number[]
  rotations: number[]
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
const STOPS = 12

const BURST_TIMES = [0, 0.05, 0.1, 0.18, 0.28, 0.4, 0.52, 0.65, 0.78, 0.88, 0.95, 1]

/* Scale envelope: quick pop then gradual fade */
const COIN_SCALES = [0.2, 1, 1, 1, 1, 1, 1, 0.85, 0.6, 0.35, 0.15, 0]
const GEM_SCALES = [0.2, 1.2, 1.1, 1, 1, 1, 1, 0.9, 0.65, 0.35, 0.15, 0]
const OPACITY_ENV = [0, 1, 1, 1, 1, 1, 0.9, 0.7, 0.45, 0.25, 0.1, 0]

/* ─── Helpers ─── */

/** Sample x/y along a parabolic burst: x = vx*t, y = vy*t + 0.5*g*t^2. */
function sampleBurst(vx: number, vy: number, grav: number) {
  return {
    xs: BURST_TIMES.map((t) => vx * t),
    ys: BURST_TIMES.map((t) => vy * t + 0.5 * grav * t * t),
  }
}

/** Generate linearly spaced values from 0 to total over STOPS steps. */
function linSpace(total: number): number[] {
  return Array.from({ length: STOPS }, (_, i) => (i / (STOPS - 1)) * total)
}

/* ─── Generators ─── */

/** 12 coins bursting radially with gravity arcs and 3D spin. */
function makeCoins(): Coin[] {
  return Array.from({ length: COIN_COUNT }, (_, i) => {
    const angle = deg2rad((i / COIN_COUNT) * 360 + randBetween(-15, 15))
    const speed = randBetween(100, 200)
    const { xs, ys } = sampleBurst(
      Math.cos(angle) * speed,
      Math.sin(angle) * speed,
      randBetween(300, 500)
    )
    const isBg = i % 4 === 0
    return {
      id: i,
      xs,
      ys,
      spins: linSpace((isBg ? randBetween(2, 3) : randBetween(3, 5)) * 360),
      size: isBg ? randBetween(14, 18) : randBetween(18, 24),
      delay: randBetween(0, 120),
      dur: randBetween(1400, 2000),
      layer: isBg ? ('bg' as const) : ('fg' as const),
    }
  })
}

/** 12 gems (3 per type) bursting with gravity arcs and tumble rotation. */
function makeGems(): Gem[] {
  return Array.from({ length: GEM_COUNT }, (_, i) => {
    const gemType = GEM_TYPES[i % 4]!
    const angle = deg2rad((i / GEM_COUNT) * 360 + randBetween(-20, 20))
    const speed = randBetween(80, 180)
    const { xs, ys } = sampleBurst(
      Math.cos(angle) * speed,
      Math.sin(angle) * speed,
      randBetween(250, 400)
    )
    const isBg = i % 3 === 0
    return {
      id: i,
      xs,
      ys,
      rotations: linSpace(randBetween(1, 3) * 360),
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
          <m.div
            key={c.id}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: w,
              height: h,
              pointerEvents: 'none',
              willChange: 'transform, opacity',
            }}
            initial={{ x: 0, y: 0, scale: 0.2, opacity: 0, rotateY: 0 }}
            animate={{
              x: c.xs,
              y: c.ys,
              scale: COIN_SCALES,
              opacity: OPACITY_ENV,
              rotateY: c.spins,
            }}
            transition={{
              duration: c.dur / 1000,
              delay: c.delay / 1000,
              times: BURST_TIMES,
              ease: 'linear',
            }}
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
          </m.div>
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
          <m.div
            key={g.id}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: w,
              height: h,
              pointerEvents: 'none',
              willChange: 'transform, opacity',
            }}
            initial={{ x: 0, y: 0, scale: 0.2, opacity: 0, rotate: 0 }}
            animate={{
              x: g.xs,
              y: g.ys,
              scale: GEM_SCALES,
              opacity: OPACITY_ENV,
              rotate: g.rotations,
            }}
            transition={{
              duration: g.dur / 1000,
              delay: g.delay / 1000,
              times: BURST_TIMES,
              ease: 'linear',
            }}
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
          </m.div>
        )
      })}
    </>
  )
}

function TrailLayer({ trails }: { trails: Mote[] }) {
  return (
    <>
      {trails.map((t) => (
        <m.span
          key={t.id}
          style={{
            position: 'absolute',
            left: '50%',
            marginLeft: t.x,
            top: '50%',
            marginTop: t.y,
            width: t.size,
            height: t.size,
            borderRadius: '50%',
            background: t.color,
            filter: `drop-shadow(0 0 ${Math.round(t.size * 1.5) + 2}px ${t.color})`,
            pointerEvents: 'none',
            willChange: 'transform, opacity',
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.4, 0.6, 0], opacity: [0, 0.8, 0.3, 0] }}
          transition={{
            duration: 0.4,
            delay: t.delay / 1000,
            times: [0, 0.3, 0.6, 1],
            ease: 'easeOut',
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
        <m.span
          key={s.id}
          className="pf-celebration__sparkle"
          style={{
            left: '50%',
            marginLeft: s.x,
            top: '50%',
            marginTop: s.y,
            width: s.size,
            height: s.size,
            background: s.color,
            filter: `drop-shadow(0 0 5px ${s.color})`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.2, 0.4, 0.9, 0], opacity: [0, 0.8, 0.2, 0.5, 0] }}
          transition={{
            duration: 0.7,
            delay: s.delay / 1000,
            times: [0, 0.2, 0.45, 0.7, 1],
            ease: 'easeOut',
          }}
        />
      ))}
    </>
  )
}

/* ─── Main ─── */

/**
 * Treasure Eruption (Framer Motion) — mixed coins and gems erupt in a radial
 * burst with parabolic gravity arcs, gem-colored trails, and sparkle twinkles.
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
      ...coins.map((c) => (c.delay + c.dur) / 1000),
      ...gems.map((g) => (g.delay + g.dur) / 1000),
      ...sparkles.map((s) => s.delay + 0.5)
    )
    const timer = setTimeout(onComplete, maxTime * 1000 + 50)
    return () => clearTimeout(timer)
  }, [coins, gems, sparkles, onComplete])
  const bgCoins = useMemo(() => coins.filter((c) => c.layer === 'bg'), [coins])
  const fgCoins = useMemo(() => coins.filter((c) => c.layer === 'fg'), [coins])
  const bgGems = useMemo(() => gems.filter((g) => g.layer === 'bg'), [gems])
  const fgGems = useMemo(() => gems.filter((g) => g.layer === 'fg'), [gems])

  return (
    <div className="pf-celebration" data-animation-id="modal-celebrations__treasure-particles">
      {/* Center flash */}
      <m.span
        className="pf-celebration__flash"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.8, 0.6], opacity: [0, 0.9, 0] }}
        transition={{ duration: 0.5, times: [0, 0.35, 1], ease: 'easeOut' }}
      />
      {/* Ambient glow */}
      <m.span
        className="pf-celebration__glow"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0.3, 0] }}
        transition={{ duration: 1.8, times: [0, 0.15, 0.5, 1], ease: 'easeOut' }}
      />
      {/* Background depth */}
      <div className="pf-celebration__depth-bg" style={{ perspective: 200 }}>
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
      <div className="pf-celebration__depth-fg" style={{ perspective: 200 }}>
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
