/**
 * Timer pill with color transition and increasing pulse urgency — CSS variant.
 * Background shifts through phase colors via CSS custom properties.
 *
 * Copy-paste files: this file + SharedTypes.ts + SharedTimer.ts + SharedFormat.ts + TimerEffectsTimerFlash.css
 * Runtime deps: react
 */

import { memo } from 'react'

import {
  computeUrgencyColor,
  FLASH_CRITICAL_RGB,
  FLASH_NORMAL_RGB,
  formatTime,
} from '@/components/realtime/timer-effects/SharedFormat'
import { useCountdown } from '@/components/realtime/timer-effects/SharedTimer'
import {
  resolveTimerProps,
  type TimerEffectProps,
} from '@/components/realtime/timer-effects/SharedTypes'

import './TimerEffectsTimerFlash.css'

const DEFAULT_START = 32
const DEFAULT_WARNING = 30
const DEFAULT_CRITICAL = 10

function TimerEffectsTimerFlashComponent(props: TimerEffectProps) {
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

  const bgColor =
    resolved.colors !== undefined
      ? (resolved.colors[phase] ??
        computeUrgencyColor(
          seconds,
          resolved.warningThreshold,
          FLASH_NORMAL_RGB,
          FLASH_CRITICAL_RGB
        ))
      : computeUrgencyColor(
          seconds,
          resolved.warningThreshold,
          FLASH_NORMAL_RGB,
          FLASH_CRITICAL_RGB
        )

  const urgency =
    seconds <= resolved.warningThreshold
      ? (resolved.warningThreshold - seconds) / resolved.warningThreshold
      : 0

  const pulseDuration = Math.max(300, 1000 - urgency * 700) / 1000
  const pulseScale =
    seconds <= resolved.warningThreshold ? 1 + (resolved.warningThreshold - seconds) / 200 : 1
  const glowScale = seconds <= resolved.warningThreshold ? 0.95 + urgency * 0.5 : 0.95
  const glowOpacity = seconds <= resolved.warningThreshold ? 0.4 + urgency * 0.4 : 0

  const pillStyle: React.CSSProperties = {
    backgroundColor: bgColor,
    '--timer-effects-timer-flash-pulse-duration': `${pulseDuration}s`,
    '--timer-effects-timer-flash-pulse-scale': pulseScale.toString(),
    '--timer-effects-timer-flash-glow-scale': glowScale.toString(),
    '--timer-effects-timer-flash-glow-opacity': glowOpacity.toString(),
  } as React.CSSProperties

  const resolvedTextColor = resolved.textColors?.[phase] ?? textColor
  const timeStyle: React.CSSProperties = {
    ...(resolvedTextColor !== undefined ? { color: resolvedTextColor } : {}),
    ...(fontSize !== undefined ? { fontSize: `${fontSize}px` } : {}),
  }

  return (
    <div className="pf-timer-flash" data-animation-id="timer-effects__timer-flash">
      <div
        className={`pf-timer-flash__pill pf-timer-flash--${phase}`}
        data-testid="timer-flash-pill"
        style={pillStyle}
      >
        <span className="pf-timer-flash__glow" aria-hidden="true" />
        <div className="pf-timer-flash__time" style={timeStyle}>
          {formatTime(seconds)}
        </div>
      </div>
    </div>
  )
}

export const TimerEffectsTimerFlash = memo(TimerEffectsTimerFlashComponent)
