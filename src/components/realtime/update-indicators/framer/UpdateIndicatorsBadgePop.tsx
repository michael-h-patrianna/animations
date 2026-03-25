/**
 * Animated badge — pops in with elastic overshoot.
 * Place next to any element to indicate new content.
 * Port to React Native: translate animate/transition to Moti MotiView props.
 *
 * Copy-paste files: this file
 * Runtime deps: react, motion
 *
 * Usage: <UpdateIndicatorsBadgePop color="#ff6b6b" textColor="#fff">3</UpdateIndicatorsBadgePop>
 */
import * as m from 'motion/react-m'
import { memo } from 'react'
import {
  BADGE_COLOR,
  BADGE_TEXT_COLOR,
} from '@/components/realtime/update-indicators/SharedDefaults'
import type { BadgeIndicatorProps } from '@/components/realtime/update-indicators/SharedTypes'

function UpdateIndicatorsBadgePopComponent({
  children = 'New',
  color = BADGE_COLOR,
  textColor = BADGE_TEXT_COLOR,
  duration = 400,
}: BadgeIndicatorProps) {
  const durS = duration / 1000

  return (
    <div className="pf-update-indicator" data-animation-id="update-indicators__badge-pop">
      <m.div
        className="pf-update-indicator__badge"
        style={{ background: color, color: textColor, animation: 'none' }}
        initial={{ scale: 0.6 }}
        animate={{ scale: [0.6, 1.1, 1] }}
        transition={{
          duration: durS,
          ease: [0.34, 1.25, 0.64, 1],
          times: [0, 0.6, 1],
        }}
      >
        {children}
      </m.div>
    </div>
  )
}

export const UpdateIndicatorsBadgePop = memo(UpdateIndicatorsBadgePopComponent)
