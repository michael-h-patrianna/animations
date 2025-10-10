import type { AnimationMetadata } from '@/types/animation'
import { easeOut, motion, useReducedMotion } from 'framer-motion'
import '../shared.css'
import './StandardEffectsRadialPulse.css'

export function StandardEffectsRadialPulse() {
  const shouldReduceMotion = useReducedMotion()

  const ringVariants = (delay: number) => ({
    animate: {
      scale: [0.1, 7.5],
      opacity: [0.8, 0.12, 0],
      transition: {
        duration: 2.4,
        ease: easeOut,
        times: [0, 0.7, 1],
        delay,
      },
    },
  })

  if (shouldReduceMotion) {
    return (
      <div className="standard-radial-pulse" role="img" aria-label="Radial pulse">
        {[0, 1, 2].map((i) => (
          <span key={i} className={`ring ring-${i + 1}`} />
        ))}
        <span className="dot-center" />
      </div>
    )
  }

  return (
    <div className="standard-radial-pulse" role="img" aria-label="Radial pulse">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className={`ring ring-${i + 1}`}
          variants={ringVariants(i * 0.6)}
          animate="animate"
        />
      ))}
      <span className="dot-center" />
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: AnimationMetadata = {
  id: 'standard-effects__radial-pulse',
  title: 'Radial Pulse',
  description: 'Concentric ripple pulses expanding from the center using Framer Motion transforms and opacity.',
  tags: ['framer'],
}
