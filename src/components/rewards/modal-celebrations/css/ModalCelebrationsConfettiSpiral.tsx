/**
 * Dynamic tornado confetti — particles orbit center in 3 spiral arms — CSS variant.
 *
 * Copy-paste files: this file + ModalCelebrationsConfettiSpiral.css + ../SharedCelebrationTypes.ts + ../utils.ts + ../shared.css
 * Runtime deps: react
 */

import { memo, useEffect, useMemo } from 'react'

import type { CelebrationBaseProps } from '@/components/rewards/modal-celebrations/SharedCelebrationTypes'
import { CELEBRATION_COLORS_HEX } from '@/components/rewards/modal-celebrations/SharedCelebrationTypes'
import { CONFETTI_SHAPES, deg2rad, pickRandom, randBetween, type ConfettiShape } from '@/components/rewards/modal-celebrations/utils'
import './ModalCelebrationsConfettiSpiral.css'

/* ─── Props ─── */

interface ModalCelebrationsConfettiSpiralProps extends CelebrationBaseProps {
  /** Total confetti particles across all spiral arms. Default 54. */
  particleCount?: number
}

/* ─── Types ─── */

type SpiralParticle = {
  id: number
  shape: ConfettiShape
  color: string
  imageUrl: string | undefined
  startAngle: number
  totalOrbit: number
  maxRadius: number
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

const DEFAULT_PARTICLE_COUNT = 54
const DEFAULT_DURATION_MS = 2500
const NUM_ARMS = 3

/* ─── Generators ─── */

function makeParticles(
  count: number,
  colors: readonly string[],
  images: readonly string[],
  timeScale: number
): SpiralParticle[] {
  const hasImages = images.length > 0
  const particles: SpiralParticle[] = []
  const perArm = Math.ceil(count / NUM_ARMS)

  for (let arm = 0; arm < NUM_ARMS; arm++) {
    const armBase = arm * (360 / NUM_ARMS)
    const armCount = Math.min(perArm, count - arm * perArm)

    for (let j = 0; j < armCount; j++) {
      const i = arm * perArm + j
      const layer: 'bg' | 'fg' = j % 3 === 0 ? 'bg' : 'fg'
      const isBg = layer === 'bg'

      particles.push({
        id: i,
        shape: pickRandom(CONFETTI_SHAPES),
        color: colors[i % colors.length]!,
        imageUrl: hasImages ? images[i % images.length] : undefined,
        startAngle: armBase + randBetween(-8, 8),
        totalOrbit: randBetween(620, 840),
        maxRadius: randBetween(85, 150) * (isBg ? 0.65 : 1),
        rotX: randBetween(-130, 130),
        rotY: randBetween(-110, 110),
        rotZ: randBetween(-240, 240),
        delay: (j * 30 + randBetween(0, 10)) * timeScale,
        dur: (isBg ? randBetween(2200, 2800) : randBetween(1800, 2400)) * timeScale,
        scale: isBg ? randBetween(0.55, 0.85) : randBetween(0.75, 1.15),
        layer,
      })
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
      delay: (700 + i * 80 + randBetween(0, 100)) * timeScale,
      size: randBetween(2.5, 5),
    }
  })
}

/* ─── Sub-components ─── */

function SpiralLayer({
  particles,
  peakOpacity,
  maxW,
  maxH,
}: {
  particles: SpiralParticle[]
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
              left: '50%',
              top: '50%',
              background: p.imageUrl !== undefined ? undefined : p.color,
              width: p.imageUrl !== undefined ? maxW : undefined,
              height: p.imageUrl !== undefined ? maxH : undefined,
              position: p.imageUrl !== undefined ? 'absolute' : undefined,
              transformStyle: 'preserve-3d',
              '--sa': `${p.startAngle}deg`,
              '--to': `${p.totalOrbit}deg`,
              '--mr': `${p.maxRadius}px`,
              '--rx': `${p.rotX}deg`,
              '--ry': `${p.rotY}deg`,
              '--rz': `${p.rotZ}deg`,
              '--s': p.scale,
              '--peak-opacity': peakOpacity,
              animation: `cs-tornado ${p.dur}ms linear ${p.delay}ms both`,
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
            animation: `cs-sparkle ${1200 * timeScale}ms ease-out ${s.delay}ms both`,
          }}
        />
      ))}
    </>
  )
}

/* ─── Main ─── */

function ModalCelebrationsConfettiSpiralComponent({
  particleCount = DEFAULT_PARTICLE_COUNT,
  colors = CELEBRATION_COLORS_HEX,
  particleImages = [],
  particleMaxWidth = 24,
  particleMaxHeight = 24,
  duration,
  onComplete,
}: ModalCelebrationsConfettiSpiralProps) {
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
      ...sparkles.map((s) => s.delay + 1200 * timeScale)
    )
    const timer = setTimeout(onComplete, maxTime + 50)
    return () => clearTimeout(timer)
  }, [particles, sparkles, timeScale, onComplete])

  return (
    <div className="pf-celebration" data-animation-id="modal-celebrations__confetti-spiral">
      <div
        className="pf-celebration__flash"
        style={{ animation: `cs-flash ${250 * timeScale}ms ease-out both` }}
      />

      <div className="pf-celebration__depth-bg">
        <SpiralLayer
          particles={bgParts}
          peakOpacity="0.5"
          maxW={particleMaxWidth}
          maxH={particleMaxHeight}
        />
      </div>
      <div className="pf-celebration__depth-fg">
        <SpiralLayer
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

export const ModalCelebrationsConfettiSpiral = memo(ModalCelebrationsConfettiSpiralComponent)
