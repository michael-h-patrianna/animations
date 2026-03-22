/**
 * Particles fly along parabolic arcs from source to target with overshoot settle.
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
  pointsAreEqual,
  randomImage,
  resolvePointRelative,
  type CollectionEffectProps,
  type ResolvedPoint,
} from '../SharedTypes'

const DEFAULT_COUNT = 10
const DEFAULT_SPREAD = 80
const DEFAULT_DURATION_S = 1.0
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
  burstDist: number
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
    const delay = t * t * 0.6
    return {
      id: i,
      startOffsetX: Math.cos(angle) * dist,
      startOffsetY: Math.sin(angle) * dist,
      rotation: (Math.random() - 0.5) * 30,
      delay,
      burstDist: 80 + Math.random() * 60,
      imageSrc: randomImage(images),
      fallback: generateFallbackParticle(colors),
    }
  })
}

function computeArc(startX: number, startY: number, targetX: number, targetY: number) {
  const dx = targetX - startX
  const dy = targetY - startY
  const dist = Math.sqrt(dx * dx + dy * dy)
  const safeDist = dist === 0 ? 1 : dist
  const perpX = -dy / safeDist * dist * ARC_HEIGHT_FACTOR
  const perpY = dx / safeDist * dist * ARC_HEIGHT_FACTOR
  return {
    midX: startX + dx * 0.5 + perpX,
    midY: startY + dy * 0.5 + perpY,
    overshootX: targetX + dx * OVERSHOOT_FACTOR,
    overshootY: targetY + dy * OVERSHOOT_FACTOR,
  }
}

function ArrivalFlash({ target }: { target: ResolvedPoint }) {
  return (
    <m.div
      className="pf-coin-magnet__arrival-flash"
      style={{ left: target.x, top: target.y, animation: 'none' }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1.2, 1.8], opacity: [0, 0.6, 0] }}
      transition={{ duration: 0.4, delay: 0.5, times: [0, 0.4, 1], ease: 'easeOut' }}
    />
  )
}

function ParticleElement({
  particle,
  fromPt,
  targetPt,
  isBurst,
  durationS,
  prefersReducedMotion,
  onFinish,
  isLast,
}: {
  particle: Particle
  fromPt: ResolvedPoint
  targetPt: ResolvedPoint
  isBurst: boolean
  durationS: number
  prefersReducedMotion: boolean | null
  onFinish?: () => void
  isLast: boolean
}) {
  const startX = fromPt.x + particle.startOffsetX
  const startY = fromPt.y + particle.startOffsetY

  if (isBurst) {
    const burstAngle = Math.atan2(particle.startOffsetY, particle.startOffsetX)
    const burstTx = Math.cos(burstAngle) * particle.burstDist
    const burstTy = Math.sin(burstAngle) * particle.burstDist
    return (
      <m.div
        className="pf-coin-magnet__particle"
        style={{ left: fromPt.x, top: fromPt.y, animation: 'none' }}
        initial={{ x: 0, y: 0, scale: 0.15, opacity: 0 }}
        animate={{ x: burstTx, y: burstTy, scale: [0.15, 1.15, 0.9, 0.35], opacity: [0, 1, 0.7, 0] }}
        transition={{ duration: durationS, delay: particle.delay, ease: [0.2, 0.8, 0.3, 1] as const, times: [0, 0.15, 0.6, 1] }}
        onAnimationComplete={isLast ? onFinish : undefined}
        aria-hidden="true"
      >
        {particle.imageSrc ? (
          <img src={particle.imageSrc} alt="" className="pf-coin-magnet__particle-image" />
        ) : (
          <FallbackParticle shape={particle.fallback.shape} color={particle.fallback.color} size={PARTICLE_SIZE} />
        )}
      </m.div>
    )
  }

  const arc = computeArc(startX, startY, targetPt.x, targetPt.y)

  return (
    <m.div
      className="pf-coin-magnet__particle"
      style={{ left: 0, top: 0, animation: 'none' }}
      initial={{ x: startX, y: startY, scale: 0.15, rotate: 0, opacity: 0 }}
      animate={
        prefersReducedMotion
          ? {
              x: [startX, targetPt.x],
              y: [startY, targetPt.y],
              scale: [0.15, 1, 0.4],
              opacity: [0, 1, 0],
            }
          : {
              x: [startX, arc.midX, arc.overshootX, targetPt.x, targetPt.x],
              y: [startY, arc.midY, arc.overshootY, targetPt.y, targetPt.y],
              scale: [0.15, 1.1, 1.0, 0.5, 0.3],
              rotate: [0, particle.rotation * 0.5, particle.rotation, particle.rotation, particle.rotation],
              opacity: [0, 1, 1, 0.6, 0],
            }
      }
      transition={
        prefersReducedMotion
          ? { duration: durationS, delay: particle.delay, ease: 'easeOut' as const, times: [0, 1], scale: { times: [0, 0.5, 1] }, opacity: { times: [0, 0.3, 1] } }
          : { duration: durationS, delay: particle.delay, ease: [0.4, 0, 0.2, 1] as const, times: [0, 0.10, 0.45, 0.88, 1], opacity: { times: [0, 0.10, 0.75, 0.92, 1], duration: durationS } }
      }
      onAnimationComplete={isLast ? onFinish : undefined}
      aria-hidden="true"
    >
      {particle.imageSrc ? (
        <img src={particle.imageSrc} alt="" className="pf-coin-magnet__particle-image" />
      ) : (
        <FallbackParticle shape={particle.fallback.shape} color={particle.fallback.color} size={PARTICLE_SIZE} />
      )}
    </m.div>
  )
}

function CollectionEffectsCoinMagnetComponent({
  from,
  to,
  count = DEFAULT_COUNT,
  particleImages,
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

  const [fromPt, setFromPt] = useState<ResolvedPoint | null>(null)
  const [toPt, setToPt] = useState<ResolvedPoint | null>(null)
  const [alive, setAlive] = useState(true)
  const prefersReducedMotion = useReducedMotion()

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

  const cleanupMs = durationS * 1000 + CLEANUP_BUFFER_MS + particles.length * 60
  useEffect(() => {
    const cleanup = setTimeout(() => setAlive(false), cleanupMs)
    return () => clearTimeout(cleanup)
  }, [cleanupMs])

  const handleComplete = useCallback(() => { onComplete?.() }, [onComplete])
  const lastParticleId = particles.length > 0 ? particles[particles.length - 1]!.id : -1

  return (
    <div ref={containerRef} className="pf-coin-magnet" data-animation-id="collection-effects__coin-magnet">
      {alive && fromPt !== null && toPt !== null && (
        <div className="pf-coin-magnet__stage" aria-hidden="true">
          {!isBurst && <ArrivalFlash target={toPt} />}
          {particles.map((particle) => (
            <ParticleElement
              key={particle.id}
              particle={particle}
              fromPt={fromPt}
              targetPt={toPt}
              isBurst={isBurst}
              durationS={durationS}
              prefersReducedMotion={prefersReducedMotion}
              onFinish={particle.id === lastParticleId ? handleComplete : undefined}
              isLast={particle.id === lastParticleId}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export const CollectionEffectsCoinMagnet = memo(CollectionEffectsCoinMagnetComponent)
