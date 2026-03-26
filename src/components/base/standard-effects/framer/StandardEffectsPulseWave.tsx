/**
 * Pulse Wave — self-contained pulsing core with expanding ring wave indicators.
 * Port to React Native: translate animate/transition to Moti. Rings become
 * absolute-positioned MotiView siblings instead of pseudo-elements.
 *
 * Copy-paste files: this file
 * Runtime deps: react, motion
 *
 * Usage: <StandardEffectsPulseWave size={56} color="#7a468e" duration={2000} />
 */
import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo } from 'react'
import {
  INDICATOR_COLOR,
  INDICATOR_RING_COLOR,
} from '@/components/base/standard-effects/SharedDefaults'

interface StandardEffectsPulseWaveProps {
  /** Core diameter in px. Default: 56 */
  size?: number
  /** Core fill color. Default: '#7a468e' */
  color?: string
  /** Ring border color. Default: 'rgb(236 195 255 / 60%)' */
  ringColor?: string
  /** Duration of one full cycle in ms. Default: 2000 */
  duration?: number
}

function StandardEffectsPulseWaveComponent({
  size = 56,
  color = INDICATOR_COLOR,
  ringColor = INDICATOR_RING_COLOR,
  duration = 2000,
}: StandardEffectsPulseWaveProps) {
  const prefersReducedMotion = useReducedMotion()
  const durationS = duration / 1000
  const resolvedColor = color
  const resolvedRingColor = ringColor
  const ringTimes: number[] = [0, 0.7, 1]

  return (
    <div
      style={{
        position: 'relative',
        width: 160,
        height: 160,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      data-animation-id="standard-effects__pulse-wave"
      role="img"
      aria-label="Pulse wave"
    >
      <m.div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: resolvedColor,
          position: 'relative',
          animation: 'none',
        }}
        animate={prefersReducedMotion ? { opacity: [1, 0.6, 1] } : { scale: [1, 1.08, 1] }}
        transition={{
          duration: durationS,
          ease: [0.4, 0, 0.6, 1] as const,
          times: [0, 0.5, 1],
          repeat: Infinity,
        }}
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
          animate={
            prefersReducedMotion ? { opacity: 0 } : { scale: [1, 2.8, 2.8], opacity: [0.6, 0, 0] }
          }
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : {
                  duration: durationS,
                  ease: [0.4, 0, 0.6, 1] as const,
                  times: ringTimes,
                  repeat: Infinity,
                }
          }
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
          animate={
            prefersReducedMotion ? { opacity: 0 } : { scale: [1, 2.8, 2.8], opacity: [0.4, 0, 0] }
          }
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : {
                  duration: durationS,
                  delay: durationS / 2,
                  ease: [0.4, 0, 0.6, 1] as const,
                  times: ringTimes,
                  repeat: Infinity,
                }
          }
        />
      </m.div>
    </div>
  )
}

export const StandardEffectsPulseWave = memo(StandardEffectsPulseWaveComponent)
