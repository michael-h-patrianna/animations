/**
 * Pop In effect — wraps any React element with an elastic pop entrance animation.
 * Port to React Native: translate initial/animate/transition to Moti MotiView from/animate/transition.
 *
 * Copy-paste files: this file
 * Runtime deps: react, motion
 *
 * Usage: <StandardEffectsPop duration={500}><YourContent /></StandardEffectsPop>
 */
import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, type ReactNode } from 'react'
import { DemoBox } from '@/components/demo-blocks'

interface StandardEffectsPopProps {
  children?: ReactNode
  /** Animation duration in ms. Default: 500 */
  duration?: number
}

function StandardEffectsPopComponent({ children, duration = 500 }: StandardEffectsPopProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <m.div
      data-animation-id="standard-effects__pop"
      style={{ animation: 'none' }}
      animate={
        prefersReducedMotion
          ? { opacity: [0, 1] }
          : {
              scale: [0, 1.2, 1],
              rotate: [0, 5, 0],
              opacity: [0, 0.8, 1],
            }
      }
      transition={
        prefersReducedMotion
          ? { duration: 0.15 }
          : {
              duration: duration / 1000,
              ease: [0.68, -0.55, 0.265, 1.55] as const,
              times: [0, 0.5, 1],
            }
      }
    >
      {children ?? <DemoBox label="Pop" />}
    </m.div>
  )
}

export const StandardEffectsPop = memo(StandardEffectsPopComponent)
