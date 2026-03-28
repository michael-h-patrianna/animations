/**
 * Notification dot — color flash with scale bounce and expanding halo ring.
 * Overlays an animated dot + halo on any element passed as children.
 * Port to React Native: translate animate/transition to Moti MotiView props.
 *
 * Copy-paste files: this file + UpdateIndicatorsHomeIconDotSweep.module.css + ../SharedTypes.ts
 * Runtime deps: react, motion
 *
 * Usage: <UpdateIndicatorsHomeIconDotSweep accentColor="#ff0a4d"><MyIcon /></UpdateIndicatorsHomeIconDotSweep>
 */
import * as m from 'motion/react-m'
import { easeInOut, useReducedMotion } from 'motion/react'
import { memo } from 'react'
import {
  DOT_COLOR,
  DOT_SWEEP_ACCENT,
  DOT_SWEEP_HALO,
  ringTint,
} from '@/components/realtime/update-indicators/SharedDefaults'
import type { DotIndicatorProps } from '@/components/realtime/update-indicators/SharedTypes'
import styles from './UpdateIndicatorsHomeIconDotSweep.module.css'

interface DotSweepProps extends DotIndicatorProps {
  /** Flash accent color during the sweep. Default: '#ff0a4d' */
  accentColor?: string
  /** Halo ring border color. Default: 'rgb(255 73 103 / 55%)' */
  haloColor?: string
}

function UpdateIndicatorsHomeIconDotSweepComponent({
  children,
  dotColor = DOT_COLOR,
  dotSize = 14,
  duration = 900,
  accentColor = DOT_SWEEP_ACCENT,
  haloColor = DOT_SWEEP_HALO,
}: DotSweepProps) {
  const prefersReducedMotion = useReducedMotion()
  const durS = duration / 1000
  const ringInset = Math.round(dotSize * 0.71)
  const ringBorder = `${Math.round(dotSize * 0.71)}px solid ${ringTint(dotColor, 22)}`
  const dotEdgeOffset = 3 // matches shared.css .pf-update-indicator__dot top/right
  const haloSize = Math.round(dotSize * 1.43)
  const haloEdgeOffset = dotEdgeOffset + (haloSize - dotSize) / 2

  const dot = (
    <>
      <m.span
        className={`pf-update-indicator-fm__dot ${styles['pf-update-indicator-fm__dot--fill']}`}
        style={{
          width: dotSize,
          height: dotSize,
          background: dotColor,
          animation: 'none',
        }}
        animate={
          prefersReducedMotion
            ? { background: [dotColor, accentColor, dotColor] }
            : {
                background: [dotColor, accentColor, dotColor],
                scale: [1, 1.16, 1],
              }
        }
        transition={{
          duration: prefersReducedMotion ? 0.15 : durS,
          ease: easeInOut,
          times: [0, 0.3, 1],
        }}
      >
        {!prefersReducedMotion && (
          <m.span
            className="pf-update-indicator-fm__dot-ring"
            style={{
              inset: -ringInset,
              border: ringBorder,
              animation: 'none',
            }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: durS, ease: easeInOut, times: [0, 0.3, 1] }}
          />
        )}
      </m.span>
      {!prefersReducedMotion && (
        <m.span
          className="pf-update-indicator-fm__halo"
          style={{
            top: -haloEdgeOffset,
            right: -haloEdgeOffset,
            width: haloSize,
            height: haloSize,
            border: `2px solid ${haloColor}`,
            animation: 'none',
          }}
          initial={{ scale: 0.75, opacity: 0 }}
          animate={{
            scale: [0.75, 1.8],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: durS,
            ease: easeInOut,
            scale: { times: [0, 1] },
            opacity: { times: [0, 0.35, 1] },
          }}
        />
      )}
    </>
  )

  return (
    <div
      className="pf-update-indicator-fm"
      data-animation-id="update-indicators__home-icon-dot-sweep"
    >
      {children !== undefined ? (
        <div className="pf-update-indicator-fm__anchor">
          {children}
          {dot}
        </div>
      ) : (
        <div className="pf-update-indicator-fm__anchor" style={{ width: dotSize, height: dotSize }}>
          {dot}
        </div>
      )}
    </div>
  )
}

export const UpdateIndicatorsHomeIconDotSweep = memo(UpdateIndicatorsHomeIconDotSweepComponent)
