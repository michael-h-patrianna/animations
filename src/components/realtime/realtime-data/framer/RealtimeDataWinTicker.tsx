/**
 * Continuously scrolling marquee/ticker for announcements, wins, or status
 * messages. Fully customizable: pass your own items, separator, speed, and color.
 *
 * Copy-paste files: this file + ../shared.css + RealtimeDataWinTicker.css
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { memo, useMemo } from 'react'

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
  const text = useMemo(() => {
    const single = items.join(separator) + separator
    return single.repeat(3)
  }, [items, separator])

  const durationS = duration / 1000

  return (
    <div className="pf-realtime-data" data-animation-id="realtime-data__win-ticker">
      <div className="pf-realtime-data__ticker">
        <m.div
          className="pf-realtime-data__ticker-text"
          initial={{ x: '100%' }}
          animate={{ x: '-100%' }}
          transition={{
            duration: durationS,
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'loop',
          }}
          style={{ animation: 'none', color: textColor }}
        >
          {text}
        </m.div>
      </div>
    </div>
  )
}

export const RealtimeDataWinTicker = memo(RealtimeDataWinTickerComponent)
