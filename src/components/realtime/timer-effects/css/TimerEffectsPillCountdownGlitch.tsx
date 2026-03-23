/**
 * Pill countdown with digital glitch/corruption effect — CSS variant.
 * Glitch intensity increases as time runs out, with chromatic aberration text copies.
 *
 * Copy-paste files: this file + SharedTypes.ts + SharedTimer.ts + SharedFormat.ts + shared.css (glitch section) + TimerEffectsPillCountdownGlitch.css
 * Runtime deps: react
 */

import { memo } from 'react'

import { formatTime } from '../SharedFormat'
import { useCountdown } from '../SharedTimer'
import type { TimerEffectProps } from '../SharedTypes'

import './shared.css'
import './TimerEffectsPillCountdownGlitch.css'

const DEFAULT_START = 60
const DEFAULT_WARNING = 30
const DEFAULT_CRITICAL = 10

type GlitchLevel =
  | ''
  | 'pf-glitch-minimal'
  | 'pf-glitch-subtle'
  | 'pf-glitch-mild'
  | 'pf-glitch-moderate'
  | 'pf-glitch-severe'
  | 'pf-timer-expired'

/** Original absolute-second thresholds, scaled proportionally to startSeconds */
function resolveGlitchLevel(
  seconds: number,
  startSeconds: number,
  isExpired: boolean
): GlitchLevel {
  if (isExpired) return 'pf-timer-expired'
  const ratio = startSeconds / 60
  if (seconds <= Math.round(10 * ratio)) return 'pf-glitch-severe'
  if (seconds <= Math.round(20 * ratio)) return 'pf-glitch-moderate'
  if (seconds <= Math.round(30 * ratio)) return 'pf-glitch-mild'
  if (seconds <= Math.round(40 * ratio)) return 'pf-glitch-subtle'
  if (seconds <= Math.round(50 * ratio)) return 'pf-glitch-minimal'
  return ''
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

  const pillStyle: React.CSSProperties = {
    ...(phaseColor !== undefined ? { backgroundColor: phaseColor } : {}),
  }

  const timeStyle: React.CSSProperties = {
    ...(textColor !== undefined ? { color: textColor } : {}),
    ...(fontSize !== undefined ? { fontSize: `${fontSize}px` } : {}),
  }

  return (
    <div
      className="pf-pill-countdown-glitch-container"
      data-animation-id="timer-effects__pill-countdown-glitch"
    >
      <div className={`pf-pill-countdown-glitch ${glitchLevel}`} style={pillStyle}>
        <span className="pf-pill-countdown-glitch__glow" aria-hidden="true" />
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
      </div>
    </div>
  )
}

export const TimerEffectsPillCountdownGlitch = memo(TimerEffectsPillCountdownGlitchComponent)
