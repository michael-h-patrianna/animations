/**
 * Notification dot — color flash with scale bounce and expanding halo ring. CSS variant.
 *
 * Copy-paste files: this file + UpdateIndicatorsHomeIconDotSweep.css + ../shared.css + ../SharedTypes.ts
 * Runtime deps: react
 *
 * Usage: <UpdateIndicatorsHomeIconDotSweep accentColor="#ff0a4d"><MyIcon /></UpdateIndicatorsHomeIconDotSweep>
 */
import { memo } from 'react'
import { DOT_COLOR, DOT_SWEEP_ACCENT, DOT_SWEEP_HALO, ringTint } from '../SharedDefaults'
import type { DotIndicatorProps } from '../SharedTypes'
import './UpdateIndicatorsHomeIconDotSweep.css'

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
  const dotEdgeOffset = 3 // matches shared.css .pf-update-indicator__dot top/right
  const haloSize = Math.round(dotSize * 1.43)
  const haloEdgeOffset = dotEdgeOffset + (haloSize - dotSize) / 2

  const dotStyle = {
    ['--pf-dot-sweep-color' as string]: dotColor,
    ['--pf-dot-sweep-accent' as string]: accentColor,
    ['--pf-dot-sweep-ring' as string]: ringTint(dotColor, 22),
    ['--pf-dot-sweep-dur' as string]: `${duration}ms`,
    width: dotSize,
    height: dotSize,
    background: dotColor,
  }

  const dot = (
    <>
      <span
        className="pf-update-indicator__dot pf-update-indicator__dot--fill pf-dot-sweep-dot"
        style={dotStyle}
      />
      <span
        className="pf-update-indicator__halo pf-dot-sweep-halo"
        style={{
          ['--pf-dot-sweep-halo-color' as string]: haloColor,
          ['--pf-dot-sweep-dur' as string]: `${duration}ms`,
          top: -haloEdgeOffset,
          right: -haloEdgeOffset,
          width: haloSize,
          height: haloSize,
        }}
      />
    </>
  )

  return (
    <div className="pf-update-indicator" data-animation-id="update-indicators__home-icon-dot-sweep">
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

export const UpdateIndicatorsHomeIconDotSweep = memo(UpdateIndicatorsHomeIconDotSweepComponent)
