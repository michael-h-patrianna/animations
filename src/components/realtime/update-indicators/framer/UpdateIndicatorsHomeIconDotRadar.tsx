/**
 * Notification dot — staggered radar rings emanating outward.
 * Overlays an animated dot + expanding rings on any element passed as children.
 * Port to React Native: translate animate/transition to Moti MotiView props.
 *
 * Copy-paste files: this file + UpdateIndicatorsHomeIconDotRadar.css + ../SharedTypes.ts
 * Runtime deps: react, motion
 *
 * Usage: <UpdateIndicatorsHomeIconDotRadar ringColor="rgba(255,0,0,0.5)"><MyIcon /></UpdateIndicatorsHomeIconDotRadar>
 */
import * as m from 'motion/react-m'
import { easeOut } from 'motion/react'
import { memo } from 'react'
import { DOT_COLOR, DOT_RADAR_RING } from '../SharedDefaults'
import type { DotIndicatorProps } from '../SharedTypes'

interface DotRadarProps extends DotIndicatorProps {
  /** Ring border color. Default: 'rgb(255 73 103 / 50%)' */
  ringColor?: string
  /** Number of staggered rings. Default: 2 */
  ringCount?: number
}

function UpdateIndicatorsHomeIconDotRadarComponent({
  children,
  dotColor = DOT_COLOR,
  dotSize = 14,
  duration = 1600,
  ringColor = DOT_RADAR_RING,
  ringCount = 2,
}: DotRadarProps) {
  const durS = duration / 1000
  const dotEdgeOffset = 3 // matches shared.css .pf-update-indicator__dot top/right
  const ringSize = Math.round(dotSize * 1.43)
  const ringEdgeOffset = dotEdgeOffset + (ringSize - dotSize) / 2
  const staggerDelay = durS / 2

  const rings = Array.from({ length: ringCount }, (_, i) => (
    <m.span
      key={i}
      className="pf-update-indicator__ring"
      style={{
        top: -ringEdgeOffset,
        right: -ringEdgeOffset,
        width: ringSize,
        height: ringSize,
        border: `2px solid ${ringColor}`,
        animation: 'none',
      }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{
        scale: [0.9, 1.9],
        opacity: [0.9, 0.6, 0],
      }}
      transition={{
        duration: durS,
        ease: easeOut,
        delay: i * staggerDelay,
        scale: { times: [0, 1] },
        opacity: { times: [0, 0.5, 1] },
      }}
    />
  ))

  const dot = (
    <>
      <span
        className="pf-update-indicator__dot pf-update-indicator__dot--radar"
        style={{
          width: dotSize,
          height: dotSize,
          background: dotColor,
        }}
      />
      {rings}
    </>
  )

  return (
    <div className="pf-update-indicator" data-animation-id="update-indicators__home-icon-dot-radar">
      {children !== undefined ? (
        <div className="pf-update-indicator__anchor">
          {children}
          {dot}
        </div>
      ) : (
        <div className="pf-update-indicator__anchor" style={{ width: dotSize, height: dotSize }}>
          {dot}
        </div>
      )}
    </div>
  )
}

export const UpdateIndicatorsHomeIconDotRadar = memo(UpdateIndicatorsHomeIconDotRadarComponent)
