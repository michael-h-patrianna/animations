/**
 * Stacked key-value rows that animate in/out with alternating slide directions
 * and staggered timing. Toggle the `visible` prop to trigger entrance/exit.
 *
 * Copy-paste files: this file + ../SharedTypes.ts + ../shared.css
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo } from 'react'

import type { StatEntry } from '@/components/realtime/realtime-data/SharedTypes'

const DEFAULT_ITEMS: StatEntry[] = [
  { label: 'Active Players', value: '1,247', active: true },
  { label: 'Total Wins', value: '856', active: false },
  { label: 'Live Games', value: '23', active: true },
  { label: 'Pending Rewards', value: '42', active: false },
  { label: 'Daily Bonus', value: '2x', active: true },
]

interface RealtimeDataStackedRealtimeProps {
  /** Stat rows to display. Default: 5 demo stats. */
  items?: StatEntry[]
  /** Whether rows are visible (animates in when true, out when false). Default: true */
  visible?: boolean
  /** Delay between each row's entrance in ms. Default: 80 */
  staggerDelay?: number
  /** Row slide-in duration in ms. Default: 600 */
  duration?: number
  /** Color for active-row values. Default: 'var(--pf-anim-cyan)' */
  activeColor?: string
  /** Color for inactive-row values. Default: 'var(--pf-anim-gray-400)' */
  inactiveColor?: string
}

function RealtimeDataStackedRealtimeComponent({
  items = DEFAULT_ITEMS,
  visible = true,
  staggerDelay = 80,
  duration = 600,
  activeColor = 'var(--pf-anim-cyan)',
  inactiveColor = 'var(--pf-anim-gray-400)',
}: RealtimeDataStackedRealtimeProps) {
  const prefersReducedMotion = useReducedMotion()

  const durationS = duration / 1000
  const staggerS = staggerDelay / 1000

  return (
    <div className="pf-realtime-data" data-animation-id="realtime-data__stacked-realtime">
      <div className="pf-realtime-data__stack">
        {items.map((item, index) => (
          <m.div
            key={item.label}
            className={`pf-realtime-data__stack-row ${item.active === true ? 'active' : ''}`}
            initial={
              prefersReducedMotion ? { opacity: 0 } : { x: index % 2 === 0 ? -16 : 16, opacity: 0 }
            }
            animate={
              prefersReducedMotion
                ? { opacity: visible ? 1 : 0 }
                : {
                    x: visible ? 0 : index % 2 === 0 ? -16 : 16,
                    opacity: visible ? 1 : 0,
                  }
            }
            transition={{
              duration: prefersReducedMotion ? 0.1 : durationS,
              delay: prefersReducedMotion ? 0 : index * staggerS,
              ease: [0.25, 0.46, 0.45, 0.94] as const,
            }}
            style={{ animation: 'none' }}
          >
            <span className="pf-realtime-data__stack-label">{item.label}</span>
            <m.span
              className="pf-realtime-data__stack-value"
              animate={{
                color: visible && item.active !== true ? inactiveColor : activeColor,
              }}
              transition={{ duration: 0.4, delay: index * staggerS + 0.2 }}
              style={{ animation: 'none' }}
            >
              {item.value}
            </m.span>
          </m.div>
        ))}
      </div>
    </div>
  )
}

export const RealtimeDataStackedRealtime = memo(RealtimeDataStackedRealtimeComponent)
