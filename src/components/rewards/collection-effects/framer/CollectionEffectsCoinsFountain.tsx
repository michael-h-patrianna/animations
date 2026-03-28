/**
 * Particle fountain erupting upward with parabolic physics.
 *
 * Copy-paste files: this file + SharedTypes.ts + SharedParticleUtils.ts +
 * SharedFallbackParticle.tsx + SharedImagePreloader.ts
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { FallbackParticle } from '@/components/rewards/collection-effects/SharedFallbackParticle'
import {
  generateFallbackParticle,
  type ConfettiShape,
} from '@/components/rewards/collection-effects/SharedParticleUtils'
import { useImagePreloader } from '@/components/rewards/collection-effects/SharedImagePreloader'
import {
  clampImages,
  containerCenter,
  randomImage,
  resolvePointRelative,
  type CollectionEffectProps,
  type ResolvedPoint,
} from '@/components/rewards/collection-effects/SharedTypes'

const DEFAULT_COUNT = 12
const DEFAULT_SPREAD = 160 // eruption height
const DEFAULT_DURATION_S = 1.2
const CLEANUP_BUFFER_MS = 400
const HORIZONTAL_SPREAD = 80 // max horizontal deviation

const randBetween = (min: number, max: number) => Math.random() * (max - min) + min

interface Particle {
  id: number
  /** Horizontal offset at apex */
  tx: number
  /** Vertical offset at apex (negative = upward) */
  tyApex: number
  /** Where particle lands (relative to origin) */
  tyFall: number
  txFall: number
  delay: number
  /** 3D spin for metallic flash */
  spinY: number
  tumble: number
  layer: 'bg' | 'fg'
  imageSrc: string | undefined
  fallback: { shape: ConfettiShape; color: string }
}

function generateParticles(
  count: number,
  spread: number,
  images: string[],
  colors?: string[]
): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    const isBg = i % 3 === 0
    const heightMultiplier = isBg ? 0.7 : 1
    return {
      id: i,
      tx: randBetween(-HORIZONTAL_SPREAD, HORIZONTAL_SPREAD) * (isBg ? 0.6 : 1),
      tyApex: -(spread * (0.7 + Math.random() * 0.3)) * heightMultiplier,
      tyFall: randBetween(10, 40),
      txFall: randBetween(-20, 20),
      delay: i * 0.04,
      spinY: randBetween(2, 4) * 360 * (isBg ? 0.7 : 1),
      tumble: randBetween(-25, 25),
      layer: isBg ? 'bg' : 'fg',
      imageSrc: randomImage(images),
      fallback: generateFallbackParticle(colors),
    }
  })
}

function LaunchFlash({ origin }: { origin: ResolvedPoint }) {
  return (
    <m.div
      className="pf-coins-fountain__flash"
      style={{ left: origin.x, top: origin.y, animation: 'none' }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1.4, 0.6, 0], opacity: [0, 0.9, 0.3, 0] }}
      transition={{ duration: 0.4, times: [0, 0.3, 0.65, 1], ease: 'easeOut' }}
    />
  )
}

function ParticleElement({
  particle,
  origin,
  particleSize,
  durationS,
  onFinish,
}: {
  particle: Particle
  origin: ResolvedPoint
  particleSize: number
  durationS: number
  onFinish?: () => void
}) {
  const isBg = particle.layer === 'bg'
  const peakOpacity = isBg ? 0.6 : 1

  return (
    <m.div
      className="pf-coins-fountain__particle"
      style={{
        left: origin.x,
        top: origin.y,
        zIndex: isBg ? 0 : 1,
        animation: 'none',
      }}
      initial={{ x: 0, y: 0, scale: 0.15, rotateY: 0, rotateZ: 0, opacity: 0 }}
      animate={{
        x: [0, 0, particle.tx, particle.tx + particle.txFall],
        y: [0, 0, particle.tyApex, particle.tyFall],
        scale: [0.15, isBg ? 0.8 : 1.1, isBg ? 0.75 : 1.0, isBg ? 0.3 : 0.4],
        rotateY: [0, 0, particle.spinY, particle.spinY],
        rotateZ: [0, 0, particle.tumble, particle.tumble],
        opacity: [0, 1, peakOpacity, 0],
      }}
      transition={{
        duration: durationS,
        delay: particle.delay,
        times: [0, 0.07, 0.45, 1],
        y: {
          duration: durationS,
          delay: particle.delay,
          times: [0, 0.07, 0.45, 1],
          ease: ['easeOut', 'easeOut', [0.33, 0, 0.85, 1]],
        },
        x: {
          duration: durationS,
          delay: particle.delay,
          times: [0, 0.07, 0.45, 1],
          ease: ['easeOut', 'easeOut', [0.25, 0.1, 0.25, 1]],
        },
        scale: {
          duration: durationS,
          delay: particle.delay,
          times: [0, 0.07, 0.4, 1],
          ease: ['easeOut', 'easeOut', 'linear'],
        },
        opacity: {
          duration: durationS,
          delay: particle.delay,
          times: [0, 0.07, 0.35, 1],
          ease: ['easeOut', 'easeOut', [0.5, 0, 1, 1]],
        },
        rotateY: { duration: durationS, delay: particle.delay, ease: 'linear' },
        rotateZ: { duration: durationS, delay: particle.delay, ease: 'linear' },
      }}
      onAnimationComplete={onFinish}
      aria-hidden="true"
    >
      {particle.imageSrc ? (
        <img src={particle.imageSrc} alt="" className="pf-coins-fountain__particle-image" />
      ) : (
        <FallbackParticle
          shape={particle.fallback.shape}
          color={particle.fallback.color}
          size={isBg ? particleSize * 0.8 : particleSize}
        />
      )}
    </m.div>
  )
}

function CollectionEffectsCoinsFountainComponent({
  from,
  to: _to,
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

  const cleanupMs = durationS * 1000 + CLEANUP_BUFFER_MS + count * 40
  useEffect(() => {
    const cleanup = setTimeout(() => setAlive(false), cleanupMs)
    return () => clearTimeout(cleanup)
  }, [cleanupMs])

  const lastParticleId = particles.length > 0 ? particles[particles.length - 1]!.id : -1

  return (
    <div
      ref={containerRef}
      className="pf-coins-fountain"
      data-animation-id="collection-effects__coins-fountain"
      style={{ '--pf-particle-size': `${particleSize}px` } as React.CSSProperties}
    >
      {alive && origin !== null && (
        <div className="pf-coins-fountain__stage" aria-hidden="true" style={{ perspective: 300 }}>
          <LaunchFlash origin={origin} />
          {particles.map((particle) => (
            <ParticleElement
              key={particle.id}
              particle={particle}
              origin={origin}
              particleSize={particleSize}
              durationS={durationS}
              onFinish={particle.id === lastParticleId ? onComplete : undefined}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export const CollectionEffectsCoinsFountain = memo(CollectionEffectsCoinsFountainComponent)
