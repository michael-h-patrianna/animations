/**
 * Animated badge — pops in with elastic overshoot. CSS variant.
 *
 * Copy-paste files: this file + UpdateIndicatorsBadgePop.css + ../shared.css
 * Runtime deps: react
 *
 * Usage: <UpdateIndicatorsBadgePop color="#ff6b6b">3</UpdateIndicatorsBadgePop>
 */
import { memo, type ReactNode } from 'react'
import { BADGE_COLOR } from '../SharedDefaults'
import './UpdateIndicatorsBadgePop.css'

interface BadgePopProps {
  /** Badge content. Default: 'New' */
  children?: ReactNode
  /** Badge background color. Default: '#c47ae5' */
  color?: string
  /** Animation duration in ms. Default: 400 */
  duration?: number
}

function UpdateIndicatorsBadgePopComponent({
  children = 'New',
  color = BADGE_COLOR,
  duration = 400,
}: BadgePopProps) {
  return (
    <div className="pf-update-indicator" data-animation-id="update-indicators__badge-pop">
      <div
        className="pf-update-indicator__badge pf-badge-pop"
        style={{
          ['--pf-badge-pop-dur' as string]: `${duration}ms`,
          background: color,
        }}
      >
        {children}
      </div>
    </div>
  )
}

export const UpdateIndicatorsBadgePop = memo(UpdateIndicatorsBadgePopComponent)
