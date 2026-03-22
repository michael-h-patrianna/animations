/**
 * Shake effect — wraps any React element with a shake animation.
 * Port to React Native: translate animate/transition to Moti MotiView props.
 *
 * Copy-paste files: this file
 * Runtime deps: react, motion
 *
 * Usage: <StandardEffectsShake duration={500}><YourContent /></StandardEffectsShake>
 */
import * as m from 'motion/react-m'
import { memo, type ReactNode } from 'react'

interface StandardEffectsShakeProps {
  children?: ReactNode
  /** Animation duration in ms. Default: 500 */
  duration?: number
}

function StandardEffectsShakeComponent({
  children,
  duration = 500,
}: StandardEffectsShakeProps) {
  return (
    <m.div
      data-animation-id="standard-effects__shake"
      style={{ animation: 'none' }}
      animate={{
        x: [0, -10, 10, -8, 8, -6, 6, -4, 4, -2, 0],
        rotate: [0, -1, 1, -0.8, 0.8, -0.6, 0.6, -0.4, 0.4, -0.2, 0],
        scaleX: [1, 0.98, 0.98, 0.99, 0.99, 0.995, 0.995, 1, 1, 1, 1],
      }}
      transition={{
        duration: duration / 1000,
        ease: [0.4, 0, 0.2, 1] as const,
      }}
    >
      {children ?? (
        <div className="pf-standard-demo__element">
          <span className="pf-standard-demo__label">Shake</span>
        </div>
      )}
    </m.div>
  )
}

export const StandardEffectsShake = memo(StandardEffectsShakeComponent)
