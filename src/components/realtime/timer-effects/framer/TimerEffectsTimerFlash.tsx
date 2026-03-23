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

import { formatTime } from '../SharedFormat'
import { useCountdown } from '../SharedTimer'
import type { TimerEffectProps } from '../SharedTypes'

const DEFAULT_START = 32
const DEFAULT_WARNING = 30
const DEFAULT_CRITICAL = 10

/** Original easeInOut curve for color interpolation */
function easeInOutFn(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

/**
 * Computes background color by interpolating between two RGB colors
 * using the original easeInOut urgency curve.
 */
function computeBgColor(
  seconds: number,
  warningThreshold: number,
  normalColor: { r: number; g: number; b: number },
  criticalColor: { r: number; g: number; b: number }
): string {
  const urgencyLevel =
    seconds <= warningThreshold ? (warningThreshold - seconds) / warningThreshold : 0
  const easedUrgency = easeInOutFn(urgencyLevel)
  const r = Math.round(normalColor.r + (criticalColor.r - normalColor.r) * easedUrgency)
  const g = Math.round(normalColor.g + (criticalColor.g - normalColor.g) * easedUrgency)
  const b = Math.round(normalColor.b + (criticalColor.b - normalColor.b) * easedUrgency)
  return `rgb(${r}, ${g}, ${b})` // eslint-disable-line animation-rules/no-hardcoded-colors -- dynamic color computation
}

function TimerEffectsTimerFlashComponent({
  startSeconds = DEFAULT_START,
  mode = 'visual',
  colors,
  thresholds,
  onEnd,
  onEndBehavior = 'stay',
  textColor,
  fontSize,
}: TimerEffectProps) {
  const warningThreshold = thresholds?.warning ?? DEFAULT_WARNING

  const { seconds, isHidden } = useCountdown({
    startSeconds,
    mode,
    thresholds: {
      warning: warningThreshold,
      critical: thresholds?.critical ?? DEFAULT_CRITICAL,
    },
    onEnd,
    onEndBehavior,
  })

  if (isHidden) return null

  // Original color computation: yellow (#ffc107) → red (#dc3545) with easeInOut curve
  const normalRgb = { r: 255, g: 193, b: 7 }
  const criticalRgb = { r: 220, g: 53, b: 69 }
  const bgColor =
    colors !== undefined
      ? (colors[
          seconds <= (thresholds?.critical ?? DEFAULT_CRITICAL)
            ? 'critical'
            : seconds <= warningThreshold
              ? 'warning'
              : 'normal'
        ] ?? computeBgColor(seconds, warningThreshold, normalRgb, criticalRgb))
      : computeBgColor(seconds, warningThreshold, normalRgb, criticalRgb)

  // Pulse speed: 1000ms → 300ms based on urgency (original formula)
  const urgencyLevel =
    seconds <= warningThreshold ? (warningThreshold - seconds) / warningThreshold : 0
  const pulseSpeed = Math.max(300, 1000 - urgencyLevel * 700) / 1000

  // Glow and scale intensity from original: driven by (30 - seconds) / 30
  const intensity =
    seconds <= warningThreshold ? (warningThreshold - seconds) / warningThreshold : 0

  const getGlowAnimation = () => {
    if (seconds > warningThreshold) {
      return { scale: 0.95, opacity: 0 }
    }
    return {
      scale: [0.95, 0.95 + intensity * 0.5, 0.95],
      opacity: [0, 0.4 + intensity * 0.4, 0],
    }
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
          seconds <= warningThreshold
            ? { scale: [1, 1 + (warningThreshold - seconds) / 200, 1] }
            : {}
        }
        transition={{ duration: pulseSpeed, repeat: Infinity, ease: easeInOut }}
      >
        <m.span
          className="pf-timer-flash__glow"
          aria-hidden="true"
          animate={getGlowAnimation()}
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
