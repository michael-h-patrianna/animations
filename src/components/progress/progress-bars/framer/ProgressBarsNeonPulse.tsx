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
 * Files to copy: this file + ProgressBarsNeonPulse.css + ../SharedTypes.ts
 */
import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import type { ProgressBarProps } from '@/components/progress/progress-bars/SharedTypes'

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
  const prefersReducedMotion = useReducedMotion()
  const displayProgress = progress ?? 0
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
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ ease: 'linear', duration: prefersReducedMotion ? 0.05 : 0.1 }}
          style={{ animation: 'none' }}
        >
          <m.div
            className="neon-pulse-flicker"
            animate={prefersReducedMotion ? undefined : { opacity: [1, 0.8, 1, 0.4, 1, 0.9, 1] }}
            transition={prefersReducedMotion ? undefined : { duration: 0.2, repeat: Infinity, repeatType: 'reverse' }}
            style={{ animation: 'none' }}
          />
        </m.div>

        <m.div
          className="neon-pulse-glow"
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ ease: 'linear', duration: prefersReducedMotion ? 0.05 : 0.1 }}
        />
      </div>
      {label !== undefined && label !== '' && <div className="neon-pulse-label">{label}</div>}
    </div>
  )
}
