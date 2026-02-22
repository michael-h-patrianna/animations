import { useMemo } from 'react'

import {
  CELEBRATION_COLORS,
  CONFETTI_SHAPES,
  pickRandom,
  randBetween,
  type ConfettiShape,
} from '../utils'
import './ModalCelebrationsConfettiBurst.css'

/* ─── Types ─── */

type Particle = {
  id: number
  shape: ConfettiShape
  color: string
  originX: number
  tx: number
  tyPeak: number
  tyFall: number
  swayX: number
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
  return Array.from({ length: 60 }, (_, i) => {
    const layer: 'bg' | 'fg' = i < 20 ? 'bg' : 'fg'
    const isBg = layer === 'bg'
    const spread = isBg ? 0.65 : 1
    const reach = isBg ? 0.6 : 1
    return {
      id: i,
      shape: pickRandom(CONFETTI_SHAPES),
      color: CELEBRATION_COLORS[i % CELEBRATION_COLORS.length],
      originX: randBetween(-4, 4),
      tx: randBetween(-140, 140) * spread,
      tyPeak: randBetween(-150, -50) * reach,
      tyFall: randBetween(60, 170),
      swayX: randBetween(-25, 25),
      rotX: randBetween(-160, 160),
      rotY: randBetween(-140, 140),
      rotZ: randBetween(-300, 300),
      delay: i * 3 + randBetween(0, 15),
      dur: isBg ? randBetween(2600, 3400) : randBetween(2000, 2800),
      scale: isBg ? randBetween(0.55, 0.85) : randBetween(0.75, 1.15),
      layer,
    }
  })
}

function makeSparkles(): Sparkle[] {
  return Array.from({ length: 10 }, (_, i) => ({
    id: i,
    x: randBetween(-100, 100),
    y: randBetween(-110, 20),
    delay: 1000 + i * 100 + randBetween(0, 150),
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
              left: `calc(50% + ${p.originX}px)`,
              top: '55%',
              background: p.color,
              transformStyle: 'preserve-3d',
              '--tx': `${p.tx}px`,
              '--ty-peak': `${p.tyPeak}px`,
              '--ty-fall': `${p.tyFall}px`,
              '--sway-x': `${p.swayX}px`,
              '--rx': `${p.rotX}deg`,
              '--ry': `${p.rotY}deg`,
              '--rz': `${p.rotZ}deg`,
              '--s': p.scale,
              '--peak-opacity': peakOpacity,
              animation: `cb-confetti ${p.dur}ms linear ${p.delay}ms forwards`,
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
            top: `calc(55% + ${s.y}px)`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animation: `cb-sparkle 1.4s ease-out ${s.delay}ms forwards`,
          }}
        />
      ))}
    </>
  )
}

/* ─── Main ─── */

/** Multi-layered confetti explosion with subtle flash, depth layers, 3D tumble, and lingering sparkles. */
export function ModalCelebrationsConfettiBurst() {
  const particles = useMemo(makeParticles, [])
  const sparkles = useMemo(makeSparkles, [])
  const bgParts = useMemo(() => particles.filter((p) => p.layer === 'bg'), [particles])
  const fgParts = useMemo(() => particles.filter((p) => p.layer === 'fg'), [particles])

  return (
    <div className="pf-celebration" data-animation-id="modal-celebrations__confetti-burst">
      <div className="pf-celebration__glow" style={{ animation: 'cb-glow 2.8s ease-out forwards' }} />
      <div className="pf-celebration__flash" style={{ animation: 'cb-flash 250ms ease-out forwards' }} />

      <div className="pf-celebration__depth-bg">
        <ConfettiLayer particles={bgParts} peakOpacity="0.5" />
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
