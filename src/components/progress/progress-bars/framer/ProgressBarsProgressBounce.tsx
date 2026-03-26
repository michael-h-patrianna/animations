/**
 * Bounce Fill Progress Bar
 *
 * Progress bar with spring physics — the fill transitions to the given
 * progress value with a spring animation.
 *
 * @example
 * ```tsx
 * <ProgressBarsProgressBounce progress={0.8} />
 * ```
 *
 * Styleable CSS custom properties:
 * - `--bounce-track-bg`       — track background (default: rgb(255 255 255 / 8%))
 * - `--bounce-fill-from`      — fill gradient start (default: #34d399)
 * - `--bounce-fill-to`        — fill gradient end (default: #6ee7b7)
 * - `--bounce-accent`         — accent for waves/particles (default: #34d399)
 * - `--bounce-accent-dark`    — darker accent for alt particles (default: #059669)
 * - `--bounce-height`         — track height (default: 14px)
 *
 * Files to copy: this file + ProgressBarsProgressBounce.css + ../SharedTypes.ts
 */
import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import type { ProgressBarProps } from '@/components/progress/progress-bars/SharedTypes'

export function ProgressBarsProgressBounce({ progress, className, style }: ProgressBarProps) {
  const prefersReducedMotion = useReducedMotion()
  const target = progress ?? 0

  return (
    <div
      className={`pf-progress-bounce${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__progress-bounce"
    >
      <div className="track-container" style={{ position: 'relative' }}>
        <div className="pf-progress-track">
          <m.div
            className="pf-progress-fill"
            animate={{ scaleX: target }}
            transition={prefersReducedMotion ? { duration: 0.1 } : { type: 'spring', stiffness: 180, damping: 14 }}
            style={{ transformOrigin: 'left center', animation: 'none' }}
          />
        </div>
      </div>
    </div>
  )
}
