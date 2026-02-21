import { memo } from 'react'
import * as m from 'motion/react-m'
import { easeOut } from 'motion/react'

function StandardEffectsRadialPulseComponent() {
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
  return (
    <div className="standard-radial-pulse" data-animation-id="standard-effects__radial-pulse" role="img" aria-label="Radial pulse">
      {[0, 1, 2].map((i) => (
        <m.span
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

/**
 * Memoized StandardEffectsRadialPulse to prevent unnecessary re-renders in grid layouts.
 */
export const StandardEffectsRadialPulse = memo(StandardEffectsRadialPulseComponent)

