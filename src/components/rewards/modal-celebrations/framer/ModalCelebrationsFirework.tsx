/**
 * Staggered firework bursts with particle images or confetti fallbacks.
 *
 * Copy-paste files: this file + ../fireworkModel.ts + ../SharedCelebrationTypes.ts + ../utils.ts + firework-particle-1.webp + firework-particle-2.webp + firework-particle-3.webp
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, useEffect, useMemo, useReducer, useRef } from 'react'

import modalCelebrationsFireworkParticle1Image from '@/assets/modal-celebrations/firework-particle-1.webp'
import modalCelebrationsFireworkParticle2Image from '@/assets/modal-celebrations/firework-particle-2.webp'
import modalCelebrationsFireworkParticle3Image from '@/assets/modal-celebrations/firework-particle-3.webp'
import type { CelebrationBaseProps } from '@/components/rewards/modal-celebrations/SharedCelebrationTypes'
import { CELEBRATION_COLORS_HEX } from '@/components/rewards/modal-celebrations/SharedCelebrationTypes'
import {
  FIREWORK_DEFAULT_BURST_COUNT,
  FIREWORK_DEFAULT_DURATION_MS,
  FIREWORK_DEFAULT_PARTICLES_PER_BURST,
  FIREWORK_GRAVITY_DISTANCE_PX,
  FIREWORK_PARTICLE_MAX_DELAY_S,
  generateFireworkBursts,
} from '@/components/rewards/modal-celebrations/fireworkModel'
import {
  CONFETTI_SHAPES,
  pickRandom,
  type ConfettiShape,
} from '@/components/rewards/modal-celebrations/utils'

/* ─── Defaults ─── */

const DEFAULT_PARTICLE_IMAGES = [
  modalCelebrationsFireworkParticle1Image,
  modalCelebrationsFireworkParticle2Image,
  modalCelebrationsFireworkParticle3Image,
]

const DEFAULT_COLORS = CELEBRATION_COLORS_HEX

/* ─── Props ─── */

interface ModalCelebrationsFireworkProps extends CelebrationBaseProps {
  /** Number of burst origin points. Default 5. */
  burstCount?: number
  /** Particles emitted per burst. Default 50. */
  particlesPerBurst?: number
}

/* ─── Fallback shape cache ─── */

type FallbackInfo = { shape: ConfettiShape; color: string }

function buildFallbackCache(count: number, colors: readonly string[]): FallbackInfo[] {
  return Array.from({ length: count }, () => ({
    shape: pickRandom(CONFETTI_SHAPES),
    color: colors[Math.floor(Math.random() * colors.length)]!,
  }))
}

/* ─── Main ─── */

function ModalCelebrationsFireworkComponent({
  particleImages = DEFAULT_PARTICLE_IMAGES,
  particleMaxWidth = 24,
  particleMaxHeight = 24,
  colors = DEFAULT_COLORS,
  burstCount = FIREWORK_DEFAULT_BURST_COUNT,
  particlesPerBurst = FIREWORK_DEFAULT_PARTICLES_PER_BURST,
  duration = FIREWORK_DEFAULT_DURATION_MS,
  onComplete,
}: ModalCelebrationsFireworkProps) {
  const prefersReducedMotion = useReducedMotion()
  const hasImages = particleImages.length > 0
  const variantCount = hasImages ? particleImages.length : colors.length
  const cycleDurationS = duration / 1000

  const bursts = useMemo(
    () =>
      generateFireworkBursts({ burstCount, particlesPerBurst, durationMs: duration, variantCount }),
    [burstCount, particlesPerBurst, duration, variantCount]
  )

  const fallbacks = useMemo(
    () => (hasImages ? null : bursts.map((b) => buildFallbackCache(b.particles.length, colors))),
    [hasImages, bursts, colors]
  )

  // Burst completion threshold: burst.delay + max particle stagger + cycle duration.
  // Bursts past this threshold are invisible (opacity 0, scale 0) and can be unmounted.
  const burstEndBufferS = FIREWORK_PARTICLE_MAX_DELAY_S + cycleDurationS

  // Periodic re-render to unmount completed bursts.
  // With high burstCount (e.g. 20 × 50 = 1000 particles), early bursts finish
  // long before late ones start. This tick removes completed 50-particle groups
  // every 500ms, keeping active Motion instances proportional to visible bursts.
  const [cleanupNow, tickCleanup] = useReducer(() => Date.now(), 0)
  const mountedAtRef = useRef(0)

  useEffect(() => {
    mountedAtRef.current = Date.now()
    const id = setInterval(tickCleanup, 500)
    return () => clearInterval(id)
  }, [bursts])

  // Fire onComplete after the last particle finishes
  useEffect(() => {
    if (onComplete === undefined) return
    const maxTime = Math.max(
      ...bursts.map((b) => b.delay + FIREWORK_PARTICLE_MAX_DELAY_S + cycleDurationS)
    )
    const timer = setTimeout(onComplete, maxTime * 1000 + 50)
    return () => clearTimeout(timer)
  }, [bursts, cycleDurationS, onComplete])

  useEffect(() => {
    if (prefersReducedMotion && onComplete) onComplete()
  }, [prefersReducedMotion, onComplete])

  if (prefersReducedMotion) {
    return <div className="mc-firework" data-animation-id="modal-celebrations__firework" />
  }

  return (
    <div className="mc-firework" data-animation-id="modal-celebrations__firework">
      {bursts.map((burst, bi) => {
        // Unmount bursts whose particles have all reached opacity 0 / scale 0
        if (cleanupNow > mountedAtRef.current + (burst.delay + burstEndBufferS) * 1000 + 100)
          return null

        return (
          <div
            key={burst.id}
            className="mc-firework__burst"
            style={{
              left: `${burst.posX}%`,
              top: `${burst.posY}%`,
            }}
          >
            {burst.particles.map((particle, pi) => (
              <m.div
                key={particle.id}
                className="mc-firework__particle"
                style={{ width: particleMaxWidth, height: particleMaxHeight, animation: 'none' }}
                initial={{
                  x: 0,
                  y: 0,
                  rotate: 0,
                  scale: 0,
                  opacity: 0,
                }}
                animate={{
                  x: [
                    0,
                    0,
                    particle.x,
                    particle.x + particle.x * 0.4,
                    particle.x + particle.x * 0.55,
                  ],
                  y: [
                    0,
                    0,
                    particle.y,
                    particle.y + FIREWORK_GRAVITY_DISTANCE_PX * 0.7,
                    particle.y + FIREWORK_GRAVITY_DISTANCE_PX,
                  ],
                  rotate: [
                    0,
                    0,
                    particle.rotation,
                    particle.rotation + 180,
                    particle.rotation + 180,
                  ],
                  scale: [0, 0, particle.scale, particle.scale * 0.5, 0],
                  opacity: [0, 1, 1, 0, 0],
                }}
                transition={{
                  duration: cycleDurationS,
                  delay: burst.delay + particle.delay,
                  times: [0, 0.08, 0.6, 0.84, 1],
                  ease: ['easeOut', 'easeOut', 'easeIn', 'linear'],
                }}
              >
                {hasImages ? (
                  <img
                    src={particleImages[particle.imageIndex % particleImages.length]}
                    alt=""
                    style={{
                      maxWidth: particleMaxWidth,
                      maxHeight: particleMaxHeight,
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                ) : (
                  <span
                    className={`pf-celebration__confetti pf-celebration__confetti--${fallbacks![bi]![pi]!.shape}`}
                    style={{
                      display: 'block',
                      width: '100%',
                      height: '100%',
                      background: fallbacks![bi]![pi]!.color,
                      animation: 'none',
                    }}
                  />
                )}
              </m.div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

export const ModalCelebrationsFirework = memo(ModalCelebrationsFireworkComponent)
