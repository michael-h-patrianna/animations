/**
 * Multi-layered confetti explosion with depth layers, 3D tumble, and sparkles.
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
  CONFETTI_SHAPES,
  pickRandom,
  randBetween,
  type ConfettiShape,
} from '@/components/rewards/modal-celebrations/utils'

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
      delay: (i * 0.003 + randBetween(0, 0.015)) * timeScale,
      dur: (isBg ? randBetween(2.6, 3.4) : randBetween(2.0, 2.8)) * timeScale,
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
    delay: (1.0 + i * 0.1 + randBetween(0, 0.15)) * timeScale,
    size: randBetween(2.5, 5),
  }))
}

/* ─── Sub-components ─── */

function SubtleFlash({ timeScale }: { timeScale: number }) {
  return (
    <m.div
      className="pf-celebration__flash"
      style={{ animation: 'none' }}
      initial={{ x: '-50%', y: '-50%', scale: 0, opacity: 0 }}
      animate={{ x: '-50%', y: '-50%', scale: [0, 1.2, 1.6], opacity: [0, 0.7, 0] }}
      transition={{ duration: 0.25 * timeScale, times: [0, 0.4, 1], ease: 'easeOut' }}
    />
  )
}

function AmbientGlow({ timeScale }: { timeScale: number }) {
  return (
    <m.div
      className="pf-celebration__glow"
      style={{ animation: 'none' }}
      initial={{ x: '-50%', y: '-50%', opacity: 0 }}
      animate={{ x: '-50%', y: '-50%', opacity: [0, 0.4, 0.25, 0.08] }}
      transition={{ duration: 2.8 * timeScale, times: [0, 0.08, 0.35, 1], ease: 'easeOut' }}
    />
  )
}

function ConfettiPiece({ p, maxW, maxH }: { p: Particle; maxW: number; maxH: number }) {
  const isBg = p.layer === 'bg'
  const peakOp = isBg ? 0.5 : 1
  const dur = p.dur

  return (
    <m.span
      className={
        p.imageUrl !== undefined
          ? undefined
          : `pf-celebration__confetti pf-celebration__confetti--${p.shape}`
      }
      style={{
        left: '50%',
        marginLeft: p.originX,
        top: '55%',
        ...(p.imageUrl !== undefined ? { width: maxW, height: maxH } : { background: p.color }),
        transformStyle: 'preserve-3d' as const,
        animation: 'none',
      }}
      initial={{ x: 0, y: 0, scale: 0, rotateX: 0, rotateY: 0, rotate: 0, opacity: 0 }}
      animate={{
        x: [0, p.tx * 0.85, p.tx + p.swayX],
        y: [0, p.tyPeak, p.tyFall],
        scale: [0, p.scale, p.scale * 0.7],
        rotateX: [0, p.rotX],
        rotateY: [0, p.rotY],
        rotate: [0, p.rotZ],
        opacity: [0, peakOp, 0],
      }}
      transition={{
        duration: dur,
        delay: p.delay,
        y: {
          duration: dur,
          delay: p.delay,
          times: [0, 0.18, 1],
          ease: ['easeOut', [0.33, 0, 0.85, 1]],
        },
        x: {
          duration: dur,
          delay: p.delay,
          times: [0, 0.18, 1],
          ease: ['easeOut', [0.25, 0.1, 0.25, 1]],
        },
        scale: {
          duration: dur,
          delay: p.delay,
          times: [0, 0.15, 1],
          ease: ['easeOut', 'linear'],
        },
        opacity: {
          duration: dur,
          delay: p.delay,
          times: [0, 0.12, 1],
          ease: ['easeOut', [0.5, 0, 1, 1]],
        },
        rotateX: { duration: dur, delay: p.delay, ease: 'linear' },
        rotateY: { duration: dur, delay: p.delay, ease: 'linear' },
        rotate: { duration: dur, delay: p.delay, ease: 'linear' },
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
        top: '55%',
        marginTop: s.y,
        width: `${s.size}px`,
        height: `${s.size}px`,
        animation: 'none',
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1.4, 0.6, 1.1, 0], opacity: [0, 0.9, 0.3, 0.7, 0] }}
      transition={{
        duration: 1.4 * timeScale,
        delay: s.delay,
        times: [0, 0.2, 0.5, 0.75, 1],
        ease: 'easeOut',
      }}
    />
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
      ...sparkles.map((s) => s.delay + 1.4 * timeScale)
    )
    const timer = setTimeout(onComplete, maxTime * 1000 + 50)
    return () => clearTimeout(timer)
  }, [particles, sparkles, timeScale, onComplete])

  useEffect(() => {
    if (prefersReducedMotion && onComplete) onComplete()
  }, [prefersReducedMotion, onComplete])

  if (prefersReducedMotion) {
    return <div className="pf-celebration" data-animation-id="modal-celebrations__confetti-burst" />
  }

  return (
    <div className="pf-celebration" data-animation-id="modal-celebrations__confetti-burst">
      <AmbientGlow timeScale={timeScale} />
      <SubtleFlash timeScale={timeScale} />

      <div className="pf-celebration__depth-bg">
        {bgParts.map((p) => (
          <ConfettiPiece key={p.id} p={p} maxW={particleMaxWidth} maxH={particleMaxHeight} />
        ))}
      </div>
      <div className="pf-celebration__depth-fg">
        {fgParts.map((p) => (
          <ConfettiPiece key={p.id} p={p} maxW={particleMaxWidth} maxH={particleMaxHeight} />
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

export const ModalCelebrationsConfettiBurst = memo(ModalCelebrationsConfettiBurstComponent)
