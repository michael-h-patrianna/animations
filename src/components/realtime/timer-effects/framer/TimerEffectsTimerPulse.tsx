/**
 * Large countdown number with continuous pulse and depleting underline bar.
 * The number pulses rhythmically while the underline shrinks to zero.
 *
 * Copy-paste files: this file + SharedTypes.ts + SharedTimer.ts + SharedFormat.ts + TimerEffectsTimerPulse.css
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { easeInOut } from 'motion/react'
import { memo } from 'react'

import { useCountdown } from '../SharedTimer'
import type { TimerEffectProps } from '../SharedTypes'

const DEFAULT_START = 10
const DEFAULT_WARNING = 6
const DEFAULT_CRITICAL = 3

interface TimerEffectsTimerPulseProps extends TimerEffectProps {
  /** Whether to show the depleting underline bar. Default: true */
  showUnderline?: boolean
}

const pulseVariants = {
  pulse: {
    scale: [1, 1.1, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 0.8,
      repeat: Infinity,
      ease: easeInOut,
    },
  },
}

function TimerEffectsTimerPulseComponent({
  startSeconds = DEFAULT_START,
  mode = 'visual',
  colors,
  thresholds,
  onEnd,
  onEndBehavior = 'stay',
  textColor,
  fontSize,
  showUnderline = true,
}: TimerEffectsTimerPulseProps) {
  const { seconds, phase, progress, isHidden } = useCountdown({
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

  const phaseColor = colors?.[phase]

  const valueStyle: React.CSSProperties = {
    animation: 'none',
    ...(textColor !== undefined ? { color: textColor } : phaseColor !== undefined ? { color: phaseColor } : {}),
    ...(fontSize !== undefined ? { fontSize: `${fontSize}px` } : {}),
  }

  return (
    <div className="pf-timer" data-animation-id="timer-effects__timer-pulse">
      <m.div
        className={`pf-timer__value pf-timer--${phase}`}
        variants={pulseVariants}
        animate="pulse"
        style={valueStyle}
      >
        {seconds}
      </m.div>
      {showUnderline && (
        <m.div
          className="pf-timer__underline"
          animate={{ scaleX: 1 - progress }}
          transition={{ duration: 0.1, ease: 'linear' }}
          style={{ transformOrigin: 'left center', animation: 'none' }}
        />
      )}
    </div>
  )
}

export const TimerEffectsTimerPulse = memo(TimerEffectsTimerPulseComponent)
