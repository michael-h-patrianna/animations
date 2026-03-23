/**
 * Spin effect — wraps any React element with a single 360° rotation.
 * Port to React Native: translate animate/transition to Moti MotiView props.
 *
 * Copy-paste files: this file
 * Runtime deps: react, motion
 *
 * Usage: <StandardEffectsSpin duration={800}><YourContent /></StandardEffectsSpin>
 */
import * as m from 'motion/react-m'
import { memo, type ReactNode } from 'react'
import { DemoBox } from '@/components/demo-blocks'

interface StandardEffectsSpinProps {
  children?: ReactNode
  /** Animation duration in ms. Default: 800 */
  duration?: number
}

function StandardEffectsSpinComponent({ children, duration = 800 }: StandardEffectsSpinProps) {
  return (
    <m.div
      data-animation-id="standard-effects__spin"
      style={{ animation: 'none' }}
      animate={{
        rotate: [0, 90, 180, 270, 360],
        scale: [0.98, 1.02, 1.04, 1.02, 1],
      }}
      transition={{
        duration: duration / 1000,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
        times: [0, 0.25, 0.5, 0.75, 1],
      }}
    >
      {children ?? (
        <DemoBox label="Spin" />
      )}
    </m.div>
  )
}

export const StandardEffectsSpin = memo(StandardEffectsSpinComponent)
