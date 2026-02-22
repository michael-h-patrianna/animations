import * as m from 'motion/react-m'
import { useMemo } from 'react'

import {
  CELEBRATION_COLORS,
  CONFETTI_SHAPES,
  pickRandom,
  randBetween,
  type ConfettiShape,
} from '../utils'

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
      delay: i * 0.003 + randBetween(0, 0.015),
      dur: isBg ? randBetween(2.6, 3.4) : randBetween(2.0, 2.8),
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
    delay: 1.0 + i * 0.1 + randBetween(0, 0.15),
    size: randBetween(2.5, 5),
  }))
}

/* ─── Sub-components ─── */

function SubtleFlash() {
  return (
    <m.div
      className="pf-celebration__flash"
      initial={{ x: '-50%', y: '-50%', scale: 0, opacity: 0 }}
      animate={{ x: '-50%', y: '-50%', scale: [0, 1.2, 1.6], opacity: [0, 0.7, 0] }}
      transition={{ duration: 0.25, times: [0, 0.4, 1], ease: 'easeOut' }}
    />
  )
}

function AmbientGlow() {
  return (
    <m.div
      className="pf-celebration__glow"
      initial={{ x: '-50%', y: '-50%', opacity: 0 }}
      animate={{ x: '-50%', y: '-50%', opacity: [0, 0.4, 0.25, 0.08] }}
      transition={{ duration: 2.8, times: [0, 0.08, 0.35, 1], ease: 'easeOut' }}
    />
  )
}

function ConfettiPiece({ p }: { p: Particle }) {
  const isBg = p.layer === 'bg'
  const peakOp = isBg ? 0.5 : 1
  const dur = p.dur

  return (
    <m.span
      className={`pf-celebration__confetti pf-celebration__confetti--${p.shape}`}
      style={{
        left: `calc(50% + ${p.originX}px)`,
        top: '55%',
        background: p.color,
        transformStyle: 'preserve-3d' as const,
      }}
      initial={{ x: 0, y: 0, scale: 0, rotateX: 0, rotateY: 0, rotate: 0, opacity: 0 }}
      animate={{
        x: [0, p.tx * 0.85, p.tx + p.swayX],
        y: [0, p.tyPeak, p.tyFall],
        scale: [0, p.scale, p.scale * 0.7],
        rotateX: [0, p.rotX],
        rotateY: [0, p.rotY],
        rotate: [0, p.rotZ],
        opacity: [0, peakOp, 0],
      }}
      transition={{
        duration: dur,
        delay: p.delay,
        y: {
          duration: dur,
          delay: p.delay,
          times: [0, 0.18, 1],
          ease: ['easeOut', [0.33, 0, 0.85, 1]],
        },
        x: {
          duration: dur,
          delay: p.delay,
          times: [0, 0.18, 1],
          ease: ['easeOut', [0.25, 0.1, 0.25, 1]],
        },
        scale: {
          duration: dur,
          delay: p.delay,
          times: [0, 0.15, 1],
          ease: ['easeOut', 'linear'],
        },
        opacity: {
          duration: dur,
          delay: p.delay,
          times: [0, 0.12, 1],
          ease: ['easeOut', [0.5, 0, 1, 1]],
        },
        rotateX: { duration: dur, delay: p.delay, ease: 'linear' },
        rotateY: { duration: dur, delay: p.delay, ease: 'linear' },
        rotate: { duration: dur, delay: p.delay, ease: 'linear' },
      }}
    />
  )
}

function SparkleDot({ s }: { s: Sparkle }) {
  return (
    <m.span
      className="pf-celebration__sparkle"
      style={{
        left: `calc(50% + ${s.x}px)`,
        top: `calc(55% + ${s.y}px)`,
        width: `${s.size}px`,
        height: `${s.size}px`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1.4, 0.6, 1.1, 0], opacity: [0, 0.9, 0.3, 0.7, 0] }}
      transition={{ duration: 1.4, delay: s.delay, times: [0, 0.2, 0.5, 0.75, 1], ease: 'easeOut' }}
    />
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
      <AmbientGlow />
      <SubtleFlash />

      <div className="pf-celebration__depth-bg">
        {bgParts.map((p) => (
          <ConfettiPiece key={p.id} p={p} />
        ))}
      </div>
      <div className="pf-celebration__depth-fg">
        {fgParts.map((p) => (
          <ConfettiPiece key={p.id} p={p} />
        ))}
      </div>
      <div className="pf-celebration__effects">
        {sparkles.map((s) => (
          <SparkleDot key={s.id} s={s} />
        ))}
      </div>
    </div>
  )
}
