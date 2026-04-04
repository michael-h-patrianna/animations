/**
 * Dynamic tornado confetti — particles orbit center in 3 spiral arms while expanding outward.
 *
 * Copy-paste files: this file + ../SharedCelebrationTypes.ts + ../utils.ts + ../shared.css
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, useEffect, useMemo } from 'react'

import './CelebrationEffectsConfettiSpiral.module.css'
import type { CelebrationBaseProps } from '@/components/rewards/celebration-effects/SharedCelebrationTypes'
import { CELEBRATION_COLORS_HEX } from '@/components/rewards/celebration-effects/SharedCelebrationTypes'
import {
  CONFETTI_SHAPES,
  deg2rad,
  pickRandom,
  randBetween,
  type ConfettiShape,
} from '@/components/rewards/celebration-effects/utils'

/* ─── Props ─── */

interface CelebrationEffectsConfettiSpiralProps extends CelebrationBaseProps {
  /** Total confetti particles across all spiral arms. Default 54. */
  particleCount?: number
}

/* ─── Types ─── */

type SpiralParticle = {
  id: number
  shape: ConfettiShape
  color: string
  imageUrl: string | undefined
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

const DEFAULT_PARTICLE_COUNT = 54
const DEFAULT_DURATION_MS = 2500
const NUM_ARMS = 3
const NUM_STOPS = 24
const STOPS = Array.from({ length: NUM_STOPS }, (_, i) => i / (NUM_STOPS - 1))

/* ─── Helpers ─── */

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

function scaleAt(t: number, peak: number): number {
  if (t < 0.08) return peak * (t / 0.08) * 0.6
  if (t < 0.2) return peak * (0.6 + 0.4 * ((t - 0.08) / 0.12))
  if (t < 0.6) return peak
  if (t < 0.8) return peak * (1 - 0.3 * ((t - 0.6) / 0.2))
  return peak * (0.7 - 0.4 * ((t - 0.8) / 0.2))
}

function opacityAt(t: number, peak: number): number {
  if (t < 0.06) return peak * (t / 0.06) * 0.7
  if (t < 0.2) return peak * (0.7 + 0.3 * ((t - 0.06) / 0.14))
  if (t < 0.55) return peak * (1 - 0.15 * ((t - 0.2) / 0.35))
  if (t < 0.8) return peak * (0.85 - 0.45 * ((t - 0.55) / 0.25))
  return peak * (0.4 - 0.4 * ((t - 0.8) / 0.2))
}

/* ─── Generators ─── */

function gravityAt(t: number): number {
  return t > 0.65 ? Math.pow((t - 0.65) / 0.35, 2) * 55 : 0
}

function buildSpiralParticle(
  id: number,
  j: number,
  armBase: number,
  colors: readonly string[],
  images: readonly string[],
  timeScale: number
): SpiralParticle {
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
    xs.push(Math.cos(a) * r)
    ys.push(Math.sin(a) * r + gravityAt(t))
    scales.push(scaleAt(t, peakScale))
    opacities.push(opacityAt(t, peakOp))
  }

  const hasImages = images.length > 0
  return {
    id,
    shape: pickRandom(CONFETTI_SHAPES),
    color: colors[id % colors.length]!,
    imageUrl: hasImages ? images[id % images.length] : undefined,
    xs,
    ys,
    scales,
    opacities,
    rotX: randBetween(-130, 130),
    rotY: randBetween(-110, 110),
    rotZ: randBetween(-240, 240),
    delay: (j * 0.03 + randBetween(0, 0.01)) * timeScale,
    dur: (isBg ? randBetween(2.2, 2.8) : randBetween(1.8, 2.4)) * timeScale,
    layer,
  }
}

function makeParticles(
  count: number,
  colors: readonly string[],
  images: readonly string[],
  timeScale: number
): SpiralParticle[] {
  const particles: SpiralParticle[] = []
  const perArm = Math.ceil(count / NUM_ARMS)

  for (let arm = 0; arm < NUM_ARMS; arm++) {
    const armBase = arm * (360 / NUM_ARMS)
    const armCount = Math.min(perArm, count - arm * perArm)

    for (let j = 0; j < armCount; j++) {
      const id = arm * perArm + j
      particles.push(buildSpiralParticle(id, j, armBase, colors, images, timeScale))
    }
  }

  return particles
}

function makeSparkles(timeScale: number): Sparkle[] {
  return Array.from({ length: 12 }, (_, i) => {
    const angle = deg2rad((i / 12) * 360 + randBetween(-15, 15))
    const r = randBetween(45, 100)
    return {
      id: i,
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r + randBetween(-5, 15),
      delay: (0.7 + i * 0.08 + randBetween(0, 0.1)) * timeScale,
      size: randBetween(2.5, 5),
    }
  })
}

/* ─── Sub-components ─── */

function SpiralFlash({ timeScale }: { timeScale: number }) {
  return (
    <m.div
      className="pf-celebration__flash"
      initial={{ x: '-50%', y: '-50%', scale: 0, opacity: 0 }}
      animate={{ x: '-50%', y: '-50%', scale: [0, 1.0, 1.4], opacity: [0, 0.6, 0] }}
      transition={{ duration: 0.25 * timeScale, times: [0, 0.4, 1], ease: 'easeOut' }}
    />
  )
}

function TornadoPiece({ p, maxW, maxH }: { p: SpiralParticle; maxW: number; maxH: number }) {
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

function CelebrationEffectsConfettiSpiralComponent({
  particleCount = DEFAULT_PARTICLE_COUNT,
  colors = CELEBRATION_COLORS_HEX,
  particleImages = [],
  particleMaxWidth = 24,
  particleMaxHeight = 24,
  duration,
  onComplete,
}: CelebrationEffectsConfettiSpiralProps) {
  const prefersReducedMotion = useReducedMotion()
  const timeScale = (duration ?? DEFAULT_DURATION_MS) / DEFAULT_DURATION_MS

  const particles = useMemo(
    () => makeParticles(particleCount, colors, particleImages, timeScale),
    [particleCount, colors, particleImages, timeScale]
  )
  const sparkles = useMemo(() => makeSparkles(timeScale), [timeScale])
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
    return (
      <div className="pf-celebration" data-animation-id="celebration-effects__confetti-spiral" />
    )

  return (
    <div className="pf-celebration" data-animation-id="celebration-effects__confetti-spiral">
      <SpiralFlash timeScale={timeScale} />

      <div className="pf-celebration__depth-bg">
        {bgParts.map((p) => (
          <TornadoPiece key={p.id} p={p} maxW={particleMaxWidth} maxH={particleMaxHeight} />
        ))}
      </div>
      <div className="pf-celebration__depth-fg">
        {fgParts.map((p) => (
          <TornadoPiece key={p.id} p={p} maxW={particleMaxWidth} maxH={particleMaxHeight} />
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

export const CelebrationEffectsConfettiSpiral = memo(CelebrationEffectsConfettiSpiralComponent)
