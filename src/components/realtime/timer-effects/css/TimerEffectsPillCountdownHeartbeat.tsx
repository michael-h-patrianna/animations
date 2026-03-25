/**
 * Pill countdown with organic heartbeat pulse effect — CSS variant.
 * Heartbeat rate and glow intensity increase as time runs out via CSS classes.
 *
 * Copy-paste files: this file + SharedTypes.ts + SharedTimer.ts + SharedFormat.ts + SharedPillPhaseTheme.ts + shared.css (heartbeat section) + TimerEffectsPillCountdownHeartbeat.css
 * Runtime deps: react
 */

import { memo } from 'react'

import { formatTime } from '@/components/realtime/timer-effects/SharedFormat'
import { buildHeartbeatPillTheme } from '@/components/realtime/timer-effects/SharedPillPhaseTheme'
import { useCountdown } from '@/components/realtime/timer-effects/SharedTimer'
import { resolveTimerProps, type TimerEffectProps } from '@/components/realtime/timer-effects/SharedTypes'

import './shared.css'
import './TimerEffectsPillCountdownHeartbeat.css'

const DEFAULT_START = 60
const DEFAULT_WARNING = 30
const DEFAULT_CRITICAL = 10

type HeartbeatLevel =
  | 'pf-heartbeat-normal'
  | 'pf-heartbeat-calm'
  | 'pf-heartbeat-mild'
  | 'pf-heartbeat-elevated'
  | 'pf-heartbeat-rapid'
  | 'pf-heartbeat-critical'
  | 'pf-timer-expired'

/** Original absolute-second thresholds, scaled proportionally to startSeconds */
function resolveHeartbeatLevel(
  seconds: number,
  startSeconds: number,
  isExpired: boolean
): HeartbeatLevel {
  if (isExpired) return 'pf-timer-expired'
  const ratio = startSeconds / 60
  if (seconds <= Math.round(10 * ratio)) return 'pf-heartbeat-critical'
  if (seconds <= Math.round(20 * ratio)) return 'pf-heartbeat-rapid'
  if (seconds <= Math.round(30 * ratio)) return 'pf-heartbeat-elevated'
  if (seconds <= Math.round(40 * ratio)) return 'pf-heartbeat-mild'
  if (seconds <= Math.round(50 * ratio)) return 'pf-heartbeat-calm'
  return 'pf-heartbeat-normal'
}

function TimerEffectsPillCountdownHeartbeatComponent(props: TimerEffectProps) {
  const {
    startSeconds = DEFAULT_START,
    mode = 'visual',
    onEnd,
    onEndBehavior = 'stay',
    textColor,
    fontSize,
  } = props

  const resolved = resolveTimerProps(props, DEFAULT_WARNING, DEFAULT_CRITICAL)
  const { seconds, phase, isExpired, isHidden } = useCountdown({
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

  const heartbeatLevel = resolveHeartbeatLevel(seconds, startSeconds, isExpired)
  const phaseColor = resolved.colors?.[phase]

  const pillStyle = phaseColor !== undefined ? buildHeartbeatPillTheme(phaseColor) : undefined

  const timeStyle: React.CSSProperties = {
    ...(textColor !== undefined ? { color: textColor } : {}),
    ...(fontSize !== undefined ? { fontSize: `${fontSize}px` } : {}),
  }

  return (
    <div
      className="pf-pill-countdown-heartbeat-container"
      data-animation-id="timer-effects__pill-countdown-heartbeat"
    >
      <div className={`pf-pill-countdown-heartbeat ${heartbeatLevel}`} style={pillStyle}>
        <span className="pf-pill-countdown-heartbeat__glow" aria-hidden="true" />
        <span className="pf-pill-countdown-heartbeat__text" style={timeStyle}>
          {formatTime(seconds)}
        </span>
      </div>
    </div>
  )
}

export const TimerEffectsPillCountdownHeartbeat = memo(TimerEffectsPillCountdownHeartbeatComponent)
