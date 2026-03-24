/**
 * Animated leaderboard that cycles the top entry to the bottom with smooth
 * rank-shift transitions. Demonstrates animating positional changes in a list.
 *
 * Copy-paste files: this file + ../SharedTypes.ts + ../shared.css +
 * RealtimeDataLeaderboardShift.css
 * Runtime deps: react, motion
 */

import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { memo, useEffect, useMemo, useRef, useState } from 'react'

import type { RankedEntry } from '../SharedTypes'

const INSTANT_TRANSITION = { duration: 0 }

const DEFAULT_ITEMS: RankedEntry[] = [
  { id: 'phoenix', label: 'Phoenix', score: 2450 },
  { id: 'shadow', label: 'Shadow', score: 2380 },
  { id: 'nova', label: 'Nova', score: 2320 },
  { id: 'apex', label: 'Apex', score: 2290 },
]

interface RealtimeDataLeaderboardShiftProps {
  /** Leaderboard entries. Default: 4 demo players. */
  items?: RankedEntry[]
  /** Shift animation duration in ms. Default: 800 */
  duration?: number
  /** Pause between animation cycles in ms. Default: 2000 */
  pauseDuration?: number
}

function RealtimeDataLeaderboardShiftComponent({
  items = DEFAULT_ITEMS,
  duration = 800,
  pauseDuration = 2000,
}: RealtimeDataLeaderboardShiftProps) {
  const initialItemsRef = useRef(items)
  const [leaderboard, setLeaderboard] = useState<RankedEntry[]>(() => [...items])
  const leaderboardRef = useRef(leaderboard)
  const hasMountedRef = useRef(false)
  const skipLayoutRef = useRef(false)

  useEffect(() => {
    leaderboardRef.current = leaderboard
  }, [leaderboard])

  useEffect(() => {
    hasMountedRef.current = true
  }, [])

  const durationS = duration / 1000

  const animTransition = useMemo(
    () => ({ duration: durationS, ease: [0.25, 0.46, 0.45, 0.94] as const }),
    [durationS]
  )

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
      const current = leaderboardRef.current
      if (current.length < 2) return

      const demoted = current[0]!

      // Phase 1: Remove top item — AnimatePresence triggers exit (slide down, fade)
      // Remaining items use layout to shift up into the vacated slot.
      setLeaderboard(current.slice(1))

      // Phase 2: After exit completes, add demoted item at bottom — AnimatePresence
      // triggers enter (slide in from above, fade in).
      schedule(() => {
        if (!mounted) return
        setLeaderboard((prev) => [...prev, { ...demoted, score: demoted.score - 50 }])

        // Phase 3: Pause, then snap-reset to initial (no animation).
        schedule(() => {
          if (!mounted) return
          skipLayoutRef.current = true
          setLeaderboard([...initialItemsRef.current])
          requestAnimationFrame(() => {
            skipLayoutRef.current = false
          })
          schedule(cycle, 1000)
        }, pauseDuration)
      }, duration)
    }

    // Delay first cycle so initial render shows full leaderboard — CSS variant
    // starts with a visual-only exit (no state change), so both variants need
    // the same initial DOM with all items visible.
    schedule(cycle, 100)

    return () => {
      mounted = false
      timeouts.forEach(clearTimeout)
      timeouts.clear()
    }
  }, [duration, pauseDuration])

  return (
    <div className="pf-realtime-data" data-animation-id="realtime-data__leaderboard-shift">
      <div className="pf-realtime-data__leaderboard">
        <AnimatePresence mode="popLayout">
          {leaderboard.map((entry, index) => (
            <m.div
              key={entry.id}
              className="pf-realtime-data__row"
              layout
              initial={hasMountedRef.current ? { y: -20, opacity: 0 } : false}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={skipLayoutRef.current ? INSTANT_TRANSITION : animTransition}
              style={{ animation: 'none' }}
            >
              <div className="pf-realtime-data__rank">#{index + 1}</div>
              <div className="pf-realtime-data__player">{entry.label}</div>
              <div className="pf-realtime-data__score">{entry.score.toLocaleString()}</div>
            </m.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

export const RealtimeDataLeaderboardShift = memo(RealtimeDataLeaderboardShiftComponent)
