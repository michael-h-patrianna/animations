/**
 * Pill countdown with quiet, breathing-style pulse at key thresholds.
 * Pulses at every 10s mark and each of the last 5 seconds.
 *
 * Copy-paste files: this file + SharedTypes.ts + SharedTimer.ts + SharedFormat.ts + ../shared.css + TimerEffectsPillCountdownSoft.css
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { easeOut, useReducedMotion } from 'motion/react'
import { memo, useEffect, useRef, useState } from 'react'

import { formatTime } from '@/components/realtime/timer-effects/SharedFormat'
import { useCountdown } from '@/components/realtime/timer-effects/SharedTimer'
import {
  resolveTimerProps,
  type TimerEffectProps,
} from '@/components/realtime/timer-effects/SharedTypes'

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

const pulseVariants = {
  idle: { scale: 1, opacity: 1 },
  pulse: (intensity: number) => ({
    scale: [1, 1 + intensity, 1],
    opacity: [1, 0.9, 1],
    transition: { duration: 0.24, ease: easeOut },
  }),
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

  const prefersReducedMotion = useReducedMotion()
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

  const [pulseKey, setPulseKey] = useState(0)
  const prevSecondsRef = useRef(startSeconds)

  // Trigger pulse on mount
  useEffect(() => {
    setPulseKey((k) => k + 1)
  }, [])

  // Trigger pulse at thresholds
  useEffect(() => {
    if (seconds !== prevSecondsRef.current && shouldPulse(seconds)) {
      setPulseKey((k) => k + 1)
    }
    prevSecondsRef.current = seconds
  }, [seconds])

  if (isHidden) return null

  const phaseColor = resolved.colors?.[phase]
  const pillStyle: React.CSSProperties = {
    animation: 'none',
    ...(phaseColor !== undefined ? { backgroundColor: phaseColor } : {}),
  }

  const resolvedTextColor = resolved.textColors?.[phase] ?? textColor
  const timeStyle: React.CSSProperties = {
    ...(resolvedTextColor !== undefined ? { color: resolvedTextColor } : {}),
    ...(fontSize !== undefined ? { fontSize: `${fontSize}px` } : {}),
  }

  return (
    <div className="pf-pill-timer" data-animation-id="timer-effects__pill-countdown-soft">
      <m.div
        key={pulseKey}
        className={`pf-pill-timer__pill pf-pill-timer__pill--soft pf-pill-timer--${phase}`}
        variants={prefersReducedMotion ? undefined : pulseVariants}
        custom={pulseIntensity}
        initial="idle"
        animate={prefersReducedMotion ? { opacity: [1, 0.7, 1] } : 'pulse'}
        transition={prefersReducedMotion ? { duration: 0.15 } : undefined}
        style={pillStyle}
      >
        <div className="pf-pill-timer__time" style={timeStyle}>
          {formatTime(seconds)}
        </div>
      </m.div>
    </div>
  )
}

export const TimerEffectsPillCountdownSoft = memo(TimerEffectsPillCountdownSoftComponent)
