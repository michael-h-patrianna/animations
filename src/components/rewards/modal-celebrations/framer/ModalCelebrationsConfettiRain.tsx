/**
 * Windswept confetti shower with 3D tumble, depth layers, wave timing, and afterglow sparkles.
 * Particles fall from emitY to the bottom of a boundary element (viewport by default),
 * adapting to any container size. 11-point gravity curve for smooth motion at any distance.
 *
 * Copy-paste files: this file + ../SharedCelebrationTypes.ts + ../utils.ts + ../shared.css
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import type { CelebrationBaseProps } from '@/components/rewards/modal-celebrations/SharedCelebrationTypes'
import { CELEBRATION_COLORS_HEX } from '@/components/rewards/modal-celebrations/SharedCelebrationTypes'
import {
  CONFETTI_SHAPES,
  pickRandom,
  randBetween,
  type ConfettiShape,
} from '@/components/rewards/modal-celebrations/utils'

/* ─── Props ─── */

interface ModalCelebrationsConfettiRainProps extends CelebrationBaseProps {
  /** Total confetti particles across all waves. Default 50. */
  particleCount?: number
  /** Emission Y position as percentage of container height (0 = top, 100 = bottom). Default 0. */
  emitY?: number
  /** Element whose bottom edge particles fall toward. Omit for viewport. */
  boundary?: HTMLElement | null
}

/* ─── Types ─── */

type Particle = {
  id: number
  shape: ConfettiShape
  color: string
  imageUrl: string | undefined
  left: number
  driftBase: number
  driftAmp: number
  driftFreq: number
  rotX: number
  rotY: number
  rotZ: number
  delay: number
  dur: number
  peakScale: number
  layer: 'bg' | 'fg'
}

type Sparkle = {
  id: number
  xPct: number
  yPct: number
  delay: number
  size: number
}

/* ─── Constants ─── */

const DEFAULT_PARTICLE_COUNT = 50
const DEFAULT_DURATION_MS = 2100
const FALLBACK_DISTANCE = 500
const STEPS = 10
const FALL_TIMES = Array.from({ length: STEPS + 1 }, (_, i) => i / STEPS)

/* ─── Motion curves ─── */

/** Gravity with air resistance: starts accelerating, approaches terminal velocity */
function fallFrac(t: number): number {
  return Math.pow(t, 1.5)
}

/** Windswept drift: linear wind + sinusoidal wobble, amplitude grows over time */
function driftAtT(t: number, base: number, amp: number, freq: number): number {
  return base * t + amp * Math.sin(freq * Math.PI * t) * t
}

/** Scale: pop in 0–12%, sustain 12–80%, shrink 80–100% */
function scaleAtT(t: number, peak: number): number {
  if (t < 0.12) return peak * (t / 0.12)
  if (t > 0.8) return peak * (0.4 + 0.6 * (1 - (t - 0.8) / 0.2))
  return peak
}

/** Opacity: fade in 0–10%, sustain 10–70%, fade out 70–100% */
function opacityAtT(t: number, peak: number): number {
  if (t < 0.1) return peak * (t / 0.1)
  if (t > 0.7) return peak * Math.max(0, 1 - (t - 0.7) / 0.3)
  return peak
}

/* ─── Fall distance measurement ─── */

function measureFallDistance(
  container: HTMLElement,
  emitYPct: number,
  boundary: HTMLElement | null | undefined
): number {
  const rect = container.getBoundingClientRect()
  const emitYPx = rect.height * (emitYPct / 100)
  const bottomBound = boundary ? boundary.getBoundingClientRect().bottom : window.innerHeight
  return Math.max(bottomBound - rect.top - emitYPx, 100)
}

/* ─── Generators ─── */

function makeParticles(
  count: number,
  colors: readonly string[],
  images: readonly string[],
  timeScale: number
): Particle[] {
  const hasImages = images.length > 0
  return Array.from({ length: count }, (_, i) => {
    const wave = i < Math.floor(count / 3) ? 0 : i < Math.floor((count * 2) / 3) ? 1 : 2
    const waveBase = [0, 0.28, 0.56][wave]!
    const layer: 'bg' | 'fg' = i % 3 === 0 ? 'bg' : 'fg'
    const isBg = layer === 'bg'

    return {
      id: i,
      shape: pickRandom(CONFETTI_SHAPES),
      color: colors[i % colors.length]!,
      imageUrl: hasImages ? images[i % images.length] : undefined,
      left: randBetween(5, 95),
      driftBase: randBetween(-25, 25),
      driftAmp: randBetween(15, 40),
      driftFreq: randBetween(1.2, 2.5),
      rotX: randBetween(-180, 180),
      rotY: randBetween(-180, 180),
      rotZ: randBetween(-120, 120),
      delay: (waveBase + randBetween(0, 0.18)) * timeScale,
      dur: (isBg ? randBetween(1.8, 2.4) : randBetween(1.2, 1.7)) * timeScale,
      peakScale: isBg ? randBetween(0.9, 1.4) : randBetween(0.6, 1.0),
      layer,
    }
  })
}

function makeSparkles(emitYPct: number, timeScale: number): Sparkle[] {
  const startY = emitYPct + (100 - emitYPct) * 0.2
  const endY = emitYPct + (100 - emitYPct) * 0.85
  const range = endY - startY
  const avgFallSec = 1.5 * timeScale

  return Array.from({ length: 12 }, (_, i) => {
    const yPct = startY + (i / 11) * range + randBetween(-range * 0.04, range * 0.04)
    const span = 100 - emitYPct
    const progress = span > 0 ? (yPct - emitYPct) / span : 0
    return {
      id: i,
      xPct: randBetween(15, 85),
      yPct: Math.max(startY, Math.min(endY, yPct)),
      delay: progress * avgFallSec * 0.6 + randBetween(0, 0.25) * timeScale,
      size: randBetween(2.5, 5),
    }
  })
}

/* ─── Sub-components ─── */

function TopFlash({ timeScale, emitYPct }: { timeScale: number; emitYPct: number }) {
  return (
    <m.div
      style={{
        position: 'absolute',
        top: `${emitYPct}%`,
        left: 0,
        right: 0,
        height: '6px',
        background:
          'linear-gradient(90deg, transparent 5%, var(--pf-anim-white-90) 50%, transparent 95%)',
        zIndex: 3,
        pointerEvents: 'none' as const,
        animation: 'none',
      }}
      initial={{ opacity: 0, scaleX: 0.3 }}
      animate={{ opacity: [0, 1, 0.6, 0], scaleX: [0.3, 1, 1, 1] }}
      transition={{ duration: 0.5 * timeScale, times: [0, 0.2, 0.5, 1], ease: 'easeOut' }}
    />
  )
}

function RainPiece({
  p,
  maxW,
  maxH,
  fallDistance,
  emitYPct,
}: {
  p: Particle
  maxW: number
  maxH: number
  fallDistance: number
  emitYPct: number
}) {
  const isBg = p.layer === 'bg'
  const peakOpacity = isBg ? 0.45 : 1

  return (
    <m.span
      className={
        p.imageUrl !== undefined
          ? undefined
          : `pf-celebration__confetti pf-celebration__confetti--${p.shape}`
      }
      style={{
        left: `${p.left}%`,
        top: `${emitYPct}%`,
        ...(p.imageUrl !== undefined ? { width: maxW, height: maxH } : { background: p.color }),
        animation: 'none',
      }}
      initial={{ y: 0, x: 0, scale: 0, rotateX: 0, rotateY: 0, rotate: 0, opacity: 0 }}
      animate={{
        y: FALL_TIMES.map((t) => fallDistance * fallFrac(t)),
        x: FALL_TIMES.map((t) => driftAtT(t, p.driftBase, p.driftAmp, p.driftFreq)),
        scale: FALL_TIMES.map((t) => scaleAtT(t, p.peakScale)),
        rotateX: FALL_TIMES.map((t) => p.rotX * t),
        rotateY: FALL_TIMES.map((t) => p.rotY * t),
        rotate: FALL_TIMES.map((t) => p.rotZ * t),
        opacity: FALL_TIMES.map((t) => opacityAtT(t, peakOpacity)),
      }}
      transition={{
        duration: p.dur,
        delay: p.delay,
        times: FALL_TIMES,
        ease: 'linear',
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
        left: `${s.xPct}%`,
        top: `${s.yPct}%`,
        width: `${s.size}px`,
        height: `${s.size}px`,
        animation: 'none',
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1.4, 0.6, 1.1, 0], opacity: [0, 1, 0.3, 0.7, 0] }}
      transition={{
        duration: 1.1 * timeScale,
        delay: s.delay,
        times: [0, 0.2, 0.5, 0.75, 1],
        ease: 'easeOut',
      }}
    />
  )
}

/* ─── Main ─── */

function ModalCelebrationsConfettiRainComponent({
  particleCount = DEFAULT_PARTICLE_COUNT,
  colors = CELEBRATION_COLORS_HEX,
  particleImages = [],
  particleMaxWidth = 24,
  particleMaxHeight = 24,
  duration,
  emitY = 0,
  boundary,
  onComplete,
}: ModalCelebrationsConfettiRainProps) {
  const prefersReducedMotion = useReducedMotion()
  const timeScale = (duration ?? DEFAULT_DURATION_MS) / DEFAULT_DURATION_MS
  const containerRef = useRef<HTMLDivElement>(null)
  const [fallDistance, setFallDistance] = useState(FALLBACK_DISTANCE)

  useLayoutEffect(() => {
    if (!containerRef.current) return
    setFallDistance(measureFallDistance(containerRef.current, emitY, boundary))
  }, [emitY, boundary])

  const particles = useMemo(
    () => makeParticles(particleCount, colors, particleImages, timeScale),
    [particleCount, colors, particleImages, timeScale]
  )
  const sparkles = useMemo(() => makeSparkles(emitY, timeScale), [emitY, timeScale])
  const bgParts = useMemo(() => particles.filter((p) => p.layer === 'bg'), [particles])
  const fgParts = useMemo(() => particles.filter((p) => p.layer === 'fg'), [particles])

  useEffect(() => {
    if (onComplete === undefined) return
    const maxTime = Math.max(
      ...particles.map((p) => p.delay + p.dur),
      ...sparkles.map((s) => s.delay + 1.1 * timeScale)
    )
    const timer = setTimeout(onComplete, maxTime * 1000 + 50)
    return () => clearTimeout(timer)
  }, [particles, sparkles, timeScale, onComplete])

  useEffect(() => {
    if (prefersReducedMotion && onComplete) onComplete()
  }, [prefersReducedMotion, onComplete])

  if (prefersReducedMotion) {
    return <div className="pf-celebration" data-animation-id="modal-celebrations__confetti-rain" />
  }

  return (
    <div
      ref={containerRef}
      className="pf-celebration"
      data-animation-id="modal-celebrations__confetti-rain"
    >
      <TopFlash timeScale={timeScale} emitYPct={emitY} />

      <div className="pf-celebration__depth-bg">
        {bgParts.map((p) => (
          <RainPiece
            key={p.id}
            p={p}
            maxW={particleMaxWidth}
            maxH={particleMaxHeight}
            fallDistance={fallDistance}
            emitYPct={emitY}
          />
        ))}
      </div>
      <div className="pf-celebration__depth-fg">
        {fgParts.map((p) => (
          <RainPiece
            key={p.id}
            p={p}
            maxW={particleMaxWidth}
            maxH={particleMaxHeight}
            fallDistance={fallDistance}
            emitYPct={emitY}
          />
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

export const ModalCelebrationsConfettiRain = memo(ModalCelebrationsConfettiRainComponent)
