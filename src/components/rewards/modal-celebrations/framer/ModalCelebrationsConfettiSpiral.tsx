import type { AnimationMetadata } from '@/types/animation'
import { easeOut, motion, useReducedMotion } from 'framer-motion'
import { useMemo } from 'react'
import './ModalCelebrationsConfettiSpiral.css'

const confettiColors = ['#ff5981', '#c6ff77', '#47fff4', '#ffce1a', '#ecc3ff']

// Utility function to generate random number between min and max
const randBetween = (min: number, max: number): number => {
  return Math.random() * (max - min) + min
}

export function ModalCelebrationsConfettiSpiral() {
  const shouldReduceMotion = useReducedMotion()

  const particles = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => {
        const angle = randBetween(0, 360)
        const spin = randBetween(360, 540)
        const radius = randBetween(90, 140)
        const delay = i * 0.018
        const duration = 1.0

        // Calculate the spiral path coordinates
        const endAngleRad = ((angle + spin) * Math.PI) / 180
        const x = Math.cos(endAngleRad) * radius
        const y = Math.sin(endAngleRad) * radius

        return {
          id: i,
          color: confettiColors[i % confettiColors.length],
          angle,
          spin,
          radius,
          delay,
          duration,
          x,
          y,
        }
      }),
    []
  )

  if (shouldReduceMotion) {
    return (
      <div className="pf-celebration">
        <div className="pf-celebration__layer">
          {particles.slice(0, 5).map((particle) => (
            <span
              key={particle.id}
              className="pf-celebration__confetti"
              style={{
                left: '50%',
                top: '50%',
                background: particle.color,
                opacity: 0.6,
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="pf-celebration">
      <div className="pf-celebration__layer">
        {particles.map((particle) => (
          <motion.span
            key={particle.id}
            className="pf-celebration__confetti"
            style={{
              left: '50%',
              top: '50%',
              background: particle.color,
            }}
            initial={{
              rotate: 0,
              x: 0,
              y: 0,
              scale: 0.4,
              opacity: 0
            }}
            animate={{
              rotate: particle.spin,
              x: particle.x,
              y: particle.y,
              scale: 1,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              times: [0, 0.2, 1],
              ease: easeOut,
            }}
          />
        ))}
      </div>
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const metadata = {
  id: 'modal-celebrations__confetti-spiral',
  title: 'Confetti Spiral',
  description: 'Celebration effects pattern: Confetti Spiral',
  tags: ['framer'],
} satisfies AnimationMetadata
