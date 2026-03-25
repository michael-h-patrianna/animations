/**
 * Animated leaderboard that cycles the top entry to the bottom with smooth
 * rank-shift transitions — CSS variant using Web Animations API.
 *
 * Copy-paste files: this file + RealtimeDataLeaderboardShift.css +
 * ../SharedTypes.ts + ../shared.css
 * Runtime deps: react
 */

import { memo, useEffect, useRef, useState } from 'react'
import './RealtimeDataLeaderboardShift.css'

import type { RankedEntry } from '@/components/realtime/realtime-data/SharedTypes'

const DEFAULT_ITEMS: RankedEntry[] = [
  { id: 'phoenix', label: 'Phoenix', score: 2450 },
  { id: 'shadow', label: 'Shadow', score: 2380 },
  { id: 'nova', label: 'Nova', score: 2320 },
  { id: 'apex', label: 'Apex', score: 2290 },
]

const ROW_HEIGHT = 48

interface RealtimeDataLeaderboardShiftProps {
  /** Leaderboard entries. Default: 4 demo players. */
  items?: RankedEntry[]
  /** Shift animation duration in ms. Default: 800 */
  duration?: number
  /** Pause between animation cycles in ms. Default: 2000 */
  pauseDuration?: number
}

const buildShiftedList = (current: RankedEntry[]): RankedEntry[] => {
  if (current.length < 2) return current
  const [first, ...rest] = current
  return [...rest, { ...first!, score: first!.score - 50 }]
}

const animateExit = (el: HTMLDivElement | undefined, durationMs: number) => {
  if (!el) return
  el.animate(
    [
      { transform: 'translateY(0)', opacity: 1 },
      { transform: 'translateY(100px)', opacity: 0 },
    ],
    { duration: durationMs, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', fill: 'forwards' }
  )
}

const animateShift = (
  el: HTMLDivElement | undefined,
  durationMs: number,
  scheduleFrame: (cb: FrameRequestCallback) => number
) => {
  if (!el) return
  el.style.transform = `translateY(${ROW_HEIGHT}px)`
  scheduleFrame(() => {
    el.animate([{ transform: `translateY(${ROW_HEIGHT}px)` }, { transform: 'translateY(0)' }], {
      duration: durationMs,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      fill: 'forwards',
    }).onfinish = () => {
      el.style.transform = ''
    }
  })
}

const animateEntry = (
  el: HTMLDivElement | undefined,
  durationMs: number,
  scheduleFrame: (cb: FrameRequestCallback) => number
) => {
  if (!el) return
  el.style.opacity = '0'
  el.style.transform = 'translateY(-20px)'
  scheduleFrame(() => {
    el.animate(
      [
        { transform: 'translateY(-20px)', opacity: 0 },
        { transform: 'translateY(0)', opacity: 1 },
      ],
      {
        duration: durationMs * 0.75,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        fill: 'forwards',
      }
    ).onfinish = () => {
      el.style.transform = ''
      el.style.opacity = ''
    }
  })
}

function RealtimeDataLeaderboardShiftComponent({
  items = DEFAULT_ITEMS,
  duration = 800,
  pauseDuration = 2000,
}: RealtimeDataLeaderboardShiftProps) {
  const initialItemsRef = useRef(items)
  const [leaderboard, setLeaderboard] = useState<RankedEntry[]>(() => [...items])
  const leaderboardRef = useRef(leaderboard)
  const rowRef = useRef<Map<string, HTMLDivElement>>(new Map())

  useEffect(() => {
    leaderboardRef.current = leaderboard
  }, [leaderboard])

  useEffect(() => {
    const timeouts = new Set<ReturnType<typeof setTimeout>>()
    const frames = new Set<number>()
    let mounted = true

    const schedule = (fn: () => void, ms: number) => {
      const id = setTimeout(() => {
        timeouts.delete(id)
        fn()
      }, ms)
      timeouts.add(id)
    }

    const scheduleFrame = (cb: FrameRequestCallback) => {
      const id = requestAnimationFrame((t) => {
        frames.delete(id)
        cb(t)
      })
      frames.add(id)
      return id
    }

    const cycle = () => {
      if (!mounted) return
      const current = leaderboardRef.current
      if (current.length < 2) return

      animateExit(rowRef.current.get(current[0]!.id), duration)

      schedule(() => {
        if (!mounted) return
        const shifted = buildShiftedList(leaderboardRef.current)
        setLeaderboard(shifted)

        scheduleFrame(() => {
          // Animate non-first items shifting up, last item entering
          shifted.slice(0, -1).forEach((entry) => {
            animateShift(rowRef.current.get(entry.id), duration, scheduleFrame)
          })
          const lastEntry = shifted[shifted.length - 1]
          if (lastEntry) {
            animateEntry(rowRef.current.get(lastEntry.id), duration, scheduleFrame)
          }
        })

        schedule(() => {
          if (!mounted) return
          setLeaderboard([...initialItemsRef.current])
          schedule(cycle, 1000)
        }, pauseDuration)
      }, duration)
    }

    cycle()

    return () => {
      mounted = false
      timeouts.forEach(clearTimeout)
      timeouts.clear()
      frames.forEach(cancelAnimationFrame)
      frames.clear()
    }
  }, [duration, pauseDuration])

  return (
    <div className="pf-realtime-data" data-animation-id="realtime-data__leaderboard-shift">
      <div className="pf-realtime-data__leaderboard">
        {leaderboard.map((entry, index) => (
          <div
            key={entry.id}
            ref={(el) => {
              if (el) rowRef.current.set(entry.id, el)
              else rowRef.current.delete(entry.id)
            }}
            className="pf-realtime-data__row"
          >
            <div className="pf-realtime-data__rank">#{index + 1}</div>
            <div className="pf-realtime-data__player">{entry.label}</div>
            <div className="pf-realtime-data__score">{entry.score.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const RealtimeDataLeaderboardShift = memo(RealtimeDataLeaderboardShiftComponent)
