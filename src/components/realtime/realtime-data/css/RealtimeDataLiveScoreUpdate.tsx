/**
 * Reactive score display that animates count-up with a scale+color pulse
 * when item scores change — CSS variant using Web Animations API.
 *
 * Copy-paste files: this file + RealtimeDataLiveScoreUpdate.css +
 * ../SharedTypes.ts + ../shared.css
 * Runtime deps: react
 */

import { memo, useEffect, useMemo, useRef, useState } from 'react'
import './RealtimeDataLiveScoreUpdate.css'

import type { RankedEntry } from '@/components/realtime/realtime-data/SharedTypes'

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
  /** Pulse animation duration in ms. Default: 800 */
  duration?: number
  /** Highlight color during score change. Default: 'var(--pf-anim-green)' */
  highlightColor?: string
}

function RealtimeDataLiveScoreUpdateComponent({
  items = DEFAULT_ITEMS,
  duration = 800,
  highlightColor = 'var(--pf-anim-green)',
}: RealtimeDataLiveScoreUpdateProps) {
  const [displayedScores, setDisplayedScores] = useState<number[]>(() => items.map((e) => e.score))
  const displayedScoresRef = useRef(displayedScores)
  const prevScoreKeyRef = useRef(items.map((e) => e.score).join(','))
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
    displayedScoresRef.current = displayedScores
  }, [displayedScores])

  // Detect score changes and animate count-up + pulse
  useEffect(() => {
    const newScoreKey = items.map((e) => e.score).join(',')
    if (newScoreKey === prevScoreKeyRef.current) return
    prevScoreKeyRef.current = newScoreKey

    const startScores = [...displayedScoresRef.current]
    const targetScores = items.map((e) => e.score)

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

    // Count up scores with easing
    let step = 0
    const intervalId = setInterval(() => {
      step += 1
      const progress = easeOutCubic(step / SCORE_STEPS)
      setDisplayedScores(
        startScores.map((start, i) => Math.round(start + (targetScores[i]! - start) * progress))
      )
      if (step >= SCORE_STEPS) {
        clearInterval(intervalId)
        setDisplayedScores([...targetScores])
      }
    }, SCORE_STEP_INTERVAL_MS)

    return () => {
      clearInterval(intervalId)
    }
  }, [items, duration, keyframes])

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
              {(displayedScores[index] ?? entry.score).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const RealtimeDataLiveScoreUpdate = memo(RealtimeDataLiveScoreUpdateComponent)
