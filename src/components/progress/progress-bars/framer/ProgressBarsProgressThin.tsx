/**
 * Thin Progress Line
 *
 * Ultra-thin progress line that transitions to the given progress value.
 *
 * @example
 * ```tsx
 * <ProgressBarsProgressThin progress={0.6} label="XP" />
 * ```
 *
 * Styleable CSS custom properties:
 * - `--thin-label-color`   — label text color (default: rgb(255 255 255 / 55%))
 * - `--thin-track-bg`      — track background (default: rgb(255 255 255 / 6%))
 * - `--thin-fill-from`     — fill gradient start (default: #38bdf8)
 * - `--thin-fill-via`      — fill gradient middle (default: #7dd3fc)
 * - `--thin-fill-to`       — fill gradient end (default: #bae6fd)
 * - `--thin-fill-glow`     — fill glow shadow (default: rgb(56 189 248 / 40%))
 * - `--thin-accent`        — accent for photon/dots/halo (default: #38bdf8)
 *
 * Files to copy: this file + ProgressBarsProgressThin.css + ../SharedTypes.ts
 */
import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import type { ProgressBarProps } from '@/components/progress/progress-bars/SharedTypes'

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
  const prefersReducedMotion = useReducedMotion()
  const target = progress ?? 0

  return (
    <div
      className={`pf-progress-thin${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__progress-thin"
    >
      {label !== undefined && label !== '' && (
        <div className="pf-progress-thin__label">{label}</div>
      )}

      <div className="track-container" style={{ position: 'relative' }}>
        <div className="pf-progress-track" style={{ height: '2px' }}>
          <m.div
            className="pf-progress-fill"
            role="progressbar"
            aria-valuenow={Math.round(target * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            animate={{ scaleX: target }}
            transition={{
              duration: prefersReducedMotion ? 0.1 : 0.5,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            style={{
              transformOrigin: 'left center',
              position: 'relative',
              overflow: 'visible',
              animation: 'none',
            }}
          />
        </div>
      </div>
    </div>
  )
}
