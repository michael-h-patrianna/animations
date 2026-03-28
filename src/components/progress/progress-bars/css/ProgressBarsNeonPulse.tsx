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
 * Files to copy: this file + ProgressBarsNeonPulse.css + ../SharedTypes.ts
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
      className={`${styles['neon-pulse-container-css']}${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__neon-pulse"
    >
      <div className={styles['neon-pulse-track-css']}>
        <div
          className={styles['neon-pulse-fill-css']}
          style={{ transform: `scaleX(${displayProgress})` }}
        >
          <div className={styles['neon-pulse-flicker-css']} />
        </div>
        <div
          className={styles['neon-pulse-glow-css']}
          style={{ transform: `scaleX(${displayProgress})` }}
        />
      </div>
      {label !== undefined && label !== '' && (
        <div className={styles['neon-pulse-label-css']}>{label}</div>
      )}
    </div>
  )
}
