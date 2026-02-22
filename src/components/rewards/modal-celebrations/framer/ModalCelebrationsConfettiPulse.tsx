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

type WaveConfig = {
  delay: number
  maxScale: number
  color: string
  particleCount: number
  spawnRMin: number
  spawnRMax: number
  driftMin: number
  driftMax: number
}

type WaveParticle = {
  id: number
  shape: ConfettiShape
  color: string
  xs: number[]
  ys: number[]
  scales: number[]
  opacities: number[]
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

/**
 * Three successive shockwave pulses, each larger than the last.
 * maxScale is applied to the 40px-diameter `.pf-celebration__pulse` ring.
 * Particle spawn radii increase per wave so confetti appears progressively
 * further from center — the wave "pushes" particles outward.
 */
const WAVES: WaveConfig[] = [
  { delay: 0, maxScale: 7, color: CELEBRATION_COLORS[0], particleCount: 12, spawnRMin: 20, spawnRMax: 45, driftMin: 22, driftMax: 40 },
  { delay: 0.35, maxScale: 9, color: CELEBRATION_COLORS[2], particleCount: 14, spawnRMin: 35, spawnRMax: 65, driftMin: 28, driftMax: 50 },
  { delay: 0.65, maxScale: 11, color: CELEBRATION_COLORS[3], particleCount: 16, spawnRMin: 50, spawnRMax: 85, driftMin: 32, driftMax: 55 },
]

/** 10 stops for smooth particle path interpolation. */
const NUM_STOPS = 10
const STOPS = Array.from({ length: NUM_STOPS }, (_, i) => i / (NUM_STOPS - 1))

/* ─── Helpers ─── */

const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t)

/** Scale envelope: ramp up → hold → shrink out. */
function scaleAt(t: number, peak: number): number {
  if (t < 0.08) return peak * (t / 0.08) * 0.4
  if (t < 0.2) return peak * (0.4 + 0.6 * ((t - 0.08) / 0.12))
  if (t < 0.5) return peak
  if (t < 0.75) return peak * (1 - 0.3 * ((t - 0.5) / 0.25))
  return peak * (0.7 - 0.7 * ((t - 0.75) / 0.25))
}

/** Opacity envelope: fast fade in → hold → fade out. */
function opacityAt(t: number, peak: number): number {
  if (t < 0.06) return peak * (t / 0.06) * 0.5
  if (t < 0.18) return peak * (0.5 + 0.5 * ((t - 0.06) / 0.12))
  if (t < 0.45) return peak
  if (t < 0.7) return peak * (1 - 0.5 * ((t - 0.45) / 0.25))
  return peak * (0.5 - 0.5 * ((t - 0.7) / 0.3))
}

/* ─── Generators ─── */

/**
 * Each wave spawns confetti at its expanding radius.
 * Particles appear when the wave "reaches" their spawn position,
 * then drift outward with gravity. 10-stop sampling.
 */
function makeParticles(): WaveParticle[] {
  const particles: WaveParticle[] = []
  let id = 0

  for (let wi = 0; wi < WAVES.length; wi++) {
    const wave = WAVES[wi]

    for (let j = 0; j < wave.particleCount; j++) {
      const layer: 'bg' | 'fg' = j % 3 === 0 ? 'bg' : 'fg'
      const isBg = layer === 'bg'

      const angle = deg2rad((j / wave.particleCount) * 360 + randBetween(-10, 10))
      const spawnR = randBetween(wave.spawnRMin, wave.spawnRMax) * (isBg ? 0.7 : 1)
      const endR = spawnR + randBetween(wave.driftMin, wave.driftMax) * (isBg ? 0.7 : 1)
      const peakScale = isBg ? randBetween(0.5, 0.8) : randBetween(0.7, 1.1)
      const peakOp = isBg ? 0.5 : 1

      /* Delay: wave base + time for wave to reach this radius */
      const waveReachFraction = spawnR / (wave.maxScale * 20)
      const spawnDelay = wave.delay + waveReachFraction * 0.3

      const xs: number[] = []
      const ys: number[] = []
      const scales: number[] = []
      const opacities: number[] = []

      for (const t of STOPS) {
        const r = spawnR + (endR - spawnR) * easeOutQuad(t)
        const gravity = t > 0.45 ? Math.pow((t - 0.45) / 0.55, 2) * 35 : 0
        xs.push(Math.cos(angle) * r)
        ys.push(Math.sin(angle) * r + gravity)
        scales.push(scaleAt(t, peakScale))
        opacities.push(opacityAt(t, peakOp))
      }

      particles.push({
        id: id++,
        shape: pickRandom(CONFETTI_SHAPES),
        color: CELEBRATION_COLORS[(wi * wave.particleCount + j) % CELEBRATION_COLORS.length],
        xs,
        ys,
        scales,
        opacities,
        rotZ: randBetween(-200, 200),
        delay: spawnDelay + randBetween(0, 0.03),
        dur: isBg ? randBetween(1.3, 1.7) : randBetween(1.0, 1.4),
        layer,
      })
    }
  }

  return particles
}

/** Sparkles scattered at outer reaches, timed to follow the waves. */
function makeSparkles(): Sparkle[] {
  return Array.from({ length: 12 }, (_, i) => {
    const waveIdx = i % WAVES.length
    const angle = deg2rad((i / 12) * 360 + randBetween(-20, 20))
    const r = randBetween(55, 115)
    return {
      id: i,
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r + randBetween(-5, 10),
      delay: WAVES[waveIdx].delay + 0.3 + (i / 12) * 0.15 + randBetween(0, 0.1),
      size: randBetween(2.5, 5),
    }
  })
}

/* ─── Sub-components ─── */

/** Triple-pulse flash — center blooms 3 times in rhythm with the shockwaves. */
function PulseFlash() {
  return (
    <m.div
      className="pf-celebration__flash"
      initial={{ x: '-50%', y: '-50%', scale: 0, opacity: 0 }}
      animate={{
        x: '-50%',
        y: '-50%',
        scale: [0, 1.0, 0.2, 1.2, 0.15, 1.5, 0],
        opacity: [0, 0.7, 0.1, 0.8, 0.08, 0.9, 0],
      }}
      transition={{
        duration: 1.4,
        times: [0, 0.06, 0.22, 0.28, 0.44, 0.50, 1.0],
        ease: 'easeOut',
      }}
    />
  )
}

/** Pulsing glow that follows wave rhythm. */
function PulseGlow() {
  return (
    <m.div
      className="pf-celebration__glow"
      initial={{ x: '-50%', y: '-50%', opacity: 0 }}
      animate={{
        x: '-50%',
        y: '-50%',
        opacity: [0, 0.35, 0.06, 0.4, 0.04, 0.45, 0],
      }}
      transition={{
        duration: 2.0,
        times: [0, 0.06, 0.22, 0.28, 0.44, 0.50, 1.0],
        ease: 'easeOut',
      }}
    />
  )
}

/** Expanding shockwave ring for one pulse wave. */
function WaveRing({ wave }: { wave: WaveConfig }) {
  return (
    <m.div
      className="pf-celebration__pulse"
      style={{ borderColor: wave.color, borderWidth: '3px' }}
      initial={{ x: '-50%', y: '-50%', scale: 0, opacity: 0 }}
      animate={{
        x: '-50%',
        y: '-50%',
        scale: [0, wave.maxScale * 0.6, wave.maxScale],
        opacity: [0, 0.7, 0],
      }}
      transition={{
        duration: 1.0,
        delay: wave.delay,
        times: [0, 0.35, 1],
        ease: 'easeOut',
      }}
    />
  )
}

/** Confetti particle pushed outward by a shockwave. */
function PulsePiece({ p }: { p: WaveParticle }) {
  return (
    <m.span
      className={`pf-celebration__confetti pf-celebration__confetti--${p.shape}`}
      style={{
        left: '50%',
        top: '50%',
        background: p.color,
        transformStyle: 'preserve-3d' as const,
      }}
      initial={{ x: p.xs[0], y: p.ys[0], scale: 0, rotate: 0, opacity: 0 }}
      animate={{
        x: p.xs,
        y: p.ys,
        scale: p.scales,
        opacity: p.opacities,
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

/** Triple shockwave pulse — 3 rhythmic energy waves expand from center, each depositing confetti particles at its passing radius. */
export function ModalCelebrationsConfettiPulse() {
  const particles = useMemo(makeParticles, [])
  const sparkles = useMemo(makeSparkles, [])
  const bgParts = useMemo(() => particles.filter((p) => p.layer === 'bg'), [particles])
  const fgParts = useMemo(() => particles.filter((p) => p.layer === 'fg'), [particles])

  return (
    <div className="pf-celebration" data-animation-id="modal-celebrations__confetti-pulse">
      <PulseGlow />
      <PulseFlash />

      {WAVES.map((w, i) => (
        <WaveRing key={i} wave={w} />
      ))}

      <div className="pf-celebration__depth-bg">
        {bgParts.map((p) => (
          <PulsePiece key={p.id} p={p} />
        ))}
      </div>
      <div className="pf-celebration__depth-fg">
        {fgParts.map((p) => (
          <PulsePiece key={p.id} p={p} />
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
