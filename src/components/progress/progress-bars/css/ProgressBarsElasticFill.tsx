/**
 * Elastic Fill Progress Bar (CSS variant)
 *
 * CSS keyframe version of the elastic fill bar. In demo mode it plays a
 * one-shot CSS animation to 70%. In controlled mode the fill width is set
 * directly and CSS `transition` provides the elastic easing.
 *
 * @example
 * ```tsx
 * <ProgressBarsElasticFill progress={0.6} />
 * ```
 *
 * Styleable CSS custom properties — same as framer variant:
 * - `--elastic-fill-track-color`, `--elastic-fill-from`, `--elastic-fill-to`
 * - `--elastic-fill-height`, `--elastic-fill-radius`
 *
 * Files to copy: this file + ProgressBarsElasticFill.css
 */
import type { ProgressBarProps } from '../SharedTypes'
import './ProgressBarsElasticFill.css'

const DEMO_TARGET = 0.7

export function ProgressBarsElasticFill({
  progress,
  className,
  style,
}: ProgressBarProps) {
  const isControlled = progress !== undefined
  const target = progress ?? DEMO_TARGET
  const percent = Math.round(target * 100)

  return (
    <div
      className={`pf-progress-elastic-fill${isControlled ? ' is-controlled' : ''}${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__elastic-fill"
    >
      <div className="track-container">
        <div className="pf-progress-track">
          <div
            className="pf-progress-fill"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            style={isControlled ? { transform: `scaleX(${target})` } : undefined}
          />
        </div>
      </div>
    </div>
  )
}
