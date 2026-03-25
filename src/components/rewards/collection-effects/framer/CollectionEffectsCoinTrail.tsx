/**
 * "Claim reward" particle trail — pop up from source, hang, accelerate to target.
 *
 * Copy-paste files: this file + SharedTypes.ts + SharedParticleUtils.ts +
 * SharedFallbackParticle.tsx + SharedImagePreloader.ts
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
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
  pointsAreEqual,
  randomImage,
  resolvePointRelative,
  type CollectionEffectProps,
  type ResolvedPoint,
} from '@/components/rewards/collection-effects/SharedTypes'

const DEFAULT_COUNT = 8
const DEFAULT_SPREAD = 50 // pop-up height above source
const DEFAULT_DURATION_S = 1.0
const CLEANUP_BUFFER_MS = 400
const SWIRL_RADIUS = 50

interface Particle {
  id: number
  delay: number
  /** Slight horizontal scatter at pop-up apex for organic feel */
  apexOffsetX: number
  imageSrc: string | undefined
  fallback: { shape: ConfettiShape; color: string }
}

function generateParticles(count: number, images: string[], colors?: string[]): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    delay: i * 0.07,
    apexOffsetX: (Math.random() - 0.5) * 20,
    imageSrc: randomImage(images),
    fallback: generateFallbackParticle(colors),
  }))
}

function ParticleElement({
  particle,
  fromPt,
  toPt,
  popHeight,
  particleSize,
  isSwirl,
  durationS,
  prefersReducedMotion,
  onFinish,
}: {
  particle: Particle
  fromPt: ResolvedPoint
  toPt: ResolvedPoint
  popHeight: number
  particleSize: number
  isSwirl: boolean
  durationS: number
  prefersReducedMotion: boolean | null
  onFinish?: () => void
}) {
  const particleContent = particle.imageSrc ? (
    <img src={particle.imageSrc} alt="" className="pf-coin-trail__particle-image" />
  ) : (
    <FallbackParticle
      shape={particle.fallback.shape}
      color={particle.fallback.color}
      size={particleSize}
    />
  )

  if (isSwirl) {
    const startAngle = (particle.id / 8) * Math.PI * 2
    const steps = 12
    const xPath: number[] = []
    const yPath: number[] = []
    for (let k = 0; k < steps; k++) {
      const t = k / (steps - 1)
      const angle = startAngle + t * Math.PI * 3
      const radius = SWIRL_RADIUS * (1 - t * 0.8)
      xPath.push(fromPt.x + Math.cos(angle) * radius)
      yPath.push(fromPt.y + Math.sin(angle) * radius)
    }

    return (
      <m.div
        className="pf-coin-trail__particle"
        style={{ left: 0, top: 0, animation: 'none' }}
        initial={{ x: xPath[0], y: yPath[0], scale: 0, opacity: 0 }}
        animate={{
          x: xPath,
          y: yPath,
          scale: [0, 1, 1, 0.8, 0.5, 0.3, 0],
          opacity: [0, 1, 1, 0.8, 0.5, 0.3, 0],
        }}
        transition={{
          duration: durationS,
          delay: particle.delay,
          ease: 'linear',
        }}
        onAnimationComplete={onFinish}
        aria-hidden="true"
      >
        {particleContent}
      </m.div>
    )
  }

  // "Claim reward" motion: pop up → hang → accelerate to target → shrink on arrival
  const apexX = fromPt.x + particle.apexOffsetX
  const apexY = fromPt.y - popHeight

  return (
    <m.div
      className="pf-coin-trail__particle"
      style={{ left: 0, top: 0 }}
      initial={{ x: fromPt.x, y: fromPt.y, scale: 0.15, opacity: 0 }}
      animate={
        prefersReducedMotion
          ? {
              x: [fromPt.x, toPt.x],
              y: [fromPt.y, toPt.y],
              scale: [0.15, 1, 0.3],
              opacity: [0, 1, 0],
            }
          : {
              // Phase 1: pop in (0→0.08), Phase 2: pop up (0.08→0.22), Phase 3: hang (0.22→0.32), Phase 4: fly to target (0.32→0.92), Phase 5: absorb (0.92→1)
              x: [fromPt.x, fromPt.x, apexX, apexX, toPt.x, toPt.x],
              y: [fromPt.y, fromPt.y, apexY, apexY, toPt.y, toPt.y],
              scale: [0.15, 1.1, 1.0, 1.0, 1.0, 0],
              opacity: [0, 1, 1, 1, 1, 0],
            }
      }
      transition={
        prefersReducedMotion
          ? {
              duration: durationS,
              delay: particle.delay,
              ease: 'easeInOut' as const,
              scale: { times: [0, 0.5, 1] },
              opacity: { times: [0, 0.3, 1] },
            }
          : {
              duration: durationS,
              delay: particle.delay,
              times: [0, 0.08, 0.22, 0.32, 0.92, 1],
              x: {
                duration: durationS,
                delay: particle.delay,
                times: [0, 0.08, 0.22, 0.32, 0.92, 1],
                ease: ['easeOut', 'easeOut', 'linear', [0.5, 0, 1, 0.5], 'easeOut'],
              },
              y: {
                duration: durationS,
                delay: particle.delay,
                times: [0, 0.08, 0.22, 0.32, 0.92, 1],
                ease: ['easeOut', 'easeOut', 'linear', [0.5, 0, 1, 0.5], 'easeOut'],
              },
              scale: {
                duration: durationS,
                delay: particle.delay,
                times: [0, 0.08, 0.22, 0.32, 0.92, 1],
              },
              opacity: {
                duration: durationS,
                delay: particle.delay,
                times: [0, 0.08, 0.22, 0.32, 0.96, 1],
              },
            }
      }
      onAnimationComplete={onFinish}
      aria-hidden="true"
    >
      {particleContent}
    </m.div>
  )
}

function CollectionEffectsCoinTrailComponent({
  from,
  to,
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
    () => generateParticles(count, useImages ? images : [], colors),
    [count, useImages, images, colors]
  )

  const [fromPt, setFromPt] = useState<ResolvedPoint | null>(null)
  const [toPt, setToPt] = useState<ResolvedPoint | null>(null)
  const [alive, setAlive] = useState(true)

  useLayoutEffect(() => {
    if (!ready) return
    const container = containerRef.current
    if (container === null) return
    const center = containerCenter(container)
    const resolvedFrom = from !== undefined ? resolvePointRelative(from, container) : center
    setFromPt(resolvedFrom)
    const resolvedTo = to !== undefined ? resolvePointRelative(to, container) : resolvedFrom
    setToPt(resolvedTo)
  }, [from, to, ready])
  const prefersReducedMotion = useReducedMotion()

  const isSwirl = pointsAreEqual(fromPt, toPt)

  const cleanupMs = durationS * 1000 + CLEANUP_BUFFER_MS + count * 70
  useEffect(() => {
    const cleanup = setTimeout(() => setAlive(false), cleanupMs)
    return () => clearTimeout(cleanup)
  }, [cleanupMs])

  const lastParticleId = particles.length > 0 ? particles[particles.length - 1]!.id : -1

  return (
    <div
      ref={containerRef}
      className="pf-coin-trail"
      data-animation-id="collection-effects__coin-trail"
      style={{ '--pf-particle-size': `${particleSize}px` } as React.CSSProperties}
    >
      {alive && fromPt !== null && toPt !== null && (
        <div className="pf-coin-trail__stage" aria-hidden="true">
          {particles.map((particle) => (
            <ParticleElement
              key={particle.id}
              particle={particle}
              fromPt={fromPt}
              toPt={toPt}
              popHeight={spread}
              particleSize={particleSize}
              isSwirl={isSwirl}
              durationS={durationS}
              prefersReducedMotion={prefersReducedMotion}
              onFinish={particle.id === lastParticleId ? onComplete : undefined}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export const CollectionEffectsCoinTrail = memo(CollectionEffectsCoinTrailComponent)
