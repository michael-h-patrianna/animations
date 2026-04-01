/**
 * Golden Vortex — coins spiral outward from center — CSS variant.
 *
 * Copy-paste files: this file + CelebrationEffectsCoinsSwirl.css + ../SharedCelebrationTypes.ts + ../SharedFallbackCoin.tsx + ../utils.ts + ../shared.css
 * Runtime deps: react
 */

import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import type { CelebrationBaseProps } from '@/components/rewards/celebration-effects/SharedCelebrationTypes'
import { GOLDEN_COLORS_HEX } from '@/components/rewards/celebration-effects/SharedCelebrationTypes'
import { FallbackCoin } from '@/components/rewards/celebration-effects/SharedFallbackCoin'
import {
  GOLDEN_COLORS,
  deg2rad,
  pickRandom,
  randBetween,
} from '@/components/rewards/celebration-effects/utils'
import './CelebrationEffectsCoinsSwirl.css'

/* ─── Props ─── */

interface CelebrationEffectsCoinsSwirlProps extends CelebrationBaseProps {
  /** Number of coin particles. Default 20. */
  coinCount?: number
  /** URL for coin image. When omitted, renders SVG fallback coin. */
  coinImage?: string
}

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

const DEFAULT_COIN_COUNT = 20
const DEFAULT_DURATION_MS = 1550

/* ─── Generators ─── */

function makeCoins(count: number, timeScale: number): Coin[] {
  const coins: Coin[] = []

  for (let i = 0; i < count; i++) {
    const layer: 'bg' | 'fg' = i % 4 === 0 ? 'bg' : 'fg'
    const isBg = layer === 'bg'

    coins.push({
      id: i,
      startAngle: (i / count) * 360 + randBetween(-8, 8),
      totalSpin: randBetween(540, 900),
      rStart: randBetween(6, 14),
      rEnd: isBg ? randBetween(60, 80) : randBetween(80, 120),
      spin: (isBg ? randBetween(2, 3) : randBetween(3, 4)) * 360,
      tumble: randBetween(-20, 20),
      size: isBg ? randBetween(14, 18) : randBetween(18, 26),
      delay: (i * 40 + randBetween(0, 30)) * timeScale,
      dur: randBetween(1300, 1800) * timeScale,
      om: isBg ? 0.55 : 1,
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
      delay: (t * 1500 + randBetween(0, 100)) * timeScale,
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
      delay: (300 + i * 60 + randBetween(0, 80)) * timeScale,
      size: randBetween(2.5, 4.5),
      color: pickRandom(colors),
    })
  }

  return sparkles
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
                '--start-angle': `${c.startAngle}deg`,
                '--total-spin': `${c.totalSpin}deg`,
                '--r-start': `${c.rStart}px`,
                '--r-end': `${c.rEnd}px`,
                '--spin': c.spin,
                '--tumble': c.tumble,
                '--om': c.om,
                animation: `cs-coin ${c.dur}ms linear ${c.delay}ms both`,
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

function TrailLayer({ trails, timeScale }: { trails: Mote[]; timeScale: number }) {
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
            animation: `cs-trail ${400 * timeScale}ms ease-out ${t.delay}ms both`,
          }}
        />
      ))}
    </>
  )
}

function SparkleLayer({ sparkles, timeScale }: { sparkles: Mote[]; timeScale: number }) {
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
            animation: `cs-sparkle ${700 * timeScale}ms ease-out ${s.delay}ms both`,
          }}
        />
      ))}
    </>
  )
}

/* ─── Main ─── */

function CelebrationEffectsCoinsSwirlComponent({
  coinCount = DEFAULT_COIN_COUNT,
  coinImage,
  particleImages = [],
  particleMaxWidth = 24,
  particleMaxHeight = 24,
  colors = GOLDEN_COLORS_HEX,
  duration,
  onComplete,
}: CelebrationEffectsCoinsSwirlProps) {
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
      ...sparkles.map((s) => s.delay + 700 * timeScale)
    )
    const timer = setTimeout(onComplete, maxTime + 50)
    return () => clearTimeout(timer)
  }, [coins, sparkles, timeScale, onComplete])

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

  if (skip) {
    return (
      <div
        ref={containerRef}
        className="pf-celebration"
        data-animation-id="celebration-effects__coins-swirl"
      />
    )
  }

  return (
    <div
      ref={containerRef}
      className="pf-celebration"
      data-animation-id="celebration-effects__coins-swirl"
    >
      <span
        style={{
          position: 'absolute',
          left: 'calc(50% - 4px)',
          top: 'calc(50% - 4px)',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: 'var(--pf-anim-gold, #ffd700)',
          boxShadow: '0 0 24px 16px var(--pf-anim-gold, #ffd700)',
          pointerEvents: 'none',
          animation: `cs-core-glow ${1800 * timeScale}ms ease-out both`,
        }}
      />
      <div className="pf-celebration__depth-bg">
        <CoinLayer
          coins={bgCoins}
          resolveImg={resolveCoinSrc}
          maxW={particleMaxWidth}
          maxH={particleMaxHeight}
        />
      </div>
      <div className="pf-celebration__depth-fg">
        <CoinLayer
          coins={fgCoins}
          resolveImg={resolveCoinSrc}
          maxW={particleMaxWidth}
          maxH={particleMaxHeight}
        />
      </div>
      <div className="pf-celebration__effects">
        <TrailLayer trails={trails} timeScale={timeScale} />
        <SparkleLayer sparkles={sparkles} timeScale={timeScale} />
      </div>
    </div>
  )
}

export const CelebrationEffectsCoinsSwirl = memo(CelebrationEffectsCoinsSwirlComponent)
