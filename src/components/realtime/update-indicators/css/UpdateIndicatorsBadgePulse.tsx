/**
 * Animated badge — continuous glowing pulse to signal unseen content. CSS variant.
 *
 * Copy-paste files: this file + UpdateIndicatorsBadgePulse.css + ../shared.css
 * Runtime deps: react
 *
 * Usage: <UpdateIndicatorsBadgePulse color="#ff6b6b" glowColor="rgba(255,100,100,0.4)">5</UpdateIndicatorsBadgePulse>
 */
import { memo, type ReactNode } from 'react'
import { BADGE_COLOR, BADGE_GLOW } from '../SharedDefaults'
import './UpdateIndicatorsBadgePulse.css'

interface BadgePulseProps {
  /** Badge content. Default: 'New' */
  children?: ReactNode
  /** Badge background color. Default: '#c47ae5' */
  color?: string
  /** Glow color. Default: 'rgb(236 195 255 / 40%)' */
  glowColor?: string
  /** Pulse cycle duration in ms. Default: 1000 */
  duration?: number
}

function UpdateIndicatorsBadgePulseComponent({
  children = 'New',
  color = BADGE_COLOR,
  glowColor = BADGE_GLOW,
  duration = 1000,
}: BadgePulseProps) {
  return (
    <div className="pf-update-indicator" data-animation-id="update-indicators__badge-pulse">
      <div
        className="pf-update-indicator__badge pf-badge-pulse"
        style={{
          ['--pf-badge-pulse-glow' as string]: glowColor,
          ['--pf-badge-pulse-dur' as string]: `${duration}ms`,
          background: color,
        }}
      >
        {children}
      </div>
    </div>
  )
}

export const UpdateIndicatorsBadgePulse = memo(UpdateIndicatorsBadgePulseComponent)
