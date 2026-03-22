/**
 * Animated score display that counts up with a scale+color pulse on each update
 * — CSS variant using Web Animations API.
 *
 * Copy-paste files: this file + RealtimeDataLiveScoreUpdate.css +
 * ../SharedTypes.ts + ../shared.css
 * Runtime deps: react
 */

import { memo, useEffect, useMemo, useRef, useState } from 'react'
import './RealtimeDataLiveScoreUpdate.css'

import type { RankedEntry } from '../SharedTypes'

const DEFAULT_ITEMS: RankedEntry[] = [
  { id: 'phoenix', label: 'Phoenix', score: 1450 },
  { id: 'shadow', label: 'Shadow', score: 1320 },
]

const SCORE_STEPS = 20
const SCORE_STEP_INTERVAL_MS = 40

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

interface RealtimeDataLiveScoreUpdateProps {
  /** Score rows to display. Default: 2 demo players. */
  items?: RankedEntry[]
  /** Score increment per update cycle. Default: 120 */
  increment?: number
  /** Pulse animation duration in ms. Default: 800 */
  duration?: number
  /** Highlight color during score change. Default: 'var(--pf-anim-green)' */
  highlightColor?: string
  /** Pause between update cycles in ms. Default: 2000 */
  pauseDuration?: number
}

function RealtimeDataLiveScoreUpdateComponent({
  items = DEFAULT_ITEMS,
  increment = 120,
  duration = 800,
  highlightColor = 'var(--pf-anim-green)',
  pauseDuration = 2000,
}: RealtimeDataLiveScoreUpdateProps) {
  const initialScores = useMemo(() => items.map((e) => e.score), [items])
  const [scores, setScores] = useState<number[]>(() => [...initialScores])
  const scoresRef = useRef(scores)
  const scoreElRef = useRef<Map<string, HTMLDivElement>>(new Map())

  const keyframes = useMemo(
    () => [
      { transform: 'scale(1)', color: 'var(--pf-base-50)' },
      { transform: 'scale(1.2)', color: highlightColor },
      { transform: 'scale(1)', color: 'var(--pf-base-50)' },
    ],
    [highlightColor]
  )

  useEffect(() => {
    scoresRef.current = scores
  }, [scores])

  useEffect(() => {
    const timeouts = new Set<ReturnType<typeof setTimeout>>()
    const intervals = new Set<ReturnType<typeof setInterval>>()
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

      // Pulse each score element with staggered delay
      items.forEach((entry, index) => {
        const el = scoreElRef.current.get(entry.id)
        if (el) {
          el.animate(keyframes, {
            duration,
            delay: index * 100,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          })
        }
      })

      // Count up scores
      const current = [...scoresRef.current]
      let step = 0
      const intervalId = setInterval(() => {
        if (!mounted) {
          clearInterval(intervalId)
          intervals.delete(intervalId)
          return
        }
        step += 1
        const progress = easeOutCubic(step / SCORE_STEPS)
        setScores(current.map((base) => Math.round(base + increment * progress)))
        if (step >= SCORE_STEPS) {
          clearInterval(intervalId)
          intervals.delete(intervalId)
        }
      }, SCORE_STEP_INTERVAL_MS)
      intervals.add(intervalId)

      schedule(() => {
        if (!mounted) return
        setScores([...initialScores])
        schedule(cycle, 1000)
      }, pauseDuration)
    }

    cycle()

    return () => {
      mounted = false
      timeouts.forEach(clearTimeout)
      timeouts.clear()
      intervals.forEach(clearInterval)
      intervals.clear()
    }
  }, [duration, increment, initialScores, items, keyframes, pauseDuration])

  return (
    <div className="pf-realtime-data" data-animation-id="realtime-data__live-score-update">
      <div className="pf-realtime-data__leaderboard">
        {items.map((entry, index) => (
          <div key={entry.id} className="pf-realtime-data__row">
            <div className="pf-realtime-data__rank">#{index + 1}</div>
            <div className="pf-realtime-data__player">{entry.label}</div>
            <div
              ref={(el) => {
                if (el) scoreElRef.current.set(entry.id, el)
                else scoreElRef.current.delete(entry.id)
              }}
              className="pf-realtime-data__score"
            >
              {(scores[index] ?? entry.score).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const RealtimeDataLiveScoreUpdate = memo(RealtimeDataLiveScoreUpdateComponent)
