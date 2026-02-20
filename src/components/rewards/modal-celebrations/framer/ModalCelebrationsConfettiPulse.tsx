import * as m from 'motion/react-m'
import { easeOut } from 'motion/react'
import { useMemo } from 'react'

const confettiColors = ['var(--pf-anim-firework-pink)', 'var(--pf-anim-green)', 'var(--pf-anim-firework-cyan)', 'var(--pf-anim-firework-gold)', 'var(--pf-base-50)']

const randBetween = (min: number, max: number): number => {
  return Math.random() * (max - min) + min
}

/**
 *
 */
export function ModalCelebrationsConfettiPulse() {
  const pulses = useMemo(
    () =>
      Array.from({ length: 3 }, (_, i) => ({
        id: i,
        delay: i * 0.18,
        color: confettiColors[i % confettiColors.length],
        duration: 1.4,
      })),
    []
  )

  const confettiParticles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => {
        const tx = randBetween(-120, 120)
        const ty = randBetween(-160, -60)
        const rot = randBetween(-220, 220)
        const delay = 0.45 + i * 0.02
        const duration = 0.78

        return {
          id: i,
          color: confettiColors[i % confettiColors.length],
          tx,
          ty,
          rot,
          delay,
          duration,
        }
      }),
    []
  )

  return (
    <div className="pf-celebration">
      <div className="pf-celebration__layer">
        {/* Pulse rings */}
        {pulses.map((pulse) => (
          <m.span
            key={pulse.id}
            className="pf-celebration__pulse"
            style={{
              borderColor: pulse.color,
            }}
            initial={{
              scale: 0.3,
              opacity: 0.8,
            }}
            animate={{
              scale: [0.3, 2.5],
              opacity: [0.8, 0],
            }}
            transition={{
              duration: pulse.duration,
              delay: pulse.delay,
              ease: easeOut,
            }}
          />
        ))}

        {/* Confetti particles */}
        {confettiParticles.map((particle) => (
          <m.span
            key={particle.id}
            className="pf-celebration__confetti"
            style={{
              left: '50%',
              top: '55%',
              background: particle.color,
            }}
            initial={{
              x: 0,
              y: 0,
              scale: 0.6,
              rotate: 0,
              opacity: 0,
            }}
            animate={{
              x: particle.tx,
              y: particle.ty,
              scale: 1,
              rotate: particle.rot,
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              ease: easeOut,
              times: [0, 0.2, 0.8, 1],
            }}
          />
        ))}
      </div>
    </div>
  )
}
