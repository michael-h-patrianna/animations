/**
 * Animated badge — pops in with elastic overshoot. CSS variant.
 *
 * Copy-paste files: this file + UpdateIndicatorsBadgePop.css + ../shared.css
 * Runtime deps: react
 *
 * Usage: <UpdateIndicatorsBadgePop color="#ff6b6b" textColor="#fff">3</UpdateIndicatorsBadgePop>
 */
import { memo } from 'react'
import {
  BADGE_COLOR,
  BADGE_TEXT_COLOR,
} from '@/components/realtime/update-indicators/SharedDefaults'
import type { BadgeIndicatorProps } from '@/components/realtime/update-indicators/SharedTypes'
import './UpdateIndicatorsBadgePop.css'

function UpdateIndicatorsBadgePopComponent({
  children = 'New',
  color = BADGE_COLOR,
  textColor = BADGE_TEXT_COLOR,
  duration = 400,
}: BadgeIndicatorProps) {
  return (
    <div className="pf-update-indicator" data-animation-id="update-indicators__badge-pop">
      <div
        className="pf-update-indicator__badge pf-badge-pop"
        style={{
          ['--pf-badge-pop-dur' as string]: `${duration}ms`,
          background: color,
          color: textColor,
        }}
      >
        {children}
      </div>
    </div>
  )
}

export const UpdateIndicatorsBadgePop = memo(UpdateIndicatorsBadgePopComponent)
