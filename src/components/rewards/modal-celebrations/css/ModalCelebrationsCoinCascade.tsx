/**
 * Jackpot Cascade — coins pour from 3 streams with gravity and bounce — CSS variant.
 * Falls from emitY to the bottom of a boundary element (viewport by default),
 * adapting to any container size.
 *
 * Copy-paste files: this file + ModalCelebrationsCoinCascade.css + ../SharedCelebrationTypes.ts + ../SharedFallbackCoin.tsx + ../utils.ts + ../shared.css
 * Runtime deps: react
 */

import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import type { CelebrationBaseProps } from '@/components/rewards/modal-celebrations/SharedCelebrationTypes'
import { GOLDEN_COLORS_HEX } from '@/components/rewards/modal-celebrations/SharedCelebrationTypes'
import { FallbackCoin } from '@/components/rewards/modal-celebrations/SharedFallbackCoin'
import { GOLDEN_COLORS, pickRandom, randBetween } from '@/components/rewards/modal-celebrations/utils'
import './ModalCelebrationsCoinCascade.css'

/* ─── Props ─── */

interface ModalCelebrationsCoinCascadeProps extends CelebrationBaseProps {
  /** Number of coin particles. Default 24. */
  coinCount?: number
  /** URL for coin image. When omitted, renders SVG fallback coin. */
  coinImage?: string
  /** Emission Y position as percentage of container height (0 = top, 100 = bottom). Default 0. */
  emitY?: number
  /** Element whose bottom edge particles fall toward. Omit for viewport. */
  boundary?: HTMLElement | null
}

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

const DEFAULT_COIN_COUNT = 24
const DEFAULT_DURATION_MS = 1400
const FALLBACK_DISTANCE = 500
const STREAMS = [-55, 0, 55]

/* ─── Fall distance measurement ─── */

function measureFallDistance(
  container: HTMLElement,
  emitYPct: number,
  boundary: HTMLElement | null | undefined
): number {
  const rect = container.getBoundingClientRect()
  const emitYPx = rect.height * (emitYPct / 100)
  // Coins bounce off a visible floor — default to container height so the bounce
  // stays in view. Viewport behavior happens naturally when the consumer wraps
  // the component in a full-screen overlay.
  const bottomBound = boundary ? boundary.getBoundingClientRect().bottom - rect.top : rect.height
  return Math.max(bottomBound - emitYPx, 100)
}

/* ─── Generators ─── */

function makeCoins(count: number, fallDistance: number, timeScale: number): Coin[] {
  const coins: Coin[] = []

  for (let i = 0; i < count; i++) {
    const streamIdx = i % 3
    const stream = STREAMS[streamIdx]!
    const layer: 'bg' | 'fg' = i % 4 === 0 ? 'bg' : 'fg'
    const isBg = layer === 'bg'

    const startX = stream + randBetween(-16, 16)
    const fallDist = fallDistance * randBetween(0.65, 0.75)
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
      delay: (streamIdx * 60 + Math.floor(i / 3) * 55 + randBetween(0, 30)) * timeScale,
      dur: randBetween(1100, 1500) * timeScale,
      om: isBg ? 0.55 : 1,
      layer,
    })
  }

  return coins
}

function makeTrails(colors: readonly string[], fallDistance: number, timeScale: number): Mote[] {
  const trails: Mote[] = []

  for (let i = 0; i < 18; i++) {
    const stream = STREAMS[i % 3]!
    const fallFrac = randBetween(0.15, 0.6)
    const coinFall = fallDistance * randBetween(0.65, 0.75)

    trails.push({
      id: i,
      x: stream + randBetween(-18, 18),
      y: coinFall * fallFrac * fallFrac,
      delay: ((i % 3) * 60 + fallFrac * 1200 + randBetween(0, 100)) * timeScale,
      size: randBetween(2, 4),
      color: pickRandom(colors),
    })
  }

  return trails
}

function makeImpacts(colors: readonly string[], fallDistance: number, timeScale: number): Mote[] {
  const impacts: Mote[] = []

  for (let i = 0; i < 10; i++) {
    const stream = STREAMS[i % 3]!

    impacts.push({
      id: i,
      x: stream + randBetween(-22, 22),
      y: fallDistance * randBetween(0.65, 0.75),
      delay: ((i % 3) * 60 + Math.floor(i / 3) * 70 + randBetween(700, 950)) * timeScale,
      size: randBetween(3, 6),
      color: pickRandom(colors),
    })
  }

  return impacts
}

function makeShimmers(colors: readonly string[], fallDistance: number, timeScale: number): Mote[] {
  const shimmers: Mote[] = []

  for (let i = 0; i < 14; i++) {
    shimmers.push({
      id: i,
      x: randBetween(-70, 70),
      y: fallDistance * randBetween(0.12, 0.94),
      delay: (250 + i * 50 + randBetween(0, 80)) * timeScale,
      size: randBetween(2, 4),
      color: pickRandom(colors),
    })
  }

  return shimmers
}

/* ─── Sub-components ─── */

function CoinLayer({
  coins,
  resolveImg,
  maxW,
  maxH,
  emitYPct,
}: {
  coins: Coin[]
  resolveImg: (id: number) => string | undefined
  maxW: number
  maxH: number
  emitYPct: number
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
                top: `${emitYPct}%`,
                width: w,
                height: h,
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
                animation: `cc-coin ${c.dur}ms linear ${c.delay}ms both`,
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

function TrailLayer({
  trails,
  timeScale,
  emitYPct,
}: {
  trails: Mote[]
  timeScale: number
  emitYPct: number
}) {
  return (
    <>
      {trails.map((t) => (
        <span
          key={t.id}
          style={{
            position: 'absolute',
            left: `calc(50% + ${t.x}px)`,
            top: `calc(${emitYPct}% + ${t.y}px)`,
            width: `${t.size}px`,
            height: `${t.size}px`,
            borderRadius: '50%',
            background: t.color,
            boxShadow: `0 0 ${t.size + 2}px ${Math.round(t.size * 0.5)}px ${t.color}`,
            pointerEvents: 'none',
            willChange: 'transform, opacity',
            animation: `cc-trail ${400 * timeScale}ms ease-out ${t.delay}ms both`,
          }}
        />
      ))}
    </>
  )
}

function ImpactLayer({
  impacts,
  timeScale,
  emitYPct,
}: {
  impacts: Mote[]
  timeScale: number
  emitYPct: number
}) {
  return (
    <>
      {impacts.map((imp) => (
        <span
          key={imp.id}
          style={{
            position: 'absolute',
            left: `calc(50% + ${imp.x}px)`,
            top: `calc(${emitYPct}% + ${imp.y}px)`,
            width: `${imp.size}px`,
            height: `${imp.size}px`,
            borderRadius: '50%',
            background: imp.color,
            boxShadow: `0 0 ${imp.size + 4}px ${Math.round(imp.size * 0.8)}px ${imp.color}`,
            pointerEvents: 'none',
            willChange: 'transform, opacity',
            animation: `cc-impact ${350 * timeScale}ms ease-out ${imp.delay}ms both`,
          }}
        />
      ))}
    </>
  )
}

function ShimmerLayer({
  shimmers,
  timeScale,
  emitYPct,
}: {
  shimmers: Mote[]
  timeScale: number
  emitYPct: number
}) {
  return (
    <>
      {shimmers.map((s) => (
        <span
          key={s.id}
          className="pf-celebration__sparkle"
          style={{
            left: `calc(50% + ${s.x}px)`,
            top: `calc(${emitYPct}% + ${s.y}px)`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            background: s.color,
            boxShadow: `0 0 4px 1px ${s.color}`,
            animation: `cc-shimmer ${700 * timeScale}ms ease-out ${s.delay}ms both`,
          }}
        />
      ))}
    </>
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
  emitY = 15,
  boundary,
  onComplete,
}: ModalCelebrationsCoinCascadeProps) {
  const timeScale = (duration ?? DEFAULT_DURATION_MS) / DEFAULT_DURATION_MS
  const containerRef = useRef<HTMLDivElement>(null)
  const [fallDistance, setFallDistance] = useState(FALLBACK_DISTANCE)

  useLayoutEffect(() => {
    if (!containerRef.current) return
    setFallDistance(measureFallDistance(containerRef.current, emitY, boundary))
  }, [emitY, boundary])

  const effectiveColors = colors.length > 0 ? colors : GOLDEN_COLORS
  const hasParticleImages = particleImages.length > 0
  const resolveCoinSrc = (index: number): string | undefined =>
    hasParticleImages ? particleImages[index % particleImages.length] : coinImage

  const coins = useMemo(
    () => makeCoins(coinCount, fallDistance, timeScale),
    [coinCount, fallDistance, timeScale]
  )
  const trails = useMemo(
    () => makeTrails(effectiveColors, fallDistance, timeScale),
    [effectiveColors, fallDistance, timeScale]
  )
  const impacts = useMemo(
    () => makeImpacts(effectiveColors, fallDistance, timeScale),
    [effectiveColors, fallDistance, timeScale]
  )
  const shimmers = useMemo(
    () => makeShimmers(effectiveColors, fallDistance, timeScale),
    [effectiveColors, fallDistance, timeScale]
  )
  const bgCoins = useMemo(() => coins.filter((c) => c.layer === 'bg'), [coins])
  const fgCoins = useMemo(() => coins.filter((c) => c.layer === 'fg'), [coins])

  useEffect(() => {
    if (onComplete === undefined) return
    const maxTime = Math.max(
      ...coins.map((c) => c.delay + c.dur),
      ...shimmers.map((s) => s.delay + 700 * timeScale)
    )
    const timer = setTimeout(onComplete, maxTime + 50)
    return () => clearTimeout(timer)
  }, [coins, shimmers, timeScale, onComplete])

  return (
    <div
      ref={containerRef}
      className="pf-celebration"
      data-animation-id="modal-celebrations__coin-cascade"
    >
      {STREAMS.map((x, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: `calc(50% + ${x}px)`,
            top: `${emitY}%`,
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'var(--pf-anim-gold, #ffd700)',
            boxShadow: '0 0 18px 12px var(--pf-anim-gold, #ffd700)',
            pointerEvents: 'none',
            animation: `cc-source-glow ${1500 * timeScale}ms ease-out ${i * 50 * timeScale}ms both`,
          }}
        />
      ))}
      <div className="pf-celebration__depth-bg">
        <CoinLayer
          coins={bgCoins}
          resolveImg={resolveCoinSrc}
          maxW={particleMaxWidth}
          maxH={particleMaxHeight}
          emitYPct={emitY}
        />
      </div>
      <div className="pf-celebration__depth-fg">
        <CoinLayer
          coins={fgCoins}
          resolveImg={resolveCoinSrc}
          maxW={particleMaxWidth}
          maxH={particleMaxHeight}
          emitYPct={emitY}
        />
      </div>
      <div className="pf-celebration__effects">
        <TrailLayer trails={trails} timeScale={timeScale} emitYPct={emitY} />
        <ImpactLayer impacts={impacts} timeScale={timeScale} emitYPct={emitY} />
        <ShimmerLayer shimmers={shimmers} timeScale={timeScale} emitYPct={emitY} />
      </div>
    </div>
  )
}

export const ModalCelebrationsCoinCascade = memo(ModalCelebrationsCoinCascadeComponent)
