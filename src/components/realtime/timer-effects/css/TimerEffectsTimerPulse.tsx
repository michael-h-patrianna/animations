/**
 * Large countdown number with continuous pulse and depleting underline bar — CSS variant.
 * The number pulses via CSS keyframes while the underline shrinks via custom property.
 *
 * Copy-paste files: this file + SharedTypes.ts + SharedTimer.ts + SharedFormat.ts + TimerEffectsTimerPulse.css
 * Runtime deps: react
 */

import { memo } from 'react'

import { useCountdown } from '../SharedTimer'
import type { TimerEffectProps } from '../SharedTypes'

import './TimerEffectsTimerPulse.css'

const DEFAULT_START = 10
const DEFAULT_WARNING = 6
const DEFAULT_CRITICAL = 3

interface TimerEffectsTimerPulseProps extends TimerEffectProps {
  /** Whether to show the depleting underline bar. Default: true */
  showUnderline?: boolean
}

function TimerEffectsTimerPulseComponent({
  startSeconds = DEFAULT_START,
  mode = 'visual',
  colors,
  thresholds,
  onEnd,
  onEndBehavior = 'stay',
  textColor,
  fontSize,
  showUnderline = true,
}: TimerEffectsTimerPulseProps) {
  const { seconds, phase, progress, isHidden } = useCountdown({
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
    ...(textColor !== undefined ? { color: textColor } : phaseColor !== undefined ? { color: phaseColor } : {}),
    ...(fontSize !== undefined ? { fontSize: `${fontSize}px` } : {}),
  }

  return (
    <div className="pf-timer-pulse" data-animation-id="timer-effects__timer-pulse">
      <div className={`pf-timer-pulse__value pf-timer-pulse--${phase}`} style={valueStyle}>
        {seconds}
      </div>
      {showUnderline && (
        <div
          className="pf-timer-pulse__underline"
          style={{ '--progress': progress } as React.CSSProperties}
        />
      )}
    </div>
  )
}

export const TimerEffectsTimerPulse = memo(TimerEffectsTimerPulseComponent)
