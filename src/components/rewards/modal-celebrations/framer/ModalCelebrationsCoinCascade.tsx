/**
 * Jackpot Cascade — coins pour from 3 stream sources, gravity fall with wobble and bounce.
 * Falls from emitY to the bottom of a boundary element (viewport by default),
 * adapting to any container size.
 *
 * Copy-paste files: this file + ../SharedCelebrationTypes.ts + ../SharedFallbackCoin.tsx + ../utils.ts + ../shared.css
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import type { CelebrationBaseProps } from '@/components/rewards/modal-celebrations/SharedCelebrationTypes'
import { GOLDEN_COLORS_HEX } from '@/components/rewards/modal-celebrations/SharedCelebrationTypes'
import { FallbackCoin } from '@/components/rewards/modal-celebrations/SharedFallbackCoin'
import { GOLDEN_COLORS } from '@/components/rewards/modal-celebrations/utils'
import type { Coin, Mote } from './CoinCascadeParticles'
import {
  makeCoins,
  makeImpacts,
  makeShimmers,
  makeTrails,
  measureFallDistance,
  STOPS,
  STREAMS,
} from './CoinCascadeParticles'

/* ─── Props ─── */

interface ModalCelebrationsCoinCascadeProps extends CelebrationBaseProps {
  /** Number of coin particles. Default 24. */
  coinCount?: number
  /** URL for a single coin image. Overridden by `particleImages` when both are provided. When omitted, renders SVG fallback coin. */
  coinImage?: string
  /** Emission Y position as percentage of container height (0 = top, 100 = bottom). Default 0. */
  emitY?: number
  /** Element whose bottom edge particles fall toward. Omit for viewport. */
  boundary?: HTMLElement | null
}

/* ─── Constants ─── */

const DEFAULT_COIN_COUNT = 24
const DEFAULT_DURATION_MS = 1400
const FALLBACK_DISTANCE = 500

/* ─── Sub-components ─── */

function CoinPiece({
  c,
  coinSrc,
  maxW,
  maxH,
  emitYPct,
}: {
  c: Coin
  coinSrc?: string
  maxW: number
  maxH: number
  emitYPct: number
}) {
  const w = coinSrc !== undefined ? Math.min(c.size, maxW) : c.size
  const h = coinSrc !== undefined ? Math.min(c.size, maxH) : c.size
  return (
    <m.div
      style={{
        position: 'absolute',
        left: '50%',
        top: `${emitYPct}%`,
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

function TrailDot({ t, timeScale, emitYPct }: { t: Mote; timeScale: number; emitYPct: number }) {
  return (
    <m.span
      style={{
        position: 'absolute',
        left: '50%',
        marginLeft: t.x,
        top: `${emitYPct}%`,
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

function ImpactBurst({
  imp,
  timeScale,
  emitYPct,
}: {
  imp: Mote
  timeScale: number
  emitYPct: number
}) {
  return (
    <m.span
      style={{
        position: 'absolute',
        left: '50%',
        marginLeft: imp.x,
        top: `${emitYPct}%`,
        marginTop: imp.y,
        width: `${imp.size}px`,
        height: `${imp.size}px`,
        borderRadius: '50%',
        background: imp.color,
        boxShadow: `0 0 ${imp.size + 4}px ${Math.round(imp.size * 0.8)}px ${imp.color}`,
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

function ShimmerDot({ s, timeScale, emitYPct }: { s: Mote; timeScale: number; emitYPct: number }) {
  return (
    <m.span
      className="pf-celebration__sparkle"
      style={{
        left: '50%',
        marginLeft: s.x,
        top: `${emitYPct}%`,
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

function SourceGlow({
  x,
  delay,
  timeScale,
  emitYPct,
}: {
  x: number
  delay: number
  timeScale: number
  emitYPct: number
}) {
  return (
    <m.span
      style={{
        position: 'absolute',
        left: '50%',
        marginLeft: x,
        top: `${emitYPct}%`,
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: 'var(--pf-anim-gold, #ffd700)',
        boxShadow: '0 0 18px 12px var(--pf-anim-gold, #ffd700)',
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
  emitY = 15,
  boundary,
  onComplete,
}: ModalCelebrationsCoinCascadeProps) {
  const prefersReducedMotion = useReducedMotion()
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
      ...shimmers.map((s) => s.delay + 0.7 * timeScale)
    )
    const timer = setTimeout(onComplete, maxTime * 1000 + 50)
    return () => clearTimeout(timer)
  }, [coins, shimmers, timeScale, onComplete])

  useEffect(() => {
    if (prefersReducedMotion && onComplete) onComplete()
  }, [prefersReducedMotion, onComplete])

  if (prefersReducedMotion) {
    return <div className="pf-celebration" data-animation-id="modal-celebrations__coin-cascade" />
  }

  return (
    <div
      ref={containerRef}
      className="pf-celebration"
      data-animation-id="modal-celebrations__coin-cascade"
    >
      {STREAMS.map((x, i) => (
        <SourceGlow
          key={i}
          x={x}
          delay={i * 0.05 * timeScale}
          timeScale={timeScale}
          emitYPct={emitY}
        />
      ))}
      <div className="pf-celebration__depth-bg" style={{ perspective: 300 }}>
        {bgCoins.map((c) => (
          <CoinPiece
            key={c.id}
            c={c}
            coinSrc={resolveCoinSrc(c.id)}
            maxW={particleMaxWidth}
            maxH={particleMaxHeight}
            emitYPct={emitY}
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
            emitYPct={emitY}
          />
        ))}
      </div>
      <div className="pf-celebration__effects">
        {trails.map((t) => (
          <TrailDot key={t.id} t={t} timeScale={timeScale} emitYPct={emitY} />
        ))}
        {impacts.map((imp) => (
          <ImpactBurst key={imp.id} imp={imp} timeScale={timeScale} emitYPct={emitY} />
        ))}
        {shimmers.map((s) => (
          <ShimmerDot key={s.id} s={s} timeScale={timeScale} emitYPct={emitY} />
        ))}
      </div>
    </div>
  )
}

export const ModalCelebrationsCoinCascade = memo(ModalCelebrationsCoinCascadeComponent)
