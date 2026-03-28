/**
 * Large countdown number with continuous pulse and depleting underline bar — CSS variant.
 * The number pulses via CSS keyframes while the underline shrinks via custom property.
 *
 * Copy-paste files: this file + SharedTypes.ts + SharedTimer.ts + SharedFormat.ts + TimerEffectsTimerPulse.module.css
 * Runtime deps: react
 */

import { memo } from 'react'

import { useCountdown } from '@/components/realtime/timer-effects/SharedTimer'
import {
  resolveTimerProps,
  type TimerEffectProps,
} from '@/components/realtime/timer-effects/SharedTypes'

import './shared.css'
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
    <div className={styles['pf-timer-pulse']} data-animation-id="timer-effects__timer-pulse">
      <div
        className={`${styles['pf-timer-pulse__value']} pf-timer-pulse--${phase}`}
        style={valueStyle}
      >
        {seconds}
      </div>
      {showUnderline && (
        <div
          className={styles['pf-timer-pulse__underline']}
          style={
            {
              '--progress': progress,
              ...(barColor !== undefined ? { background: barColor } : {}),
            } as React.CSSProperties
          }
        />
      )}
    </div>
  )
}

export const TimerEffectsTimerPulse = memo(TimerEffectsTimerPulseComponent)
