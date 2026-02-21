
import { easeOut } from 'motion/react'
import * as m from 'motion/react-m'

const confettiColors = ['var(--pf-anim-firework-pink)', 'var(--pf-anim-green)', 'var(--pf-anim-firework-cyan)', 'var(--pf-anim-firework-gold)', 'var(--pf-base-50)']

// Utility function to generate random number between min and max
const randBetween = (min: number, max: number): number => {
  return Math.random() * (max - min) + min
}

/**
 *
 */
export function ModalCelebrationsConfettiBurst() {
const particles = Array.from({ length: 32 }, (_, i) => {
    const tx = randBetween(-160, 160)
    const ty = randBetween(-210, -80)
    const rot = randBetween(-260, 260)
    const delay = i * 0.012
    const duration = randBetween(0.6, 0.9)

    return {
      id: i,
      color: confettiColors[i % confettiColors.length],
      tx,
      ty,
      rot,
      delay,
      duration,
    }
  })
  return (
    <div className="pf-celebration" data-animation-id="modal-celebrations__confetti-burst">
      <div className="pf-celebration__layer">
        {particles.map((particle) => (
          <m.span
            key={particle.id}
            className="pf-celebration__confetti"
            style={{
              left: '50%',
              top: '60%',
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
