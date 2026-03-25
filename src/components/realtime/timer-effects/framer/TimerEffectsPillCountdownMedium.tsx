/**
 * Pill countdown with periodic LED-style blip at interval thresholds.
 * Blips every 6s normally, every 3s under 12 seconds.
 *
 * Copy-paste files: this file + SharedTypes.ts + SharedTimer.ts + SharedFormat.ts + ../shared.css + TimerEffectsPillCountdownMedium.css
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { easeOut } from 'motion/react'
import { memo, useEffect, useRef, useState } from 'react'

import { formatTime } from '@/components/realtime/timer-effects/SharedFormat'
import { useCountdown } from '@/components/realtime/timer-effects/SharedTimer'
import { resolveTimerProps, type TimerEffectProps } from '@/components/realtime/timer-effects/SharedTypes'

const DEFAULT_START = 60
const DEFAULT_WARNING = 30
const DEFAULT_CRITICAL = 10

function shouldBlip(display: number): boolean {
  if (display > 12) return display % 6 === 0 && display > 0
  if (display > 0) return display % 3 === 0
  return false
}

const blipVariants = {
  idle: { scale: 1, opacity: 1 },
  blip: {
    scale: [1, 1.08, 1],
    opacity: [1, 0.85, 1],
    transition: { duration: 0.32, ease: easeOut },
  },
}

const glowVariants = {
  idle: { scale: 0.9, opacity: 0 },
  blip: {
    scale: [0.9, 1.15, 0.9],
    opacity: [0, 0.6, 0],
    transition: { duration: 0.32, ease: easeOut },
  },
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

  const [blipKey, setBlipKey] = useState(0)
  const prevSecondsRef = useRef(startSeconds)

  useEffect(() => {
    setBlipKey((k) => k + 1)
  }, [])

  useEffect(() => {
    if (seconds !== prevSecondsRef.current && shouldBlip(seconds)) {
      setBlipKey((k) => k + 1)
    }
    prevSecondsRef.current = seconds
  }, [seconds])

  if (isHidden) return null

  const phaseColor = resolved.colors?.[phase]
  const pillStyle: React.CSSProperties = {
    animation: 'none',
    ...(phaseColor !== undefined ? { backgroundColor: phaseColor } : {}),
  }

  const timeStyle: React.CSSProperties = {
    ...(textColor !== undefined ? { color: textColor } : {}),
    ...(fontSize !== undefined ? { fontSize: `${fontSize}px` } : {}),
  }

  return (
    <div className="pf-pill-timer" data-animation-id="timer-effects__pill-countdown-medium">
      <m.div
        key={blipKey}
        className={`pf-pill-timer__pill pf-pill-timer__pill--medium pf-pill-timer--${phase}`}
        variants={blipVariants}
        initial="idle"
        animate="blip"
        style={pillStyle}
      >
        <m.span
          className="pf-pill-timer__glow"
          aria-hidden="true"
          variants={glowVariants}
          initial="idle"
          animate="blip"
          style={{ animation: 'none' }}
        />
        <div className="pf-pill-timer__time" style={timeStyle}>
          {formatTime(seconds)}
        </div>
      </m.div>
    </div>
  )
}

export const TimerEffectsPillCountdownMedium = memo(TimerEffectsPillCountdownMediumComponent)
