/**
 * Sci-Fi Loader Progress Bar (CSS variant)
 *
 * Files to copy: this file + ProgressBarsSciFiLoader.css + ../SharedTypes.ts + ../SharedDemoLoop.ts
 */
import type { ProgressBarProps } from '@/components/progress/progress-bars/SharedTypes'
import { useDemoProgress } from '@/components/progress/progress-bars/SharedDemoLoop'
import './ProgressBarsSciFiLoader.css'

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
  const displayProgress = useDemoProgress(progress, { duration: 5000, pause: 800 })
  const percent = Math.round(displayProgress * 100)

  return (
    <div
      className={`scifi-loader-container-css${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__sci-fi-loader"
    >
      <div className="scifi-loader-track-css">
        <div className="scifi-loader-fill-css" style={{ width: `${percent}%` }} />
        <div className="scifi-loader-glint-css" />
      </div>
      <div className="scifi-loader-decor-top-css" />
      <div className="scifi-loader-decor-bottom-css" />
      <div className="scifi-loader-text-css">
        {label} {percent}%
      </div>
    </div>
  )
}
