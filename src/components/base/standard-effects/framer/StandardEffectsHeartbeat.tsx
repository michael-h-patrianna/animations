/**
 * Heartbeat effect — wraps any React element with a rhythmic double-beat pulse.
 * Port to React Native: translate animate/transition to Moti MotiView props.
 *
 * Copy-paste files: this file
 * Runtime deps: react, motion
 *
 * Usage: <StandardEffectsHeartbeat duration={1300}><YourContent /></StandardEffectsHeartbeat>
 */
import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, type ReactNode } from 'react'
import { DemoBox } from '@/components/demo-blocks'

interface StandardEffectsHeartbeatProps {
  children?: ReactNode
  /** Duration of one full cycle in ms. Default: 1300 */
  duration?: number
}

function StandardEffectsHeartbeatComponent({
  children,
  duration = 1300,
}: StandardEffectsHeartbeatProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <m.div
      data-animation-id="standard-effects__heartbeat"
      style={{ animation: 'none' }}
      animate={
        prefersReducedMotion
          ? { scale: [1, 1.04, 1, 1.04, 1], opacity: [1, 0.85, 0.95, 0.85, 1] }
          : {
              scale: [1, 1.3, 1, 1.3, 1.05, 1, 0.98],
              rotate: [0, -5, 2, 5, -1, 0, 0.5],
              y: [0, -2, 0, -3, -1, 0, 0],
              opacity: [1, 0.9, 0.95, 0.9, 0.97, 1, 1],
            }
      }
      transition={
        prefersReducedMotion
          ? { duration: duration / 1000, times: [0, 0.14, 0.42, 0.7, 1], repeat: Infinity }
          : {
              duration: duration / 1000,
              ease: [0.4, 0, 0.6, 1] as const,
              times: [0, 0.14, 0.28, 0.42, 0.56, 0.7, 0.85],
              repeat: Infinity,
            }
      }
    >
      {children ?? <DemoBox label="HeartBeat" />}
    </m.div>
  )
}

export const StandardEffectsHeartbeat = memo(StandardEffectsHeartbeatComponent)
