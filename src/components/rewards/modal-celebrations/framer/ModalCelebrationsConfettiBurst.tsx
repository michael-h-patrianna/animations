
import * as m from 'motion/react-m'
import { easeOut } from 'motion/react'
import './ModalCelebrationsConfettiBurst.css'
import '../shared.css'

const confettiColors = ['#ff5981', '#c6ff77', '#47fff4', '#ffce1a', '#ecc3ff']

// Utility function to generate random number between min and max
const randBetween = (min: number, max: number): number => {
  return Math.random() * (max - min) + min
}

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
    <div className="pf-celebration">
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

// eslint-disable-next-line react-refresh/only-export-components

