
import * as m from 'motion/react-m'
import { easeOut } from 'motion/react'
import { useMemo } from 'react'

const confettiColors = ['var(--pf-anim-firework-pink)', 'var(--pf-anim-green)', 'var(--pf-anim-firework-cyan)', 'var(--pf-anim-firework-gold)', 'var(--pf-base-50)']

// Utility function to generate random number between min and max
const randBetween = (min: number, max: number): number => {
  return Math.random() * (max - min) + min
}

/**
 *
 */
export function ModalCelebrationsConfettiRain() {
const particles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => {
        const left = randBetween(10, 90)
        const drift = randBetween(-40, 40)
        const rot = randBetween(-90, 90)
        const delay = randBetween(0, 0.4)
        const duration = 1.2

        return {
          id: i,
          color: confettiColors[i % confettiColors.length],
          left,
          drift,
          rot,
          delay,
          duration,
        }
      }),
    []
  )
  return (
    <div className="pf-celebration" data-animation-id="modal-celebrations__confetti-rain">
      <div className="pf-celebration__layer">
        {particles.map((particle) => (
          <m.span
            key={particle.id}
            className="pf-celebration__confetti"
            style={{
              left: `${particle.left}%`,
              top: '-10%',
              background: particle.color,
            }}
            initial={{ y: -160, x: 0, opacity: 0 }}
            animate={{
              y: [0, 220],
              x: [0, particle.drift],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              times: [0, 0.15, 1],
              ease: easeOut,
            }}
          />
        ))}
      </div>
    </div>
  )
}

