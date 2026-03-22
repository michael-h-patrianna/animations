/**
 * Pill countdown with digital glitch/corruption effect.
 * Glitch intensity increases at fixed-second thresholds with chromatic aberration text copies.
 *
 * Copy-paste files: this file + SharedTypes.ts + SharedTimer.ts + SharedFormat.ts + TimerEffectsPillCountdownGlitch.css + ../shared.css (glitch section)
 * Runtime deps: react, motion
 */

import { easeInOut } from 'motion/react'
import * as m from 'motion/react-m'
import { memo } from 'react'

import { formatTime } from '../SharedFormat'
import { useCountdown } from '../SharedTimer'
import type { TimerEffectProps } from '../SharedTypes'

const DEFAULT_START = 60
const DEFAULT_WARNING = 30
const DEFAULT_CRITICAL = 10

type GlitchLevel = '' | 'pf-glitch-minimal' | 'pf-glitch-subtle' | 'pf-glitch-mild' | 'pf-glitch-moderate' | 'pf-glitch-severe' | 'pf-timer-expired'

/** Original absolute-second thresholds, scaled proportionally to startSeconds */
function resolveGlitchLevel(seconds: number, startSeconds: number, isExpired: boolean): GlitchLevel {
  if (isExpired) return 'pf-timer-expired'
  // Original thresholds for 60s: 50, 40, 30, 20, 10
  // Scale proportionally for other startSeconds values
  const ratio = startSeconds / 60
  if (seconds <= Math.round(10 * ratio)) return 'pf-glitch-severe'
  if (seconds <= Math.round(20 * ratio)) return 'pf-glitch-moderate'
  if (seconds <= Math.round(30 * ratio)) return 'pf-glitch-mild'
  if (seconds <= Math.round(40 * ratio)) return 'pf-glitch-subtle'
  if (seconds <= Math.round(50 * ratio)) return 'pf-glitch-minimal'
  return ''
}

/** Original per-level glow animation values — preserved exactly from source */
function getGlowAnimation(seconds: number, startSeconds: number, isExpired: boolean) {
  const ratio = startSeconds / 60
  if (isExpired) {
    return {
      scale: [1, 1.3, 1],
      opacity: [0.45, 0.8, 0.45],
      transition: { duration: 0.4, repeat: Infinity, ease: easeInOut },
    }
  }
  if (seconds <= Math.round(10 * ratio)) {
    return {
      scale: [1, 1.25, 1],
      opacity: [0.35, 0.7, 0.35],
      transition: { duration: 0.5, repeat: Infinity, ease: easeInOut },
    }
  }
  if (seconds <= Math.round(20 * ratio)) {
    return {
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.6, 0.3],
      transition: { duration: 0.8, repeat: Infinity, ease: easeInOut },
    }
  }
  if (seconds <= Math.round(30 * ratio)) {
    return {
      scale: [1, 1.15, 1],
      opacity: [0.25, 0.5, 0.25],
      transition: { duration: 1.1, repeat: Infinity, ease: easeInOut },
    }
  }
  if (seconds <= Math.round(40 * ratio)) {
    return {
      scale: [1, 1.1, 1],
      opacity: [0.2, 0.45, 0.2],
      transition: { duration: 1.4, repeat: Infinity, ease: easeInOut },
    }
  }
  if (seconds <= Math.round(50 * ratio)) {
    return {
      scale: [1, 1.08, 1],
      opacity: [0.15, 0.4, 0.15],
      transition: { duration: 1.7, repeat: Infinity, ease: easeInOut },
    }
  }
  return {
    scale: [1, 1.05, 1],
    opacity: [0.1, 0.35, 0.1],
    transition: { duration: 2, repeat: Infinity, ease: easeInOut },
  }
}

function TimerEffectsPillCountdownGlitchComponent({
  startSeconds = DEFAULT_START,
  mode = 'visual',
  colors,
  thresholds,
  onEnd,
  onEndBehavior = 'stay',
  textColor,
  fontSize,
}: TimerEffectProps) {
  const { seconds, phase, isExpired, isHidden } = useCountdown({
    startSeconds,
    mode,
    thresholds: {
      warning: thresholds?.warning ?? DEFAULT_WARNING,
      critical: thresholds?.critical ?? DEFAULT_CRITICAL,
    },
    onEnd,
    onEndBehavior,
  })

  if (isHidden) return null

  const glitchLevel = resolveGlitchLevel(seconds, startSeconds, isExpired)
  const phaseColor = colors?.[phase]

  const timeStyle: React.CSSProperties = {
    ...(textColor !== undefined ? { color: textColor } : {}),
    ...(fontSize !== undefined ? { fontSize: `${fontSize}px` } : {}),
  }

  return (
    <div
      className="pf-pill-countdown-glitch-container"
      data-animation-id="timer-effects__pill-countdown-glitch"
    >
      <m.div
        className={`pf-pill-countdown-glitch ${glitchLevel}`}
        style={phaseColor !== undefined ? { backgroundColor: phaseColor, animation: 'none' } : { animation: 'none' }}
      >
        <m.span
          className="pf-pill-countdown-glitch__glow"
          aria-hidden="true"
          animate={getGlowAnimation(seconds, startSeconds, isExpired)}
          style={{ animation: 'none' }}
        />
        <span className="pf-pill-countdown-glitch__text" style={timeStyle}>
          {formatTime(seconds)}
        </span>
        <span
          aria-hidden="true"
          className="pf-pill-countdown-glitch__copy pf-pill-countdown-glitch__copy--before"
        >
          {formatTime(seconds)}
        </span>
        <span
          aria-hidden="true"
          className="pf-pill-countdown-glitch__copy pf-pill-countdown-glitch__copy--after"
        >
          {formatTime(seconds)}
        </span>
      </m.div>
    </div>
  )
}

export const TimerEffectsPillCountdownGlitch = memo(TimerEffectsPillCountdownGlitchComponent)
