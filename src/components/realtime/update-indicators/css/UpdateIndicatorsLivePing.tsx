/**
 * Live status dot — continuously pulsing indicator for real-time/active state. CSS variant.
 *
 * Copy-paste files: this file + UpdateIndicatorsLivePing.module.css + ../shared.css
 * Runtime deps: react
 *
 * Usage: <UpdateIndicatorsLivePing color="#00ff00" size={10} />
 */
import { memo } from 'react'
import { PING_COLOR } from '@/components/realtime/update-indicators/SharedDefaults'
import styles from './UpdateIndicatorsLivePing.module.css'

interface LivePingProps {
  /** Dot color. Default: '#c6ff77' */
  color?: string
  /** Dot diameter in px. Default: 12 */
  size?: number
  /** Pulse cycle duration in ms. Default: 1200 */
  duration?: number
}

function UpdateIndicatorsLivePingComponent({
  color = PING_COLOR,
  size = 12,
  duration = 1200,
}: LivePingProps) {
  return (
    <div className="pf-update-indicator" data-animation-id="update-indicators__live-ping">
      <div
        className={`pf-update-indicator__ping ${styles['pf-live-ping']}`}
        style={{
          ['--pf-live-ping-dur' as string]: `${duration}ms`,
          width: size,
          height: size,
          background: color,
        }}
      />
    </div>
  )
}

export const UpdateIndicatorsLivePing = memo(UpdateIndicatorsLivePingComponent)
