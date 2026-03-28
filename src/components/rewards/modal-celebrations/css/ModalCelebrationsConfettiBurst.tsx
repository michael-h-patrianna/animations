/**
 * Multi-layered confetti explosion with depth layers, 3D tumble, and sparkles — CSS variant.
 *
 * Copy-paste files: this file + ModalCelebrationsConfettiBurst.css + ../SharedCelebrationTypes.ts + ../utils.ts + ../shared.css
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
import './ModalCelebrationsConfettiBurst.css'

/* ─── Props ─── */

interface ModalCelebrationsConfettiBurstProps extends CelebrationBaseProps {
  /** Total confetti particles. Default 60. */
  particleCount?: number
}

/* ─── Types ─── */

type Particle = {
  id: number
  shape: ConfettiShape
  color: string
  imageUrl: string | undefined
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

/* ─── Constants ─── */

const DEFAULT_PARTICLE_COUNT = 60
const DEFAULT_DURATION_MS = 2800

/* ─── Generators ─── */

function makeParticles(
  count: number,
  colors: readonly string[],
  images: readonly string[],
  timeScale: number
): Particle[] {
  const hasImages = images.length > 0
  return Array.from({ length: count }, (_, i) => {
    const layer: 'bg' | 'fg' = i < Math.floor(count / 3) ? 'bg' : 'fg'
    const isBg = layer === 'bg'
    const spread = isBg ? 0.65 : 1
    const reach = isBg ? 0.6 : 1
    return {
      id: i,
      shape: pickRandom(CONFETTI_SHAPES),
      color: colors[i % colors.length]!,
      imageUrl: hasImages ? images[i % images.length] : undefined,
      originX: randBetween(-4, 4),
      tx: randBetween(-140, 140) * spread,
      tyPeak: randBetween(-150, -50) * reach,
      tyFall: randBetween(60, 170),
      swayX: randBetween(-25, 25),
      rotX: randBetween(-160, 160),
      rotY: randBetween(-140, 140),
      rotZ: randBetween(-300, 300),
      delay: (i * 3 + randBetween(0, 15)) * timeScale,
      dur: (isBg ? randBetween(2600, 3400) : randBetween(2000, 2800)) * timeScale,
      scale: isBg ? randBetween(0.55, 0.85) : randBetween(0.75, 1.15),
      layer,
    }
  })
}

function makeSparkles(timeScale: number): Sparkle[] {
  return Array.from({ length: 10 }, (_, i) => ({
    id: i,
    x: randBetween(-100, 100),
    y: randBetween(-110, 20),
    delay: (1000 + i * 100 + randBetween(0, 150)) * timeScale,
    size: randBetween(2.5, 5),
  }))
}

/* ─── Sub-components ─── */

function ConfettiLayer({
  particles,
  peakOpacity,
  maxW,
  maxH,
}: {
  particles: Particle[]
  peakOpacity: string
  maxW: number
  maxH: number
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
              left: `calc(50% + ${p.originX}px)`,
              top: '55%',
              background: p.imageUrl !== undefined ? undefined : p.color,
              width: p.imageUrl !== undefined ? maxW : undefined,
              height: p.imageUrl !== undefined ? maxH : undefined,
              position: p.imageUrl !== undefined ? 'absolute' : undefined,
              '--tx': `${p.tx}px`,
              '--ty-peak': `${p.tyPeak}px`,
              '--ty-fall': `${p.tyFall}px`,
              '--sway-x': `${p.swayX}px`,
              '--rx': `${p.rotX}deg`,
              '--ry': `${p.rotY}deg`,
              '--rz': `${p.rotZ}deg`,
              '--s': p.scale,
              '--peak-opacity': peakOpacity,
              animation: `cb-confetti ${p.dur}ms linear ${p.delay}ms both`,
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
            left: `calc(50% + ${s.x}px)`,
            top: `calc(55% + ${s.y}px)`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animation: `cb-sparkle ${1400 * timeScale}ms ease-out ${s.delay}ms both`,
          }}
        />
      ))}
    </>
  )
}

/* ─── Main ─── */

function ModalCelebrationsConfettiBurstComponent({
  particleCount = DEFAULT_PARTICLE_COUNT,
  colors = CELEBRATION_COLORS_HEX,
  particleImages = [],
  particleMaxWidth = 24,
  particleMaxHeight = 24,
  duration,
  onComplete,
}: ModalCelebrationsConfettiBurstProps) {
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
      ...sparkles.map((s) => s.delay + 1400 * timeScale)
    )
    const timer = setTimeout(onComplete, maxTime + 50)
    return () => clearTimeout(timer)
  }, [particles, sparkles, timeScale, onComplete])

  const containerRef = useRef<HTMLDivElement>(null)
  const [skip, setSkip] = useState(
    () => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  )
  useLayoutEffect(() => {
    if (!skip && containerRef.current?.closest("[data-reduced-motion='reduce']")) setSkip(true)
  }, [skip])
  useEffect(() => {
    if (skip && onComplete) onComplete()
  }, [skip, onComplete])

  if (skip) {
    return (
      <div
        ref={containerRef}
        className="pf-celebration"
        data-animation-id="modal-celebrations__confetti-burst"
      />
    )
  }

  return (
    <div
      ref={containerRef}
      className="pf-celebration"
      data-animation-id="modal-celebrations__confetti-burst"
    >
      <div
        className="pf-celebration__glow"
        style={{ animation: `cb-glow ${2800 * timeScale}ms ease-out both` }}
      />
      <div
        className="pf-celebration__flash"
        style={{ animation: `cb-flash ${250 * timeScale}ms ease-out both` }}
      />

      <div className="pf-celebration__depth-bg">
        <ConfettiLayer
          particles={bgParts}
          peakOpacity="0.5"
          maxW={particleMaxWidth}
          maxH={particleMaxHeight}
        />
      </div>
      <div className="pf-celebration__depth-fg">
        <ConfettiLayer
          particles={fgParts}
          peakOpacity="1"
          maxW={particleMaxWidth}
          maxH={particleMaxHeight}
        />
      </div>
      <div className="pf-celebration__effects">
        <SparkleLayer sparkles={sparkles} timeScale={timeScale} />
      </div>
    </div>
  )
}

export const ModalCelebrationsConfettiBurst = memo(ModalCelebrationsConfettiBurstComponent)
