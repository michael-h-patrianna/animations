/**
 * Neon Pulse Progress Bar (CSS variant)
 *
 * CSS version with flicker animation via keyframes. In demo mode cycles
 * continuously. In controlled mode displays the given progress value.
 *
 * @example
 * ```tsx
 * <ProgressBarsNeonPulse progress={0.65} label="UPLOADING..." />
 * ```
 *
 * Styleable CSS custom properties — same as framer variant.
 *
 * Files to copy: this file + ProgressBarsNeonPulse.css + ../SharedTypes.ts
 */
import type { ProgressBarProps } from '@/components/progress/progress-bars/SharedTypes'
import './ProgressBarsNeonPulse.css'

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
  const displayProgress = progress ?? 0
  const percent = displayProgress * 100

  return (
    <div
      className={`neon-pulse-container-css${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__neon-pulse"
    >
      <div className="neon-pulse-track-css">
        <div className="neon-pulse-fill-css" style={{ width: `${percent}%` }}>
          <div className="neon-pulse-flicker-css" />
        </div>
        <div className="neon-pulse-glow-css" style={{ width: `${percent}%` }} />
      </div>
      {label !== undefined && label !== '' && <div className="neon-pulse-label-css">{label}</div>}
    </div>
  )
}
