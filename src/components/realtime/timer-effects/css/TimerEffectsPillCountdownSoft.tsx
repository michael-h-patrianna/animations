/**
 * Pill countdown with quiet, breathing-style pulse at key thresholds — CSS variant.
 * Pulses at every 10s mark and each of the last 5 seconds.
 *
 * Copy-paste files: this file + SharedTypes.ts + SharedTimer.ts + SharedFormat.ts + shared.css + TimerEffectsPillCountdownSoft.css
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
import styles from './TimerEffectsPillCountdownSoft.module.css'

const DEFAULT_START = 60
const DEFAULT_WARNING = 30
const DEFAULT_CRITICAL = 10

interface TimerEffectsPillCountdownSoftProps extends TimerEffectProps {
  /** Scale intensity of the pulse effect (0-1). Default: 0.05 */
  pulseIntensity?: number
}

function shouldPulse(display: number): boolean {
  if (display > 0 && display <= 60 && display >= 10 && display % 10 === 0) return true
  if (display <= 5 && display > 0) return true
  return false
}

function TimerEffectsPillCountdownSoftComponent(props: TimerEffectsPillCountdownSoftProps) {
  const {
    startSeconds = DEFAULT_START,
    mode = 'visual',
    onEnd,
    onEndBehavior = 'stay',
    textColor,
    fontSize,
    pulseIntensity = 0.05,
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
    if (seconds !== prevSecondsRef.current && shouldPulse(seconds)) {
      setAnimationKey((k) => k + 1)
    }
    prevSecondsRef.current = seconds
  }, [seconds])

  if (isHidden) return null

  const phaseColor = resolved.colors?.[phase]
  const pillStyle = {
    ...(phaseColor !== undefined ? { backgroundColor: phaseColor } : {}),
    '--pf-pill-soft-pulse-scale': String(1 + Math.max(0, pulseIntensity)),
  } as React.CSSProperties

  const resolvedTextColor = resolved.textColors?.[phase] ?? textColor
  const timeStyle: React.CSSProperties = {
    ...(resolvedTextColor !== undefined ? { color: resolvedTextColor } : {}),
    ...(fontSize !== undefined ? { fontSize: `${fontSize}px` } : {}),
  }

  return (
    <div className="pf-pill-timer" data-animation-id="timer-effects__pill-countdown-soft">
      <div
        key={animationKey}
        className={`pf-pill-timer__pill ${styles['pf-pill-timer__pill--soft']} pf-pill-timer--${phase}`}
        style={pillStyle}
      >
        <div className="pf-pill-timer__time" style={timeStyle}>
          {formatTime(seconds)}
        </div>
      </div>
    </div>
  )
}

export const TimerEffectsPillCountdownSoft = memo(TimerEffectsPillCountdownSoftComponent)
