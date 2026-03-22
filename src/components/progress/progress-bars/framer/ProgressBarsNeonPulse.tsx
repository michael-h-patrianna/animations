/**
 * Neon Pulse Progress Bar
 *
 * Cyberpunk-style progress bar with flickering neon fill and glow layer.
 * In demo mode cycles continuously 0→100%→reset. In controlled mode
 * displays the given progress value.
 *
 * @example
 * ```tsx
 * <ProgressBarsNeonPulse progress={0.65} label="UPLOADING..." />
 * ```
 *
 * Styleable CSS custom properties:
 * - `--neon-pulse-bg`         — container background (default: #000)
 * - `--neon-pulse-track`      — track background (default: #1a1a1a)
 * - `--neon-pulse-fill`       — neon fill color (default: #f0f)
 * - `--neon-pulse-flicker`    — flicker overlay color (default: rgb(255 255 255 / 50%))
 * - `--neon-pulse-glow`       — glow layer color (default: rgb(255 0 255 / 20%))
 * - `--neon-pulse-height`     — track height (default: 10px)
 *
 * Files to copy: this file + ProgressBarsNeonPulse.css + ../SharedTypes.ts + ../SharedDemoLoop.ts
 */
import * as m from 'motion/react-m'
import type { ProgressBarProps } from '../SharedTypes'
import { useDemoProgress } from '../SharedDemoLoop'

interface NeonPulseProps extends ProgressBarProps {
  /** Status label below the bar. Default: "SYNCING...". */
  label?: string
}

export function ProgressBarsNeonPulse({
  progress,
  label = 'SYNCING...',
  className,
  style,
}: NeonPulseProps) {
  const displayProgress = useDemoProgress(progress, { duration: 6000, pause: 800 })
  const percent = displayProgress * 100

  return (
    <div
      className={`neon-pulse-container${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__neon-pulse"
    >
      <div className="neon-pulse-track">
        <m.div
          className="neon-pulse-fill"
          animate={{ width: `${percent}%` }}
          transition={{ ease: 'linear', duration: 0.1 }}
          style={{ animation: 'none' }}
        >
          <m.div
            className="neon-pulse-flicker"
            animate={{ opacity: [1, 0.8, 1, 0.4, 1, 0.9, 1] }}
            transition={{ duration: 0.2, repeat: Infinity, repeatType: 'reverse' }}
            style={{ animation: 'none' }}
          />
        </m.div>

        <m.div
          className="neon-pulse-glow"
          animate={{ width: `${percent}%` }}
          transition={{ ease: 'linear', duration: 0.1 }}
        />
      </div>
      {label !== undefined && label !== '' && <div className="neon-pulse-label">{label}</div>}
    </div>
  )
}
