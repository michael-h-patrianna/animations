/**
 * Source emits particles, target attracts them like a magnet — CSS variant.
 *
 * Visual narrative matches the framer variant:
 * 1. Emission (0-12%): particles burst FROM the source outward
 * 2. Hover (12-25%): particles hang momentarily — magnetic field grips them
 * 3. Pull (25-92%): particles accelerate along curves toward target
 * 4. Impact (92-100%): particles shrink to zero and disappear at the target
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
const DEFAULT_SPREAD = 60
const DEFAULT_DURATION_MS = 1333
const CLEANUP_BUFFER_MS = 500

interface Particle {
  id: number
  emitAngle: number
  emitDist: number
  curvature: number
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
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    emitAngle: Math.random() * Math.PI * 2,
    emitDist: spread * (0.4 + Math.random() * 0.6),
    curvature: (Math.random() - 0.5) * 2,
    delay: i * 50,
    imageSrc: randomImage(images),
    fallback: generateFallbackParticle(colors),
  }))
}

/**
 * Samples 4 points along the pull bezier curve for CSS keyframe stops.
 * Uses quadratic ease-in (t²) for magnetic acceleration, matching the framer variant.
 */
function samplePullStops(
  start: ResolvedPoint,
  end: ResolvedPoint,
  curvature: number
): { p1: ResolvedPoint; p2: ResolvedPoint; p3: ResolvedPoint; p4: ResolvedPoint } {
  const dx = end.x - start.x
  const dy = end.y - start.y
  const rawDist = Math.sqrt(dx * dx + dy * dy)
  const dist = rawDist === 0 ? 1 : rawDist
  const nx = -dy / dist
  const ny = dx / dist
  const arc = dist * 0.3 * curvature

  const cp1x = start.x + dx * 0.2 + nx * arc
  const cp1y = start.y + dy * 0.2 + ny * arc
  const cp2x = end.x - dx * 0.15 + nx * arc * 0.2
  const cp2y = end.y - dy * 0.15 + ny * arc * 0.2

  function sample(linear: number): ResolvedPoint {
    const t = linear * linear // ease-in
    const mt = 1 - t
    return {
      x:
        mt * mt * mt * start.x + 3 * mt * mt * t * cp1x + 3 * mt * t * t * cp2x + t * t * t * end.x,
      y:
        mt * mt * mt * start.y + 3 * mt * mt * t * cp1y + 3 * mt * t * t * cp2y + t * t * t * end.y,
    }
  }

  return {
    p1: sample(0.3), // early pull — barely moved (ease-in)
    p2: sample(0.55), // mid pull
    p3: sample(0.8), // approaching target
    p4: end, // at target
  }
}

function CollectionEffectsCoinMagnetComponent({
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

  const maxDelay = particles.length > 0 ? particles[particles.length - 1]!.delay : 0
  const cleanupMs = duration + CLEANUP_BUFFER_MS + maxDelay
  useEffect(() => {
    const cleanup = setTimeout(() => setAlive(false), cleanupMs)
    return () => clearTimeout(cleanup)
  }, [cleanupMs])

  const handleComplete = useCallback(() => {
    onComplete?.()
  }, [onComplete])
  useEffect(() => {
    if (onComplete === undefined) return
    const timer = setTimeout(handleComplete, maxDelay + duration + 50)
    return () => clearTimeout(timer)
  }, [maxDelay, duration, handleComplete, onComplete])

  return (
    <div
      ref={containerRef}
      className="pf-coin-magnet"
      data-animation-id="collection-effects__coin-magnet"
      style={{ '--pf-particle-size': `${particleSize}px` } as React.CSSProperties}
    >
      {alive && fromPt !== null && toPt !== null && (
        <div className="pf-coin-magnet__stage" aria-hidden="true">
          {!isBurst && (
            <div
              className="pf-coin-magnet__arrival-flash"
              style={{ left: toPt.x, top: toPt.y, animationDelay: `${duration * 0.8}ms` }}
            />
          )}
          {particles.map((particle) => {
            const scatterX = fromPt.x + Math.cos(particle.emitAngle) * particle.emitDist
            const scatterY = fromPt.y + Math.sin(particle.emitAngle) * particle.emitDist

            if (isBurst) {
              const burstTx = Math.cos(particle.emitAngle) * particle.emitDist
              const burstTy = Math.sin(particle.emitAngle) * particle.emitDist
              return (
                <div
                  key={particle.id}
                  className="pf-coin-magnet__particle pf-coin-magnet__particle--burst"
                  style={
                    {
                      left: fromPt.x,
                      top: fromPt.y,
                      animationDelay: `${particle.delay}ms`,
                      animationDuration: `${duration * 0.6}ms`,
                      '--burst-tx': `${burstTx}px`,
                      '--burst-ty': `${burstTy}px`,
                    } as React.CSSProperties
                  }
                >
                  {particle.imageSrc ? (
                    <img
                      src={particle.imageSrc}
                      alt=""
                      className="pf-coin-magnet__particle-image"
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

            // Magnet mode: sample 4 pull-curve positions
            const scatter = { x: scatterX, y: scatterY }
            const stops = samplePullStops(scatter, toPt, particle.curvature)
            return (
              <div
                key={particle.id}
                className="pf-coin-magnet__particle pf-coin-magnet__particle--magnet"
                style={
                  {
                    left: 0,
                    top: 0,
                    animationDelay: `${particle.delay}ms`,
                    animationDuration: `${duration}ms`,
                    '--src-x': `${fromPt.x}px`,
                    '--src-y': `${fromPt.y}px`,
                    '--scatter-x': `${scatterX}px`,
                    '--scatter-y': `${scatterY}px`,
                    '--pull1-x': `${stops.p1.x}px`,
                    '--pull1-y': `${stops.p1.y}px`,
                    '--pull2-x': `${stops.p2.x}px`,
                    '--pull2-y': `${stops.p2.y}px`,
                    '--pull3-x': `${stops.p3.x}px`,
                    '--pull3-y': `${stops.p3.y}px`,
                    '--target-x': `${stops.p4.x}px`,
                    '--target-y': `${stops.p4.y}px`,
                  } as React.CSSProperties
                }
              >
                {particle.imageSrc ? (
                  <img src={particle.imageSrc} alt="" className="pf-coin-magnet__particle-image" />
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

export const CollectionEffectsCoinMagnet = memo(CollectionEffectsCoinMagnetComponent)
