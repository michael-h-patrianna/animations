/**
 * Notification dot — elastic bounce entrance with idle bob.
 * Overlays an animated dot on any element passed as children.
 * Port to React Native: translate animate/transition to Moti MotiView props.
 *
 * Copy-paste files: this file + UpdateIndicatorsHomeIconDotBounce.css + ../SharedTypes.ts
 * Runtime deps: react, motion
 *
 * Usage: <UpdateIndicatorsHomeIconDotBounce dotColor="#ff0000"><MyIcon /></UpdateIndicatorsHomeIconDotBounce>
 */
import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo } from 'react'
import { DOT_COLOR, ringTint } from '@/components/realtime/update-indicators/SharedDefaults'
import type { DotIndicatorProps } from '@/components/realtime/update-indicators/SharedTypes'
import styles from './UpdateIndicatorsHomeIconDotBounce.module.css'

function UpdateIndicatorsHomeIconDotBounceComponent({
  children,
  dotColor = DOT_COLOR,
  dotSize = 14,
  duration = 2420,
}: DotIndicatorProps) {
  const prefersReducedMotion = useReducedMotion()
  const durS = duration / 1000
  const ringBorder = `${Math.round(dotSize * 0.43)}px solid ${ringTint(dotColor, 18)}`

  const dot = (
    <m.span
      className={`pf-update-indicator-fm__dot ${styles['pf-update-indicator-fm__dot--bounce']}`}
      style={{
        width: dotSize,
        height: dotSize,
        background: dotColor,
        animation: 'none',
      }}
      initial={prefersReducedMotion ? { opacity: 0 } : { scale: 0, opacity: 0, x: 4, y: -4 }}
      animate={
        prefersReducedMotion
          ? { opacity: 1 }
          : {
              scale: [0, 1.2, 1, 1, 1.06, 1],
              opacity: [0, 1, 1, 1, 1, 1],
              x: [4, 0, 0, 0, 0, 0],
              y: [-4, 0, 0, 0, 0, 0],
            }
      }
      transition={
        prefersReducedMotion
          ? { duration: 0.15 }
          : {
              duration: durS,
              times: [0, 0.174, 0.174, 0.248, 0.661, 1],
              ease: [0.2, 0.9, 0.3, 1.2],
            }
      }
    >
      {!prefersReducedMotion && (
        <m.span
          className="pf-update-indicator-fm__dot-ring"
          style={{
            inset: `${-Math.round(dotSize * 0.43)}px`,
            border: ringBorder,
            animation: 'none',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0, 0, 0, 1, 0] }}
          transition={{
            duration: durS,
            times: [0, 0.174, 0.248, 0.5, 0.661, 1],
            ease: 'easeOut',
          }}
        />
      )}
    </m.span>
  )

  return (
    <div
      className="pf-update-indicator-fm"
      data-animation-id="update-indicators__home-icon-dot-bounce"
    >
      {children !== undefined ? (
        <div className="pf-update-indicator-fm__anchor">
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
