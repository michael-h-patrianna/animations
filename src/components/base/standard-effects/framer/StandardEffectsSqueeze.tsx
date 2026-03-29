/**
 * Squeeze effect — wraps any React element with a squeeze-and-release animation.
 * Port to React Native: translate animate/transition to Moti MotiView props.
 *
 * Copy-paste files: this file
 * Runtime deps: react, motion
 *
 * Usage: <StandardEffectsSqueeze duration={900}><YourContent /></StandardEffectsSqueeze>
 */
import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, type ReactNode } from 'react'
import { DemoBox } from '@/components/demo-blocks'

interface StandardEffectsSqueezeProps {
  children?: ReactNode
  /** Animation duration in ms. Default: 900 */
  duration?: number
}

function StandardEffectsSqueezeComponent({
  children,
  duration = 900,
}: StandardEffectsSqueezeProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <m.div
      data-animation-id="standard-effects__squeeze"
      animate={
        prefersReducedMotion
          ? { scaleX: [1, 1.02, 0.98, 1], scaleY: [1, 0.98, 1.02, 1] }
          : {
              scaleX: [1, 1.1, 1.25, 0.75, 1.15, 0.95, 1.05, 0.98, 1],
              scaleY: [1, 0.9, 0.75, 1.25, 0.85, 1.05, 0.95, 1.02, 1],
              rotate: [0, -2, -4, 3, -1, 1, -0.5, 0.2, 0],
              opacity: [1, 0.95, 0.9, 0.92, 0.96, 0.98, 0.99, 1, 1],
            }
      }
      transition={
        prefersReducedMotion
          ? { duration: 0.4, ease: 'easeInOut' }
          : {
              duration: duration / 1000,
              ease: [0.68, -0.55, 0.265, 1.55] as const,
              times: [0, 0.15, 0.3, 0.4, 0.5, 0.65, 0.75, 0.85, 1],
            }
      }
    >
      {children ?? <DemoBox label="Squeeze" />}
    </m.div>
  )
}

export const StandardEffectsSqueeze = memo(StandardEffectsSqueezeComponent)
