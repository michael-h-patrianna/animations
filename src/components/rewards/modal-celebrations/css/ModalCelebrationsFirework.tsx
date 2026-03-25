/**
 * Endless firework overlay — infinite burst waves with images or confetti fallbacks — CSS variant.
 *
 * Copy-paste files: this file + ModalCelebrationsFirework.css + ../fireworkModel.ts + ../SharedCelebrationTypes.ts + ../utils.ts + ../shared.css + firework-particle-1.webp + firework-particle-2.webp + firework-particle-3.webp
 * Runtime deps: react
 */

import { memo, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import './ModalCelebrationsFirework.css'

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
import { CONFETTI_SHAPES, pickRandom, type ConfettiShape } from '@/components/rewards/modal-celebrations/utils'

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
  const hasImages = particleImages.length > 0
  const variantCount = hasImages ? particleImages.length : colors.length
  const cycleDurationS = duration / 1000
  // Single-burst visual duration is ~60% of the cycle (matches keyframe at 60%)
  const burstDurationS = cycleDurationS * 0.6

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

  return (
    <div className="mc-firework mc-firework--css" data-animation-id="modal-celebrations__firework">
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
                <span
                  key={particle.id}
                  className="mc-firework__particle"
                  style={
                    {
                      '--fw-x': `${particle.x}px`,
                      '--fw-y': `${particle.y}px`,
                      '--fw-rotation': `${particle.rotation}deg`,
                      '--fw-scale': String(particle.scale),
                      '--fw-duration': `${burstDurationS}s`,
                      '--fw-cycle-duration': `${cycleDurationS}s`,
                      '--fw-gravity-distance': `${FIREWORK_GRAVITY_DISTANCE_PX}px`,
                      '--fw-delay': `${burst.delay + particle.delay}s`,
                      width: `${particleMaxWidth}px`,
                      height: `${particleMaxHeight}px`,
                    } as CSSProperties
                  }
                >
                  {hasImages ? (
                    <img
                      className="mc-firework__particle-image"
                      src={particleImages[particle.imageIndex % particleImages.length]}
                      alt=""
                    />
                  ) : (
                    <span
                      className={`pf-celebration__confetti pf-celebration__confetti--${wave.fallbacks![bi]![pi]!.shape}`}
                      style={{
                        display: 'block',
                        width: '100%',
                        height: '100%',
                        background: wave.fallbacks![bi]![pi]!.color,
                      }}
                    />
                  )}
                </span>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export const ModalCelebrationsFirework = memo(ModalCelebrationsFireworkComponent)
