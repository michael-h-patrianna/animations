/**
 * Wiggle effect — wraps any React element with a wiggle animation.
 * Port to React Native: translate animate/transition to Moti MotiView props.
 *
 * Copy-paste files: this file
 * Runtime deps: react, motion
 *
 * Usage: <StandardEffectsWiggle duration={1000}><YourContent /></StandardEffectsWiggle>
 */
import * as m from 'motion/react-m'
import { memo, type ReactNode } from 'react'
import { DemoBox } from '@/components/demo-blocks'

interface StandardEffectsWiggleProps {
  children?: ReactNode
  /** Animation duration in ms. Default: 1000 */
  duration?: number
}

function StandardEffectsWiggleComponent({ children, duration = 1000 }: StandardEffectsWiggleProps) {
  return (
    <m.div
      data-animation-id="standard-effects__wiggle"
      style={{ animation: 'none' }}
      animate={{
        rotate: [0, -3, 3, -3, 3, -3, 3, -3, 3, -3, 3, 0],
        scale: [1, 1.02, 0.98, 1.02, 0.98, 1.02, 0.98, 1.02, 0.98, 1.02, 0.98, 1],
        x: [0, -2, 2, -2, 2, -2, 2, -2, 2, -2, 2, 0],
      }}
      transition={{
        duration: duration / 1000,
        ease: [0.4, 0, 0.2, 1] as const,
      }}
    >
      {children ?? <DemoBox label="Wiggle" />}
    </m.div>
  )
}

export const StandardEffectsWiggle = memo(StandardEffectsWiggleComponent)
