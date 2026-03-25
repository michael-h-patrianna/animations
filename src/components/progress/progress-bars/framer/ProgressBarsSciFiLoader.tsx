/**
 * Sci-Fi Loader Progress Bar
 *
 * Futuristic system-init style progress bar with glint sweep and decorative
 * framing. In demo mode cycles continuously. In controlled mode displays
 * the given progress value.
 *
 * @example
 * ```tsx
 * <ProgressBarsSciFiLoader progress={0.75} label="DOWNLOADING:" />
 * ```
 *
 * Styleable CSS custom properties:
 * - `--scifi-bg`      — container background
 * - `--scifi-track`   — track background
 * - `--scifi-fill`    — fill color
 * - `--scifi-glint`   — glint sweep color
 * - `--scifi-text`    — label text color
 * - `--scifi-decor`   — decorative frame color
 *
 * Files to copy: this file + ProgressBarsSciFiLoader.css + ../SharedTypes.ts
 */
import * as m from 'motion/react-m'
import type { ProgressBarProps } from '@/components/progress/progress-bars/SharedTypes'

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
      className={`scifi-loader-container${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__sci-fi-loader"
    >
      <div className="scifi-loader-track">
        <m.div
          className="scifi-loader-fill"
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ type: 'tween', ease: 'linear', duration: 0.05 }}
          style={{ animation: 'none' }}
        />
        <m.div
          className="scifi-loader-glint"
          animate={{ left: ['-20%', '120%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          style={{ animation: 'none' }}
        />
      </div>
      <div className="scifi-loader-decor-top" />
      <div className="scifi-loader-decor-bottom" />
      <div className="scifi-loader-text">
        {label} {percent}%
      </div>
    </div>
  )
}
