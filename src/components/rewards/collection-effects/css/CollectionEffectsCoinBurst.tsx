/**
 * Radial particle burst from a configurable origin — CSS variant.
 *
 * Copy-paste files: this file + CollectionEffectsCoinBurst.css + SharedTypes.ts +
 * SharedParticleUtils.ts + SharedFallbackParticle.tsx + SharedImagePreloader.ts
 * Runtime deps: react
 */

import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import './CollectionEffectsCoinBurst.css'

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

const DEFAULT_COUNT = 14
const DEFAULT_SPREAD = 130
const DEFAULT_DURATION_MS = 1200
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
      delay: i * 4,
      imageSrc: randomImage(images),
      fallback: generateFallbackParticle(colors),
    }
  })
}

function CollectionEffectsCoinBurstComponent({
  from,
  count = DEFAULT_COUNT,
  particleImages,
  particleSize = 24,
  colors,
  spread = DEFAULT_SPREAD,
  duration = DEFAULT_DURATION_MS,
  onComplete,
}: CollectionEffectProps) {
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

  useEffect(() => {
    const cleanup = setTimeout(() => setAlive(false), duration + CLEANUP_BUFFER_MS)
    return () => clearTimeout(cleanup)
  }, [duration])

  // CSS variant uses setTimeout for onComplete (Framer variant uses onAnimationComplete callback).
  // Timing is approximate — includes a 50ms buffer for animation settle.
  useEffect(() => {
    if (onComplete === undefined) return
    const maxDelay = particles.reduce((max, p) => Math.max(max, p.delay), 0)
    const timer = setTimeout(onComplete, maxDelay + duration + 50)
    return () => clearTimeout(timer)
  }, [particles, duration, onComplete])

  return (
    <div
      ref={containerRef}
      className="pf-coin-burst"
      data-animation-id="collection-effects__coin-burst"
      style={{ '--pf-particle-size': `${particleSize}px` } as React.CSSProperties}
    >
      {alive && origin !== null && (
        <div className="pf-coin-burst__stage pf-coin-burst__stage--anticipation" aria-hidden="true">
          <div className="pf-coin-burst__flash" style={{ left: origin.x, top: origin.y }} />
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="pf-coin-burst__particle"
              style={
                {
                  left: origin.x,
                  top: origin.y,
                  animationDelay: `${particle.delay}ms`,
                  animationDuration: `${duration}ms`,
                  '--burst-tx': `${particle.tx}px`,
                  '--burst-ty': `${particle.ty}px`,
                  '--burst-rotation': `${particle.rotation}deg`,
                } as React.CSSProperties
              }
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
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const CollectionEffectsCoinBurst = memo(CollectionEffectsCoinBurstComponent)
