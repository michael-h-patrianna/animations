/**
 * Bounce Fill Progress Bar (CSS variant)
 *
 * CSS keyframe version. In demo mode plays a one-shot bounce fill with
 * track deformation and impact particles. In controlled mode the fill
 * transitions with spring-like cubic-bezier easing.
 *
 * @example
 * ```tsx
 * <ProgressBarsProgressBounce progress={0.8} />
 * ```
 *
 * Styleable CSS custom properties — same as framer variant:
 * - `--bounce-track-color`, `--bounce-fill-from`, `--bounce-fill-to`
 * - `--bounce-height`
 *
 * Files to copy: this file + ProgressBarsProgressBounce.css + ../SharedTypes.ts
 */
import type { ProgressBarProps } from '../SharedTypes'
import './ProgressBarsProgressBounce.css'

export function ProgressBarsProgressBounce({ progress, className, style }: ProgressBarProps) {
  const isControlled = progress !== undefined

  return (
    <div
      className={`pf-progress-bounce${isControlled ? ' is-controlled' : ''}${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__progress-bounce"
    >
      <div className="track-container" style={{ position: 'relative' }}>
        <div className="pf-progress-track">
          <div
            className="pf-progress-fill"
            role="progressbar"
            aria-valuenow={Math.round((progress ?? 1) * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            style={isControlled ? { transform: `scaleX(${progress})` } : undefined}
          />
        </div>
      </div>
    </div>
  )
}
