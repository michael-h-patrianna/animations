/**
 * Notification dot — staggered radar rings emanating outward. CSS variant.
 *
 * Copy-paste files: this file + UpdateIndicatorsHomeIconDotRadar.css + ../shared.css + ../SharedTypes.ts
 * Runtime deps: react
 *
 * Usage: <UpdateIndicatorsHomeIconDotRadar ringColor="rgba(255,0,0,0.5)"><MyIcon /></UpdateIndicatorsHomeIconDotRadar>
 */
import { memo } from 'react'
import { DOT_COLOR, DOT_RADAR_RING } from '../SharedDefaults'
import type { DotIndicatorProps } from '../SharedTypes'
import './UpdateIndicatorsHomeIconDotRadar.css'

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
  const dotEdgeOffset = 3 // matches shared.css .pf-update-indicator__dot top/right
  const ringSize = Math.round(dotSize * 1.43)
  const ringEdgeOffset = dotEdgeOffset + (ringSize - dotSize) / 2
  const staggerMs = duration / 2

  const ringStyle = {
    ['--pf-dot-radar-ring-color' as string]: ringColor,
    ['--pf-dot-radar-dur' as string]: `${duration}ms`,
    top: -ringEdgeOffset,
    right: -ringEdgeOffset,
    width: ringSize,
    height: ringSize,
  }

  const rings = Array.from({ length: ringCount }, (_, i) => (
    <span
      key={i}
      className="pf-update-indicator__ring pf-dot-radar-ring"
      style={{
        ...ringStyle,
        animationDelay: `${i * staggerMs}ms`,
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
