/**
 * Notification dot — gentle breathing pulse with soft glow ring. CSS variant.
 *
 * Copy-paste files: this file + UpdateIndicatorsHomeIconDotPulse.module.css + ../shared.css + ../SharedTypes.ts
 * Runtime deps: react
 *
 * Usage: <UpdateIndicatorsHomeIconDotPulse dotColor="#ff0000"><MyIcon /></UpdateIndicatorsHomeIconDotPulse>
 */
import { memo } from 'react'
import { DOT_COLOR, ringTint } from '@/components/realtime/update-indicators/SharedDefaults'
import type { DotIndicatorProps } from '@/components/realtime/update-indicators/SharedTypes'
import styles from './UpdateIndicatorsHomeIconDotPulse.module.css'

function UpdateIndicatorsHomeIconDotPulseComponent({
  children,
  dotColor = DOT_COLOR,
  dotSize = 14,
  duration = 1400,
}: DotIndicatorProps) {
  const ringSize = Math.round(dotSize * 0.57)
  const dotStyle = {
    ['--pf-dot-pulse-ring' as string]: ringTint(dotColor, 25),
    ['--pf-dot-pulse-ring-size' as string]: `${ringSize}px`,
    ['--pf-dot-pulse-dur' as string]: `${duration}ms`,
    width: dotSize,
    height: dotSize,
    background: dotColor,
  }

  const dot = (
    <span
      className={`pf-update-indicator__dot pf-update-indicator__dot--pulse ${styles['pf-dot-pulse-anim']}`}
      style={dotStyle}
    />
  )

  return (
    <div className="pf-update-indicator" data-animation-id="update-indicators__home-icon-dot-pulse">
      {children !== undefined ? (
        <div className="pf-update-indicator__anchor">
          {children}
          {dot}
        </div>
      ) : (
        dot
      )}
    </div>
  )
}

export const UpdateIndicatorsHomeIconDotPulse = memo(UpdateIndicatorsHomeIconDotPulseComponent)
