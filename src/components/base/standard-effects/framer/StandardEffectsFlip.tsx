/**
 * Flip effect — wraps any React element with a Y-axis flip animation.
 * Port to React Native: translate animate/transition to Moti MotiView props.
 *
 * Copy-paste files: this file
 * Runtime deps: react, motion
 *
 * Usage: <StandardEffectsFlip duration={800}><YourContent /></StandardEffectsFlip>
 */
import * as m from 'motion/react-m'
import { memo, type ReactNode } from 'react'

interface StandardEffectsFlipProps {
  children?: ReactNode
  /** Animation duration in ms. Default: 800 */
  duration?: number
}

function StandardEffectsFlipComponent({ children, duration = 800 }: StandardEffectsFlipProps) {
  return (
    <m.div
      data-animation-id="standard-effects__flip"
      style={{ perspective: 400, animation: 'none' }}
      animate={{
        rotateY: [0, 90, 180],
        scale: [1, 0.95, 1],
      }}
      transition={{
        duration: duration / 1000,
        ease: [0.4, 0, 0.2, 1] as const,
        times: [0, 0.4, 1],
      }}
    >
      {children ?? (
        <div className="pf-standard-demo__element">
          <span className="pf-standard-demo__label">Flip</span>
        </div>
      )}
    </m.div>
  )
}

export const StandardEffectsFlip = memo(StandardEffectsFlipComponent)
