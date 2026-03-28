/**
 * Continuously scrolling marquee/ticker for announcements, wins, or status
 * messages — CSS variant using keyframe animation.
 *
 * Copy-paste files: this file + RealtimeDataWinTicker.css + ../shared.css
 * Runtime deps: react
 */

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
  const text = useMemo(() => {
    const single = items.join(separator) + separator
    return single.repeat(3)
  }, [items, separator])

  const style = useMemo(
    () => ({
      '--pf-realtime-ticker-duration': `${duration}ms`,
      color: textColor,
    }),
    [duration, textColor]
  )

  return (
    <div className="pf-realtime-data" data-animation-id="realtime-data__win-ticker">
      <div className="pf-realtime-data__ticker">
        <div className="pf-realtime-data__ticker-text" style={style}>
          {text}
        </div>
      </div>
    </div>
  )
}

export const RealtimeDataWinTicker = memo(RealtimeDataWinTickerComponent)
