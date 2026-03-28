/**
 * "Claim reward" particle trail — CSS variant.
 *
 * Copy-paste files: this file + CollectionEffectsCoinTrail.css + SharedTypes.ts +
 * SharedParticleUtils.ts + SharedFallbackParticle.tsx + SharedImagePreloader.ts
 * Runtime deps: react
 */

import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import styles from './CollectionEffectsCoinTrail.module.css'

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
const DEFAULT_SPREAD = 50
const DEFAULT_DURATION_MS = 1000
const CLEANUP_BUFFER_MS = 400

interface Particle {
  id: number
  delay: number
  apexOffsetX: number
  imageSrc: string | undefined
  fallback: { shape: ConfettiShape; color: string }
}

function generateParticles(count: number, images: string[], colors?: string[]): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    delay: i * 70,
    apexOffsetX: (Math.random() - 0.5) * 20,
    imageSrc: randomImage(images),
    fallback: generateFallbackParticle(colors),
  }))
}

function CollectionEffectsCoinTrailComponent({
  from,
  to,
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

  const isSwirl = pointsAreEqual(fromPt, toPt)

  const cleanupMs = duration + CLEANUP_BUFFER_MS + count * 70
  useEffect(() => {
    const cleanup = setTimeout(() => setAlive(false), cleanupMs)
    return () => clearTimeout(cleanup)
  }, [cleanupMs])

  useEffect(() => {
    if (onComplete === undefined) return
    const maxDelay = particles.reduce((max, p) => Math.max(max, p.delay), 0)
    const timer = setTimeout(onComplete, maxDelay + duration + 50)
    return () => clearTimeout(timer)
  }, [particles, duration, onComplete])

  return (
    <div
      ref={containerRef}
      className={styles['pf-coin-trail']}
      data-animation-id="collection-effects__coin-trail"
      style={{ '--pf-particle-size': `${particleSize}px` } as React.CSSProperties}
    >
      {alive && fromPt !== null && toPt !== null && (
        <div className={styles['pf-coin-trail__stage']} aria-hidden="true">
          {particles.map((particle) => {
            if (isSwirl) {
              const swirlAngle = (particle.id / count) * Math.PI * 2
              const swirlTx = Math.cos(swirlAngle) * 50
              const swirlTy = Math.sin(swirlAngle) * 50
              return (
                <div
                  key={particle.id}
                  className={`${styles['pf-coin-trail__particle']} ${styles['pf-coin-trail__particle--swirl']}`}
                  style={
                    {
                      left: fromPt.x,
                      top: fromPt.y,
                      animationDelay: `${particle.delay}ms`,
                      animationDuration: `${duration}ms`,
                      '--swirl-tx': `${swirlTx}px`,
                      '--swirl-ty': `${swirlTy}px`,
                    } as React.CSSProperties
                  }
                >
                  {particle.imageSrc ? (
                    <img
                      src={particle.imageSrc}
                      alt=""
                      className={styles['pf-coin-trail__particle-image']}
                    />
                  ) : (
                    <FallbackParticle
                      shape={particle.fallback.shape}
                      color={particle.fallback.color}
                      size={particleSize}
                    />
                  )}
                </div>
              )
            }

            // "Claim reward" CSS animation: pop up → hang → accelerate to target
            const apexX = fromPt.x + particle.apexOffsetX
            const apexY = fromPt.y - spread
            return (
              <div
                key={particle.id}
                className={`${styles['pf-coin-trail__particle']} ${styles['pf-coin-trail__particle--claim']}`}
                style={
                  {
                    left: 0,
                    top: 0,
                    animationDelay: `${particle.delay}ms`,
                    animationDuration: `${duration}ms`,
                    '--from-x': `${fromPt.x}px`,
                    '--from-y': `${fromPt.y}px`,
                    '--apex-x': `${apexX}px`,
                    '--apex-y': `${apexY}px`,
                    '--to-x': `${toPt.x}px`,
                    '--to-y': `${toPt.y}px`,
                  } as React.CSSProperties
                }
              >
                {particle.imageSrc ? (
                  <img
                    src={particle.imageSrc}
                    alt=""
                    className={styles['pf-coin-trail__particle-image']}
                  />
                ) : (
                  <FallbackParticle
                    shape={particle.fallback.shape}
                    color={particle.fallback.color}
                    size={particleSize}
                  />
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export const CollectionEffectsCoinTrail = memo(CollectionEffectsCoinTrailComponent)
