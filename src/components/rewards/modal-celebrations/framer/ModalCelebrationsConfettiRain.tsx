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
    // 3 waves: 0-16 = wave1, 17-33 = wave2, 34-49 = wave3
    const wave = i < 17 ? 0 : i < 34 ? 1 : 2
    const waveBase = [0, 0.28, 0.56][wave]
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
      delay: waveBase + randBetween(0, 0.18),
      dur: isBg ? randBetween(1.8, 2.4) : randBetween(1.2, 1.7),
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
    delay: 0.9 + i * 0.1 + randBetween(0, 0.15),
    size: randBetween(2.5, 5),
  }))
}

/* ─── Sub-components ─── */

function TopFlash() {
  return (
    <m.div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '6px',
        background: 'linear-gradient(90deg, transparent 5%, rgb(255 255 255 / 90%) 50%, transparent 95%)',
        zIndex: 3,
        pointerEvents: 'none' as const,
      }}
      initial={{ opacity: 0, scaleX: 0.3 }}
      animate={{ opacity: [0, 1, 0.6, 0], scaleX: [0.3, 1, 1, 1] }}
      transition={{ duration: 0.5, times: [0, 0.2, 0.5, 1], ease: 'easeOut' }}
    />
  )
}

function TopGlow() {
  return (
    <m.div
      style={{
        position: 'absolute',
        top: '-20px',
        left: '10%',
        right: '10%',
        height: '60px',
        borderRadius: '50%',
        background: 'linear-gradient(180deg, rgb(255 206 26 / 35%) 0%, rgb(236 195 255 / 15%) 50%, transparent 100%)',
        pointerEvents: 'none' as const,
        zIndex: 0,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.9, 0.5, 0.15] }}
      transition={{ duration: 2.0, times: [0, 0.1, 0.4, 1], ease: 'easeOut' }}
    />
  )
}

function RainPiece({ p }: { p: Particle }) {
  const isBg = p.layer === 'bg'

  return (
    <m.span
      className={`pf-celebration__confetti pf-celebration__confetti--${p.shape}`}
      style={{
        left: `${p.left}%`,
        top: '-5%',
        background: p.color,
        opacity: isBg ? 0.45 : undefined,
        transformStyle: 'preserve-3d' as const,
      }}
      initial={{ y: 0, x: 0, scale: 0, rotateX: 0, rotateY: 0, rotate: 0, opacity: 0 }}
      animate={{
        y: [0, 80, 180, 280],
        x: [0, p.driftX1, p.driftX2, p.driftX3],
        scale: [0, p.scale, p.scale, p.scale * 0.4],
        rotateX: [0, p.rotX * 0.4, p.rotX * 0.8, p.rotX],
        rotateY: [0, p.rotY * 0.3, p.rotY * 0.7, p.rotY],
        rotate: [0, p.rotZ * 0.4, p.rotZ * 0.8, p.rotZ],
        opacity: [0, isBg ? 0.45 : 1, isBg ? 0.35 : 0.8, 0],
      }}
      transition={{
        duration: p.dur,
        delay: p.delay,
        times: [0, 0.2, 0.6, 1],
        ease: [0.12, 0, 0.39, 0],
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
        top: `calc(50% + ${s.y}px)`,
        width: `${s.size}px`,
        height: `${s.size}px`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1.4, 0.6, 1.1, 0], opacity: [0, 1, 0.3, 0.7, 0] }}
      transition={{ duration: 1.1, delay: s.delay, times: [0, 0.2, 0.5, 0.75, 1], ease: 'easeOut' }}
    />
  )
}

/* ─── Main ─── */

/** Windswept confetti shower with 3D tumble, depth layers, wave timing, and top-edge flash. */
export function ModalCelebrationsConfettiRain() {
  const particles = useMemo(makeParticles, [])
  const sparkles = useMemo(makeSparkles, [])
  const bgParts = useMemo(() => particles.filter((p) => p.layer === 'bg'), [particles])
  const fgParts = useMemo(() => particles.filter((p) => p.layer === 'fg'), [particles])

  return (
    <div className="pf-celebration" data-animation-id="modal-celebrations__confetti-rain">
      <TopGlow />
      <TopFlash />

      <div className="pf-celebration__depth-bg">
        {bgParts.map((p) => (
          <RainPiece key={p.id} p={p} />
        ))}
      </div>
      <div className="pf-celebration__depth-fg">
        {fgParts.map((p) => (
          <RainPiece key={p.id} p={p} />
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
