/**
 * Pulse effect — wraps any React element with a rhythmic scale pulse and glow.
 * Port to React Native: translate animate/transition to Moti MotiView props.
 * The glow ::before pseudo-element maps to an absolute-positioned sibling in RN.
 *
 * Copy-paste files: this file
 * Runtime deps: react, motion
 *
 * Usage: <StandardEffectsPulse duration={1500}><YourContent /></StandardEffectsPulse>
 */
import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, type ReactNode } from 'react'
import { DemoBox } from '@/components/demo-blocks'
import { PULSE_GLOW_COLOR } from '@/components/base/standard-effects/SharedDefaults'

interface StandardEffectsPulseProps {
  children?: ReactNode
  /** Duration of one full cycle in ms. Default: 1500 */
  duration?: number
  /** Glow overlay color. Default: 'rgb(198 255 119 / 30%)' */
  glowColor?: string
  /** Border radius applied to the pulse glow. Default: 16 */
  borderRadius?: number | string
}

function StandardEffectsPulseComponent({
  children,
  duration = 1500,
  glowColor = PULSE_GLOW_COLOR,
  borderRadius = 16,
}: StandardEffectsPulseProps) {
  const prefersReducedMotion = useReducedMotion()
  const resolvedGlowColor = glowColor
  const durationS = duration / 1000

  return (
    <m.div
      className="pf-pulse-fm"
      data-animation-id="standard-effects__pulse"
      style={{ animation: 'none', borderRadius }}
      animate={
        prefersReducedMotion
          ? { scale: [1, 1.03, 1], opacity: [1, 0.8, 1] }
          : {
              scale: [1, 1.25, 1],
              opacity: [1, 0.8, 1],
            }
      }
      transition={
        prefersReducedMotion
          ? { duration: durationS, times: [0, 0.5, 1], repeat: Infinity }
          : {
              duration: durationS,
              ease: [0.4, 0, 0.6, 1] as const,
              times: [0, 0.5, 1],
              repeat: Infinity,
            }
      }
    >
      <m.span
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          background: `linear-gradient(180deg, ${resolvedGlowColor} 0%, transparent 70%)`,
          pointerEvents: 'none',
          zIndex: -1,
          animation: 'none',
        }}
        animate={
          prefersReducedMotion
            ? undefined
            : {
                scale: [0.8, 1.5, 2],
                opacity: [0, 0.6, 0],
              }
        }
        transition={
          prefersReducedMotion
            ? undefined
            : {
                duration: durationS,
                ease: [0.4, 0, 0.6, 1] as const,
                times: [0, 0.5, 1],
                repeat: Infinity,
              }
        }
      />
      {children ?? <DemoBox label="Pulse" />}
    </m.div>
  )
}

export const StandardEffectsPulse = memo(StandardEffectsPulseComponent)
