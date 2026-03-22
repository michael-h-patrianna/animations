/**
 * Golden Eruption — coins erupt upward in parabolic arcs with 3D metallic spin.
 *
 * Copy-paste files: this file + ../SharedCelebrationTypes.ts + ../SharedFallbackCoin.tsx + ../utils.ts + ../shared.css
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { memo, useEffect, useMemo } from 'react'

import type { CelebrationBaseProps } from '../SharedCelebrationTypes'
import { GOLDEN_COLORS_HEX } from '../SharedCelebrationTypes'
import { FallbackCoin } from '../SharedFallbackCoin'
import { GOLDEN_COLORS, deg2rad, pickRandom, randBetween } from '../utils'

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

const DEFAULT_COIN_COUNT = 20
const DEFAULT_DURATION_MS = 1400
const NUM_STOPS = 12
const STOPS = Array.from({ length: NUM_STOPS }, (_, i) => i / (NUM_STOPS - 1))

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
    const size = isBg ? randBetween(16, 20) : randBetween(20, 28)

    const xs: number[] = []
    const ys: number[] = []
    const scales: number[] = []
    const opacities: number[] = []

    for (const t of STOPS) {
      xs.push(vx * t)
      ys.push(vy * t + 0.5 * gravity * t * t)

      if (t < 0.08) scales.push(0.4 + 0.6 * (t / 0.08))
      else if (t < 0.55) scales.push(1.0)
      else scales.push(1.0 - 0.65 * ((t - 0.55) / 0.45))

      const basePeak = isBg ? 0.55 : 1.0
      if (t < 0.06) opacities.push(basePeak * (t / 0.06))
      else if (t < 0.65) opacities.push(basePeak)
      else opacities.push(basePeak * (1 - (t - 0.65) / 0.35))
    }

    coins.push({
      id: i,
      xs,
      ys,
      scales,
      opacities,
      spins: (isBg ? randBetween(2, 3) : randBetween(3, 4)) * 360,
      tumble: randBetween(-25, 25),
      size,
      delay: (i * 0.018 + randBetween(0, 0.03)) * timeScale,
      dur: randBetween(1.2, 1.6) * timeScale,
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
    const vx = Math.sin(angle) * speed
    const vy = -Math.cos(angle) * speed

    glints.push({
      id: i,
      x: vx * t,
      y: vy * t + 0.5 * gravity * t * t,
      delay: (t * 1.4 + randBetween(0, 0.12)) * timeScale,
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
    const vx = Math.sin(angle) * speed
    const vy = -Math.cos(angle) * speed

    sparkles.push({
      id: i,
      x: vx * t + randBetween(-8, 8),
      y: vy * t + 0.5 * gravity * t * t + randBetween(-6, 6),
      delay: (0.4 + i * 0.06 + randBetween(0, 0.08)) * timeScale,
      size: randBetween(2.5, 4.5),
      color: pickRandom(colors),
    })
  }

  return sparkles
}

/* ─── Sub-components ─── */

function CoinPiece({ c, coinSrc }: { c: Coin; coinSrc?: string }) {
  return (
    <m.div
      style={{
        position: 'absolute',
        left: '50%',
        top: '65%',
        width: `${c.size}px`,
        height: `${c.size}px`,
        pointerEvents: 'none',
        willChange: 'transform, opacity',
      }}
      initial={{ x: 0, y: 0, scale: 0.4, rotateY: 0, rotateZ: 0, opacity: 0 }}
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
        <img src={coinSrc} alt="" style={{ width: '100%', height: '100%', display: 'block' }} />
      ) : (
        <FallbackCoin size={c.size} />
      )}
    </m.div>
  )
}

function GlintDot({ g, timeScale }: { g: Mote; timeScale: number }) {
  return (
    <m.span
      style={{
        position: 'absolute',
        left: '50%',
        marginLeft: g.x,
        top: '65%',
        marginTop: g.y,
        width: `${g.size}px`,
        height: `${g.size}px`,
        borderRadius: '50%',
        background: g.color,
        filter: `drop-shadow(0 0 ${Math.round(g.size * 1.6) + 3}px ${g.color})`,
        pointerEvents: 'none',
        willChange: 'transform, opacity',
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1.8, 0.5, 0], opacity: [0, 1, 0.4, 0] }}
      transition={{ duration: 0.35 * timeScale, delay: g.delay, times: [0, 0.25, 0.6, 1], ease: 'easeOut' }}
    />
  )
}

function SparkleDot({ s, timeScale }: { s: Mote; timeScale: number }) {
  return (
    <m.span
      className="pf-celebration__sparkle"
      style={{
        left: '50%',
        marginLeft: s.x,
        top: '65%',
        marginTop: s.y,
        width: `${s.size}px`,
        height: `${s.size}px`,
        background: s.color,
        filter: `drop-shadow(0 0 5px ${s.color})`,
        animation: 'none',
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1.3, 0.4, 1.0, 0], opacity: [0, 0.9, 0.25, 0.6, 0] }}
      transition={{ duration: 0.8 * timeScale, delay: s.delay, times: [0, 0.2, 0.5, 0.75, 1], ease: 'easeOut' }}
    />
  )
}

function EruptionFlash({ timeScale }: { timeScale: number }) {
  return (
    <m.div
      className="pf-celebration__flash"
      style={{ left: '50%', top: '65%', animation: 'none' }}
      initial={{ x: '-50%', y: '-50%', scale: 0, opacity: 0 }}
      animate={{ x: '-50%', y: '-50%', scale: [0, 1.4, 0.6, 0], opacity: [0, 0.9, 0.3, 0] }}
      transition={{ duration: 0.4 * timeScale, times: [0, 0.3, 0.65, 1], ease: 'easeOut' }}
    />
  )
}

function EruptionGlow({ timeScale }: { timeScale: number }) {
  return (
    <m.div
      className="pf-celebration__glow"
      style={{ left: '50%', top: '65%', animation: 'none' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.5, 0.4, 0.15, 0] }}
      transition={{ duration: 1.6 * timeScale, times: [0, 0.1, 0.3, 0.65, 1], ease: 'easeOut' }}
    />
  )
}

/* ─── Main ─── */

function ModalCelebrationsCoinsArcComponent({
  coinCount = DEFAULT_COIN_COUNT,
  coinImage,
  colors = GOLDEN_COLORS_HEX as unknown as string[],
  duration,
  onComplete,
}: ModalCelebrationsCoinsArcProps) {
  const timeScale = (duration ?? DEFAULT_DURATION_MS) / DEFAULT_DURATION_MS
  const effectiveColors = colors.length > 0 ? colors : (GOLDEN_COLORS as unknown as string[])

  const coins = useMemo(() => makeCoins(coinCount, timeScale), [coinCount, timeScale])
  const glints = useMemo(() => makeGlints(effectiveColors, timeScale), [effectiveColors, timeScale])
  const sparkles = useMemo(() => makeSparkles(effectiveColors, timeScale), [effectiveColors, timeScale])
  const bgCoins = useMemo(() => coins.filter((c) => c.layer === 'bg'), [coins])
  const fgCoins = useMemo(() => coins.filter((c) => c.layer === 'fg'), [coins])

  useEffect(() => {
    if (onComplete === undefined) return
    const maxTime = Math.max(
      ...coins.map((c) => c.delay + c.dur),
      ...sparkles.map((s) => s.delay + 0.8 * timeScale),
    )
    const timer = setTimeout(onComplete, maxTime * 1000 + 50)
    return () => clearTimeout(timer)
  }, [coins, sparkles, timeScale, onComplete])

  return (
    <div className="pf-celebration" data-animation-id="modal-celebrations__coins-arc">
      <EruptionGlow timeScale={timeScale} />
      <EruptionFlash timeScale={timeScale} />
      <div className="pf-celebration__depth-bg" style={{ perspective: 300 }}>
        {bgCoins.map((c) => (
          <CoinPiece key={c.id} c={c} coinSrc={coinImage} />
        ))}
      </div>
      <div className="pf-celebration__depth-fg" style={{ perspective: 300 }}>
        {fgCoins.map((c) => (
          <CoinPiece key={c.id} c={c} coinSrc={coinImage} />
        ))}
      </div>
      <div className="pf-celebration__effects">
        {glints.map((g) => (
          <GlintDot key={g.id} g={g} timeScale={timeScale} />
        ))}
        {sparkles.map((s) => (
          <SparkleDot key={s.id} s={s} timeScale={timeScale} />
        ))}
      </div>
    </div>
  )
}

export const ModalCelebrationsCoinsArc = memo(ModalCelebrationsCoinsArcComponent)
