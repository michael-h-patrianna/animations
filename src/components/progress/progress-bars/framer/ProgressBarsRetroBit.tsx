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
 * Files to copy: this file + ProgressBarsRetroBit.css + ../SharedTypes.ts + ../SharedDemoLoop.ts
 */
import * as m from 'motion/react-m'
import type { ProgressBarProps } from '../SharedTypes'
import { useDemoProgress } from '../SharedDemoLoop'

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
  const displayProgress = useDemoProgress(progress, { duration: 5000, pause: 1000 })
  const activeCount = Math.floor(displayProgress * segments)

  return (
    <div
      className={`retro-bit-container${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__retro-bit"
    >
      <div className="retro-bit-frame">
        {Array.from({ length: segments }, (_, i) => (
          <m.div
            key={i}
            className="retro-bit-segment"
            initial={{ opacity: 0.1 }}
            animate={{
              opacity: i < activeCount ? 1 : 0.1,
              backgroundColor:
                i < activeCount ? 'var(--retro-bit-active)' : 'var(--retro-bit-inactive)',
            }}
            transition={{ duration: 0 }}
            style={{ animation: 'none' }}
          />
        ))}
      </div>
      {label !== undefined && label !== '' && <div className="retro-bit-label">{label}</div>}
    </div>
  )
}
