import * as m from 'motion/react-m'
import { useMemo } from 'react'

import {
  CELEBRATION_COLORS,
  CONFETTI_SHAPES,
  deg2rad,
  pickRandom,
  randBetween,
  type ConfettiShape,
} from '../utils'

/* ─── Types ─── */

type SpiralParticle = {
  id: number
  shape: ConfettiShape
  color: string
  xs: number[]
  ys: number[]
  scales: number[]
  opacities: number[]
  rotX: number
  rotY: number
  rotZ: number
  delay: number
  dur: number
  layer: 'bg' | 'fg'
}

type Sparkle = {
  id: number
  x: number
  y: number
  delay: number
  size: number
}

/* ─── Constants ─── */

const NUM_ARMS = 3
const PER_ARM = 18

/**
 * 24 evenly-spaced time stops.
 * Motion interpolates linearly between x,y keyframes — with only a few
 * points, a spiral degrades into zigzag straight lines.
 * 24 stops keeps each segment under ~30° of arc, which approximates
 * a smooth curve visually.
 */
const NUM_STOPS = 24
const STOPS = Array.from({ length: NUM_STOPS }, (_, i) => i / (NUM_STOPS - 1))

/* ─── Helpers ─── */

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

/** Envelope for scale: ramp up fast, hold, then shrink. */
function scaleAt(t: number, peak: number): number {
  if (t < 0.08) return peak * (t / 0.08) * 0.6
  if (t < 0.2) return peak * (0.6 + 0.4 * ((t - 0.08) / 0.12))
  if (t < 0.6) return peak
  if (t < 0.8) return peak * (1 - 0.3 * ((t - 0.6) / 0.2))
  return peak * (0.7 - 0.4 * ((t - 0.8) / 0.2))
}

/** Envelope for opacity: fade in fast, hold, then fade out. */
function opacityAt(t: number, peak: number): number {
  if (t < 0.06) return peak * (t / 0.06) * 0.7
  if (t < 0.2) return peak * (0.7 + 0.3 * ((t - 0.06) / 0.14))
  if (t < 0.55) return peak * (1 - 0.15 * ((t - 0.2) / 0.35))
  if (t < 0.8) return peak * (0.85 - 0.45 * ((t - 0.55) / 0.25))
  return peak * (0.4 - 0.4 * ((t - 0.8) / 0.2))
}

/* ─── Generators ─── */

/**
 * Dynamic tornado spiral: each particle continuously orbits center
 * while expanding outward (2+ full revolutions). Staggered delays
 * within each arm create visible spiral arms at any freeze-frame.
 * Positions sampled at 24 stops for smooth curved motion in Framer.
 */
function makeParticles(): SpiralParticle[] {
  const particles: SpiralParticle[] = []

  for (let arm = 0; arm < NUM_ARMS; arm++) {
    const armBase = arm * (360 / NUM_ARMS)

    for (let j = 0; j < PER_ARM; j++) {
      const i = arm * PER_ARM + j
      const layer: 'bg' | 'fg' = j % 3 === 0 ? 'bg' : 'fg'
      const isBg = layer === 'bg'

      const startAngle = armBase + randBetween(-8, 8)
      const totalOrbit = randBetween(620, 840)
      const maxRadius = randBetween(85, 150) * (isBg ? 0.65 : 1)
      const peakScale = isBg ? randBetween(0.55, 0.85) : randBetween(0.75, 1.15)
      const peakOp = isBg ? 0.5 : 1

      const xs: number[] = []
      const ys: number[] = []
      const scales: number[] = []
      const opacities: number[] = []

      for (const t of STOPS) {
        const a = deg2rad(startAngle + totalOrbit * t)
        const r = maxRadius * easeOutCubic(t)
        const gravity = t > 0.65 ? Math.pow((t - 0.65) / 0.35, 2) * 55 : 0
        xs.push(Math.cos(a) * r)
        ys.push(Math.sin(a) * r + gravity)
        scales.push(scaleAt(t, peakScale))
        opacities.push(opacityAt(t, peakOp))
      }

      particles.push({
        id: i,
        shape: pickRandom(CONFETTI_SHAPES),
        color: CELEBRATION_COLORS[i % CELEBRATION_COLORS.length],
        xs,
        ys,
        scales,
        opacities,
        rotX: randBetween(-130, 130),
        rotY: randBetween(-110, 110),
        rotZ: randBetween(-240, 240),
        delay: j * 0.03 + randBetween(0, 0.01),
        dur: isBg ? randBetween(2.2, 2.8) : randBetween(1.8, 2.4),
        layer,
      })
    }
  }

  return particles
}

/** Sparkles scattered at mid-radius along spiral paths. */
function makeSparkles(): Sparkle[] {
  return Array.from({ length: 12 }, (_, i) => {
    const angle = deg2rad((i / 12) * 360 + randBetween(-15, 15))
    const r = randBetween(45, 100)
    return {
      id: i,
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r + randBetween(-5, 15),
      delay: 0.7 + i * 0.08 + randBetween(0, 0.1),
      size: randBetween(2.5, 5),
    }
  })
}

/* ─── Sub-components ─── */

/** Center flash at spiral origin. */
function SpiralFlash() {
  return (
    <m.div
      className="pf-celebration__flash"
      initial={{ x: '-50%', y: '-50%', scale: 0, opacity: 0 }}
      animate={{ x: '-50%', y: '-50%', scale: [0, 1.0, 1.4], opacity: [0, 0.6, 0] }}
      transition={{ duration: 0.25, times: [0, 0.4, 1], ease: 'easeOut' }}
    />
  )
}

/** Tornado particle — orbits center along a densely-sampled spiral path. */
function TornadoPiece({ p }: { p: SpiralParticle }) {
  return (
    <m.span
      className={`pf-celebration__confetti pf-celebration__confetti--${p.shape}`}
      style={{
        left: '50%',
        top: '50%',
        background: p.color,
        transformStyle: 'preserve-3d' as const,
      }}
      initial={{ x: 0, y: 0, scale: 0, rotateX: 0, rotateY: 0, rotate: 0, opacity: 0 }}
      animate={{
        x: p.xs,
        y: p.ys,
        scale: p.scales,
        opacity: p.opacities,
        rotateX: [0, p.rotX],
        rotateY: [0, p.rotY],
        rotate: [0, p.rotZ],
      }}
      transition={{
        duration: p.dur,
        delay: p.delay,
        times: STOPS,
        x: { duration: p.dur, delay: p.delay, times: STOPS, ease: 'linear' },
        y: { duration: p.dur, delay: p.delay, times: STOPS, ease: 'linear' },
        scale: { duration: p.dur, delay: p.delay, times: STOPS, ease: 'linear' },
        opacity: { duration: p.dur, delay: p.delay, times: STOPS, ease: 'linear' },
        rotateX: { duration: p.dur, delay: p.delay, ease: 'linear' },
        rotateY: { duration: p.dur, delay: p.delay, ease: 'linear' },
        rotate: { duration: p.dur, delay: p.delay, ease: 'linear' },
      }}
    />
  )
}

/** Sparkle dot. */
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
      animate={{ scale: [0, 1.3, 0.5, 1.0, 0], opacity: [0, 0.9, 0.3, 0.65, 0] }}
      transition={{ duration: 1.2, delay: s.delay, times: [0, 0.2, 0.5, 0.75, 1], ease: 'easeOut' }}
    />
  )
}

/* ─── Main ─── */

/** Dynamic tornado confetti — particles orbit center in 3 spiral arms while expanding outward with gravity release. */
export function ModalCelebrationsConfettiSpiral() {
  const particles = useMemo(makeParticles, [])
  const sparkles = useMemo(makeSparkles, [])
  const bgParts = useMemo(() => particles.filter((p) => p.layer === 'bg'), [particles])
  const fgParts = useMemo(() => particles.filter((p) => p.layer === 'fg'), [particles])

  return (
    <div className="pf-celebration" data-animation-id="modal-celebrations__confetti-spiral">
      <SpiralFlash />

      <div className="pf-celebration__depth-bg">
        {bgParts.map((p) => (
          <TornadoPiece key={p.id} p={p} />
        ))}
      </div>
      <div className="pf-celebration__depth-fg">
        {fgParts.map((p) => (
          <TornadoPiece key={p.id} p={p} />
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
