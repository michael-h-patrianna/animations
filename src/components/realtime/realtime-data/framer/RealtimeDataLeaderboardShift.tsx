/**
 * Reactive leaderboard that animates position transitions when items change
 * — Motion variant using a 2-phase sequential animation.
 *
 * Phase 1 (exit): removed items slide down and fade out over `duration` ms.
 * Phase 2 (shift + entry): remaining items slide up from their old visual
 * position; new items fade in from above. Phases are sequential — shift/entry
 * waits for exit to complete — matching the CSS variant's behavior exactly.
 *
 * Shifted items use a versioned key to force remount each cycle, ensuring
 * `initial` applies fresh and the slide-up animation always triggers.
 *
 * Copy-paste files: this file + ../SharedTypes.ts + ../shared.css
 * Runtime deps: react, motion
 */

import { useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { memo, useEffect, useRef, useState } from 'react'

import type { RankedEntry } from '@/components/realtime/realtime-data/SharedTypes'
import './RealtimeDataLeaderboardShift.module.css'

const DEFAULT_ITEMS: RankedEntry[] = [
  { id: 'phoenix', label: 'Phoenix', score: 2450 },
  { id: 'shadow', label: 'Shadow', score: 2380 },
  { id: 'nova', label: 'Nova', score: 2320 },
  { id: 'apex', label: 'Apex', score: 2290 },
]

const ROW_HEIGHT = 48
const EASING: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94]

type ItemPhase = 'idle' | 'exiting' | 'shifting' | 'entering'

interface RenderEntry extends RankedEntry {
  phase: ItemPhase
}

interface RealtimeDataLeaderboardShiftProps {
  /** Leaderboard entries. Default: 4 demo players. */
  items?: RankedEntry[]
  /** Shift animation duration in ms. Default: 800 */
  duration?: number
}

function RealtimeDataLeaderboardShiftComponent({
  items = DEFAULT_ITEMS,
  duration = 800,
}: RealtimeDataLeaderboardShiftProps) {
  const prefersReducedMotion = useReducedMotion()
  const durationS = duration / 1000

  const [renderList, setRenderList] = useState<RenderEntry[]>(() =>
    items.map((e) => ({ ...e, phase: 'idle' as const }))
  )
  const [shiftVersion, setShiftVersion] = useState(0)
  const prevIdsRef = useRef<string[]>(items.map((e) => e.id))
  const isFirstRenderRef = useRef(true)
  const exitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (exitTimeoutRef.current !== null) clearTimeout(exitTimeoutRef.current)
    }
  }, [])

  // Detect items changes and orchestrate phased animations
  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false
      return
    }

    // Cancel any in-progress exit phase
    if (exitTimeoutRef.current !== null) {
      clearTimeout(exitTimeoutRef.current)
      exitTimeoutRef.current = null
    }

    const prevIds = prevIdsRef.current
    const nextIds = items.map((e) => e.id)
    prevIdsRef.current = nextIds

    // Same composition — just update values, no animation
    if (prevIds.join(',') === nextIds.join(',')) {
      setRenderList(items.map((e) => ({ ...e, phase: 'idle' as const })))
      return
    }

    const nextIdSet = new Set(nextIds)
    const prevIdSet = new Set(prevIds)
    const removed = prevIds.filter((id) => !nextIdSet.has(id))
    const shifted = nextIds.filter(
      (id) => prevIdSet.has(id) && prevIds.indexOf(id) !== nextIds.indexOf(id)
    )
    const added = nextIds.filter((id) => !prevIdSet.has(id))

    // Reduced motion: skip phasing, update immediately
    if (prefersReducedMotion) {
      setRenderList(items.map((e) => ({ ...e, phase: 'idle' as const })))
      return
    }

    const shiftedSet = new Set(shifted)
    const addedSet = new Set(added)

    const buildPhase2List = () =>
      items.map((e) => ({
        ...e,
        phase: addedSet.has(e.id)
          ? ('entering' as const)
          : shiftedSet.has(e.id)
            ? ('shifting' as const)
            : ('idle' as const),
      }))

    if (removed.length > 0) {
      const removedSet = new Set(removed)

      // Phase 1: mark exits, leave others unchanged (they stay in place)
      setRenderList((prev) =>
        prev.map((e) => (removedSet.has(e.id) ? { ...e, phase: 'exiting' as const } : e))
      )

      // Phase 2: after exit completes, bump version and update list
      exitTimeoutRef.current = setTimeout(() => {
        exitTimeoutRef.current = null
        setShiftVersion((v) => v + 1)
        setRenderList(buildPhase2List())
      }, duration)
    } else {
      // No exits — update immediately
      setShiftVersion((v) => v + 1)
      setRenderList(buildPhase2List())
    }
  }, [items, duration, prefersReducedMotion])

  return (
    <div className="pf-realtime-data-fm" data-animation-id="realtime-data__leaderboard-shift">
      <div className="pf-realtime-data-fm__leaderboard">
        {renderList.map((entry, index) => (
          <m.div
            key={entry.phase === 'shifting' ? `${entry.id}-s${shiftVersion}` : entry.id}
            className="pf-realtime-data-fm__row"
            data-testid="leaderboard-row"
            initial={
              entry.phase === 'shifting'
                ? { y: ROW_HEIGHT }
                : entry.phase === 'entering'
                  ? { y: -20, opacity: 0 }
                  : false
            }
            animate={
              entry.phase === 'exiting' ? { y: [0, 100], opacity: [1, 0] } : { y: 0, opacity: 1 }
            }
            transition={
              entry.phase === 'exiting'
                ? { duration: durationS, ease: EASING }
                : entry.phase === 'shifting'
                  ? { duration: durationS, ease: EASING }
                  : entry.phase === 'entering'
                    ? { duration: durationS * 0.75, ease: EASING }
                    : { duration: 0 }
            }
          >
            <div className="pf-realtime-data-fm__rank" data-testid="leaderboard-rank">
              #{index + 1}
            </div>
            <div className="pf-realtime-data-fm__player" data-testid="leaderboard-player">
              {entry.label}
            </div>
            <div className="pf-realtime-data-fm__score" data-testid="leaderboard-score">
              {entry.score.toLocaleString()}
            </div>
          </m.div>
        ))}
      </div>
    </div>
  )
}

export const RealtimeDataLeaderboardShift = memo(RealtimeDataLeaderboardShiftComponent)
