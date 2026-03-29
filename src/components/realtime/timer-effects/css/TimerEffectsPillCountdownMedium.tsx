/**
 * Pill countdown with periodic LED-style blip at interval thresholds — CSS variant.
 * Blips every 6s normally, every 3s under 12 seconds.
 *
 * Copy-paste files: this file + SharedTypes.ts + SharedTimer.ts + SharedFormat.ts + shared.css + TimerEffectsPillCountdownMedium.module.css
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
import styles from './TimerEffectsPillCountdownMedium.module.css'

const DEFAULT_START = 60
const DEFAULT_WARNING = 30
const DEFAULT_CRITICAL = 10

function shouldBlip(display: number): boolean {
  if (display > 12) return display % 6 === 0 && display > 0
  if (display > 0) return display % 3 === 0
  return false
}

function TimerEffectsPillCountdownMediumComponent(props: TimerEffectProps) {
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

  const [animationKey, setAnimationKey] = useState(0)
  const prevSecondsRef = useRef(startSeconds)

  useEffect(() => {
    setAnimationKey((k) => k + 1)
  }, [])

  useEffect(() => {
    if (seconds !== prevSecondsRef.current && shouldBlip(seconds)) {
      setAnimationKey((k) => k + 1)
    }
    prevSecondsRef.current = seconds
  }, [seconds])

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
    <div className="pf-pill-timer" data-animation-id="timer-effects__pill-countdown-medium">
      <div
        key={animationKey}
        className={`pf-pill-timer__pill ${styles['pf-pill-timer__pill--medium']} pf-pill-timer--${phase}`}
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

export const TimerEffectsPillCountdownMedium = memo(TimerEffectsPillCountdownMediumComponent)
