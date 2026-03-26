/**
 * Float effect — wraps any React element with a continuous floating animation.
 * Port to React Native: translate animate/transition to Moti MotiView props.
 *
 * Copy-paste files: this file
 * Runtime deps: react, motion
 *
 * Usage: <StandardEffectsFloat duration={6000}><YourContent /></StandardEffectsFloat>
 */
import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, type ReactNode } from 'react'
import { DemoBox } from '@/components/demo-blocks'

interface StandardEffectsFloatProps {
  children?: ReactNode
  /** Duration of one full cycle in ms. Default: 6000 */
  duration?: number
}

function StandardEffectsFloatComponent({ children, duration = 6000 }: StandardEffectsFloatProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <m.div
      data-animation-id="standard-effects__float"
      style={{ transformOrigin: 'center 20%', animation: 'none' }}
      animate={
        prefersReducedMotion
          ? undefined
          : {
              y: [0, -14, 0],
              x: [0, 5.5, 0, -5.5, 0],
              rotate: [0, -4, 0, 4, 0],
              scale: [1, 1.02, 1],
            }
      }
      transition={
        prefersReducedMotion
          ? undefined
          : {
              duration: duration / 1000,
              ease: [0.4, 0, 0.2, 1] as const,
              repeat: Infinity,
            }
      }
    >
      {children ?? <DemoBox label="Float" />}
    </m.div>
  )
}

export const StandardEffectsFloat = memo(StandardEffectsFloatComponent)
