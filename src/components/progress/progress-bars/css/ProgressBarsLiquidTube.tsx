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
      className={`${styles['liquid-tube-container-css']}${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__liquid-tube"
    >
      <div className={styles['liquid-tube-glass-css']}>
        <div
          className={styles['liquid-tube-fill-css']}
          style={{ transform: `translateY(${100 - percent}%)` }}
        >
          <div className={styles['liquid-tube-surface-css']}>
            <div className={styles['liquid-wave-css']} />
          </div>
          <div className={`${styles['liquid-bubble-css']} ${styles['bubble-1']}`} />
          <div className={`${styles['liquid-bubble-css']} ${styles['bubble-2']}`} />
          <div className={`${styles['liquid-bubble-css']} ${styles['bubble-3']}`} />
        </div>
      </div>
    </div>
  )
}
