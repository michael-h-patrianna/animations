/**
 * Pill countdown with intense buzz-shake effect and aggressive color transitions.
 * Buzzes at landmark seconds and every second in the final 10.
 *
 * Copy-paste files: this file + SharedTypes.ts + SharedTimer.ts + SharedFormat.ts + ../shared.css + TimerEffectsPillCountdownExtreme.module.css
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
import styles from './TimerEffectsPillCountdownExtreme.module.css'

const DEFAULT_START = 60
const DEFAULT_WARNING = 30
const DEFAULT_CRITICAL = 10
const FLASH_RESET_DELAY_MS = 220

function shouldTriggerBuzz(displaySeconds: number): boolean {
  if (displaySeconds === 60 || displaySeconds === 50 || displaySeconds === 40) return true
  if (displaySeconds <= 30 && displaySeconds >= 15 && displaySeconds % 5 === 0) return true
  return displaySeconds <= 10 && displaySeconds > 0
}

const buzzVariants = {
  idle: { scale: 1, x: 0 },
  buzz: {
    scale: [1, 1.02, 0.98, 1.01, 1],
    x: [0, -2, 2, -1, 0],
    transition: { duration: 0.18, ease: easeOut },
  },
}

const glowVariants = {
  idle: { scale: 0.9, opacity: 0 },
  buzz: {
    scale: [0.9, 1.08, 0.94, 1.05, 0.9],
    opacity: [0, 0.6, 0.4, 0.5, 0],
    transition: { duration: 0.18, ease: easeOut },
  },
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

  const prefersReducedMotion = useReducedMotion()
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

  const [buzzKey, setBuzzKey] = useState(0)
  const [flashClass, setFlashClass] = useState('')
  const prevSecondsRef = useRef(startSeconds)
  const timeoutIdsRef = useRef(new Set<ReturnType<typeof setTimeout>>())

  useEffect(() => {
    setBuzzKey((k) => k + 1)
  }, [])

  useEffect(() => {
    if (seconds === prevSecondsRef.current) return
    prevSecondsRef.current = seconds

    // Flash on zero
    if (isExpired) {
      setFlashClass('is-flash')
      const timeoutId = setTimeout(() => {
        timeoutIdsRef.current.delete(timeoutId)
        setFlashClass('')
      }, FLASH_RESET_DELAY_MS)
      timeoutIdsRef.current.add(timeoutId)
    }

    if (shouldTriggerBuzz(seconds)) {
      setBuzzKey((k) => k + 1)
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
    <div
      className={styles['pf-pill-timer-fm']}
      data-animation-id="timer-effects__pill-countdown-extreme"
    >
      <m.div
        key={buzzKey}
        className={`${styles['pf-pill-timer-fm__pill']} ${styles['pf-pill-timer-fm__pill--extreme']} ${styles[`pf-pill-timer-fm--${phase}`] ?? ''} ${flashClass}`}
        variants={prefersReducedMotion ? undefined : buzzVariants}
        initial="idle"
        animate={prefersReducedMotion ? { opacity: [1, 0.7, 1] } : 'buzz'}
        transition={prefersReducedMotion ? { duration: 0.15 } : undefined}
        style={pillStyle}
      >
        {!prefersReducedMotion && (
          <m.span
            className={styles['pf-pill-timer-fm__glow']}
            aria-hidden="true"
            variants={glowVariants}
            initial="idle"
            animate="buzz"
          />
        )}
        <div className={styles['pf-pill-timer-fm__time']} style={timeStyle}>
          {formatTime(seconds)}
        </div>
      </m.div>
    </div>
  )
}

export const TimerEffectsPillCountdownExtreme = memo(TimerEffectsPillCountdownExtremeComponent)
