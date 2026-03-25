/**
 * Pill countdown with aggressive snap emphasis and double-tap at critical seconds — CSS variant.
 * Color transitions through normal → caution → danger phases.
 *
 * Copy-paste files: this file + SharedTypes.ts + SharedTimer.ts + SharedFormat.ts + shared.css + TimerEffectsPillCountdownStrong.css
 * Runtime deps: react
 */

import { memo, useEffect, useRef, useState } from 'react'

import { formatTime } from '@/components/realtime/timer-effects/SharedFormat'
import { useCountdown } from '@/components/realtime/timer-effects/SharedTimer'
import { resolveTimerProps, type TimerEffectProps } from '@/components/realtime/timer-effects/SharedTypes'

import './shared.css'
import './TimerEffectsPillCountdownStrong.css'

const DEFAULT_START = 60
const DEFAULT_WARNING = 30
const DEFAULT_CRITICAL = 10
const DOUBLE_TAP_DELAY_MS = 160

const PRIMARY_SNAP_SECONDS = new Set([55, 50, 45, 40, 35, 30, 25, 20])
const SECONDARY_SNAP_SECONDS = new Set([15, 12])
const DOUBLE_TAP_SNAP_SECONDS = new Set([9, 7, 5, 3, 1])

function getSnapBursts(displaySeconds: number): number {
  if (PRIMARY_SNAP_SECONDS.has(displaySeconds) || SECONDARY_SNAP_SECONDS.has(displaySeconds))
    return 1
  if (DOUBLE_TAP_SNAP_SECONDS.has(displaySeconds)) return 2
  return 0
}

function TimerEffectsPillCountdownStrongComponent(props: TimerEffectProps) {
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
  const timeoutIdsRef = useRef(new Set<ReturnType<typeof setTimeout>>())

  useEffect(() => {
    setAnimationKey((k) => k + 1)
  }, [])

  useEffect(() => {
    if (seconds === prevSecondsRef.current) return
    prevSecondsRef.current = seconds

    const burstCount = getSnapBursts(seconds)
    if (burstCount > 0) {
      setAnimationKey((k) => k + 1)
      if (burstCount === 2) {
        const timeoutId = setTimeout(() => {
          timeoutIdsRef.current.delete(timeoutId)
          setAnimationKey((k) => k + 1)
        }, DOUBLE_TAP_DELAY_MS)
        timeoutIdsRef.current.add(timeoutId)
      }
    }
  }, [seconds])

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
    <div className="pf-pill-timer" data-animation-id="timer-effects__pill-countdown-strong">
      <div
        key={animationKey}
        className={`pf-pill-timer__pill pf-pill-timer__pill--strong pf-pill-timer--${phase}`}
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

export const TimerEffectsPillCountdownStrong = memo(TimerEffectsPillCountdownStrongComponent)
