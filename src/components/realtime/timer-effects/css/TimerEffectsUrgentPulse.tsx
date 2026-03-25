/**
 * Urgent pulsing countdown pill with gradient color shift — CSS variant.
 * Uses CSS keyframe animation with phase-driven classes.
 *
 * Copy-paste files: this file + SharedTypes.ts + SharedTimer.ts + SharedFormat.ts + TimerEffectsUrgentPulse.css
 * Runtime deps: react
 */

import { memo } from 'react'

import { formatTime } from '@/components/realtime/timer-effects/SharedFormat'
import { useCountdown } from '@/components/realtime/timer-effects/SharedTimer'
import { resolveTimerProps, type TimerEffectProps } from '@/components/realtime/timer-effects/SharedTypes'

import './TimerEffectsUrgentPulse.css'

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

  const phaseColor = resolved.colors?.[phase]
  const resolvedTextColor = resolved.textColors?.[phase] ?? textColor

  const valueStyle: React.CSSProperties = {
    ...(resolvedTextColor !== undefined ? { color: resolvedTextColor } : {}),
    ...(fontSize !== undefined ? { fontSize: `${fontSize}px` } : {}),
  }

  return (
    <div className="timer-urgent-pulse-demo" data-animation-id="timer-effects__urgent-pulse">
      <div
        className={`timer-urgent-pulse timer-urgent-pulse--${phase}`}
        style={phaseColor !== undefined ? { backgroundColor: phaseColor } : undefined}
      >
        <span className="timer-urgent-pulse__value" style={valueStyle}>
          {formatTime(seconds)}
        </span>
      </div>
    </div>
  )
}

export const TimerEffectsUrgentPulse = memo(TimerEffectsUrgentPulseComponent)
