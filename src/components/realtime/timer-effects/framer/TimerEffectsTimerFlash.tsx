/**
 * Timer pill with color transition and increasing pulse urgency.
 * Background shifts from yellow to red with easeInOut curve.
 * Glow and pulse intensify as time runs out.
 *
 * Copy-paste files: this file + SharedTypes.ts + SharedTimer.ts + SharedFormat.ts + TimerEffectsTimerFlash.css
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { easeInOut } from 'motion/react'
import { memo } from 'react'

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

function TimerEffectsTimerFlashComponent(props: TimerEffectProps) {
  const {
    startSeconds = DEFAULT_START,
    mode = 'visual',
    onEnd,
    onEndBehavior = 'stay',
    textColor,
    fontSize,
  } = props

  const resolved = resolveTimerProps(props, DEFAULT_WARNING, DEFAULT_CRITICAL)

  const { seconds, isHidden } = useCountdown({
    startSeconds,
    mode,
    thresholds: {
      warning: resolved.warningThreshold,
      critical: resolved.criticalThreshold,
    },
    onEnd,
    onEndBehavior,
  })

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

  // Single urgency value drives pulse speed, glow intensity, and scale
  const urgency = seconds <= resolved.warningThreshold ? (resolved.warningThreshold - seconds) / resolved.warningThreshold : 0
  const pulseSpeed = Math.max(300, 1000 - urgency * 700) / 1000

  const glowAnimation =
    seconds > resolved.warningThreshold
      ? { scale: 0.95, opacity: 0 }
      : {
          scale: [0.95, 0.95 + urgency * 0.5, 0.95],
          opacity: [0, 0.4 + urgency * 0.4, 0],
        }

  const timeStyle: React.CSSProperties = {
    ...(textColor !== undefined ? { color: textColor } : {}),
    ...(fontSize !== undefined ? { fontSize: `${fontSize}px` } : {}),
  }

  return (
    <div className="pf-timer-flash" data-animation-id="timer-effects__timer-flash">
      <m.div
        className="pf-timer-flash__pill"
        style={{ backgroundColor: bgColor, animation: 'none' }}
        animate={
          seconds <= resolved.warningThreshold
            ? { scale: [1, 1 + (resolved.warningThreshold - seconds) / 200, 1] }
            : {}
        }
        transition={{ duration: pulseSpeed, repeat: Infinity, ease: easeInOut }}
      >
        <m.span
          className="pf-timer-flash__glow"
          aria-hidden="true"
          animate={glowAnimation}
          transition={{ duration: pulseSpeed, repeat: Infinity, ease: easeInOut }}
          style={{ animation: 'none' }}
        />
        <div className="pf-timer-flash__time" style={timeStyle}>
          {formatTime(seconds)}
        </div>
      </m.div>
    </div>
  )
}

export const TimerEffectsTimerFlash = memo(TimerEffectsTimerFlashComponent)
