/**
 * Urgent pulsing countdown pill with gradient color shift.
 * Two-layer gradient (amber base + red overlay) with scale pulse and opacity crossfade.
 * Pulse parameters match the original fixed values — intensity does not change with time.
 *
 * Copy-paste files: this file + SharedTypes.ts + SharedTimer.ts + SharedFormat.ts + TimerEffectsUrgentPulse.css
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo } from 'react'

import { formatTime } from '@/components/realtime/timer-effects/SharedFormat'
import { useCountdown } from '@/components/realtime/timer-effects/SharedTimer'
import { resolveTimerProps, type TimerEffectProps } from '@/components/realtime/timer-effects/SharedTypes'

const DEFAULT_START = 5
const DEFAULT_WARNING = 3
const DEFAULT_CRITICAL = 1

function TimerEffectsUrgentPulseComponent(props: TimerEffectProps) {
  const {
    startSeconds = DEFAULT_START,
    mode = 'visual',
    onEnd,
    onEndBehavior = 'stay',
    textColor,
    fontSize,
  } = props

  const resolved = resolveTimerProps(props, DEFAULT_WARNING, DEFAULT_CRITICAL)
  const prefersReducedMotion = useReducedMotion()

  const { seconds, phase, isHidden } = useCountdown({
    startSeconds,
    mode,
    thresholds: {
      warning: resolved.warningThreshold,
      critical: resolved.criticalThreshold,
    },
    onEnd,
    onEndBehavior,
  })

  if (isHidden) return null

  // Original fixed values — no dynamic scaling
  const scaleValues = prefersReducedMotion ? [1, 1.06, 1] : [1, 1.12, 1]
  const opacityValues = prefersReducedMotion ? 0.5 : [0, 1, 0]
  const duration = prefersReducedMotion ? 1 : 0.5

  const phaseColor = resolved.colors?.[phase]

  const valueStyle: React.CSSProperties = {
    ...(textColor !== undefined ? { color: textColor } : {}),
    ...(fontSize !== undefined ? { fontSize: `${fontSize}px` } : {}),
  }

  return (
    <div className="timer-urgent-pulse-demo" data-animation-id="timer-effects__urgent-pulse">
      <m.div
        className="timer-urgent-pulse"
        animate={{ scale: scaleValues }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          animation: 'none',
          ...(phaseColor !== undefined ? { backgroundColor: phaseColor } : {}),
        }}
      >
        <div className="timer-urgent-pulse__gradient-base" />
        <m.div
          className="timer-urgent-pulse__gradient-top"
          animate={{ opacity: opacityValues }}
          transition={{
            duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ animation: 'none' }}
        />
        <span className="timer-urgent-pulse__value" style={valueStyle}>
          {formatTime(seconds)}
        </span>
      </m.div>
    </div>
  )
}

export const TimerEffectsUrgentPulse = memo(TimerEffectsUrgentPulseComponent)
