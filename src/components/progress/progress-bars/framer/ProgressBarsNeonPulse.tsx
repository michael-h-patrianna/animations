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
 * - `--neon-pulse-bg`         — container background (default: #0a0a0f)
 * - `--neon-pulse-track`      — track background (default: rgb(236 72 153 / 8%))
 * - `--neon-pulse-fill`       — neon fill color (default: #ec4899)
 * - `--neon-pulse-fill-to`    — neon fill end (default: #f472b6)
 * - `--neon-pulse-glow`       — glow layer (default: rgb(236 72 153 / 25%))
 * - `--neon-pulse-height`     — track height (default: 8px)
 *
 * Files to copy: this file + ProgressBarsNeonPulse.css + ../SharedTypes.ts + ../SharedDemoLoop.ts
 */
import * as m from 'motion/react-m'
import type { ProgressBarProps } from '@/components/progress/progress-bars/SharedTypes'
import { useDemoProgress } from '@/components/progress/progress-bars/SharedDemoLoop'

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
  const isDemo = progress === undefined
  const demoDuration = 6000
  const displayProgress = useDemoProgress(progress, { duration: demoDuration, pause: 800 })
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
          initial={isDemo ? { width: '0%' } : false}
          animate={
            isDemo
              ? {
                  width: '100%',
                  transition: {
                    duration: demoDuration / 1000,
                    ease: 'linear',
                    repeat: Infinity,
                    repeatDelay: 0.8,
                  },
                }
              : { width: `${percent}%` }
          }
          transition={isDemo ? undefined : { ease: 'linear', duration: 0.1 }}
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
          initial={isDemo ? { width: '0%' } : false}
          animate={
            isDemo
              ? {
                  width: '100%',
                  transition: {
                    duration: demoDuration / 1000,
                    ease: 'linear',
                    repeat: Infinity,
                    repeatDelay: 0.8,
                  },
                }
              : { width: `${percent}%` }
          }
          transition={isDemo ? undefined : { ease: 'linear', duration: 0.1 }}
        />
      </div>
      {label !== undefined && label !== '' && <div className="neon-pulse-label">{label}</div>}
    </div>
  )
}
