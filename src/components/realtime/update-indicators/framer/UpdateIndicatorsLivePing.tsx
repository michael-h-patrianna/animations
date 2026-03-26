/**
 * Live status dot — continuously pulsing indicator for real-time/active state.
 * Port to React Native: translate animate/transition to Moti MotiView props.
 *
 * Copy-paste files: this file
 * Runtime deps: react, motion
 *
 * Usage: <UpdateIndicatorsLivePing color="#00ff00" size={10} />
 */
import * as m from 'motion/react-m'
import { easeInOut, useReducedMotion } from 'motion/react'
import { memo } from 'react'
import { PING_COLOR } from '@/components/realtime/update-indicators/SharedDefaults'

interface LivePingProps {
  /** Dot color. Default: '#c6ff77' */
  color?: string
  /** Dot diameter in px. Default: 12 */
  size?: number
  /** Pulse cycle duration in ms. Default: 1200 */
  duration?: number
}

function UpdateIndicatorsLivePingComponent({
  color = PING_COLOR,
  size = 12,
  duration = 1200,
}: LivePingProps) {
  const prefersReducedMotion = useReducedMotion()
  const durS = duration / 1000

  return (
    <div className="pf-update-indicator" data-animation-id="update-indicators__live-ping">
      <m.div
        className="pf-update-indicator__ping"
        style={{
          width: size,
          height: size,
          background: color,
          animation: 'none',
        }}
        animate={
          prefersReducedMotion
            ? { opacity: [1, 0.5, 1] }
            : {
                scale: [1, 1.6, 1],
                opacity: [1, 0, 1],
              }
        }
        transition={{
          duration: durS,
          ease: easeInOut,
          repeat: Infinity,
          repeatType: 'loop',
        }}
      />
    </div>
  )
}

export const UpdateIndicatorsLivePing = memo(UpdateIndicatorsLivePingComponent)
