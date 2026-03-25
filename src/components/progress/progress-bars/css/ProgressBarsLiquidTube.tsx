/**
 * Liquid Tube Progress Bar (CSS variant)
 *
 * CSS keyframe version with wave and bubble animations.
 *
 * Files to copy: this file + ProgressBarsLiquidTube.css + ../SharedTypes.ts
 */
import type { ProgressBarProps } from '@/components/progress/progress-bars/SharedTypes'
import './ProgressBarsLiquidTube.css'

export function ProgressBarsLiquidTube({ progress, className, style }: ProgressBarProps) {
  const displayProgress = (progress ?? 0)
  const percent = displayProgress * 100

  return (
    <div
      className={`liquid-tube-container-css${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__liquid-tube"
    >
      <div className="liquid-tube-glass-css">
        <div className="liquid-tube-fill-css" style={{ height: `${percent}%` }}>
          <div className="liquid-tube-surface-css">
            <div className="liquid-wave-css" />
          </div>
          <div className="liquid-bubble-css bubble-1" />
          <div className="liquid-bubble-css bubble-2" />
          <div className="liquid-bubble-css bubble-3" />
        </div>
      </div>
    </div>
  )
}
