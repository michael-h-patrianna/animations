/**
 * Neon Pulse Progress Bar (CSS variant)
 *
 * CSS version with flicker animation via keyframes. In demo mode cycles
 * continuously. In controlled mode displays the given progress value.
 *
 * @example
 * ```tsx
 * <ProgressBarsNeonPulse progress={0.65} label="UPLOADING..." />
 * ```
 *
 * Styleable CSS custom properties — same as framer variant.
 *
 * Files to copy: this file + ProgressBarsNeonPulse.module.css + ../SharedTypes.ts
 */
import type { ProgressBarProps } from '@/components/progress/progress-bars/SharedTypes'
import styles from './ProgressBarsNeonPulse.module.css'

interface NeonPulseProps extends ProgressBarProps {
  /** Status label below the bar. Default: "SYNCING...". */
  label?: string
}

export function ProgressBarsNeonPulse({
  progress,
  label = 'SYNCING...',
  className,
  style,
}: NeonPulseProps) {
  const displayProgress = progress ?? 0

  return (
    <div
      className={`${styles['pf-neon-pulse']}${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__neon-pulse"
    >
      <div className={styles['pf-neon-pulse__track']}>
        <div
          className={styles['pf-neon-pulse__fill']}
          role="progressbar"
          aria-label={label}
          aria-valuenow={Math.round(displayProgress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          style={{ transform: `scaleX(${displayProgress})` }}
        >
          <div className={styles['pf-neon-pulse__flicker']} />
        </div>
        <div
          className={styles['pf-neon-pulse__glow']}
          style={{ transform: `scaleX(${displayProgress})` }}
        />
      </div>
      {label !== undefined && label !== '' && (
        <div className={styles['pf-neon-pulse__label']}>{label}</div>
      )}
    </div>
  )
}
