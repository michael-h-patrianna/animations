/**
 * Reactive leaderboard that animates position transitions when items change
 * — CSS variant using Web Animations API.
 *
 * When items change, the component diffs previous vs current entries and runs
 * WAAPI FLIP-style animations for exits, shifts, and entries. Removed entries
 * are kept in the DOM during their exit animation, then removed.
 *
 * Copy-paste files: this file + RealtimeDataLeaderboardShift.css +
 * ../SharedTypes.ts + ../shared.css
 * Runtime deps: react
 */

import { memo, useEffect, useLayoutEffect, useRef, useState } from 'react'
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
}

const EASING = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'

const animateExit = (el: HTMLDivElement | undefined, durationMs: number) => {
  if (!el) return
  el.animate(
    [
      { transform: 'translateY(0)', opacity: 1 },
      { transform: 'translateY(100px)', opacity: 0 },
    ],
    { duration: durationMs, easing: EASING, fill: 'forwards' }
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
      easing: EASING,
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
        easing: EASING,
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
}: RealtimeDataLeaderboardShiftProps) {
  // renderList may temporarily include exiting entries that are still animating out
  const [renderList, setRenderList] = useState<RankedEntry[]>(() => [...items])
  const prevIdsRef = useRef<string[]>(items.map((e) => e.id))
  const rowRef = useRef<Map<string, HTMLDivElement>>(new Map())
  const framesRef = useRef<Set<number>>(new Set())
  const exitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isFirstRenderRef = useRef(true)

  // Pending animations to run after the next renderList state update
  const pendingAnimRef = useRef<{ shifted: string[]; added: string[] } | null>(null)

  // Clean up rAFs and exit timeout on unmount
  useEffect(() => {
    const frames = framesRef.current
    return () => {
      frames.forEach(cancelAnimationFrame)
      frames.clear()
      if (exitTimeoutRef.current !== null) clearTimeout(exitTimeoutRef.current)
    }
  }, [])

  // Detect items changes: handle exits (animate on current DOM), then schedule
  // renderList update for shift/entry animations.
  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false
      return
    }

    // Cancel any pending exit timeout from a previous update
    if (exitTimeoutRef.current !== null) {
      clearTimeout(exitTimeoutRef.current)
      exitTimeoutRef.current = null
    }

    const prevIds = prevIdsRef.current
    const nextIds = items.map((e) => e.id)
    prevIdsRef.current = nextIds

    // No change in item composition — just update values
    if (prevIds.join(',') === nextIds.join(',')) {
      setRenderList([...items])
      return
    }

    const nextIdSet = new Set(nextIds)
    const prevIdSet = new Set(prevIds)
    const removed = prevIds.filter((id) => !nextIdSet.has(id))
    const shifted = nextIds.filter(
      (id) => prevIdSet.has(id) && prevIds.indexOf(id) !== nextIds.indexOf(id)
    )
    const added = nextIds.filter((id) => !prevIdSet.has(id))

    if (removed.length > 0) {
      // Phase 1: Animate exit on current DOM (renderList still has old entries)
      for (const id of removed) {
        animateExit(rowRef.current.get(id), duration)
      }

      // Phase 2: After exit animation, update renderList → triggers shift/entry
      exitTimeoutRef.current = setTimeout(() => {
        exitTimeoutRef.current = null
        pendingAnimRef.current = { shifted, added }
        setRenderList([...items])
      }, duration)
    } else {
      // No exits — update renderList immediately
      pendingAnimRef.current = { shifted, added }
      setRenderList([...items])
    }
  }, [items, duration])

  // After renderList commits to DOM, run shift/entry animations
  useLayoutEffect(() => {
    const pending = pendingAnimRef.current
    if (!pending) return
    pendingAnimRef.current = null

    const { shifted, added } = pending
    if (shifted.length === 0 && added.length === 0) return

    const scheduleFrame = (cb: FrameRequestCallback) => {
      const id = requestAnimationFrame((t) => {
        framesRef.current.delete(id)
        cb(t)
      })
      framesRef.current.add(id)
      return id
    }

    scheduleFrame(() => {
      for (const id of shifted) {
        animateShift(rowRef.current.get(id), duration, scheduleFrame)
      }
      for (const id of added) {
        animateEntry(rowRef.current.get(id), duration, scheduleFrame)
      }
    })
  }) // Fires on every render; pendingAnimRef guards against unnecessary work

  return (
    <div className="pf-realtime-data" data-animation-id="realtime-data__leaderboard-shift">
      <div className="pf-realtime-data__leaderboard">
        {renderList.map((entry, index) => (
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
