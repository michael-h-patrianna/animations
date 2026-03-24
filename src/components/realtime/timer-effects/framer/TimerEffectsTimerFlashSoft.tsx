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
} from '../SharedFormat'
import { useCountdown } from '../SharedTimer'
import type { TimerEffectProps } from '../SharedTypes'

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

function TimerEffectsTimerFlashSoftComponent({
  startSeconds = DEFAULT_START,
  mode = 'visual',
  colors,
  thresholds,
  onEnd,
  onEndBehavior = 'stay',
  textColor,
  fontSize,
  shakeInterval = DEFAULT_SHAKE_INTERVAL,
}: TimerEffectsTimerFlashSoftProps) {
  const warningThreshold = thresholds?.warning ?? DEFAULT_WARNING

  const { seconds, progress, isHidden } = useCountdown({
    startSeconds,
    mode,
    thresholds: {
      warning: warningThreshold,
      critical: thresholds?.critical ?? DEFAULT_CRITICAL,
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
    colors !== undefined
      ? (colors[
          seconds <= (thresholds?.critical ?? DEFAULT_CRITICAL)
            ? 'critical'
            : seconds <= warningThreshold
              ? 'warning'
              : 'normal'
        ] ??
        computeUrgencyColor(seconds, warningThreshold, FLASH_NORMAL_RGB, FLASH_CRITICAL_RGB))
      : computeUrgencyColor(seconds, warningThreshold, FLASH_NORMAL_RGB, FLASH_CRITICAL_RGB)

  const timeStyle: React.CSSProperties = {
    ...(textColor !== undefined ? { color: textColor } : {}),
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
