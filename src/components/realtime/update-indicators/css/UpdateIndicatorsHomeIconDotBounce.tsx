/**
 * Notification dot — elastic bounce entrance with idle bob. CSS variant.
 *
 * Copy-paste files: this file + UpdateIndicatorsHomeIconDotBounce.css + ../shared.css + ../SharedTypes.ts
 * Runtime deps: react
 *
 * Usage: <UpdateIndicatorsHomeIconDotBounce dotColor="#ff0000"><MyIcon /></UpdateIndicatorsHomeIconDotBounce>
 */
import { memo } from 'react'
import { DOT_COLOR, ringTint } from '../SharedDefaults'
import type { DotIndicatorProps } from '../SharedTypes'
import './UpdateIndicatorsHomeIconDotBounce.css'

function UpdateIndicatorsHomeIconDotBounceComponent({
  children,
  dotColor = DOT_COLOR,
  dotSize = 14,
  duration = 2420,
}: DotIndicatorProps) {
  const dotStyle = {
    ['--pf-dot-bounce-ring' as string]: ringTint(dotColor, 18),
    ['--pf-dot-bounce-dur' as string]: `${duration * 0.174}ms`,
    ['--pf-dot-bounce-idle-dur' as string]: `${duration * 0.826}ms`,
    ['--pf-dot-bounce-idle-delay' as string]: `${duration * 0.248}ms`,
    width: dotSize,
    height: dotSize,
    background: dotColor,
  }

  const dot = (
    <span
      className="pf-update-indicator__dot pf-update-indicator__dot--bounce pf-dot-bounce-enter"
      style={dotStyle}
    />
  )

  return (
    <div
      className="pf-update-indicator"
      data-animation-id="update-indicators__home-icon-dot-bounce"
    >
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

export const UpdateIndicatorsHomeIconDotBounce = memo(UpdateIndicatorsHomeIconDotBounceComponent)
