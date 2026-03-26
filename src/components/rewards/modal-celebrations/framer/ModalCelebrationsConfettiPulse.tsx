/**
 * Triple shockwave pulse — 3 expanding energy waves deposit confetti at each passing radius.
 *
 * Copy-paste files: this file + ../SharedCelebrationTypes.ts + ../utils.ts + ../shared.css
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, useEffect, useMemo } from 'react'

import type { CelebrationBaseProps } from '@/components/rewards/modal-celebrations/SharedCelebrationTypes'
import { CELEBRATION_COLORS_HEX } from '@/components/rewards/modal-celebrations/SharedCelebrationTypes'
import {
  CELEBRATION_COLORS,
  CONFETTI_SHAPES,
  deg2rad,
  pickRandom,
  randBetween,
  type ConfettiShape,
} from '@/components/rewards/modal-celebrations/utils'

/* ─── Props ─── */

interface ModalCelebrationsConfettiPulseProps extends CelebrationBaseProps {
  /** Total confetti particles across all waves. Default 42. */
  particleCount?: number
}

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
  imageUrl: string | undefined
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

const DEFAULT_PARTICLE_COUNT = 42
const DEFAULT_DURATION_MS = 2200
const NUM_STOPS = 10
const STOPS = Array.from({ length: NUM_STOPS }, (_, i) => i / (NUM_STOPS - 1))

/* ─── Helpers ─── */

const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t)

function scaleAt(t: number, peak: number): number {
  if (t < 0.08) return peak * (t / 0.08) * 0.4
  if (t < 0.2) return peak * (0.4 + 0.6 * ((t - 0.08) / 0.12))
  if (t < 0.5) return peak
  if (t < 0.75) return peak * (1 - 0.3 * ((t - 0.5) / 0.25))
  return peak * (0.7 - 0.7 * ((t - 0.75) / 0.25))
}

function opacityAt(t: number, peak: number): number {
  if (t < 0.06) return peak * (t / 0.06) * 0.5
  if (t < 0.18) return peak * (0.5 + 0.5 * ((t - 0.06) / 0.12))
  if (t < 0.45) return peak
  if (t < 0.7) return peak * (1 - 0.5 * ((t - 0.45) / 0.25))
  return peak * (0.5 - 0.5 * ((t - 0.7) / 0.3))
}

/* ─── Generators ─── */

function buildWaves(colors: readonly string[]): WaveConfig[] {
  return [
    {
      delay: 0,
      maxScale: 7,
      color: colors[0] ?? CELEBRATION_COLORS[0],
      particleCount: 12,
      spawnRMin: 20,
      spawnRMax: 45,
      driftMin: 22,
      driftMax: 40,
    },
    {
      delay: 0.35,
      maxScale: 9,
      color: colors[2 % colors.length] ?? CELEBRATION_COLORS[2],
      particleCount: 14,
      spawnRMin: 35,
      spawnRMax: 65,
      driftMin: 28,
      driftMax: 50,
    },
    {
      delay: 0.65,
      maxScale: 11,
      color: colors[3 % colors.length] ?? CELEBRATION_COLORS[3],
      particleCount: 16,
      spawnRMin: 50,
      spawnRMax: 85,
      driftMin: 32,
      driftMax: 55,
    },
  ]
}

function makeParticles(
  totalCount: number,
  colors: readonly string[],
  images: readonly string[],
  waves: WaveConfig[],
  timeScale: number
): WaveParticle[] {
  const hasImages = images.length > 0
  const particles: WaveParticle[] = []
  let id = 0

  // Distribute totalCount across waves proportionally to defaults (12:14:16 = 2:2.33:2.67)
  const defaultTotal = waves.reduce((s, w) => s + w.particleCount, 0)

  for (let wi = 0; wi < waves.length; wi++) {
    const wave = waves[wi]!
    const waveCount = Math.round((wave.particleCount / defaultTotal) * totalCount)

    for (let j = 0; j < waveCount; j++) {
      const layer: 'bg' | 'fg' = j % 3 === 0 ? 'bg' : 'fg'
      const isBg = layer === 'bg'

      const angle = deg2rad((j / waveCount) * 360 + randBetween(-10, 10))
      const spawnR = randBetween(wave.spawnRMin, wave.spawnRMax) * (isBg ? 0.7 : 1)
      const endR = spawnR + randBetween(wave.driftMin, wave.driftMax) * (isBg ? 0.7 : 1)
      const peakScale = isBg ? randBetween(0.5, 0.8) : randBetween(0.7, 1.1)
      const peakOp = isBg ? 0.5 : 1

      const waveReachFraction = spawnR / (wave.maxScale * 20)
      const spawnDelay = (wave.delay + waveReachFraction * 0.3) * timeScale

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

      const particleId = id++
      particles.push({
        id: particleId,
        shape: pickRandom(CONFETTI_SHAPES),
        color: colors[(wi * waveCount + j) % colors.length]!,
        imageUrl: hasImages ? images[particleId % images.length] : undefined,
        xs,
        ys,
        scales,
        opacities,
        rotZ: randBetween(-200, 200),
        delay: spawnDelay + randBetween(0, 0.03) * timeScale,
        dur: (isBg ? randBetween(1.3, 1.7) : randBetween(1.0, 1.4)) * timeScale,
        layer,
      })
    }
  }

  return particles
}

function makeSparkles(waves: WaveConfig[], timeScale: number): Sparkle[] {
  return Array.from({ length: 12 }, (_, i) => {
    const waveIdx = i % waves.length
    const angle = deg2rad((i / 12) * 360 + randBetween(-20, 20))
    const r = randBetween(55, 115)
    return {
      id: i,
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r + randBetween(-5, 10),
      delay: (waves[waveIdx]!.delay + 0.3 + (i / 12) * 0.15 + randBetween(0, 0.1)) * timeScale,
      size: randBetween(2.5, 5),
    }
  })
}

/* ─── Sub-components ─── */

function PulseFlash({ timeScale }: { timeScale: number }) {
  return (
    <m.div
      className="pf-celebration__flash"
      style={{ animation: 'none' }}
      initial={{ x: '-50%', y: '-50%', scale: 0, opacity: 0 }}
      animate={{
        x: '-50%',
        y: '-50%',
        scale: [0, 1.0, 0.2, 1.2, 0.15, 1.5, 0],
        opacity: [0, 0.7, 0.1, 0.8, 0.08, 0.9, 0],
      }}
      transition={{
        duration: 1.4 * timeScale,
        times: [0, 0.06, 0.22, 0.28, 0.44, 0.5, 1.0],
        ease: 'easeOut',
      }}
    />
  )
}

function PulseGlow({ timeScale }: { timeScale: number }) {
  return (
    <m.div
      className="pf-celebration__glow"
      style={{ animation: 'none' }}
      initial={{ x: '-50%', y: '-50%', opacity: 0 }}
      animate={{
        x: '-50%',
        y: '-50%',
        opacity: [0, 0.35, 0.06, 0.4, 0.04, 0.45, 0],
      }}
      transition={{
        duration: 2.0 * timeScale,
        times: [0, 0.06, 0.22, 0.28, 0.44, 0.5, 1.0],
        ease: 'easeOut',
      }}
    />
  )
}

function WaveRing({ wave, timeScale }: { wave: WaveConfig; timeScale: number }) {
  return (
    <m.div
      className="pf-celebration__pulse"
      style={{ borderColor: wave.color, borderWidth: '3px', animation: 'none' }}
      initial={{ x: '-50%', y: '-50%', scale: 0, opacity: 0 }}
      animate={{
        x: '-50%',
        y: '-50%',
        scale: [0, wave.maxScale * 0.6, wave.maxScale],
        opacity: [0, 0.7, 0],
      }}
      transition={{
        duration: 1.0 * timeScale,
        delay: wave.delay * timeScale,
        times: [0, 0.35, 1],
        ease: 'easeOut',
      }}
    />
  )
}

function PulsePiece({ p, maxW, maxH }: { p: WaveParticle; maxW: number; maxH: number }) {
  return (
    <m.span
      className={
        p.imageUrl !== undefined
          ? undefined
          : `pf-celebration__confetti pf-celebration__confetti--${p.shape}`
      }
      style={{
        left: '50%',
        top: '50%',
        ...(p.imageUrl !== undefined ? { width: maxW, height: maxH } : { background: p.color }),
        transformStyle: 'preserve-3d' as const,
        animation: 'none',
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
    >
      {p.imageUrl !== undefined && (
        <img
          src={p.imageUrl}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
        />
      )}
    </m.span>
  )
}

function SparkleDot({ s, timeScale }: { s: Sparkle; timeScale: number }) {
  return (
    <m.span
      className="pf-celebration__sparkle"
      style={{
        left: '50%',
        marginLeft: s.x,
        top: '50%',
        marginTop: s.y,
        width: `${s.size}px`,
        height: `${s.size}px`,
        animation: 'none',
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1.3, 0.5, 1.0, 0], opacity: [0, 0.9, 0.3, 0.65, 0] }}
      transition={{
        duration: 1.2 * timeScale,
        delay: s.delay,
        times: [0, 0.2, 0.5, 0.75, 1],
        ease: 'easeOut',
      }}
    />
  )
}

/* ─── Main ─── */

function ModalCelebrationsConfettiPulseComponent({
  particleCount = DEFAULT_PARTICLE_COUNT,
  colors = CELEBRATION_COLORS_HEX,
  particleImages = [],
  particleMaxWidth = 24,
  particleMaxHeight = 24,
  duration,
  onComplete,
}: ModalCelebrationsConfettiPulseProps) {
  const prefersReducedMotion = useReducedMotion()
  const timeScale = (duration ?? DEFAULT_DURATION_MS) / DEFAULT_DURATION_MS
  const waves = useMemo(() => buildWaves(colors), [colors])

  const particles = useMemo(
    () => makeParticles(particleCount, colors, particleImages, waves, timeScale),
    [particleCount, colors, particleImages, waves, timeScale]
  )
  const sparkles = useMemo(() => makeSparkles(waves, timeScale), [waves, timeScale])
  const bgParts = useMemo(() => particles.filter((p) => p.layer === 'bg'), [particles])
  const fgParts = useMemo(() => particles.filter((p) => p.layer === 'fg'), [particles])

  useEffect(() => {
    if (onComplete === undefined) return
    const maxTime = Math.max(
      ...particles.map((p) => p.delay + p.dur),
      ...sparkles.map((s) => s.delay + 1.2 * timeScale)
    )
    const timer = setTimeout(onComplete, maxTime * 1000 + 50)
    return () => clearTimeout(timer)
  }, [particles, sparkles, timeScale, onComplete])

  useEffect(() => {
    if (prefersReducedMotion && onComplete) onComplete()
  }, [prefersReducedMotion, onComplete])
  if (prefersReducedMotion)
    return <div className="pf-celebration" data-animation-id="modal-celebrations__confetti-pulse" />

  return (
    <div className="pf-celebration" data-animation-id="modal-celebrations__confetti-pulse">
      <PulseGlow timeScale={timeScale} />
      <PulseFlash timeScale={timeScale} />

      {waves.map((w, i) => (
        <WaveRing key={i} wave={w} timeScale={timeScale} />
      ))}

      <div className="pf-celebration__depth-bg">
        {bgParts.map((p) => (
          <PulsePiece key={p.id} p={p} maxW={particleMaxWidth} maxH={particleMaxHeight} />
        ))}
      </div>
      <div className="pf-celebration__depth-fg">
        {fgParts.map((p) => (
          <PulsePiece key={p.id} p={p} maxW={particleMaxWidth} maxH={particleMaxHeight} />
        ))}
      </div>
      <div className="pf-celebration__effects">
        {sparkles.map((s) => (
          <SparkleDot key={s.id} s={s} timeScale={timeScale} />
        ))}
      </div>
    </div>
  )
}

export const ModalCelebrationsConfettiPulse = memo(ModalCelebrationsConfettiPulseComponent)
