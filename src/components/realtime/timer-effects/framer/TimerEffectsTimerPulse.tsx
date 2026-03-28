/**
 * Large countdown number with continuous pulse and depleting underline bar.
 * The number pulses rhythmically while the underline shrinks to zero.
 *
 * Copy-paste files: this file + SharedTypes.ts + SharedTimer.ts + SharedFormat.ts + TimerEffectsTimerPulse.module.css
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { easeInOut, useReducedMotion } from 'motion/react'
import { memo } from 'react'

import { useCountdown } from '@/components/realtime/timer-effects/SharedTimer'
import {
  resolveTimerProps,
  type TimerEffectProps,
} from '@/components/realtime/timer-effects/SharedTypes'
import styles from './TimerEffectsTimerPulse.module.css'

const DEFAULT_START = 10
const DEFAULT_WARNING = 6
const DEFAULT_CRITICAL = 3

interface TimerEffectsTimerPulseProps extends TimerEffectProps {
  /** Override color of the progress underline bar. */
  barColor?: string
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

function TimerEffectsTimerPulseComponent(props: TimerEffectsTimerPulseProps) {
  const {
    startSeconds = DEFAULT_START,
    mode = 'visual',
    onEnd,
    onEndBehavior = 'stay',
    textColor,
    fontSize,
    barColor,
    showUnderline = true,
  } = props

  const prefersReducedMotion = useReducedMotion()
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
    progressMode: showUnderline ? 'smooth' : 'discrete',
  })

  if (isHidden) return null

  const phaseColor = resolved.colors?.[phase]
  const resolvedTextColor = resolved.textColors?.[phase] ?? textColor

  const valueStyle: React.CSSProperties = {
    ...(resolvedTextColor !== undefined
      ? { color: resolvedTextColor }
      : phaseColor !== undefined
        ? { color: phaseColor }
        : {}),
    ...(fontSize !== undefined ? { fontSize: `${fontSize}px` } : {}),
  }

  return (
    <div className={styles['pf-timer-fm']} data-animation-id="timer-effects__timer-pulse">
      <m.div
        className={`${styles['pf-timer-fm__value']} ${styles[`pf-timer-fm--${phase}`] ?? ''}`}
        variants={prefersReducedMotion ? undefined : pulseVariants}
        animate={prefersReducedMotion ? undefined : 'pulse'}
        style={valueStyle}
      >
        {seconds}
      </m.div>
      {showUnderline && (
        <m.div
          className={styles['pf-timer-fm__underline']}
          animate={{ scaleX: 1 - progress }}
          transition={{ duration: prefersReducedMotion ? 0.05 : 0.1, ease: 'linear' }}
          style={{
            transformOrigin: 'left center',
            ...(barColor !== undefined ? { background: barColor } : {}),
          }}
        />
      )}
    </div>
  )
}

export const TimerEffectsTimerPulse = memo(TimerEffectsTimerPulseComponent)
