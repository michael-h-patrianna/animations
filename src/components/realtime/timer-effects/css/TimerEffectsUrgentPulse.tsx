/**
 * Urgent pulsing countdown pill with gradient color shift — CSS variant.
 * Uses CSS keyframe animation with phase-driven classes.
 *
 * Copy-paste files: this file + SharedTypes.ts + SharedTimer.ts + SharedFormat.ts + TimerEffectsUrgentPulse.css
 * Runtime deps: react
 */

import { memo } from 'react'

import { formatTime } from '../SharedFormat'
import { useCountdown } from '../SharedTimer'
import type { TimerEffectProps } from '../SharedTypes'

import './TimerEffectsUrgentPulse.css'

const DEFAULT_START = 5
const DEFAULT_WARNING = 3
const DEFAULT_CRITICAL = 1

function TimerEffectsUrgentPulseComponent({
  startSeconds = DEFAULT_START,
  mode = 'visual',
  colors,
  thresholds,
  onEnd,
  onEndBehavior = 'stay',
  textColor,
  fontSize,
}: TimerEffectProps) {
  const { seconds, phase, isHidden } = useCountdown({
    startSeconds,
    mode,
    thresholds: {
      warning: thresholds?.warning ?? DEFAULT_WARNING,
      critical: thresholds?.critical ?? DEFAULT_CRITICAL,
    },
    onEnd,
    onEndBehavior,
  })

  if (isHidden) return null

  const phaseColor = colors?.[phase]

  const valueStyle: React.CSSProperties = {
    ...(textColor !== undefined ? { color: textColor } : {}),
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
