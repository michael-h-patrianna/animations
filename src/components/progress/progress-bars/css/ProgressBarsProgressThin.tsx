/**
 * Thin Progress Line (CSS variant)
 *
 * CSS keyframe version. In demo mode plays a one-shot sweep with photon trail,
 * pulse dots, halo, and completion flash. In controlled mode transitions
 * the fill to the given progress value.
 *
 * @example
 * ```tsx
 * <ProgressBarsProgressThin progress={0.6} label="XP" />
 * ```
 *
 * Styleable CSS custom properties — same as framer variant:
 * - `--thin-label-color`, `--thin-track-color`
 * - `--thin-fill-from`, `--thin-fill-via`, `--thin-fill-to`, `--thin-accent`
 *
 * Files to copy: this file + ProgressBarsProgressThin.css + ../SharedTypes.ts
 */
import type { ProgressBarProps } from '../SharedTypes'
import './ProgressBarsProgressThin.css'

interface ProgressThinProps extends ProgressBarProps {
  /** Label text above the bar. Default: "Level progress". */
  label?: string
}

export function ProgressBarsProgressThin({
  progress,
  label = 'Level progress',
  className,
  style,
}: ProgressThinProps) {
  const isControlled = progress !== undefined

  return (
    <div
      className={`pf-progress-thin${isControlled ? ' is-controlled' : ''}${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__progress-thin"
    >
      {label !== undefined && label !== '' && (
        <div className="pf-progress-thin__label">{label}</div>
      )}

      <div className="track-container" style={{ position: 'relative' }}>
        {/* Halo glow (demo only) */}
        {!isControlled && <div className="pf-progress-thin__halo" />}

        <div className="pf-progress-track">
          <div
            className="pf-progress-fill"
            role="progressbar"
            aria-valuenow={Math.round((progress ?? 1) * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            style={isControlled ? { transform: `scaleX(${progress})` } : undefined}
          >
            {/* Photon trail (demo only) */}
            {!isControlled && <div className="pf-progress-thin__photon" />}
          </div>
        </div>

        {/* Pulse dots (demo only) */}
        {!isControlled &&
          [0, 1, 2].map((i) => (
            <div
              key={i}
              className="pf-progress-thin__dot"
              style={{
                left: `${30 + i * 25}%`,
                animationDelay: `${360 + i * 100}ms`,
              }}
            />
          ))}

        {/* Completion flash (demo only) */}
        {!isControlled && <div className="pf-progress-thin__flash" />}
      </div>
    </div>
  )
}
