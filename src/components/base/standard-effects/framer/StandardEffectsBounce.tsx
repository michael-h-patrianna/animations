/**
 * Bounce effect — wraps any React element with a bounce animation.
 * Port to React Native: translate animate/transition to Moti MotiView props.
 *
 * Copy-paste files: this file
 * Runtime deps: react, motion
 *
 * Usage: <StandardEffectsBounce duration={800}><YourContent /></StandardEffectsBounce>
 */
import * as m from 'motion/react-m'
import { memo, type ReactNode } from 'react'

interface StandardEffectsBounceProps {
  children?: ReactNode
  /** Animation duration in ms. Default: 800 */
  duration?: number
}

function StandardEffectsBounceComponent({
  children,
  duration = 800,
}: StandardEffectsBounceProps) {
  return (
    <m.div
      data-animation-id="standard-effects__bounce"
      style={{ transformOrigin: 'center bottom', animation: 'none' }}
      animate={{
        y: [0, 0, -30, -35, -30, 0, 0],
        scaleY: [1, 0.8, 1.1, 1.05, 1.02, 0.95, 1],
        scaleX: [1, 1.1, 0.95, 0.98, 0.99, 1.02, 1],
        rotate: [0, 0, 2, 1, -1, 0, 0],
      }}
      transition={{
        duration: duration / 1000,
        ease: [0.4, 0, 0.2, 1] as const,
        times: [0, 0.2, 0.4, 0.5, 0.6, 0.8, 1],
      }}
    >
      {children ?? (
        <div className="pf-standard-demo__element">
          <span className="pf-standard-demo__label">Bounce</span>
        </div>
      )}
    </m.div>
  )
}

export const StandardEffectsBounce = memo(StandardEffectsBounceComponent)
