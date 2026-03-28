/**
 * Jello effect — wraps any React element with a jello wobble animation.
 * Port to React Native: translate animate/transition to Moti MotiView props.
 *
 * Copy-paste files: this file
 * Runtime deps: react, motion
 *
 * Usage: <StandardEffectsJello duration={1000}><YourContent /></StandardEffectsJello>
 */
import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, type ReactNode } from 'react'
import { DemoBox } from '@/components/demo-blocks'

interface StandardEffectsJelloProps {
  children?: ReactNode
  /** Animation duration in ms. Default: 1000 */
  duration?: number
}

function StandardEffectsJelloComponent({ children, duration = 1000 }: StandardEffectsJelloProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <m.div
      data-animation-id="standard-effects__jello"
      animate={
        prefersReducedMotion
          ? { skewX: [0, -1.5, 1, -0.5, 0], skewY: [0, -1.5, 1, -0.5, 0] }
          : {
              skewX: [0, -12.5, 6.25, -3.125, 1.5625, -0.78125, 0],
              skewY: [0, -12.5, 6.25, -3.125, 1.5625, -0.78125, 0],
              scale: [1, 1.05, 0.98, 1.02, 0.99, 1.01, 1],
            }
      }
      transition={
        prefersReducedMotion
          ? { duration: 0.5, ease: 'easeInOut' }
          : {
              duration: duration / 1000,
              ease: [0.4, 0, 0.2, 1] as const,
              times: [0, 0.3, 0.4, 0.5, 0.65, 0.75, 1],
            }
      }
    >
      {children ?? <DemoBox label="Jello" />}
    </m.div>
  )
}

export const StandardEffectsJello = memo(StandardEffectsJelloComponent)
