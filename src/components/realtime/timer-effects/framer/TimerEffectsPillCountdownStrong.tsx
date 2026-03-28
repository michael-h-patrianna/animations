/**
 * Pill countdown with aggressive snap emphasis and double-tap at critical seconds.
 * Color transitions through normal → caution → danger phases.
 *
 * Copy-paste files: this file + SharedTypes.ts + SharedTimer.ts + SharedFormat.ts + ../shared.css + TimerEffectsPillCountdownStrong.css
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
import styles from './TimerEffectsPillCountdownStrong.module.css'

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

const snapVariants = {
  idle: { scale: 1, y: 0 },
  snap: {
    scale: [1, 0.95, 1.03, 1],
    y: [0, 2, -1, 0],
    transition: { duration: 0.16, ease: easeOut },
  },
}

const glowVariants = {
  idle: { scale: 0.92, opacity: 0 },
  snap: {
    scale: [0.92, 0.88, 1.06, 0.92],
    opacity: [0, 0.5, 0.7, 0],
    transition: { duration: 0.16, ease: easeOut },
  },
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

  const [snapKey, setSnapKey] = useState(0)
  const prevSecondsRef = useRef(startSeconds)
  const timeoutIdsRef = useRef(new Set<ReturnType<typeof setTimeout>>())

  useEffect(() => {
    setSnapKey((k) => k + 1)
  }, [])

  useEffect(() => {
    if (seconds === prevSecondsRef.current) return
    prevSecondsRef.current = seconds

    const burstCount = getSnapBursts(seconds)
    if (burstCount > 0) {
      setSnapKey((k) => k + 1)
      if (burstCount === 2) {
        const timeoutId = setTimeout(() => {
          timeoutIdsRef.current.delete(timeoutId)
          setSnapKey((k) => k + 1)
        }, DOUBLE_TAP_DELAY_MS)
        timeoutIdsRef.current.add(timeoutId)
      }
    }
  }, [seconds])

  // Clean up double-tap timeouts on unmount
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
      data-animation-id="timer-effects__pill-countdown-strong"
    >
      <m.div
        key={snapKey}
        className={`${styles['pf-pill-timer-fm__pill']} ${styles['pf-pill-timer-fm__pill--strong'] ?? ''} ${styles[`pf-pill-timer-fm--${phase}`] ?? ''}`}
        variants={prefersReducedMotion ? undefined : snapVariants}
        initial="idle"
        animate={prefersReducedMotion ? { opacity: [1, 0.7, 1] } : 'snap'}
        transition={prefersReducedMotion ? { duration: 0.15 } : undefined}
        style={pillStyle}
      >
        {!prefersReducedMotion && (
          <m.span
            className={styles['pf-pill-timer-fm__glow']}
            aria-hidden="true"
            variants={glowVariants}
            initial="idle"
            animate="snap"
          />
        )}
        <div className={styles['pf-pill-timer-fm__time']} style={timeStyle}>
          {formatTime(seconds)}
        </div>
      </m.div>
    </div>
  )
}

export const TimerEffectsPillCountdownStrong = memo(TimerEffectsPillCountdownStrongComponent)
