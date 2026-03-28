/**
 * Retro Bit Progress Bar (CSS variant)
 *
 * Files to copy: this file + ProgressBarsRetroBit.css + ../SharedTypes.ts
 */
import type { ProgressBarProps } from '@/components/progress/progress-bars/SharedTypes'
import styles from './ProgressBarsRetroBit.module.css'

interface RetroBitProps extends ProgressBarProps {
  /** Number of discrete segments. Default: 10. */
  segments?: number
  /** Label text below the bar. Default: "LOADING...". */
  label?: string
}

export function ProgressBarsRetroBit({
  progress,
  segments = 10,
  label = 'LOADING...',
  className,
  style,
}: RetroBitProps) {
  const displayProgress = progress ?? 0
  const activeCount = Math.floor(displayProgress * segments)

  return (
    <div
      className={`${styles['retro-bit-container-css']}${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__retro-bit"
    >
      <div className={styles['retro-bit-frame-css']}>
        {Array.from({ length: segments }, (_, i) => (
          <div
            key={i}
            className={styles['retro-bit-segment-css']}
            style={{
              opacity: i < activeCount ? 1 : 0.1,
              backgroundColor:
                i < activeCount ? 'var(--retro-bit-active)' : 'var(--retro-bit-inactive)',
            }}
          />
        ))}
      </div>
      {label !== undefined && label !== '' && (
        <div className={styles['retro-bit-label-css']}>{label}</div>
      )}
    </div>
  )
}
