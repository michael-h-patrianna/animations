/**
 * Windswept confetti shower with 3D tumble, depth layers, and top-edge flash — CSS variant.
 *
 * Copy-paste files: this file + ModalCelebrationsConfettiRain.css + ../SharedCelebrationTypes.ts + ../utils.ts + ../shared.css
 * Runtime deps: react
 */

import { memo, useEffect, useMemo } from 'react'

import type { CelebrationBaseProps } from '../SharedCelebrationTypes'
import { CELEBRATION_COLORS_HEX } from '../SharedCelebrationTypes'
import { CONFETTI_SHAPES, pickRandom, randBetween, type ConfettiShape } from '../utils'
import './ModalCelebrationsConfettiRain.css'

/* ─── Props ─── */

interface ModalCelebrationsConfettiRainProps extends CelebrationBaseProps {
  /** Total confetti particles across all waves. Default 50. */
  particleCount?: number
}

/* ─── Types ─── */

type Particle = {
  id: number
  shape: ConfettiShape
  color: string
  imageUrl: string | undefined
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

/* ─── Constants ─── */

const DEFAULT_PARTICLE_COUNT = 50
const DEFAULT_DURATION_MS = 2100

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
    return {
      id: i,
      shape: pickRandom(CONFETTI_SHAPES),
      color: colors[i % colors.length]!,
      imageUrl: hasImages ? images[i % images.length] : undefined,
      left: randBetween(5, 95),
      driftX1: randBetween(-20, 20),
      driftX2: randBetween(-45, 45),
      driftX3: randBetween(-30, 55),
      rotX: randBetween(-180, 180),
      rotY: randBetween(-180, 180),
      rotZ: randBetween(-120, 120),
      delay: (waveBase + randBetween(0, 180)) * timeScale,
      dur: (isBg ? randBetween(1800, 2400) : randBetween(1200, 1700)) * timeScale,
      scale: isBg ? randBetween(0.9, 1.4) : randBetween(0.6, 1.0),
      layer,
    }
  })
}

function makeSparkles(timeScale: number): Sparkle[] {
  return Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: randBetween(-130, 130),
    y: randBetween(-40, 80),
    delay: (900 + i * 100 + randBetween(0, 150)) * timeScale,
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
              left: `${p.left}%`,
              top: '-5%',
              background: p.imageUrl !== undefined ? undefined : p.color,
              width: p.imageUrl !== undefined ? maxW : undefined,
              height: p.imageUrl !== undefined ? maxH : undefined,
              position: p.imageUrl !== undefined ? 'absolute' : undefined,
              transformStyle: 'preserve-3d',
              '--dx1': `${p.driftX1}px`,
              '--dx2': `${p.driftX2}px`,
              '--dx3': `${p.driftX3}px`,
              '--rx': `${p.rotX}deg`,
              '--ry': `${p.rotY}deg`,
              '--rz': `${p.rotZ}deg`,
              '--s': p.scale,
              '--peak-opacity': peakOpacity,
              animation: `cr-confetti ${p.dur}ms cubic-bezier(0.12, 0, 0.39, 0) ${p.delay}ms both`,
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
            top: `calc(50% + ${s.y}px)`,
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
  onComplete,
}: ModalCelebrationsConfettiRainProps) {
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
      ...sparkles.map((s) => s.delay + 1100 * timeScale)
    )
    const timer = setTimeout(onComplete, maxTime + 50)
    return () => clearTimeout(timer)
  }, [particles, sparkles, timeScale, onComplete])

  return (
    <div className="pf-celebration" data-animation-id="modal-celebrations__confetti-rain">
      <div
        style={{
          position: 'absolute',
          top: 0,
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

export const ModalCelebrationsConfettiRain = memo(ModalCelebrationsConfettiRainComponent)
