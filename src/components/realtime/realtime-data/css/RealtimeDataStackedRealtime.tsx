/**
 * Stacked key-value rows that animate in with alternating slide directions
 * and staggered timing — CSS variant using Web Animations API.
 *
 * Copy-paste files: this file + RealtimeDataStackedRealtime.css +
 * ../SharedTypes.ts + ../shared.css
 * Runtime deps: react
 */

import { memo, useEffect, useRef } from 'react'
import './RealtimeDataStackedRealtime.css'

import type { StatEntry } from '../SharedTypes'

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

const animateRowsIn = (
  items: StatEntry[],
  rowEls: Array<HTMLDivElement | null>,
  valueEls: Array<HTMLSpanElement | null>,
  duration: number,
  staggerDelay: number,
  activeColor: string,
  inactiveColor: string
) => {
  items.forEach((item, index) => {
    const rowEl = rowEls[index]
    const valueEl = valueEls[index]
    const offsetX = index % 2 === 0 ? -16 : 16

    if (rowEl) {
      rowEl.animate(
        [
          { transform: `translateX(${offsetX}px)`, opacity: 0 },
          { transform: 'translateX(0)', opacity: 1 },
        ],
        {
          duration,
          delay: index * staggerDelay,
          easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          fill: 'forwards',
        }
      )
    }

    if (valueEl) {
      const targetColor = item.active === true ? activeColor : inactiveColor
      valueEl.animate([{ color: activeColor }, { color: targetColor }], {
        duration: 400,
        delay: index * staggerDelay + 200,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        fill: 'forwards',
      })
    }
  })
}

const animateRowsOut = (rowEls: Array<HTMLDivElement | null>) => {
  rowEls.forEach((el, index) => {
    if (!el) return
    const offsetX = index % 2 === 0 ? -16 : 16
    el.animate(
      [
        { transform: 'translateX(0)', opacity: 1 },
        { transform: `translateX(${offsetX}px)`, opacity: 0 },
      ],
      { duration: 400, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', fill: 'forwards' }
    )
  })
}

function RealtimeDataStackedRealtimeComponent({
  items = DEFAULT_ITEMS,
  staggerDelay = 80,
  duration = 600,
  activeColor = 'var(--pf-anim-cyan)',
  inactiveColor = 'var(--pf-anim-gray-400)',
}: RealtimeDataStackedRealtimeProps) {
  const rowRef = useRef<Array<HTMLDivElement | null>>([])
  const valueRef = useRef<Array<HTMLSpanElement | null>>([])

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
      animateRowsIn(items, rowRef.current, valueRef.current, duration, staggerDelay, activeColor, inactiveColor)

      schedule(() => {
        if (!mounted) return
        animateRowsOut(rowRef.current)
        schedule(cycle, 2000)
      }, 1500)
    }

    cycle()

    return () => {
      mounted = false
      timeouts.forEach(clearTimeout)
      timeouts.clear()
    }
  }, [activeColor, duration, inactiveColor, items, staggerDelay])

  return (
    <div className="pf-realtime-data" data-animation-id="realtime-data__stacked-realtime">
      <div className="pf-realtime-data__stack">
        {items.map((item, index) => (
          <div
            key={item.label}
            ref={(el) => {
              rowRef.current[index] = el
            }}
            className={`pf-realtime-data__stack-row ${item.active === true ? 'active' : ''}`}
            style={{ opacity: 0, transform: `translateX(${index % 2 === 0 ? -16 : 16}px)` }}
          >
            <span className="pf-realtime-data__stack-label">{item.label}</span>
            <span
              ref={(el) => {
                valueRef.current[index] = el
              }}
              className="pf-realtime-data__stack-value"
              style={{ color: activeColor }}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export const RealtimeDataStackedRealtime = memo(RealtimeDataStackedRealtimeComponent)
