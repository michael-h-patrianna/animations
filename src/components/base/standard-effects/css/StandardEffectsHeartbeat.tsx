/**
 * Catalog display for the Heartbeat CSS effect.
 * Consumer product: StandardEffectsHeartbeat.module.css — import styles and apply styles['pf-heartbeat'].
 */
import { memo, type CSSProperties, type ReactNode } from 'react'
import styles from './StandardEffectsHeartbeat.module.css'
import { DemoBox } from '@/components/demo-blocks'

interface StandardEffectsHeartbeatProps {
  children?: ReactNode
  duration?: number
}

function StandardEffectsHeartbeatComponent({
  children,
  duration = 1300,
}: StandardEffectsHeartbeatProps) {
  const style = {
    display: 'inline-flex',
    ['--pf-heartbeat-duration' as string]: `${duration}ms`,
  } as CSSProperties

  return (
    <div
      className={styles['pf-heartbeat']}
      data-animation-id="standard-effects__heartbeat"
      style={style}
    >
      {children ?? <DemoBox label="Heartbeat" />}
    </div>
  )
}

export const StandardEffectsHeartbeat = memo(StandardEffectsHeartbeatComponent)
