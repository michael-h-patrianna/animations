/**
 * Liquid Tube Progress Bar (CSS variant)
 *
 * CSS keyframe version with wave and bubble animations.
 *
 * Files to copy: this file + ProgressBarsLiquidTube.module.css + ../SharedTypes.ts
 */
import type { ProgressBarProps } from '@/components/progress/progress-bars/SharedTypes'
import styles from './ProgressBarsLiquidTube.module.css'

export function ProgressBarsLiquidTube({ progress, className, style }: ProgressBarProps) {
  const displayProgress = progress ?? 0
  const percent = displayProgress * 100

  return (
    <div
      className={`${styles['pf-liquid-tube']}${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__liquid-tube"
    >
      <div
        className={styles['pf-liquid-tube__glass']}
        role="progressbar"
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={styles['pf-liquid-tube__fill']}
          style={{ transform: `translateY(${100 - percent}%)` }}
        >
          <div className={styles['pf-liquid-tube__surface']}>
            <div className={styles['pf-liquid-tube__wave']} />
          </div>
          <div
            className={`${styles['pf-liquid-tube__bubble']} ${styles['pf-liquid-tube__bubble--1']}`}
          />
          <div
            className={`${styles['pf-liquid-tube__bubble']} ${styles['pf-liquid-tube__bubble--2']}`}
          />
          <div
            className={`${styles['pf-liquid-tube__bubble']} ${styles['pf-liquid-tube__bubble--3']}`}
          />
        </div>
      </div>
    </div>
  )
}
