/**
 * Radial particle burst from a configurable origin.
 *
 * Copy-paste files: this file + SharedTypes.ts + SharedParticleUtils.ts +
 * SharedFallbackParticle.tsx + SharedImagePreloader.ts
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { FallbackParticle } from '../SharedFallbackParticle'
import { generateFallbackParticle, type ConfettiShape } from '../SharedParticleUtils'
import { useImagePreloader } from '../SharedImagePreloader'
import {
  clampImages,
  containerCenter,
  randomImage,
  resolvePointRelative,
  type CollectionEffectProps,
  type ResolvedPoint,
} from '../SharedTypes'

const DEFAULT_COUNT = 14
const DEFAULT_SPREAD = 130
const DEFAULT_DURATION_S = 1.2
const SPREAD_VARIANCE = 0.4
const CLEANUP_BUFFER_MS = 300

interface Particle {
  id: number
  tx: number
  ty: number
  rotation: number
  delay: number
  imageSrc: string | undefined
  fallback: { shape: ConfettiShape; color: string }
}

function generateParticles(
  count: number,
  spread: number,
  images: string[],
  colors?: string[]
): Particle[] {
  const halfVariance = spread * SPREAD_VARIANCE
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.3
    const distance = spread - halfVariance + Math.random() * halfVariance * 2
    return {
      id: i,
      tx: Math.cos(angle) * distance,
      ty: Math.sin(angle) * distance,
      rotation: (Math.random() - 0.5) * 360,
      delay: i * 0.004,
      imageSrc: randomImage(images),
      fallback: generateFallbackParticle(colors),
    }
  })
}

function BurstFlash({ origin }: { origin: ResolvedPoint }) {
  return (
    <m.div
      className="pf-coin-burst__flash"
      style={{ left: origin.x, top: origin.y, animation: 'none' }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1.5, 2], opacity: [0, 0.8, 0] }}
      transition={{ duration: 0.3, times: [0, 0.3, 1], ease: 'easeOut' }}
    />
  )
}

function ParticleElement({
  particle,
  origin,
  particleSize,
  durationS,
  prefersReducedMotion,
  onFinish,
  isLast,
}: {
  particle: Particle
  origin: ResolvedPoint
  particleSize: number
  durationS: number
  prefersReducedMotion: boolean | null
  onFinish?: () => void
  isLast: boolean
}) {
  return (
    <m.div
      className="pf-coin-burst__particle"
      style={{ left: origin.x, top: origin.y, animation: 'none' }}
      initial={{ x: 0, y: 0, scale: 0.15, rotate: 0, opacity: 0 }}
      animate={
        prefersReducedMotion
          ? { x: 0, y: 0, scale: [0.15, 1, 1, 0], rotate: 0, opacity: [0, 1, 1, 0] }
          : {
              x: [0, 0, 0, particle.tx, particle.tx],
              y: [0, 0, 0, particle.ty, particle.ty],
              scale: [0.15, 1.15, 1, 0.8, 0.35],
              rotate: [0, 0, 0, particle.rotation, particle.rotation],
              opacity: [0, 1, 1, 0.7, 0],
            }
      }
      transition={
        prefersReducedMotion
          ? {
              duration: 0.3,
              delay: particle.delay,
              ease: 'easeOut' as const,
              times: [0, 0.33, 0.67, 1],
            }
          : { duration: durationS, delay: particle.delay, times: [0, 0.06, 0.14, 0.7, 1] }
      }
      onAnimationComplete={isLast ? onFinish : undefined}
      aria-hidden="true"
    >
      {particle.imageSrc ? (
        <img src={particle.imageSrc} alt="" className="pf-coin-burst__particle-image" />
      ) : (
        <FallbackParticle
          shape={particle.fallback.shape}
          color={particle.fallback.color}
          size={particleSize}
        />
      )}
    </m.div>
  )
}

function CollectionEffectsCoinBurstComponent({
  from,
  count = DEFAULT_COUNT,
  particleImages,
  particleSize = 24,
  colors,
  spread = DEFAULT_SPREAD,
  duration,
  onComplete,
}: CollectionEffectProps) {
  const durationS = duration !== undefined ? duration / 1000 : DEFAULT_DURATION_S
  const containerRef = useRef<HTMLDivElement>(null)

  const images = useMemo(() => clampImages(particleImages), [particleImages])
  const { ready, timedOut } = useImagePreloader(images.length > 0 ? images : undefined)
  const useImages = ready && !timedOut && images.length > 0

  const particles = useMemo(
    () => generateParticles(count, spread, useImages ? images : [], colors),
    [count, spread, useImages, images, colors]
  )

  const [origin, setOrigin] = useState<ResolvedPoint | null>(null)
  const [alive, setAlive] = useState(true)
  const prefersReducedMotion = useReducedMotion()

  useLayoutEffect(() => {
    if (!ready) return
    const container = containerRef.current
    if (container === null) return
    if (from !== undefined) {
      setOrigin(resolvePointRelative(from, container))
    } else {
      setOrigin(containerCenter(container))
    }
  }, [from, ready])

  const cleanupMs = durationS * 1000 + CLEANUP_BUFFER_MS
  useEffect(() => {
    const cleanup = setTimeout(() => setAlive(false), cleanupMs)
    return () => clearTimeout(cleanup)
  }, [cleanupMs])

  const handleComplete = useCallback(() => {
    onComplete?.()
  }, [onComplete])
  const lastParticleId = particles.length > 0 ? particles[particles.length - 1]!.id : -1

  return (
    <div
      ref={containerRef}
      className="pf-coin-burst"
      data-animation-id="collection-effects__coin-burst"
      style={{ '--pf-particle-size': `${particleSize}px` } as React.CSSProperties}
    >
      {alive && origin !== null && (
        <m.div
          className="pf-coin-burst__stage"
          initial={{ scale: 1 }}
          animate={prefersReducedMotion ? { scale: 1 } : { scale: [1, 0.85, 1] }}
          transition={{ duration: 0.15, ease: [0.4, 0, 0.6, 1] as const }}
          aria-hidden="true"
        >
          <BurstFlash origin={origin} />
          {particles.map((particle) => (
            <ParticleElement
              key={particle.id}
              particle={particle}
              origin={origin}
              particleSize={particleSize}
              durationS={durationS}
              prefersReducedMotion={prefersReducedMotion}
              onFinish={particle.id === lastParticleId ? handleComplete : undefined}
              isLast={particle.id === lastParticleId}
            />
          ))}
        </m.div>
      )}
    </div>
  )
}

export const CollectionEffectsCoinBurst = memo(CollectionEffectsCoinBurstComponent)
