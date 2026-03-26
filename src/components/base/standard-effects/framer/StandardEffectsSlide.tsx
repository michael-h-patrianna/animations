/**
 * Slide In effect — wraps any React element with a slide-in entrance animation.
 * Port to React Native: translate initial/animate/transition to Moti MotiView from/animate/transition.
 *
 * Copy-paste files: this file
 * Runtime deps: react, motion
 *
 * Usage: <StandardEffectsSlide duration={700}><YourContent /></StandardEffectsSlide>
 */
import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, type ReactNode } from 'react'
import { DemoBox } from '@/components/demo-blocks'

interface StandardEffectsSlideProps {
  children?: ReactNode
  /** Animation duration in ms. Default: 700 */
  duration?: number
}

function StandardEffectsSlideComponent({ children, duration = 700 }: StandardEffectsSlideProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <m.div
      data-animation-id="standard-effects__slide"
      style={{ transformOrigin: 'center left', animation: 'none' }}
      initial={prefersReducedMotion ? { opacity: 0 } : { x: '-100%', scale: 0.8, rotate: -5, opacity: 0 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { x: 0, scale: 1, rotate: 0, opacity: 1 }}
      transition={{
        duration: prefersReducedMotion ? 0.15 : duration / 1000,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      }}
    >
      {children ?? <DemoBox label="Slide" />}
    </m.div>
  )
}

export const StandardEffectsSlide = memo(StandardEffectsSlideComponent)
