/**
 * Timer pill with color transition and periodic shake reminders.
 * Background shifts from yellow to red with easeInOut curve.
 * Shakes at configurable intervals as a gentle urgency reminder.
 *
 * Copy-paste files: this file + SharedTypes.ts + SharedTimer.ts + SharedFormat.ts + TimerEffectsTimerFlashSoft.css
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { easeOut } from 'motion/react'
import { memo, useEffect, useRef, useState } from 'react'

import {
  computeUrgencyColor,
  FLASH_CRITICAL_RGB,
  FLASH_NORMAL_RGB,
  formatTime,
} from '@/components/realtime/timer-effects/SharedFormat'
import { useCountdown } from '@/components/realtime/timer-effects/SharedTimer'
import { resolveTimerProps, type TimerEffectProps } from '@/components/realtime/timer-effects/SharedTypes'

const DEFAULT_START = 32
const DEFAULT_WARNING = 30
const DEFAULT_CRITICAL = 10
const DEFAULT_SHAKE_INTERVAL = 10

interface TimerEffectsTimerFlashSoftProps extends TimerEffectProps {
  /** Seconds between shake reminders. Default: 10 */
  shakeInterval?: number
}

const shakeVariants = {
  idle: { x: 0, rotate: 0 },
  shake: {
    x: [0, -4, 4, -3, 3, -2, 2, 0],
    rotate: [0, -1, 1, -0.5, 0.5, 0],
    transition: { duration: 0.6, ease: easeOut },
  },
}

const glowVariants = {
  idle: { scale: 0.95, opacity: 0 },
  shake: {
    scale: [0.95, 1.2, 0.95],
    opacity: [0, 0.6, 0],
    transition: { duration: 0.6, ease: easeOut },
  },
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
  
  const { seconds, phase, progress, isHidden } = useCountdown({
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

  // Shake at elapsed-time intervals (original: every 10s of elapsed time)
  const lastShakeProgressRef = useRef(0)
  const shakeIntervalFraction = startSeconds > 0 ? shakeInterval / startSeconds : 1

  useEffect(() => {
    if (progress - lastShakeProgressRef.current >= shakeIntervalFraction) {
      lastShakeProgressRef.current = progress
      setShakeKey((k) => k + 1)
    }
  }, [progress, shakeIntervalFraction])

  if (isHidden) return null

  const bgColor =
    resolved.colors !== undefined
      ? (resolved.colors[
          seconds <= resolved.criticalThreshold
            ? 'critical'
            : seconds <= resolved.warningThreshold
              ? 'warning'
              : 'normal'
        ] ?? computeUrgencyColor(seconds, resolved.warningThreshold, FLASH_NORMAL_RGB, FLASH_CRITICAL_RGB))
      : computeUrgencyColor(seconds, resolved.warningThreshold, FLASH_NORMAL_RGB, FLASH_CRITICAL_RGB)

  const resolvedTextColor = resolved.textColors?.[phase] ?? textColor
  const timeStyle: React.CSSProperties = {
    ...(resolvedTextColor !== undefined ? { color: resolvedTextColor } : {}),
    ...(fontSize !== undefined ? { fontSize: `${fontSize}px` } : {}),
  }

  return (
    <div className="pf-timer-flash" data-animation-id="timer-effects__timer-flash-soft">
      <m.div
        key={shakeKey}
        className="pf-timer-flash__pill pf-timer-flash__pill--soft"
        style={{ backgroundColor: bgColor, animation: 'none' }}
        variants={shakeVariants}
        initial="idle"
        animate="shake"
      >
        <m.span
          className="pf-timer-flash__glow"
          aria-hidden="true"
          variants={glowVariants}
          initial="idle"
          animate="shake"
          style={{ animation: 'none' }}
        />
        <div className="pf-timer-flash__time" style={timeStyle}>
          {formatTime(seconds)}
        </div>
      </m.div>
    </div>
  )
}

export const TimerEffectsTimerFlashSoft = memo(TimerEffectsTimerFlashSoftComponent)
