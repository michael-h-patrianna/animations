import { useMemo } from 'react'

import {
  CELEBRATION_COLORS,
  CONFETTI_SHAPES,
  deg2rad,
  pickRandom,
  randBetween,
  type ConfettiShape,
} from '../utils'
import './ModalCelebrationsFireworksRing.css'

/* ─── Types ─── */

type Ember = {
  id: number
  ringX: number
  ringY: number
  sx: number
  sy: number
  ex: number
  ey: number
  color: string
  delay: number
  size: number
  tailSize: number
  layer: 'bg' | 'fg'
  om: number
  tailOm: number
}

type Shimmer = {
  id: number
  x: number
  y: number
  delay: number
  size: number
  color: string
}

type Burst = {
  id: number
  shape: ConfettiShape
  color: string
  startX: number
  startY: number
  bx: number
  by: number
  bs: number
  bop: number
  brz: number
  delay: number
  dur: number
}

type Sparkle = {
  id: number
  x: number
  y: number
  delay: number
  size: number
}

/* ─── Constants ─── */

const RING_RADIUS = 48
const EMBER_COUNT = 22
const SHIMMER_COUNT = 16
const BURST_COUNT = 18
const SPARKLE_COUNT = 16
const DURATION = 2000

/* ─── Generators ─── */

function makeEmbers(): Ember[] {
  const embers: Ember[] = []

  for (let i = 0; i < EMBER_COUNT; i++) {
    const baseAngle = (i / EMBER_COUNT) * Math.PI * 2
    const ringAngle = baseAngle + deg2rad(randBetween(-4, 4))
    const layer: 'bg' | 'fg' = i % 3 === 0 ? 'bg' : 'fg'
    const isBg = layer === 'bg'

    const ringX = Math.cos(ringAngle) * RING_RADIUS
    const ringY = Math.sin(ringAngle) * RING_RADIUS

    const startAngle = baseAngle + deg2rad(randBetween(-25, 25))
    const startR = isBg ? randBetween(110, 135) : randBetween(130, 160)
    const startX = Math.cos(startAngle) * startR
    const startY = Math.sin(startAngle) * startR

    const endR = isBg ? randBetween(75, 100) : randBetween(95, 135)
    const endX = Math.cos(ringAngle) * endR
    const endY = Math.sin(ringAngle) * endR + randBetween(12, 28)
    const om = isBg ? 0.6 : 1

    embers.push({
      id: i,
      ringX,
      ringY,
      sx: startX - ringX,
      sy: startY - ringY,
      ex: endX - ringX,
      ey: endY - ringY,
      color: pickRandom(CELEBRATION_COLORS),
      delay: (i / EMBER_COUNT) * 220,
      size: isBg ? randBetween(4, 6) : randBetween(5, 8),
      tailSize: isBg ? randBetween(2, 3) : randBetween(3, 4),
      layer,
      om,
      tailOm: om * 0.4,
    })
  }

  return embers
}

function makeShimmers(): Shimmer[] {
  const shimmers: Shimmer[] = []

  for (let i = 0; i < SHIMMER_COUNT; i++) {
    const angle = (i / SHIMMER_COUNT) * Math.PI * 2 + Math.PI / SHIMMER_COUNT
    const jitter = deg2rad(randBetween(-3, 3))
    shimmers.push({
      id: i,
      x: Math.cos(angle + jitter) * RING_RADIUS,
      y: Math.sin(angle + jitter) * RING_RADIUS,
      delay: 20 * i,
      size: randBetween(2, 3.5),
      color: pickRandom(CELEBRATION_COLORS),
    })
  }

  return shimmers
}

function makeBursts(): Burst[] {
  const bursts: Burst[] = []
  const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

  for (let i = 0; i < BURST_COUNT; i++) {
    const angle = (i / BURST_COUNT) * Math.PI * 2 + deg2rad(randBetween(-8, 8))
    const startR = RING_RADIUS + randBetween(-3, 3)
    const startX = Math.cos(angle) * startR
    const startY = Math.sin(angle) * startR
    const maxDist = randBetween(55, 100)

    bursts.push({
      id: i,
      shape: pickRandom(CONFETTI_SHAPES),
      color: pickRandom(CELEBRATION_COLORS),
      startX,
      startY,
      bx: Math.cos(angle) * maxDist * easeOut(1),
      by: Math.sin(angle) * maxDist * easeOut(1),
      bs: randBetween(0.7, 1.1),
      bop: randBetween(0.7, 1.0),
      brz: randBetween(-180, 180),
      delay: 820 + randBetween(0, 60),
      dur: randBetween(900, 1200),
    })
  }

  return bursts
}

function makeSparkles(): Sparkle[] {
  const sparkles: Sparkle[] = []

  for (let i = 0; i < SPARKLE_COUNT; i++) {
    const angle = (i / SPARKLE_COUNT) * Math.PI * 2 + deg2rad(randBetween(-10, 10))
    const r = randBetween(70, 125)
    sparkles.push({
      id: i,
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r + randBetween(-4, 8),
      delay: 900 + i * 50 + randBetween(0, 60),
      size: randBetween(2.5, 4.5),
    })
  }

  return sparkles
}

/* ─── Sub-components ─── */

/** Renders ember primary dot + ghost tail for a list of embers. */
function EmberLayer({ embers }: { embers: Ember[] }) {
  return (
    <>
      {/* Tails first (behind primaries) */}
      {embers.map((e) => (
        <span
          key={`t-${e.id}`}
          style={
            {
              position: 'absolute',
              left: `calc(50% + ${e.ringX}px)`,
              top: `calc(50% + ${e.ringY}px)`,
              width: `${e.tailSize}px`,
              height: `${e.tailSize}px`,
              borderRadius: '50%',
              background: e.color,
              pointerEvents: 'none',
              willChange: 'transform, opacity',
              '--sx': `${e.sx}px`,
              '--sy': `${e.sy}px`,
              '--ex': `${e.ex}px`,
              '--ey': `${e.ey}px`,
              '--om': e.tailOm,
              animation: `fr-ember ${DURATION}ms linear ${e.delay + 50}ms both`,
            } as React.CSSProperties
          }
        />
      ))}
      {/* Primary embers */}
      {embers.map((e) => (
        <span
          key={`e-${e.id}`}
          style={
            {
              position: 'absolute',
              left: `calc(50% + ${e.ringX}px)`,
              top: `calc(50% + ${e.ringY}px)`,
              width: `${e.size}px`,
              height: `${e.size}px`,
              borderRadius: '50%',
              background: e.color,
              boxShadow: `0 0 ${e.size + 2}px ${Math.round(e.size * 0.5)}px ${e.color}`,
              pointerEvents: 'none',
              willChange: 'transform, opacity',
              '--sx': `${e.sx}px`,
              '--sy': `${e.sy}px`,
              '--ex': `${e.ex}px`,
              '--ey': `${e.ey}px`,
              '--om': e.om,
              animation: `fr-ember ${DURATION}ms linear ${e.delay}ms both`,
            } as React.CSSProperties
          }
        />
      ))}
    </>
  )
}

function ShimmerLayer({ shimmers }: { shimmers: Shimmer[] }) {
  return (
    <>
      {shimmers.map((s) => (
        <span
          key={s.id}
          style={{
            position: 'absolute',
            left: `calc(50% + ${s.x}px)`,
            top: `calc(50% + ${s.y}px)`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            borderRadius: '50%',
            background: s.color,
            boxShadow: `0 0 4px 1px ${s.color}`,
            pointerEvents: 'none',
            willChange: 'transform, opacity',
            animation: `fr-shimmer ${DURATION}ms linear ${s.delay}ms both`,
          }}
        />
      ))}
    </>
  )
}

function BurstLayer({ bursts }: { bursts: Burst[] }) {
  return (
    <>
      {bursts.map((b) => (
        <span
          key={b.id}
          className={`pf-celebration__confetti pf-celebration__confetti--${b.shape}`}
          style={
            {
              left: `calc(50% + ${b.startX}px)`,
              top: `calc(50% + ${b.startY}px)`,
              background: b.color,
              '--bx': `${b.bx}px`,
              '--by': `${b.by}px`,
              '--bs': b.bs,
              '--bop': b.bop,
              '--brz': `${b.brz}deg`,
              animation: `fr-burst ${b.dur}ms linear ${b.delay}ms both`,
            } as React.CSSProperties
          }
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
            top: `calc(50% + ${s.y}px)`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animation: `fr-sparkle 900ms ease-out ${s.delay}ms both`,
          }}
        />
      ))}
    </>
  )
}

/* ─── Main ─── */

/** Chrysanthemum Ring (CSS) — embers converge, ring ignites, everything explodes. */
export function ModalCelebrationsFireworksRing() {
  const embers = useMemo(makeEmbers, [])
  const shimmers = useMemo(makeShimmers, [])
  const bursts = useMemo(makeBursts, [])
  const sparkles = useMemo(makeSparkles, [])
  const bgEmbers = useMemo(() => embers.filter((e) => e.layer === 'bg'), [embers])
  const fgEmbers = useMemo(() => embers.filter((e) => e.layer === 'fg'), [embers])

  return (
    <div className="pf-celebration" data-animation-id="modal-celebrations__fireworks-ring">
      <div
        className="pf-celebration__glow"
        style={{ left: '50%', top: '50%', animation: `fr-glow ${DURATION}ms linear both` }}
      />
      <div
        className="pf-celebration__flash"
        style={{ left: '50%', top: '50%', animation: `fr-flash ${DURATION}ms linear both` }}
      />
      <div className="pf-celebration__depth-bg">
        <EmberLayer embers={bgEmbers} />
      </div>
      <div className="pf-celebration__effects">
        <ShimmerLayer shimmers={shimmers} />
      </div>
      <div className="pf-celebration__depth-fg">
        <EmberLayer embers={fgEmbers} />
        <BurstLayer bursts={bursts} />
      </div>
      <div className="pf-celebration__layer">
        <SparkleLayer sparkles={sparkles} />
      </div>
    </div>
  )
}
