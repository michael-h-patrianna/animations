/**
 * Tada effect — wraps any React element with an attention-grabbing tada animation.
 * Port to React Native: translate animate/transition to Moti MotiView props.
 *
 * Copy-paste files: this file
 * Runtime deps: react, motion
 *
 * Usage: <StandardEffectsTada duration={1000}><YourContent /></StandardEffectsTada>
 */
import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, type ReactNode } from 'react'
import { DemoBox } from '@/components/demo-blocks'

interface StandardEffectsTadaProps {
  children?: ReactNode
  /** Animation duration in ms. Default: 1000 */
  duration?: number
}

function StandardEffectsTadaComponent({ children, duration = 1000 }: StandardEffectsTadaProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <m.div
      data-animation-id="standard-effects__tada"
      style={{ animation: 'none' }}
      animate={
        prefersReducedMotion
          ? { scale: [1, 0.97, 1.04, 1], rotate: [0, -1, 1, 0] }
          : {
              scale: [1, 0.9, 0.9, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1],
              rotate: [0, -3, -3, 3, -3, 3, -3, 3, -3, 3, 0],
              skewX: [0, -2, -2, 1, -1, 1, -1, 1, -1, 1, 0],
              opacity: [1, 0.95, 0.95, 1, 0.98, 1, 0.98, 1, 0.98, 1, 1],
            }
      }
      transition={
        prefersReducedMotion
          ? { duration: 0.4, ease: 'easeInOut' }
          : {
              duration: duration / 1000,
              ease: [0.4, 0, 0.6, 1] as const,
              times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
            }
      }
    >
      {children ?? <DemoBox label="Tada" />}
    </m.div>
  )
}

export const StandardEffectsTada = memo(StandardEffectsTadaComponent)
