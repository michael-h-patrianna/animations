/**
 * Pulse Circle — self-contained pulsing circle with expanding ring indicators.
 * Port to React Native: translate animate/transition to Moti. Rings become
 * absolute-positioned MotiView siblings instead of pseudo-elements.
 *
 * Copy-paste files: this file
 * Runtime deps: react, motion
 *
 * Usage: <StandardEffectsPulseCircle size={76} color="#7a468e" duration={2200} />
 */
import * as m from 'motion/react-m'
import { memo } from 'react'

import { INDICATOR_COLOR, INDICATOR_RING_COLOR } from '../SharedDefaults'

interface StandardEffectsPulseCircleProps {
  /** Circle diameter in px. Default: 76 */
  size?: number
  /** Circle fill color. Default: '#7a468e' */
  color?: string
  /** Ring border color. Default: 'rgb(236 195 255 / 60%)' */
  ringColor?: string
  /** Duration of one full cycle in ms. Default: 2200 */
  duration?: number
}

function StandardEffectsPulseCircleComponent({
  size = 76,
  color,
  ringColor,
  duration = 2200,
}: StandardEffectsPulseCircleProps) {
  const durationS = duration / 1000
  const ringTimes: number[] = [0, 0.7, 1]
  const resolvedColor = color ?? INDICATOR_COLOR
  const resolvedRingColor = ringColor ?? INDICATOR_RING_COLOR

  return (
    <div
      style={{ width: 160, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      data-animation-id="standard-effects__pulse-circle"
    >
      <m.div
        role="img"
        aria-label="Pulse circle"
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: resolvedColor,
          position: 'relative',
          animation: 'none',
        }}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: durationS, ease: [0.4, 0, 0.6, 1] as const, times: [0, 0.5, 1] }}
      >
        <m.span
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: `2px solid ${resolvedRingColor}`,
            animation: 'none',
          }}
          initial={{ scale: 1, opacity: 0.7 }}
          animate={{ scale: [1, 2.6, 2.6], opacity: [0.7, 0.12, 0] }}
          transition={{ duration: durationS, ease: [0.4, 0, 0.6, 1] as const, times: ringTimes }}
        />
        <m.span
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: `2px solid ${resolvedRingColor}`,
            animation: 'none',
          }}
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: [1, 2.6, 2.6], opacity: [0.6, 0.1, 0] }}
          transition={{
            duration: durationS,
            delay: durationS / 2,
            ease: [0.4, 0, 0.6, 1] as const,
            times: ringTimes,
          }}
        />
      </m.div>
    </div>
  )
}

export const StandardEffectsPulseCircle = memo(StandardEffectsPulseCircleComponent)
