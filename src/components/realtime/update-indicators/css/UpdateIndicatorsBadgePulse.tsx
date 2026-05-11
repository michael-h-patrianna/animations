/**
 * Reduced-motion note: catalog-only data-reduced-motion mirroring supplements
 * OS @media (prefers-reduced-motion) rules; consumers do not need to copy it.
 * Animated badge — continuous glowing pulse to signal unseen content. CSS variant.
 *
 * Copy-paste files: this file + UpdateIndicatorsBadgePulse.module.css + ../shared.css
 * Runtime deps: react
 *
 * Usage: <UpdateIndicatorsBadgePulse color="#ff6b6b" textColor="#fff" glowColor="rgba(255,100,100,0.4)">5</UpdateIndicatorsBadgePulse>
 */
import { memo, type ReactNode } from 'react'
import {
  BADGE_COLOR,
  BADGE_GLOW,
  BADGE_TEXT_COLOR,
} from '@/components/realtime/update-indicators/SharedDefaults'
import styles from './UpdateIndicatorsBadgePulse.module.css'

interface BadgePulseProps {
  /** Badge content. Default: 'New' */
  children?: ReactNode
  /** Badge background color. Default: '#c47ae5' */
  color?: string
  /** Badge text color. Default: '#ffffff' */
  textColor?: string
  /** Glow color. Default: 'rgb(236 195 255 / 40%)' */
  glowColor?: string
  /** Pulse cycle duration in ms. Default: 1000 */
  duration?: number
}

function UpdateIndicatorsBadgePulseComponent({
  children = 'New',
  color = BADGE_COLOR,
  textColor = BADGE_TEXT_COLOR,
  glowColor = BADGE_GLOW,
  duration = 1000,
}: BadgePulseProps) {
  return (
    <div className="pf-update-indicator" data-animation-id="update-indicators__badge-pulse">
      <div
        className={`pf-update-indicator__badge ${styles['pf-badge-pulse']}`}
        style={{
          ['--pf-badge-pulse-glow' as string]: glowColor,
          ['--pf-badge-pulse-dur' as string]: `${duration}ms`,
          background: color,
          color: textColor,
        }}
      >
        {children}
      </div>
    </div>
  )
}

export const UpdateIndicatorsBadgePulse = memo(UpdateIndicatorsBadgePulseComponent)
