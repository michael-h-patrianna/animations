/**
 * Endless firework overlay — infinite repeating burst waves with particle images or confetti fallbacks.
 *
 * Copy-paste files: this file + ../fireworkModel.ts + ../SharedCelebrationTypes.ts + ../utils.ts + firework-particle-1.webp + firework-particle-2.webp + firework-particle-3.webp
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, useEffect, useMemo, useRef, useState } from 'react'

import modalCelebrationsFireworkParticle1Image from '@/assets/modal-celebrations/firework-particle-1.webp'
import modalCelebrationsFireworkParticle2Image from '@/assets/modal-celebrations/firework-particle-2.webp'
import modalCelebrationsFireworkParticle3Image from '@/assets/modal-celebrations/firework-particle-3.webp'
import { CELEBRATION_COLORS_HEX } from '@/components/rewards/modal-celebrations/SharedCelebrationTypes'
import {
  FIREWORK_DEFAULT_BURST_COUNT,
  FIREWORK_DEFAULT_DURATION_MS,
  FIREWORK_DEFAULT_PARTICLES_PER_BURST,
  FIREWORK_GRAVITY_DISTANCE_PX,
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

/* ─── Props ─── */

interface ModalCelebrationsFireworkProps {
  /** Image URLs for particles. Defaults to bundled firework particle images. Falls back to colored confetti shapes when set to empty array. */
  particleImages?: string[]
  /** Maximum width in pixels for particles. @default 24 */
  particleMaxWidth?: number
  /** Maximum height in pixels for particles. @default 24 */
  particleMaxHeight?: number
  /** Fallback confetti colors when no images provided. */
  colors?: readonly string[]
  /** Number of burst origin points per cycle. Default 5. */
  burstCount?: number
  /** Particles emitted per burst. Default 50. */
  particlesPerBurst?: number
  /** Total cycle duration in ms before the wave repeats. Default 2500. */
  duration?: number
}

/* ─── Fallback shape cache ─── */

type FallbackInfo = { shape: ConfettiShape; color: string }

function buildFallbackCache(count: number, colors: readonly string[]): FallbackInfo[] {
  return Array.from({ length: count }, () => ({
    shape: pickRandom(CONFETTI_SHAPES),
    color: colors[Math.floor(Math.random() * colors.length)]!,
  }))
}

/* ─── Wave cycling ─── */

type FireworkWave = {
  key: number
  bursts: ReturnType<typeof generateFireworkBursts>
  fallbacks: FallbackInfo[][] | null
  createdAt: number
}

function createWave(
  key: number,
  config: Parameters<typeof generateFireworkBursts>[0],
  hasImages: boolean,
  colors: readonly string[]
): FireworkWave {
  const bursts = generateFireworkBursts(config)
  return {
    key,
    bursts,
    fallbacks: hasImages ? null : bursts.map((b) => buildFallbackCache(b.particles.length, colors)),
    createdAt: Date.now(),
  }
}

/* ─── Main ─── */

const DEFAULT_COLORS = CELEBRATION_COLORS_HEX

function ModalCelebrationsFireworkComponent({
  particleImages = DEFAULT_PARTICLE_IMAGES,
  particleMaxWidth = 24,
  particleMaxHeight = 24,
  colors = DEFAULT_COLORS,
  burstCount = FIREWORK_DEFAULT_BURST_COUNT,
  particlesPerBurst = FIREWORK_DEFAULT_PARTICLES_PER_BURST,
  duration = FIREWORK_DEFAULT_DURATION_MS,
}: ModalCelebrationsFireworkProps) {
  const prefersReducedMotion = useReducedMotion()
  const hasImages = particleImages.length > 0
  const variantCount = hasImages ? particleImages.length : colors.length
  const cycleDurationS = duration / 1000

  const config = useMemo(
    () => ({ burstCount, particlesPerBurst, durationMs: duration, variantCount }),
    [burstCount, particlesPerBurst, duration, variantCount]
  )

  // Wave lifetime: max burst delay + max particle delay + cycle duration
  const baseGap = cycleDurationS * 0.12
  const jitterRange = baseGap * 0.67
  const maxTotalDelay = (burstCount - 1) * baseGap + jitterRange + 0.3
  const waveLifetimeMs = (maxTotalDelay + cycleDurationS) * 1000

  const nextKeyRef = useRef(1)
  const [waves, setWaves] = useState<FireworkWave[]>(() => [
    createWave(0, config, hasImages, colors),
  ])

  useEffect(() => {
    // Reset waves when config changes
    nextKeyRef.current = 1
    setWaves([createWave(0, config, hasImages, colors)])

    const interval = setInterval(() => {
      const key = nextKeyRef.current++
      setWaves((prev) => [
        ...prev.filter((w) => Date.now() - w.createdAt < waveLifetimeMs),
        createWave(key, config, hasImages, colors),
      ])
    }, duration)

    return () => clearInterval(interval)
  }, [config, duration, hasImages, colors, waveLifetimeMs])

  if (prefersReducedMotion) return <div className="mc-firework" data-animation-id="modal-celebrations__firework" />

  return (
    <div className="mc-firework" data-animation-id="modal-celebrations__firework">
      {waves.map((wave) => (
        <div key={wave.key} className="mc-firework__wave">
          {wave.bursts.map((burst, bi) => (
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
                      className={`pf-celebration__confetti pf-celebration__confetti--${wave.fallbacks![bi]![pi]!.shape}`}
                      style={{
                        display: 'block',
                        width: '100%',
                        height: '100%',
                        background: wave.fallbacks![bi]![pi]!.color,
                        animation: 'none',
                      }}
                    />
                  )}
                </m.div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export const ModalCelebrationsFirework = memo(ModalCelebrationsFireworkComponent)
