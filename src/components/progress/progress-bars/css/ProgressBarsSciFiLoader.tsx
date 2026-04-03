/**
 * Sci-Fi Loader Progress Bar (CSS variant)
 *
 * Files to copy: this file + ProgressBarsSciFiLoader.module.css + ../SharedTypes.ts
 */
import type { ProgressBarProps } from '@/components/progress/progress-bars/SharedTypes'
import styles from './ProgressBarsSciFiLoader.module.css'

interface SciFiLoaderProps extends ProgressBarProps {
  /** Label prefix text. Default: "SYSTEM.INIT:". */
  label?: string
}

export function ProgressBarsSciFiLoader({
  progress,
  label = 'SYSTEM.INIT:',
  className,
  style,
}: SciFiLoaderProps) {
  const displayProgress = progress ?? 0
  const percent = Math.round(displayProgress * 100)

  return (
    <div
      className={`${styles['pf-scifi-loader-css']}${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__sci-fi-loader"
    >
      <div className={styles['pf-scifi-loader-css__track']}>
        <div
          className={styles['pf-scifi-loader-css__fill']}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          style={{ transform: `scaleX(${displayProgress})` }}
        />
        <div className={styles['pf-scifi-loader-css__glint']} />
      </div>
      <div className={styles['pf-scifi-loader-css__decor-top']} />
      <div className={styles['pf-scifi-loader-css__decor-bottom']} />
      <div className={styles['pf-scifi-loader-css__text']}>
        {label} {percent}%
      </div>
    </div>
  )
}
