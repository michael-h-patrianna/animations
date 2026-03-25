/**
 * Pill countdown with organic heartbeat pulse effect.
 * Heartbeat rate and glow intensity increase at fixed-second thresholds.
 *
 * Copy-paste files: this file + SharedTypes.ts + SharedTimer.ts + SharedFormat.ts + SharedPillPhaseTheme.ts + TimerEffectsPillCountdownHeartbeat.css + ../shared.css (heartbeat section)
 * Runtime deps: react, motion
 */

import { easeInOut } from 'motion/react'
import * as m from 'motion/react-m'
import { memo } from 'react'

import { formatTime } from '@/components/realtime/timer-effects/SharedFormat'
import { buildHeartbeatPillTheme } from '@/components/realtime/timer-effects/SharedPillPhaseTheme'
import { useCountdown } from '@/components/realtime/timer-effects/SharedTimer'
import {
  resolveTimerProps,
  type TimerEffectProps,
} from '@/components/realtime/timer-effects/SharedTypes'

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

/** Original per-level glow animation values — preserved exactly from source */
function getGlowAnimation(seconds: number, startSeconds: number, isExpired: boolean) {
  const ratio = startSeconds / 60
  if (isExpired) {
    return {
      scale: [1, 1.3, 1],
      opacity: [0.45, 0.8, 0.45],
      transition: { duration: 0.6, repeat: Infinity, ease: easeInOut },
    }
  }
  if (seconds <= Math.round(10 * ratio)) {
    return {
      scale: [1, 1.25, 1],
      opacity: [0.4, 0.75, 0.4],
      transition: { duration: 0.5, repeat: Infinity, ease: easeInOut },
    }
  }
  if (seconds <= Math.round(20 * ratio)) {
    return {
      scale: [1, 1.2, 1],
      opacity: [0.35, 0.65, 0.35],
      transition: { duration: 0.7, repeat: Infinity, ease: easeInOut },
    }
  }
  if (seconds <= Math.round(30 * ratio)) {
    return {
      scale: [1, 1.15, 1],
      opacity: [0.3, 0.55, 0.3],
      transition: { duration: 0.9, repeat: Infinity, ease: easeInOut },
    }
  }
  if (seconds <= Math.round(40 * ratio)) {
    return {
      scale: [1, 1.1, 1],
      opacity: [0.25, 0.45, 0.25],
      transition: { duration: 1.2, repeat: Infinity, ease: easeInOut },
    }
  }
  if (seconds <= Math.round(50 * ratio)) {
    return {
      scale: [1, 1.08, 1],
      opacity: [0.2, 0.4, 0.2],
      transition: { duration: 1.5, repeat: Infinity, ease: easeInOut },
    }
  }
  return {
    scale: [1, 1.05, 1],
    opacity: [0.15, 0.35, 0.15],
    transition: { duration: 2, repeat: Infinity, ease: easeInOut },
  }
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
  const pillThemeStyle = phaseColor !== undefined ? buildHeartbeatPillTheme(phaseColor) : undefined

  const resolvedTextColor = resolved.textColors?.[phase] ?? textColor
  const timeStyle: React.CSSProperties = {
    ...(resolvedTextColor !== undefined ? { color: resolvedTextColor } : {}),
    ...(fontSize !== undefined ? { fontSize: `${fontSize}px` } : {}),
  }

  return (
    <div
      className="pf-pill-countdown-heartbeat-container"
      data-animation-id="timer-effects__pill-countdown-heartbeat"
    >
      <m.div
        className={`pf-pill-countdown-heartbeat ${heartbeatLevel}`}
        style={{ animation: 'none', ...pillThemeStyle }}
      >
        <m.span
          className="pf-pill-countdown-heartbeat__glow"
          aria-hidden="true"
          animate={getGlowAnimation(seconds, startSeconds, isExpired)}
          style={{ animation: 'none' }}
        />
        <span className="pf-pill-countdown-heartbeat__text" style={timeStyle}>
          {formatTime(seconds)}
        </span>
      </m.div>
    </div>
  )
}

export const TimerEffectsPillCountdownHeartbeat = memo(TimerEffectsPillCountdownHeartbeatComponent)
