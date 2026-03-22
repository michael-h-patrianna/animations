/**
 * Pill countdown with periodic LED-style blip at interval thresholds — CSS variant.
 * Blips every 6s normally, every 3s under 12 seconds.
 *
 * Copy-paste files: this file + SharedTypes.ts + SharedTimer.ts + SharedFormat.ts + shared.css + TimerEffectsPillCountdownMedium.css
 * Runtime deps: react
 */

import { memo, useEffect, useRef, useState } from 'react'

import { formatTime } from '../SharedFormat'
import { useCountdown } from '../SharedTimer'
import type { TimerEffectProps } from '../SharedTypes'

import './shared.css'
import './TimerEffectsPillCountdownMedium.css'

const DEFAULT_START = 60
const DEFAULT_WARNING = 30
const DEFAULT_CRITICAL = 10

function shouldBlip(display: number): boolean {
  if (display > 12) return display % 6 === 0 && display > 0
  if (display > 0) return display % 3 === 0
  return false
}

function TimerEffectsPillCountdownMediumComponent({
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

  const phaseColor = colors?.[phase]
  const pillStyle: React.CSSProperties = {
    ...(phaseColor !== undefined ? { backgroundColor: phaseColor } : {}),
  }

  const timeStyle: React.CSSProperties = {
    ...(textColor !== undefined ? { color: textColor } : {}),
    ...(fontSize !== undefined ? { fontSize: `${fontSize}px` } : {}),
  }

  return (
    <div className="pf-pill-timer" data-animation-id="timer-effects__pill-countdown-medium">
      <div
        key={animationKey}
        className={`pf-pill-timer__pill pf-pill-timer__pill--medium pf-pill-timer--${phase}`}
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
