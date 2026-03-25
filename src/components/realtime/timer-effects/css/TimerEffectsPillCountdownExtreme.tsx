/**
 * Pill countdown with intense buzz-shake effect and aggressive color transitions — CSS variant.
 * Buzzes at landmark seconds and every second in the final 10.
 *
 * Copy-paste files: this file + SharedTypes.ts + SharedTimer.ts + SharedFormat.ts + shared.css + TimerEffectsPillCountdownExtreme.css
 * Runtime deps: react
 */

import { memo, useEffect, useRef, useState } from 'react'

import { formatTime } from '@/components/realtime/timer-effects/SharedFormat'
import { useCountdown } from '@/components/realtime/timer-effects/SharedTimer'
import {
  resolveTimerProps,
  type TimerEffectProps,
} from '@/components/realtime/timer-effects/SharedTypes'

import './shared.css'
import './TimerEffectsPillCountdownExtreme.css'

const DEFAULT_START = 60
const DEFAULT_WARNING = 30
const DEFAULT_CRITICAL = 10
const FLASH_RESET_DELAY_MS = 220

function shouldTriggerBuzz(displaySeconds: number): boolean {
  if (displaySeconds === 60 || displaySeconds === 50 || displaySeconds === 40) return true
  if (displaySeconds <= 30 && displaySeconds >= 15 && displaySeconds % 5 === 0) return true
  return displaySeconds <= 10 && displaySeconds > 0
}

function TimerEffectsPillCountdownExtremeComponent(props: TimerEffectProps) {
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

  const [animationKey, setAnimationKey] = useState(0)
  const [flashClass, setFlashClass] = useState('')
  const prevSecondsRef = useRef(startSeconds)
  const timeoutIdsRef = useRef(new Set<ReturnType<typeof setTimeout>>())

  useEffect(() => {
    setAnimationKey((k) => k + 1)
  }, [])

  useEffect(() => {
    if (seconds === prevSecondsRef.current) return
    prevSecondsRef.current = seconds

    if (isExpired) {
      setFlashClass('is-flash')
      const timeoutId = setTimeout(() => {
        timeoutIdsRef.current.delete(timeoutId)
        setFlashClass('')
      }, FLASH_RESET_DELAY_MS)
      timeoutIdsRef.current.add(timeoutId)
    }

    if (shouldTriggerBuzz(seconds)) {
      setAnimationKey((k) => k + 1)
    }
  }, [seconds, isExpired])

  useEffect(() => {
    const ids = timeoutIdsRef.current
    return () => {
      ids.forEach((id) => clearTimeout(id))
      ids.clear()
    }
  }, [])

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
    <div className="pf-pill-timer" data-animation-id="timer-effects__pill-countdown-extreme">
      <div
        key={animationKey}
        className={`pf-pill-timer__pill pf-pill-timer__pill--extreme pf-pill-timer--${phase} ${flashClass}`}
        style={pillStyle}
      >
        <span className="pf-pill-timer__glow" aria-hidden="true" />
        <div className="pf-pill-timer__time" style={timeStyle}>
          {formatTime(seconds)}
        </div>
      </div>
    </div>
  )
}

export const TimerEffectsPillCountdownExtreme = memo(TimerEffectsPillCountdownExtremeComponent)
