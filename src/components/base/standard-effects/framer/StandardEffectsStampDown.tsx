/**
 * Stamp Down / Impact Land — element slams in from oversized to normal with weight.
 * Direction is DOWN (large → normal) — feels like something heavy landing.
 * Port to React Native: translate animate/transition to Moti MotiView from/animate/transition.
 *
 * Copy-paste files: this file
 * Runtime deps: react, motion
 *
 * Usage: <StandardEffectsStampDown startScale={2.5}><YourContent /></StandardEffectsStampDown>
 */
import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, type ReactNode } from 'react'
import { DemoBox } from '@/components/demo-blocks'

interface StandardEffectsStampDownProps {
  children?: ReactNode
  /** Total animation duration in ms. Default: 350 */
  duration?: number
  /** Initial oversized scale before slam. Default: 2.0 */
  startScale?: number
  /** Subtle tilt on impact in degrees. Default: 2 */
  impactRotation?: number
}

function StandardEffectsStampDownComponent({
  children,
  duration = 350,
  startScale = 2.0,
  impactRotation = 2,
}: StandardEffectsStampDownProps) {
  const prefersReducedMotion = useReducedMotion()
  const durationS = duration / 1000

  return (
    <m.div
      data-animation-id="standard-effects__stamp-down"
      style={{ display: 'inline-flex' }}
      animate={
        prefersReducedMotion
          ? { opacity: [0, 1] }
          : {
              scale: [startScale, 0.92, 1.04, 1],
              opacity: [0, 1, 1, 1],
              rotate: [0, -impactRotation, impactRotation * 0.3, 0],
            }
      }
      transition={
        prefersReducedMotion
          ? { duration: 0.15 }
          : {
              duration: durationS,
              times: [0, 0.43, 0.71, 1],
              ease: [0.4, 0, 0.2, 1] as const,
            }
      }
    >
      {children ?? <DemoBox label="Stamp" />}
    </m.div>
  )
}

export const StandardEffectsStampDown = memo(StandardEffectsStampDownComponent)
