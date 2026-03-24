/**
 * Animated badge — pops in with elastic overshoot. CSS variant.
 *
 * Copy-paste files: this file + UpdateIndicatorsBadgePop.css + ../shared.css
 * Runtime deps: react
 *
 * Usage: <UpdateIndicatorsBadgePop color="#ff6b6b">3</UpdateIndicatorsBadgePop>
 */
import { memo } from 'react'
import { BADGE_COLOR } from '../SharedDefaults'
import type { BadgeIndicatorProps } from '../SharedTypes'
import './UpdateIndicatorsBadgePop.css'

function UpdateIndicatorsBadgePopComponent({
  children = 'New',
  color = BADGE_COLOR,
  duration = 400,
}: BadgeIndicatorProps) {
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
