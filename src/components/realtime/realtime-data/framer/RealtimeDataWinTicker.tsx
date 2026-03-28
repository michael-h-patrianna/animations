/**
 * Continuously scrolling marquee/ticker for announcements, wins, or status
 * messages. Fully customizable: pass your own items, separator, speed, and color.
 *
 * Copy-paste files: this file + ../shared.css + RealtimeDataWinTicker.module.css
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, useMemo } from 'react'

import './RealtimeDataWinTicker.module.css'

const DEFAULT_ITEMS = ['Mega Win! +5,000 credits', 'Daily streak unlocked', 'Bonus wheel ready']

interface RealtimeDataWinTickerProps {
  /** Messages to scroll. Default: demo messages. */
  items?: string[]
  /** Separator between messages. Default: ' · ' */
  separator?: string
  /** Full scroll cycle duration in ms. Default: 8000 */
  duration?: number
  /** Text color. Default: '#f59e0b' (amber) */
  textColor?: string
}

function RealtimeDataWinTickerComponent({
  items = DEFAULT_ITEMS,
  separator = ' \u00b7 ',
  duration = 8000,
  textColor,
}: RealtimeDataWinTickerProps) {
  const prefersReducedMotion = useReducedMotion()
  const text = useMemo(() => {
    const single = items.join(separator) + separator
    return single.repeat(3)
  }, [items, separator])

  const durationS = duration / 1000

  return (
    <div className="pf-realtime-data-fm" data-animation-id="realtime-data__win-ticker">
      <div className="pf-realtime-data-fm__ticker">
        <m.div
          className="pf-realtime-data-fm__ticker-text"
          initial={prefersReducedMotion ? undefined : { x: '100%' }}
          animate={prefersReducedMotion ? undefined : { x: '-100%' }}
          transition={
            prefersReducedMotion
              ? undefined
              : {
                  duration: durationS,
                  ease: 'linear',
                  repeat: Infinity,
                  repeatType: 'loop',
                }
          }
          style={{ color: textColor }}
        >
          {text}
        </m.div>
      </div>
    </div>
  )
}

export const RealtimeDataWinTicker = memo(RealtimeDataWinTickerComponent)
