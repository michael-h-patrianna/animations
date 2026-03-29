/**
 * Animated badge — continuous glowing pulse to signal unseen content.
 * Place next to any element to draw attention.
 * Port to React Native: translate animate/transition to Moti MotiView props.
 *
 * Copy-paste files: this file + UpdateIndicatorsBadgePulse.module.css
 * Runtime deps: react, motion
 *
 * Usage: <UpdateIndicatorsBadgePulse color="#ff6b6b" textColor="#fff" glowColor="rgba(255,100,100,0.4)">5</UpdateIndicatorsBadgePulse>
 */
import * as m from 'motion/react-m'
import { easeInOut, useReducedMotion } from 'motion/react'
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
  const prefersReducedMotion = useReducedMotion()
  const durS = duration / 1000

  return (
    <div className="pf-update-indicator-fm" data-animation-id="update-indicators__badge-pulse">
      <div
        className="pf-update-indicator-fm__badge"
        style={{ background: color, color: textColor }}
      >
        <m.div
          className={`pf-update-indicator-fm__badge-glow ${styles['pf-update-indicator-fm__badge-glow']}`}
          style={{ ['--pf-badge-glow' as string]: `0 0 18px ${glowColor}`, animation: 'none' }}
          animate={prefersReducedMotion ? { opacity: 0.5 } : { opacity: [0, 1, 0] }}
          transition={
            prefersReducedMotion
              ? { duration: 0.3 }
              : {
                  duration: durS,
                  ease: easeInOut,
                  repeat: Infinity,
                  repeatType: 'loop',
                }
          }
        />
        {children}
      </div>
    </div>
  )
}

export const UpdateIndicatorsBadgePulse = memo(UpdateIndicatorsBadgePulseComponent)
