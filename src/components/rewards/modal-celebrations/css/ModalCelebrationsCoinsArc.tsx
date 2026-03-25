/**
 * Golden Eruption — parabolic coin fountain with 3D spin — CSS variant.
 *
 * Copy-paste files: this file + ModalCelebrationsCoinsArc.css + ../SharedCelebrationTypes.ts + ../SharedFallbackCoin.tsx + ../utils.ts + ../shared.css
 * Runtime deps: react
 */

import { memo, useEffect, useMemo } from 'react'

import type { CelebrationBaseProps } from '@/components/rewards/modal-celebrations/SharedCelebrationTypes'
import { GOLDEN_COLORS_HEX } from '@/components/rewards/modal-celebrations/SharedCelebrationTypes'
import { FallbackCoin } from '@/components/rewards/modal-celebrations/SharedFallbackCoin'
import {
  GOLDEN_COLORS,
  deg2rad,
  pickRandom,
  randBetween,
} from '@/components/rewards/modal-celebrations/utils'
import './ModalCelebrationsCoinsArc.css'

/* ─── Props ─── */

interface ModalCelebrationsCoinsArcProps extends CelebrationBaseProps {
  /** Number of coin particles. Default 20. */
  coinCount?: number
  /** URL for coin image. When omitted, renders SVG fallback coin. */
  coinImage?: string
}

/* ─── Types ─── */

type Coin = {
  id: number
  ex: number
  peak: number
  endY: number
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
const DEFAULT_DURATION_MS = 1400

/* ─── Generators ─── */

function makeCoins(count: number, timeScale: number): Coin[] {
  const coins: Coin[] = []

  for (let i = 0; i < count; i++) {
    const layer: 'bg' | 'fg' = i % 3 === 0 ? 'bg' : 'fg'
    const isBg = layer === 'bg'

    const angleDeg = -55 + (i / (count - 1)) * 110 + randBetween(-4, 4)
    const angle = deg2rad(angleDeg)
    const speed = isBg ? randBetween(280, 360) : randBetween(350, 450)
    const gravity = randBetween(750, 950)

    const vx = Math.sin(angle) * speed
    const vy = -Math.cos(angle) * speed

    const tApex = Math.min(-vy / gravity, 1)
    const peakY = vy * tApex + 0.5 * gravity * tApex * tApex
    const endY = vy + 0.5 * gravity

    coins.push({
      id: i,
      ex: vx,
      peak: peakY,
      endY,
      spin: (isBg ? randBetween(2, 3) : randBetween(3, 4)) * 360,
      tumble: randBetween(-25, 25),
      size: isBg ? randBetween(16, 20) : randBetween(20, 28),
      delay: (i * 18 + randBetween(0, 30)) * timeScale,
      dur: randBetween(1200, 1600) * timeScale,
      om: isBg ? 0.55 : 1,
      layer,
    })
  }

  return coins
}

function makeGlints(colors: readonly string[], timeScale: number): Mote[] {
  const glints: Mote[] = []

  for (let i = 0; i < 10; i++) {
    const angle = deg2rad(randBetween(-50, 50))
    const t = randBetween(0.15, 0.5)
    const speed = randBetween(300, 420)
    const gravity = randBetween(750, 900)
    glints.push({
      id: i,
      x: Math.sin(angle) * speed * t,
      y: -Math.cos(angle) * speed * t + 0.5 * gravity * t * t,
      delay: (t * 1400 + randBetween(0, 120)) * timeScale,
      size: randBetween(3, 6),
      color: pickRandom(colors),
    })
  }

  return glints
}

function makeSparkles(colors: readonly string[], timeScale: number): Mote[] {
  const sparkles: Mote[] = []

  for (let i = 0; i < 14; i++) {
    const angle = deg2rad(randBetween(-55, 55))
    const t = randBetween(0.1, 0.7)
    const speed = randBetween(280, 430)
    const gravity = randBetween(750, 900)
    sparkles.push({
      id: i,
      x: Math.sin(angle) * speed * t + randBetween(-8, 8),
      y: -Math.cos(angle) * speed * t + 0.5 * gravity * t * t + randBetween(-6, 6),
      delay: (400 + i * 60 + randBetween(0, 80)) * timeScale,
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
                top: '65%',
                width: w,
                height: h,
                pointerEvents: 'none',
                willChange: 'transform, opacity',
                '--ex': `${c.ex}px`,
                '--peak': `${c.peak}px`,
                '--end-y': `${c.endY}px`,
                '--spin': c.spin,
                '--tumble': c.tumble,
                '--om': c.om,
                animation: `ca-coin ${c.dur}ms linear ${c.delay}ms both`,
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

function GlintLayer({ glints, timeScale }: { glints: Mote[]; timeScale: number }) {
  return (
    <>
      {glints.map((g) => (
        <span
          key={g.id}
          style={{
            position: 'absolute',
            left: `calc(50% + ${g.x}px)`,
            top: `calc(65% + ${g.y}px)`,
            width: `${g.size}px`,
            height: `${g.size}px`,
            borderRadius: '50%',
            background: g.color,
            boxShadow: `0 0 ${g.size + 3}px ${Math.round(g.size * 0.6)}px ${g.color}`,
            pointerEvents: 'none',
            willChange: 'transform, opacity',
            animation: `ca-glint ${350 * timeScale}ms ease-out ${g.delay}ms both`,
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
            top: `calc(65% + ${s.y}px)`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            background: s.color,
            boxShadow: `0 0 4px 1px ${s.color}`,
            animation: `ca-sparkle ${800 * timeScale}ms ease-out ${s.delay}ms both`,
          }}
        />
      ))}
    </>
  )
}

/* ─── Main ─── */

function ModalCelebrationsCoinsArcComponent({
  coinCount = DEFAULT_COIN_COUNT,
  coinImage,
  particleImages = [],
  particleMaxWidth = 24,
  particleMaxHeight = 24,
  colors = GOLDEN_COLORS_HEX,
  duration,
  onComplete,
}: ModalCelebrationsCoinsArcProps) {
  const timeScale = (duration ?? DEFAULT_DURATION_MS) / DEFAULT_DURATION_MS
  const effectiveColors = colors.length > 0 ? colors : GOLDEN_COLORS
  const hasParticleImages = particleImages.length > 0
  const resolveCoinSrc = (index: number): string | undefined =>
    hasParticleImages ? particleImages[index % particleImages.length] : coinImage

  const coins = useMemo(() => makeCoins(coinCount, timeScale), [coinCount, timeScale])
  const glints = useMemo(() => makeGlints(effectiveColors, timeScale), [effectiveColors, timeScale])
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
      ...sparkles.map((s) => s.delay + 800 * timeScale)
    )
    const timer = setTimeout(onComplete, maxTime + 50)
    return () => clearTimeout(timer)
  }, [coins, sparkles, timeScale, onComplete])

  return (
    <div className="pf-celebration" data-animation-id="modal-celebrations__coins-arc">
      <div
        className="pf-celebration__glow"
        style={{
          left: '50%',
          top: '65%',
          animation: `ca-glow ${1600 * timeScale}ms ease-out both`,
        }}
      />
      <div
        className="pf-celebration__flash"
        style={{
          left: '50%',
          top: '65%',
          animation: `ca-flash ${400 * timeScale}ms ease-out both`,
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
        <GlintLayer glints={glints} timeScale={timeScale} />
        <SparkleLayer sparkles={sparkles} timeScale={timeScale} />
      </div>
    </div>
  )
}

export const ModalCelebrationsCoinsArc = memo(ModalCelebrationsCoinsArcComponent)
