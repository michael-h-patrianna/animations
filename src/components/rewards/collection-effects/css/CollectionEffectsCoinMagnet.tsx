/**
 * Particles fly along parabolic arcs from source to target — CSS variant.
 *
 * Copy-paste files: this file + CollectionEffectsCoinMagnet.css + SharedTypes.ts +
 * SharedParticleUtils.ts + SharedFallbackParticle.tsx + SharedImagePreloader.ts
 * Runtime deps: react
 */

import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import './CollectionEffectsCoinMagnet.css'

import { FallbackParticle } from '../SharedFallbackParticle'
import { generateFallbackParticle, type ConfettiShape } from '../SharedParticleUtils'
import { useImagePreloader } from '../SharedImagePreloader'
import {
  clampImages,
  containerCenter,
  pointsAreEqual,
  randomImage,
  resolvePointRelative,
  type CollectionEffectProps,
  type ResolvedPoint,
} from '../SharedTypes'

const DEFAULT_COUNT = 10
const DEFAULT_SPREAD = 80
const DEFAULT_DURATION_MS = 1000
const PARTICLE_SIZE = 36
const CLEANUP_BUFFER_MS = 400
const OVERSHOOT_FACTOR = 0.08
const ARC_HEIGHT_FACTOR = 0.25

interface Particle {
  id: number
  startOffsetX: number
  startOffsetY: number
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
  return Array.from({ length: count }, (_, i) => {
    const angle = Math.random() * Math.PI * 2
    const dist = Math.random() * spread
    const t = i / Math.max(count - 1, 1)
    const delay = t * t * 600
    return {
      id: i,
      startOffsetX: Math.cos(angle) * dist,
      startOffsetY: Math.sin(angle) * dist,
      rotation: (Math.random() - 0.5) * 30,
      delay,
      imageSrc: randomImage(images),
      fallback: generateFallbackParticle(colors),
    }
  })
}

function computeArc(
  startX: number,
  startY: number,
  targetX: number,
  targetY: number
) {
  const dx = targetX - startX
  const dy = targetY - startY
  const dist = Math.sqrt(dx * dx + dy * dy)
  const perpX = (-dy / (dist === 0 ? 1 : dist)) * dist * ARC_HEIGHT_FACTOR
  const perpY = (dx / (dist === 0 ? 1 : dist)) * dist * ARC_HEIGHT_FACTOR
  return {
    midX: startX + dx * 0.5 + perpX,
    midY: startY + dy * 0.5 + perpY,
    overshootX: targetX + dx * OVERSHOOT_FACTOR,
    overshootY: targetY + dy * OVERSHOOT_FACTOR,
  }
}

function CollectionEffectsCoinMagnetComponent({
  from,
  to,
  count = DEFAULT_COUNT,
  particleImages,
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

  const isBurst = pointsAreEqual(fromPt, toPt)

  const cleanupMs = duration + CLEANUP_BUFFER_MS + particles.length * 60
  useEffect(() => {
    const cleanup = setTimeout(() => setAlive(false), cleanupMs)
    return () => clearTimeout(cleanup)
  }, [cleanupMs])

  const handleComplete = useCallback(() => {
    onComplete?.()
  }, [onComplete])

  useEffect(() => {
    if (onComplete === undefined) return
    const maxDelay = particles.reduce((max, p) => Math.max(max, p.delay), 0)
    const timer = setTimeout(handleComplete, maxDelay + duration + 50)
    return () => clearTimeout(timer)
  }, [particles, duration, handleComplete, onComplete])

  return (
    <div
      ref={containerRef}
      className="pf-coin-magnet"
      data-animation-id="collection-effects__coin-magnet"
    >
      {alive && fromPt !== null && toPt !== null && (
        <div className="pf-coin-magnet__stage" aria-hidden="true">
          {!isBurst && (
            <div
              className="pf-coin-magnet__arrival-flash"
              style={{ left: toPt.x, top: toPt.y }}
            />
          )}
          {particles.map((particle) => {
            const startX = fromPt.x + particle.startOffsetX
            const startY = fromPt.y + particle.startOffsetY

            if (isBurst) {
              // Burst mode: radiate outward from origin
              const burstDist = 80 + Math.random() * 60
              const burstAngle = Math.atan2(particle.startOffsetY, particle.startOffsetX)
              const burstTx = Math.cos(burstAngle) * burstDist
              const burstTy = Math.sin(burstAngle) * burstDist
              return (
                <div
                  key={particle.id}
                  className="pf-coin-magnet__particle pf-coin-magnet__particle--burst"
                  style={
                    {
                      left: fromPt.x,
                      top: fromPt.y,
                      animationDelay: `${particle.delay}ms`,
                      animationDuration: `${duration}ms`,
                      '--burst-tx': `${burstTx}px`,
                      '--burst-ty': `${burstTy}px`,
                    } as React.CSSProperties
                  }
                >
                  {particle.imageSrc ? (
                    <img src={particle.imageSrc} alt="" className="pf-coin-magnet__particle-image" />
                  ) : (
                    <FallbackParticle shape={particle.fallback.shape} color={particle.fallback.color} size={PARTICLE_SIZE} />
                  )}
                </div>
              )
            }

            // Normal mode: arc flight from start to target
            const arc = computeArc(startX, startY, toPt.x, toPt.y)
            return (
              <div
                key={particle.id}
                className="pf-coin-magnet__particle pf-coin-magnet__particle--flight"
                style={
                  {
                    animationDelay: `${particle.delay}ms`,
                    animationDuration: `${duration}ms`,
                    '--start-x': `${startX}px`,
                    '--start-y': `${startY}px`,
                    '--mid-x': `${arc.midX}px`,
                    '--mid-y': `${arc.midY}px`,
                    '--overshoot-x': `${arc.overshootX}px`,
                    '--overshoot-y': `${arc.overshootY}px`,
                    '--target-x': `${toPt.x}px`,
                    '--target-y': `${toPt.y}px`,
                    '--rotation': `${particle.rotation}deg`,
                  } as React.CSSProperties
                }
              >
                {particle.imageSrc ? (
                  <img src={particle.imageSrc} alt="" className="pf-coin-magnet__particle-image" />
                ) : (
                  <FallbackParticle shape={particle.fallback.shape} color={particle.fallback.color} size={PARTICLE_SIZE} />
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export const CollectionEffectsCoinMagnet = memo(CollectionEffectsCoinMagnetComponent)
