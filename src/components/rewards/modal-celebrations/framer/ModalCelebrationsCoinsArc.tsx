import * as m from 'motion/react-m'
import { useMemo } from 'react'

import { coinImage } from '@/assets'
import { GOLDEN_COLORS, deg2rad, pickRandom, randBetween } from '../utils'

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

type Glint = {
  id: number
  x: number
  y: number
  delay: number
  size: number
  color: string
}

type Sparkle = {
  id: number
  x: number
  y: number
  delay: number
  size: number
  color: string
}

/* ─── Constants ─── */

const COIN_COUNT = 20
const GLINT_COUNT = 10
const SPARKLE_COUNT = 14
const NUM_STOPS = 12
const STOPS = Array.from({ length: NUM_STOPS }, (_, i) => i / (NUM_STOPS - 1))

/* ─── Generators ─── */

/**
 * 20 coins erupting upward in a fan (±55°) with true parabolic arcs.
 * y(t) = vy·t + ½·g·t², creating realistic fountain trajectories.
 * Each coin spins 2–4 rotations via rotateY for metallic flash.
 */
function makeCoins(): Coin[] {
  const coins: Coin[] = []

  for (let i = 0; i < COIN_COUNT; i++) {
    const layer: 'bg' | 'fg' = i % 3 === 0 ? 'bg' : 'fg'
    const isBg = layer === 'bg'

    /* Fan angle: -55° to +55° from vertical */
    const angleDeg = -55 + (i / (COIN_COUNT - 1)) * 110 + randBetween(-4, 4)
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
      delay: i * 0.018 + randBetween(0, 0.03),
      dur: randBetween(1.2, 1.6),
      layer,
    })
  }

  return coins
}

/** 10 metallic glint flashes — scattered along the fountain arc area. */
function makeGlints(): Glint[] {
  const glints: Glint[] = []

  for (let i = 0; i < GLINT_COUNT; i++) {
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
      delay: t * 1.4 + randBetween(0, 0.12),
      size: randBetween(3, 6),
      color: pickRandom(GOLDEN_COLORS),
    })
  }

  return glints
}

/** 14 golden sparkles scattered around the fountain path. */
function makeSparkles(): Sparkle[] {
  const sparkles: Sparkle[] = []

  for (let i = 0; i < SPARKLE_COUNT; i++) {
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
      delay: 0.4 + i * 0.06 + randBetween(0, 0.08),
      size: randBetween(2.5, 4.5),
      color: pickRandom(GOLDEN_COLORS),
    })
  }

  return sparkles
}

/* ─── Sub-components ─── */

/** Coin with parabolic arc and 3D spin. */
function CoinPiece({ c }: { c: Coin }) {
  return (
    <m.img
      src={coinImage}
      alt=""
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
    />
  )
}

/** Brief golden flash at a point in the fountain — simulates light catching metal. */
function GlintDot({ g }: { g: Glint }) {
  return (
    <m.span
      style={{
        position: 'absolute',
        left: '50%', marginLeft: g.x,
        top: '65%', marginTop: g.y,
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
      transition={{ duration: 0.35, delay: g.delay, times: [0, 0.25, 0.6, 1], ease: 'easeOut' }}
    />
  )
}

function SparkleDot({ s }: { s: Sparkle }) {
  return (
    <m.span
      className="pf-celebration__sparkle"
      style={{
        left: '50%', marginLeft: s.x,
        top: '65%', marginTop: s.y,
        width: `${s.size}px`,
        height: `${s.size}px`,
        background: s.color,
        filter: `drop-shadow(0 0 5px ${s.color})`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1.3, 0.4, 1.0, 0], opacity: [0, 0.9, 0.25, 0.6, 0] }}
      transition={{ duration: 0.8, delay: s.delay, times: [0, 0.2, 0.5, 0.75, 1], ease: 'easeOut' }}
    />
  )
}

/** Golden eruption flash at the fountain origin. */
function EruptionFlash() {
  return (
    <m.div
      className="pf-celebration__flash"
      style={{ left: '50%', top: '65%' }}
      initial={{ x: '-50%', y: '-50%', scale: 0, opacity: 0 }}
      animate={{ x: '-50%', y: '-50%', scale: [0, 1.4, 0.6, 0], opacity: [0, 0.9, 0.3, 0] }}
      transition={{ duration: 0.4, times: [0, 0.3, 0.65, 1], ease: 'easeOut' }}
    />
  )
}

/** Golden radial glow at fountain origin. */
function EruptionGlow() {
  return (
    <m.div
      className="pf-celebration__glow"
      style={{ left: '50%', top: '65%' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.5, 0.4, 0.15, 0] }}
      transition={{ duration: 1.6, times: [0, 0.1, 0.3, 0.65, 1], ease: 'easeOut' }}
    />
  )
}

/* ─── Main ─── */

/**
 * Golden Eruption — coins erupt upward in parabolic arcs from the bottom center,
 * spinning with 3D metallic flash, accompanied by golden glints and sparkles.
 */
export function ModalCelebrationsCoinsArc() {
  const coins = useMemo(makeCoins, [])
  const glints = useMemo(makeGlints, [])
  const sparkles = useMemo(makeSparkles, [])
  const bgCoins = useMemo(() => coins.filter((c) => c.layer === 'bg'), [coins])
  const fgCoins = useMemo(() => coins.filter((c) => c.layer === 'fg'), [coins])

  return (
    <div className="pf-celebration" data-animation-id="modal-celebrations__coins-arc">
      <EruptionGlow />
      <EruptionFlash />
      <div className="pf-celebration__depth-bg" style={{ perspective: 300 }}>
        {bgCoins.map((c) => (
          <CoinPiece key={c.id} c={c} />
        ))}
      </div>
      <div className="pf-celebration__depth-fg" style={{ perspective: 300 }}>
        {fgCoins.map((c) => (
          <CoinPiece key={c.id} c={c} />
        ))}
      </div>
      <div className="pf-celebration__effects">
        {glints.map((g) => (
          <GlintDot key={g.id} g={g} />
        ))}
        {sparkles.map((s) => (
          <SparkleDot key={s.id} s={s} />
        ))}
      </div>
    </div>
  )
}
