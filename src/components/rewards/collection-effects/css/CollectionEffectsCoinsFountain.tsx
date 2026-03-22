/**
 * Particle fountain erupting upward — CSS variant.
 *
 * Copy-paste files: this file + CollectionEffectsCoinsFountain.css + SharedTypes.ts +
 * SharedParticleUtils.ts + SharedFallbackParticle.tsx + SharedImagePreloader.ts
 * Runtime deps: react
 */

import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import './CollectionEffectsCoinsFountain.css'

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

const DEFAULT_COUNT = 12
const DEFAULT_SPREAD = 160
const DEFAULT_DURATION_MS = 1200
const PARTICLE_SIZE = 24
const CLEANUP_BUFFER_MS = 400
const HORIZONTAL_SPREAD = 80

const randBetween = (min: number, max: number) => Math.random() * (max - min) + min

interface Particle {
  id: number
  tx: number
  tyApex: number
  tyFall: number
  txFall: number
  delay: number
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
    const heightMul = isBg ? 0.7 : 1
    return {
      id: i,
      tx: randBetween(-HORIZONTAL_SPREAD, HORIZONTAL_SPREAD) * (isBg ? 0.6 : 1),
      tyApex: -(spread * (0.7 + Math.random() * 0.3)) * heightMul,
      tyFall: randBetween(10, 40),
      txFall: randBetween(-20, 20),
      delay: i * 40,
      layer: isBg ? 'bg' : 'fg',
      imageSrc: randomImage(images),
      fallback: generateFallbackParticle(colors),
    }
  })
}

function CollectionEffectsCoinsFountainComponent({
  from,
  to: _to,
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

  const cleanupMs = duration + CLEANUP_BUFFER_MS + count * 40
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
      className="pf-coins-fountain"
      data-animation-id="collection-effects__coins-fountain"
    >
      {alive && origin !== null && (
        <div className="pf-coins-fountain__stage" aria-hidden="true">
          <div
            className="pf-coins-fountain__flash"
            style={{ left: origin.x, top: origin.y }}
          />
          {particles.map((particle) => {
            const isBg = particle.layer === 'bg'
            return (
              <div
                key={particle.id}
                className={`pf-coins-fountain__particle${isBg ? ' pf-coins-fountain__particle--bg' : ''}`}
                style={
                  {
                    left: origin.x,
                    top: origin.y,
                    animationDelay: `${particle.delay}ms`,
                    animationDuration: `${duration}ms`,
                    '--fountain-tx': `${particle.tx}px`,
                    '--fountain-ty-apex': `${particle.tyApex}px`,
                    '--fountain-ty-fall': `${particle.tyFall}px`,
                    '--fountain-tx-fall': `${particle.txFall}px`,
                  } as React.CSSProperties
                }
              >
                {particle.imageSrc ? (
                  <img src={particle.imageSrc} alt="" className="pf-coins-fountain__particle-image" />
                ) : (
                  <FallbackParticle
                    shape={particle.fallback.shape}
                    color={particle.fallback.color}
                    size={isBg ? PARTICLE_SIZE * 0.8 : PARTICLE_SIZE}
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

export const CollectionEffectsCoinsFountain = memo(CollectionEffectsCoinsFountainComponent)
