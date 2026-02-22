import { useMemo } from 'react'

import {
  CELEBRATION_COLORS,
  CONFETTI_SHAPES,
  pickRandom,
  randBetween,
  type ConfettiShape,
} from '../utils'
import './ModalCelebrationsConfettiRain.css'

/* ─── Types ─── */

type Particle = {
  id: number
  shape: ConfettiShape
  color: string
  left: number
  driftX1: number
  driftX2: number
  driftX3: number
  rotX: number
  rotY: number
  rotZ: number
  delay: number
  dur: number
  scale: number
  layer: 'bg' | 'fg'
}

type Sparkle = {
  id: number
  x: number
  y: number
  delay: number
  size: number
}

/* ─── Generators ─── */

function makeParticles(): Particle[] {
  return Array.from({ length: 50 }, (_, i) => {
    const wave = i < 17 ? 0 : i < 34 ? 1 : 2
    const waveBase = [0, 280, 560][wave]
    const layer: 'bg' | 'fg' = i % 3 === 0 ? 'bg' : 'fg'
    const isBg = layer === 'bg'
    return {
      id: i,
      shape: pickRandom(CONFETTI_SHAPES),
      color: CELEBRATION_COLORS[i % CELEBRATION_COLORS.length],
      left: randBetween(5, 95),
      driftX1: randBetween(-20, 20),
      driftX2: randBetween(-45, 45),
      driftX3: randBetween(-30, 55),
      rotX: randBetween(-180, 180),
      rotY: randBetween(-180, 180),
      rotZ: randBetween(-120, 120),
      delay: waveBase + randBetween(0, 180),
      dur: isBg ? randBetween(1800, 2400) : randBetween(1200, 1700),
      scale: isBg ? randBetween(0.9, 1.4) : randBetween(0.6, 1.0),
      layer,
    }
  })
}

function makeSparkles(): Sparkle[] {
  return Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: randBetween(-130, 130),
    y: randBetween(-40, 80),
    delay: 900 + i * 100 + randBetween(0, 150),
    size: randBetween(2.5, 5),
  }))
}

/* ─── Sub-components ─── */

function ConfettiLayer({ particles, peakOpacity }: { particles: Particle[]; peakOpacity: string }) {
  return (
    <>
      {particles.map((p) => (
        <span
          key={p.id}
          className={`pf-celebration__confetti pf-celebration__confetti--${p.shape}`}
          style={
            {
              left: `${p.left}%`,
              top: '-5%',
              background: p.color,
              transformStyle: 'preserve-3d',
              '--dx1': `${p.driftX1}px`,
              '--dx2': `${p.driftX2}px`,
              '--dx3': `${p.driftX3}px`,
              '--rx': `${p.rotX}deg`,
              '--ry': `${p.rotY}deg`,
              '--rz': `${p.rotZ}deg`,
              '--s': p.scale,
              '--peak-opacity': peakOpacity,
              animation: `cr-confetti ${p.dur}ms cubic-bezier(0.12, 0, 0.39, 0) ${p.delay}ms forwards`,
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
            animation: `cr-sparkle 1.1s ease-out ${s.delay}ms forwards`,
          }}
        />
      ))}
    </>
  )
}

/* ─── Main ─── */

/** Windswept confetti shower with 3D tumble, depth layers, staggered wave timing, and top-edge flash. */
export function ModalCelebrationsConfettiRain() {
  const particles = useMemo(makeParticles, [])
  const sparkles = useMemo(makeSparkles, [])
  const bgParts = useMemo(() => particles.filter((p) => p.layer === 'bg'), [particles])
  const fgParts = useMemo(() => particles.filter((p) => p.layer === 'fg'), [particles])

  return (
    <div className="pf-celebration" data-animation-id="modal-celebrations__confetti-rain">
      {/* Top glow */}
      <div
        style={{
          position: 'absolute',
          top: '-20px',
          left: '10%',
          right: '10%',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(180deg, rgb(255 206 26 / 35%) 0%, rgb(236 195 255 / 15%) 50%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 0,
          animation: 'cr-glow 2s ease-out forwards',
        }}
      />

      {/* Top flash bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '6px',
          background: 'linear-gradient(90deg, transparent 5%, rgb(255 255 255 / 90%) 50%, transparent 95%)',
          zIndex: 3,
          pointerEvents: 'none',
          animation: 'cr-flash 500ms ease-out forwards',
        }}
      />

      <div className="pf-celebration__depth-bg">
        <ConfettiLayer particles={bgParts} peakOpacity="0.45" />
      </div>
      <div className="pf-celebration__depth-fg">
        <ConfettiLayer particles={fgParts} peakOpacity="1" />
      </div>
      <div className="pf-celebration__effects">
        <SparkleLayer sparkles={sparkles} />
      </div>
    </div>
  )
}
