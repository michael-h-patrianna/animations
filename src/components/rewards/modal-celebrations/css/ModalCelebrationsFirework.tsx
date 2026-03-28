/**
 * Staggered firework bursts with particle images or confetti fallbacks — CSS variant.
 *
 * Copy-paste files: this file + ModalCelebrationsFirework.css + ../fireworkModel.ts + ../SharedCelebrationTypes.ts + ../utils.ts + ../shared.css + firework-particle-1.webp + firework-particle-2.webp + firework-particle-3.webp
 * Runtime deps: react
 */

import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import './ModalCelebrationsFirework.css'

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

  // Fire onComplete after the last particle finishes
  useEffect(() => {
    if (onComplete === undefined) return
    const maxTime = Math.max(
      ...bursts.map((b) => b.delay + FIREWORK_PARTICLE_MAX_DELAY_S + cycleDurationS)
    )
    const timer = setTimeout(onComplete, maxTime * 1000 + 50)
    return () => clearTimeout(timer)
  }, [bursts, cycleDurationS, onComplete])

  const containerRef = useRef<HTMLDivElement>(null)
  const [skip, setSkip] = useState(
    () => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  )
  useLayoutEffect(() => {
    if (!skip && containerRef.current?.closest("[data-reduced-motion='reduce']")) setSkip(true)
  }, [skip])
  useEffect(() => {
    if (skip && onComplete) onComplete()
  }, [skip, onComplete])

  if (skip) {
    return <div ref={containerRef} className="mc-firework mc-firework--css" data-animation-id="modal-celebrations__firework" />
  }

  return (
    <div ref={containerRef} className="mc-firework mc-firework--css" data-animation-id="modal-celebrations__firework">
      {bursts.map((burst, bi) => (
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
                  className={`pf-celebration__confetti pf-celebration__confetti--${fallbacks![bi]![pi]!.shape}`}
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    background: fallbacks![bi]![pi]!.color,
                  }}
                />
              )}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

export const ModalCelebrationsFirework = memo(ModalCelebrationsFireworkComponent)
