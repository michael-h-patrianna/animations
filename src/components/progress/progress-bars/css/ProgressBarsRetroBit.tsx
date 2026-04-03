/**
 * Retro Bit Progress Bar (CSS variant)
 *
 * Files to copy: this file + ProgressBarsRetroBit.module.css + ../SharedTypes.ts
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
      className={`${styles['pf-retro-bit-css']}${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__retro-bit"
    >
      <div
        className={styles['pf-retro-bit-css__frame']}
        role="progressbar"
        aria-valuenow={Math.round(displayProgress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {Array.from({ length: segments }, (_, i) => (
          <div
            key={i}
            className={styles['pf-retro-bit-css__segment']}
            style={{
              opacity: i < activeCount ? 1 : 0.1,
              backgroundColor:
                i < activeCount ? 'var(--retro-bit-active)' : 'var(--retro-bit-inactive)',
            }}
          />
        ))}
      </div>
      {label !== undefined && label !== '' && (
        <div className={styles['pf-retro-bit-css__label']}>{label}</div>
      )}
    </div>
  )
}
