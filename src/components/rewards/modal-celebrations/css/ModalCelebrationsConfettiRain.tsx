/**
 * Windswept confetti shower with 3D tumble, depth layers, and afterglow sparkles — CSS variant.
 * Particles fall from emitY to the bottom of a boundary element (viewport by default),
 * adapting to any container size. 11-point gravity curve for smooth motion at any distance.
 *
 * Copy-paste files: this file + ModalCelebrationsConfettiRain.css + ../SharedCelebrationTypes.ts + ../utils.ts + ../shared.css
 * Runtime deps: react
 */

import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import type { CelebrationBaseProps } from '@/components/rewards/modal-celebrations/SharedCelebrationTypes'
import { CELEBRATION_COLORS_HEX } from '@/components/rewards/modal-celebrations/SharedCelebrationTypes'
import {
  CONFETTI_SHAPES,
  pickRandom,
  randBetween,
  type ConfettiShape,
} from '@/components/rewards/modal-celebrations/utils'
import './ModalCelebrationsConfettiRain.css'

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
  xValues: number[]
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

/* ─── Motion curves (sampled for CSS custom properties) ─── */

function driftAtT(t: number, base: number, amp: number, freq: number): number {
  return base * t + amp * Math.sin(freq * Math.PI * t) * t
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
    const waveBase = [0, 280, 560][wave]!
    const layer: 'bg' | 'fg' = i % 3 === 0 ? 'bg' : 'fg'
    const isBg = layer === 'bg'

    const driftBase = randBetween(-25, 25)
    const driftAmp = randBetween(15, 40)
    const driftFreq = randBetween(1.2, 2.5)

    return {
      id: i,
      shape: pickRandom(CONFETTI_SHAPES),
      color: colors[i % colors.length]!,
      imageUrl: hasImages ? images[i % images.length] : undefined,
      left: randBetween(5, 95),
      xValues: FALL_TIMES.map((t) => driftAtT(t, driftBase, driftAmp, driftFreq)),
      rotX: randBetween(-180, 180),
      rotY: randBetween(-180, 180),
      rotZ: randBetween(-120, 120),
      delay: (waveBase + randBetween(0, 180)) * timeScale,
      dur: (isBg ? randBetween(1800, 2400) : randBetween(1200, 1700)) * timeScale,
      peakScale: isBg ? randBetween(0.9, 1.4) : randBetween(0.6, 1.0),
      layer,
    }
  })
}

function makeSparkles(emitYPct: number, timeScale: number): Sparkle[] {
  const startY = emitYPct + (100 - emitYPct) * 0.2
  const endY = emitYPct + (100 - emitYPct) * 0.85
  const range = endY - startY
  const avgFallMs = 1500 * timeScale

  return Array.from({ length: 12 }, (_, i) => {
    const yPct = startY + (i / 11) * range + randBetween(-range * 0.04, range * 0.04)
    const span = 100 - emitYPct
    const progress = span > 0 ? (yPct - emitYPct) / span : 0
    return {
      id: i,
      xPct: randBetween(15, 85),
      yPct: Math.max(startY, Math.min(endY, yPct)),
      delay: progress * avgFallMs * 0.6 + randBetween(0, 250) * timeScale,
      size: randBetween(2.5, 5),
    }
  })
}

/* ─── Sub-components ─── */

function ConfettiLayer({
  particles,
  peakOpacity,
  maxW,
  maxH,
  fallDistance,
  emitYPct,
}: {
  particles: Particle[]
  peakOpacity: string
  maxW: number
  maxH: number
  fallDistance: number
  emitYPct: number
}) {
  return (
    <>
      {particles.map((p) => (
        <span
          key={p.id}
          className={
            p.imageUrl !== undefined
              ? undefined
              : `pf-celebration__confetti pf-celebration__confetti--${p.shape}`
          }
          style={
            {
              left: `${p.left}%`,
              top: `${emitYPct}%`,
              background: p.imageUrl !== undefined ? undefined : p.color,
              width: p.imageUrl !== undefined ? maxW : undefined,
              height: p.imageUrl !== undefined ? maxH : undefined,
              position: p.imageUrl !== undefined ? 'absolute' : undefined,
              transformStyle: 'preserve-3d',
              '--fall': `${fallDistance}px`,
              '--x1': `${p.xValues[1]}px`,
              '--x2': `${p.xValues[2]}px`,
              '--x3': `${p.xValues[3]}px`,
              '--x4': `${p.xValues[4]}px`,
              '--x5': `${p.xValues[5]}px`,
              '--x6': `${p.xValues[6]}px`,
              '--x7': `${p.xValues[7]}px`,
              '--x8': `${p.xValues[8]}px`,
              '--x9': `${p.xValues[9]}px`,
              '--x10': `${p.xValues[10]}px`,
              '--rx': `${p.rotX}deg`,
              '--ry': `${p.rotY}deg`,
              '--rz': `${p.rotZ}deg`,
              '--s': p.peakScale,
              '--peak-opacity': peakOpacity,
              animation: `cr-confetti ${p.dur}ms linear ${p.delay}ms both`,
            } as React.CSSProperties
          }
        >
          {p.imageUrl !== undefined && (
            <img
              src={p.imageUrl}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
            />
          )}
        </span>
      ))}
    </>
  )
}

function SparkleLayer({ sparkles, timeScale }: { sparkles: Sparkle[]; timeScale: number }) {
  return (
    <>
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="pf-celebration__sparkle"
          style={{
            left: `${s.xPct}%`,
            top: `${s.yPct}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animation: `cr-sparkle ${1100 * timeScale}ms ease-out ${s.delay}ms both`,
          }}
        />
      ))}
    </>
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
      ...sparkles.map((s) => s.delay + 1100 * timeScale)
    )
    const timer = setTimeout(onComplete, maxTime + 50)
    return () => clearTimeout(timer)
  }, [particles, sparkles, timeScale, onComplete])

  return (
    <div
      ref={containerRef}
      className="pf-celebration"
      data-animation-id="modal-celebrations__confetti-rain"
    >
      <div
        style={{
          position: 'absolute',
          top: `${emitY}%`,
          left: 0,
          right: 0,
          height: '6px',
          background:
            'linear-gradient(90deg, transparent 5%, var(--pf-anim-white-90) 50%, transparent 95%)',
          zIndex: 3,
          pointerEvents: 'none',
          animation: `cr-flash ${500 * timeScale}ms ease-out both`,
        }}
      />

      <div className="pf-celebration__depth-bg">
        <ConfettiLayer
          particles={bgParts}
          peakOpacity="0.45"
          maxW={particleMaxWidth}
          maxH={particleMaxHeight}
          fallDistance={fallDistance}
          emitYPct={emitY}
        />
      </div>
      <div className="pf-celebration__depth-fg">
        <ConfettiLayer
          particles={fgParts}
          peakOpacity="1"
          maxW={particleMaxWidth}
          maxH={particleMaxHeight}
          fallDistance={fallDistance}
          emitYPct={emitY}
        />
      </div>
      <div className="pf-celebration__effects">
        <SparkleLayer sparkles={sparkles} timeScale={timeScale} />
      </div>
    </div>
  )
}

export const ModalCelebrationsConfettiRain = memo(ModalCelebrationsConfettiRainComponent)
