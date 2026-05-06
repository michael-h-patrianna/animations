/**
 * Reduced-motion note: catalog-only data-reduced-motion mirroring supplements
 * OS @media (prefers-reduced-motion) rules; consumers do not need to copy it.
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
 * Files to copy: this file + ProgressBarsProgressBounce.module.css + ../SharedTypes.ts
 */
import type { ProgressBarProps } from '@/components/progress/progress-bars/SharedTypes'
import styles from './ProgressBarsProgressBounce.module.css'

export function ProgressBarsProgressBounce({ progress, className, style }: ProgressBarProps) {
  const isControlled = progress !== undefined

  return (
    <div
      className={`${styles['pf-progress-bounce']}${isControlled ? ` ${styles['is-controlled']}` : ''}${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__progress-bounce"
    >
      <div className="track-container" style={{ position: 'relative' }}>
        <div className={styles['pf-progress-track']}>
          <div
            className={styles['pf-progress-fill']}
            role="progressbar"
            aria-label="Progress"
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
