/**
 * Fade In effect — wraps any React element with a fade-in entrance animation.
 * Port to React Native: translate initial/animate/transition to Moti MotiView from/animate/transition.
 *
 * Copy-paste files: this file
 * Runtime deps: react, motion
 *
 * Usage: <StandardEffectsFade duration={800}><YourContent /></StandardEffectsFade>
 */
import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, type ReactNode } from 'react'
import { DemoBox } from '@/components/demo-blocks'

interface StandardEffectsFadeProps {
  children?: ReactNode
  /** Animation duration in ms. Default: 800 */
  duration?: number
}

function StandardEffectsFadeComponent({ children, duration = 800 }: StandardEffectsFadeProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <m.div
      data-animation-id="standard-effects__fade"
      style={{ animation: 'none' }}
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, rotate: -1 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, rotate: 0 }}
      transition={{
        duration: prefersReducedMotion ? 0.15 : duration / 1000,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      }}
    >
      {children ?? <DemoBox label="Fade" />}
    </m.div>
  )
}

export const StandardEffectsFade = memo(StandardEffectsFadeComponent)
