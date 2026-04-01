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
import { memo, type CSSProperties, type ReactNode } from 'react'
import { DemoBox } from '@/components/demo-blocks'
import { STAMP_DOWN_RING_COLOR } from '@/components/base/standard-effects/SharedDefaults'

interface StandardEffectsStampDownProps {
  children?: ReactNode
  /** Total animation duration in ms. Default: 350 */
  duration?: number
  /** Initial oversized scale before slam. Default: 2.0 */
  startScale?: number
  /** Subtle tilt on impact in degrees. Default: 2 */
  impactRotation?: number
  /** Show expanding ring on impact. Default: false */
  showImpactRing?: boolean
  /** Impact ring color. Default: rgba(255, 255, 255, 0.3) */
  ringColor?: string
}

const ringStyle: CSSProperties = {
  position: 'absolute',
  width: '120%',
  height: '120%',
  top: '-10%',
  left: '-10%',
  borderRadius: '50%',
  border: '2px solid',
  pointerEvents: 'none',
}

function StandardEffectsStampDownComponent({
  children,
  duration = 350,
  startScale = 2.0,
  impactRotation = 2,
  showImpactRing = false,
  ringColor = STAMP_DOWN_RING_COLOR,
}: StandardEffectsStampDownProps) {
  const prefersReducedMotion = useReducedMotion()
  const durationS = duration / 1000

  return (
    <m.div
      data-animation-id="standard-effects__stamp-down"
      style={{ position: 'relative', display: 'inline-flex' }}
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

      {showImpactRing && (
        <m.div
          style={{ ...ringStyle, borderColor: ringColor }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 0, 1.5, 2], opacity: [0, 0.8, 0.4, 0] }}
          transition={{
            duration: durationS,
            times: [0, 0.43, 0.71, 1],
            ease: 'easeOut',
          }}
          aria-hidden="true"
        />
      )}
    </m.div>
  )
}

export const StandardEffectsStampDown = memo(StandardEffectsStampDownComponent)
