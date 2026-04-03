/**
 * Retro Bit Progress Bar
 *
 * Retro-style segmented progress bar with discrete block fills.
 * In demo mode cycles continuously. In controlled mode fills blocks
 * proportional to the given progress value.
 *
 * @example
 * ```tsx
 * <ProgressBarsRetroBit progress={0.7} segments={10} label="DOWNLOADING..." />
 * ```
 *
 * Styleable CSS custom properties:
 * - `--retro-bit-bg`           — container background
 * - `--retro-bit-active`       — active segment color
 * - `--retro-bit-inactive`     — inactive segment color
 * - `--retro-bit-label-color`  — label text color
 *
 * Files to copy: this file + ProgressBarsRetroBit.module.css + ../SharedTypes.ts
 */
import * as m from 'motion/react-m'
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
      className={`${styles['pf-retro-bit-fm']}${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__retro-bit"
    >
      <div
        className={styles['pf-retro-bit-fm__frame']}
        role="progressbar"
        aria-label={label}
        aria-valuenow={Math.min(100, Math.max(0, Math.round(displayProgress * 100)))}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {Array.from({ length: segments }, (_, i) => (
          <m.div
            key={i}
            className={styles['pf-retro-bit-fm__segment']}
            initial={{ opacity: 0.1 }}
            animate={{
              opacity: i < activeCount ? 1 : 0.1,
              backgroundColor:
                i < activeCount ? 'var(--retro-bit-active)' : 'var(--retro-bit-inactive)',
            }}
            transition={{ duration: 0 }}
          />
        ))}
      </div>
      {label !== undefined && label !== '' && (
        <div className={styles['pf-retro-bit-fm__label']}>{label}</div>
      )}
    </div>
  )
}
