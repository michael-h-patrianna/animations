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
      className={`${styles['scifi-loader-container-css']}${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__sci-fi-loader"
    >
      <div className={styles['scifi-loader-track-css']}>
        <div
          className={styles['scifi-loader-fill-css']}
          style={{ transform: `scaleX(${displayProgress})` }}
        />
        <div className={styles['scifi-loader-glint-css']} />
      </div>
      <div className={styles['scifi-loader-decor-top-css']} />
      <div className={styles['scifi-loader-decor-bottom-css']} />
      <div className={styles['scifi-loader-text-css']}>
        {label} {percent}%
      </div>
    </div>
  )
}
