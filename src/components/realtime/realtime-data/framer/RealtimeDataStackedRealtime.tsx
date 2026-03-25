/**
 * Stacked key-value rows that animate in with alternating slide directions
 * and staggered timing. Demonstrates animating a batch data refresh in a list.
 *
 * Copy-paste files: this file + ../SharedTypes.ts + ../shared.css +
 * RealtimeDataStackedRealtime.css
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { memo, useEffect, useState } from 'react'

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
  staggerDelay = 80,
  duration = 600,
  activeColor = 'var(--pf-anim-cyan)',
  inactiveColor = 'var(--pf-anim-gray-400)',
}: RealtimeDataStackedRealtimeProps) {
  const [isVisible, setIsVisible] = useState(false)

  const durationS = duration / 1000
  const staggerS = staggerDelay / 1000

  useEffect(() => {
    const timeouts = new Set<ReturnType<typeof setTimeout>>()
    let mounted = true

    const schedule = (fn: () => void, ms: number) => {
      const id = setTimeout(() => {
        timeouts.delete(id)
        fn()
      }, ms)
      timeouts.add(id)
    }

    const cycle = () => {
      if (!mounted) return
      setIsVisible(true)

      schedule(() => {
        if (!mounted) return
        setIsVisible(false)
        schedule(cycle, 2000)
      }, 1500)
    }

    cycle()

    return () => {
      mounted = false
      timeouts.forEach(clearTimeout)
      timeouts.clear()
    }
  }, [])

  return (
    <div className="pf-realtime-data" data-animation-id="realtime-data__stacked-realtime">
      <div className="pf-realtime-data__stack">
        {items.map((item, index) => (
          <m.div
            key={item.label}
            className={`pf-realtime-data__stack-row ${item.active === true ? 'active' : ''}`}
            initial={{ x: index % 2 === 0 ? -16 : 16, opacity: 0 }}
            animate={{
              x: isVisible ? 0 : index % 2 === 0 ? -16 : 16,
              opacity: isVisible ? 1 : 0,
            }}
            transition={{
              duration: durationS,
              delay: index * staggerS,
              ease: [0.25, 0.46, 0.45, 0.94] as const,
            }}
            style={{ animation: 'none' }}
          >
            <span className="pf-realtime-data__stack-label">{item.label}</span>
            <m.span
              className="pf-realtime-data__stack-value"
              animate={{
                color: isVisible && item.active !== true ? inactiveColor : activeColor,
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
