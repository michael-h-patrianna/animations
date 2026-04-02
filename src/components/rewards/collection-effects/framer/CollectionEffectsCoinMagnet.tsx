/**
 * Source emits particles, target attracts them like a magnet.
 *
 * Visual narrative:
 * 1. Emission (0-12%): particles burst FROM the source outward
 * 2. Hover (12-25%): particles hang momentarily — magnetic field grips them
 * 3. Pull (25-92%): particles accelerate along smooth bezier curves toward target
 * 4. Impact (92-100%): particles shrink to zero and disappear at the target
 *
 * Copy-paste files: this file + SharedTypes.ts + SharedParticleUtils.ts +
 * SharedFallbackParticle.tsx + SharedImagePreloader.ts
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import styles from './CollectionEffectsCoinMagnet.module.css'
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

const DEFAULT_COUNT = 10
const DEFAULT_SPREAD = 60
const DEFAULT_DURATION_S = 1.333
const CLEANUP_BUFFER_MS = 500
const WAYPOINTS = 20
const HOVER_END = 0.25
const IMPACT_START = 0.95
const ARRIVAL_FLASH_DELAY_RATIO = 0.8

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
    delay: i * 0.05,
    imageSrc: randomImage(images),
    fallback: generateFallbackParticle(colors),
  }))
}

/**
 * Samples a cubic bezier from `start` to `end` into WAYPOINTS+1 positions.
 * The parametric easing (t²) bakes magnetic acceleration into the waypoint spacing:
 * positions are close together at the start (slow) and spread apart near the end (fast).
 * Motion animates through these at linear time intervals, producing the acceleration visually.
 */
function sampleBezierPath(
  start: ResolvedPoint,
  end: ResolvedPoint,
  curvature: number
): { xPath: number[]; yPath: number[] } {
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

  const xPath: number[] = []
  const yPath: number[] = []

  for (let i = 0; i <= WAYPOINTS; i++) {
    const linear = i / WAYPOINTS
    const t = linear * linear // Match the CSS variant's quadratic pull acceleration.
    const mt = 1 - t
    xPath.push(
      mt * mt * mt * start.x + 3 * mt * mt * t * cp1x + 3 * mt * t * t * cp2x + t * t * t * end.x
    )
    yPath.push(
      mt * mt * mt * start.y + 3 * mt * mt * t * cp1y + 3 * mt * t * t * cp2y + t * t * t * end.y
    )
  }

  return { xPath, yPath }
}

function ArrivalFlash({ target, delayS }: { target: ResolvedPoint; delayS: number }) {
  return (
    <m.div
      className={styles['pf-coin-magnet-fm__arrival-flash']}
      style={{ left: target.x, top: target.y }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1.2, 1.8], opacity: [0, 0.7, 0] }}
      transition={{ duration: 0.5, delay: delayS, times: [0, 0.4, 1], ease: 'easeOut' }}
    />
  )
}

function ParticleElement({
  particle,
  fromPt,
  targetPt,
  particleSize,
  isBurst,
  durationS,
  onFinish,
}: {
  particle: Particle
  fromPt: ResolvedPoint
  targetPt: ResolvedPoint
  particleSize: number
  isBurst: boolean
  durationS: number
  onFinish?: () => void
}) {
  // Scattered position after emission burst
  const scatterX = fromPt.x + Math.cos(particle.emitAngle) * particle.emitDist
  const scatterY = fromPt.y + Math.sin(particle.emitAngle) * particle.emitDist

  const particleContent = particle.imageSrc ? (
    <img src={particle.imageSrc} alt="" className={styles['pf-coin-magnet-fm__particle-image']} />
  ) : (
    <FallbackParticle
      shape={particle.fallback.shape}
      color={particle.fallback.color}
      size={particleSize}
    />
  )

  if (isBurst) {
    // No target — just emit outward and fade
    return (
      <m.div
        className={styles['pf-coin-magnet-fm__particle']}
        style={{ left: fromPt.x, top: fromPt.y }}
        initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
        animate={{
          x: [0, 0, Math.cos(particle.emitAngle) * particle.emitDist],
          y: [0, 0, Math.sin(particle.emitAngle) * particle.emitDist],
          scale: [0, 1, 0.4],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: durationS * 0.6,
          delay: particle.delay,
          times: [0, 0.15, 1],
          ease: [0.2, 0.8, 0.3, 1] as const,
        }}
        onAnimationComplete={onFinish}
        aria-hidden="true"
      >
        {particleContent}
      </m.div>
    )
  }

  // Sample the pull curve (scattered position → target)
  const scatter = { x: scatterX, y: scatterY }
  const { xPath, yPath } = sampleBezierPath(scatter, targetPt, particle.curvature)

  // Build full path: source → scattered → pull curve → hold at target for impact.
  // Phases match CSS: emit (0→0.12), hover (0.12→0.25), pull (0.25→0.95), impact (0.95→1).
  const fullX = [fromPt.x, fromPt.x, fromPt.x, scatterX, scatterX, ...xPath, targetPt.x]
  const fullY = [fromPt.y, fromPt.y, fromPt.y, scatterY, scatterY, ...yPath, targetPt.y]
  const pullRange = IMPACT_START - HOVER_END
  const fullTimes = [
    0,
    0.03,
    0.05,
    0.12,
    HOVER_END,
    ...Array.from({ length: WAYPOINTS + 1 }, (_, i) => HOVER_END + (i / WAYPOINTS) * pullRange),
    1,
  ]

  return (
    <m.div
      className={styles['pf-coin-magnet-fm__particle']}
      style={{ left: 0, top: 0 }}
      initial={{ x: fromPt.x, y: fromPt.y, scale: 0, opacity: 0 }}
      animate={{
        x: fullX,
        y: fullY,
        scale: [0, 0, 1, 0.3, 0],
        opacity: [0, 0, 1, 1, 0],
      }}
      transition={{
        x: {
          duration: durationS,
          delay: particle.delay,
          times: fullTimes,
          ease: 'linear',
        },
        y: {
          duration: durationS,
          delay: particle.delay,
          times: fullTimes,
          ease: 'linear',
        },
        scale: {
          duration: durationS,
          delay: particle.delay,
          times: [0, 0.03, 0.05, IMPACT_START, 1],
          ease: 'linear',
        },
        opacity: {
          duration: durationS,
          delay: particle.delay,
          times: [0, 0.03, 0.05, IMPACT_START, 1],
          ease: 'linear',
        },
      }}
      onAnimationComplete={onFinish}
      aria-hidden="true"
    >
      {particleContent}
    </m.div>
  )
}

function CollectionEffectsCoinMagnetComponent({
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
  const prefersReducedMotion = useReducedMotion()
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

  const maxDelay = particles.length > 0 ? particles[particles.length - 1]!.delay * 1000 : 0
  const cleanupMs = durationS * 1000 + CLEANUP_BUFFER_MS + maxDelay
  useEffect(() => {
    const cleanup = setTimeout(() => setAlive(false), cleanupMs)
    return () => clearTimeout(cleanup)
  }, [cleanupMs])

  const lastParticleId = particles.length > 0 ? particles[particles.length - 1]!.id : -1

  // Reduced motion: skip particle animation, fire onComplete immediately
  useEffect(() => {
    if (prefersReducedMotion && onComplete) onComplete()
  }, [prefersReducedMotion, onComplete])

  if (prefersReducedMotion) {
    return (
      <div
        ref={containerRef}
        className={styles['pf-coin-magnet-fm']}
        data-animation-id="collection-effects__coin-magnet"
      />
    )
  }

  return (
    <div
      ref={containerRef}
      className={styles['pf-coin-magnet-fm']}
      data-animation-id="collection-effects__coin-magnet"
      style={{ '--pf-particle-size': `${particleSize}px` } as React.CSSProperties}
    >
      {alive && fromPt !== null && toPt !== null && (
        <div className={styles['pf-coin-magnet-fm__stage']} aria-hidden="true">
          {!isBurst && (
            <ArrivalFlash target={toPt} delayS={durationS * ARRIVAL_FLASH_DELAY_RATIO} />
          )}
          {particles.map((particle) => (
            <ParticleElement
              key={particle.id}
              particle={particle}
              fromPt={fromPt}
              targetPt={toPt}
              particleSize={particleSize}
              isBurst={isBurst}
              durationS={durationS}
              onFinish={particle.id === lastParticleId ? onComplete : undefined}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export const CollectionEffectsCoinMagnet = memo(CollectionEffectsCoinMagnetComponent)
