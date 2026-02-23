import { useMemo } from 'react'

import { coinImage } from '@/assets'
import { GOLDEN_COLORS, deg2rad, pickRandom, randBetween } from '../utils'
import './ModalCelebrationsCoinsArc.css'

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

/* ─── Generators ─── */

/**
 * 20 coins — CSS variant stores parabolic endpoints and peak height.
 * The ca-coin keyframe approximates the arc using --ex, --peak, --end-y.
 */
function makeCoins(): Coin[] {
  const coins: Coin[] = []

  for (let i = 0; i < COIN_COUNT; i++) {
    const layer: 'bg' | 'fg' = i % 3 === 0 ? 'bg' : 'fg'
    const isBg = layer === 'bg'

    const angleDeg = -55 + (i / (COIN_COUNT - 1)) * 110 + randBetween(-4, 4)
    const angle = deg2rad(angleDeg)
    const speed = isBg ? randBetween(280, 360) : randBetween(350, 450)
    const gravity = randBetween(750, 950)

    const vx = Math.sin(angle) * speed
    const vy = -Math.cos(angle) * speed

    /* Apex: t_apex = -vy / gravity, y_apex = vy·t + ½·g·t² */
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
      delay: i * 18 + randBetween(0, 30),
      dur: randBetween(1200, 1600),
      om: isBg ? 0.55 : 1,
      layer,
    })
  }

  return coins
}

function makeGlints(): Glint[] {
  const glints: Glint[] = []

  for (let i = 0; i < GLINT_COUNT; i++) {
    const angle = deg2rad(randBetween(-50, 50))
    const t = randBetween(0.15, 0.5)
    const speed = randBetween(300, 420)
    const gravity = randBetween(750, 900)
    glints.push({
      id: i,
      x: Math.sin(angle) * speed * t,
      y: -Math.cos(angle) * speed * t + 0.5 * gravity * t * t,
      delay: t * 1400 + randBetween(0, 120),
      size: randBetween(3, 6),
      color: pickRandom(GOLDEN_COLORS),
    })
  }

  return glints
}

function makeSparkles(): Sparkle[] {
  const sparkles: Sparkle[] = []

  for (let i = 0; i < SPARKLE_COUNT; i++) {
    const angle = deg2rad(randBetween(-55, 55))
    const t = randBetween(0.1, 0.7)
    const speed = randBetween(280, 430)
    const gravity = randBetween(750, 900)
    sparkles.push({
      id: i,
      x: Math.sin(angle) * speed * t + randBetween(-8, 8),
      y: -Math.cos(angle) * speed * t + 0.5 * gravity * t * t + randBetween(-6, 6),
      delay: 400 + i * 60 + randBetween(0, 80),
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
              top: '65%',
              width: `${c.size}px`,
              height: `${c.size}px`,
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
        />
      ))}
    </>
  )
}

function GlintLayer({ glints }: { glints: Glint[] }) {
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
            animation: `ca-glint 350ms ease-out ${g.delay}ms both`,
          }}
        />
      ))}
    </>
  )
}

function SparkleLayer({ sparkles }: { sparkles: Sparkle[] }) {
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
            animation: `ca-sparkle 800ms ease-out ${s.delay}ms both`,
          }}
        />
      ))}
    </>
  )
}

/* ─── Main ─── */

/** Golden Eruption (CSS) — parabolic coin fountain with 3D spin and golden effects. */
export function ModalCelebrationsCoinsArc() {
  const coins = useMemo(makeCoins, [])
  const glints = useMemo(makeGlints, [])
  const sparkles = useMemo(makeSparkles, [])
  const bgCoins = useMemo(() => coins.filter((c) => c.layer === 'bg'), [coins])
  const fgCoins = useMemo(() => coins.filter((c) => c.layer === 'fg'), [coins])

  return (
    <div className="pf-celebration" data-animation-id="modal-celebrations__coins-arc">
      <div
        className="pf-celebration__glow"
        style={{ left: '50%', top: '65%', animation: 'ca-glow 1600ms ease-out both' }}
      />
      <div
        className="pf-celebration__flash"
        style={{ left: '50%', top: '65%', animation: 'ca-flash 400ms ease-out both' }}
      />
      <div className="pf-celebration__depth-bg">
        <CoinLayer coins={bgCoins} />
      </div>
      <div className="pf-celebration__depth-fg">
        <CoinLayer coins={fgCoins} />
      </div>
      <div className="pf-celebration__effects">
        <GlintLayer glints={glints} />
        <SparkleLayer sparkles={sparkles} />
      </div>
    </div>
  )
}
