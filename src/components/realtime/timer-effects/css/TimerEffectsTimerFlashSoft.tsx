/**
 * Timer pill with color transition and periodic shake reminders — CSS variant.
 * Background shifts through phase colors. Shakes at configurable intervals via CSS animation replay.
 *
 * Copy-paste files: this file + SharedTypes.ts + SharedTimer.ts + SharedFormat.ts + TimerEffectsTimerFlashSoft.css
 * Runtime deps: react
 */

import { memo, useEffect, useRef, useState } from 'react'

import { formatTime } from '@/components/realtime/timer-effects/SharedFormat'
import { useCountdown } from '@/components/realtime/timer-effects/SharedTimer'
import { resolveTimerProps, type TimerEffectProps } from '@/components/realtime/timer-effects/SharedTypes'

import './TimerEffectsTimerFlashSoft.css'

const DEFAULT_START = 32
const DEFAULT_WARNING = 30
const DEFAULT_CRITICAL = 10
const DEFAULT_SHAKE_INTERVAL = 10

interface TimerEffectsTimerFlashSoftProps extends TimerEffectProps {
  /** Seconds between shake reminders. Default: 10 */
  shakeInterval?: number
}

function TimerEffectsTimerFlashSoftComponent(props: TimerEffectsTimerFlashSoftProps) {
  const {
    startSeconds = DEFAULT_START,
    mode = 'visual',
    onEnd,
    onEndBehavior = 'stay',
    textColor,
    fontSize,
    shakeInterval = DEFAULT_SHAKE_INTERVAL,
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

  const [shakeKey, setShakeKey] = useState(0)
  const lastShakeAtRef = useRef(0)

  useEffect(() => {
    const elapsed = startSeconds - seconds
    if (elapsed - lastShakeAtRef.current >= shakeInterval) {
      lastShakeAtRef.current = elapsed
      setShakeKey((k) => k + 1)
    }
  }, [seconds, startSeconds, shakeInterval])

  if (isHidden) return null

  const phaseColor = resolved.colors?.[phase]
  const pillStyle: React.CSSProperties = {
    ...(phaseColor !== undefined ? { backgroundColor: phaseColor } : {}),
  }

  const resolvedTextColor = resolved.textColors?.[phase] ?? textColor
  const timeStyle: React.CSSProperties = {
    ...(resolvedTextColor !== undefined ? { color: resolvedTextColor } : {}),
    ...(fontSize !== undefined ? { fontSize: `${fontSize}px` } : {}),
  }

  return (
    <div className="pf-timer-flash-soft" data-animation-id="timer-effects__timer-flash-soft">
      <div
        key={shakeKey}
        className={`pf-timer-flash-soft__pill pf-timer-flash-soft--${phase}`}
        style={pillStyle}
      >
        <span className="pf-timer-flash-soft__glow" aria-hidden="true" />
        <div className="pf-timer-flash-soft__time" style={timeStyle}>
          {formatTime(seconds)}
        </div>
      </div>
    </div>
  )
}

export const TimerEffectsTimerFlashSoft = memo(TimerEffectsTimerFlashSoftComponent)
