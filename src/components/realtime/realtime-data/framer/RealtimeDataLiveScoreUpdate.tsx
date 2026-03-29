/**
 * Reactive score display that animates count-up with a scale+color pulse
 * when item scores change. Pass updated items to trigger the animation.
 *
 * Copy-paste files: this file + ../SharedTypes.ts + ../shared.css
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, useEffect, useRef, useState } from 'react'

import type { RankedEntry } from '@/components/realtime/realtime-data/SharedTypes'
import './RealtimeDataLiveScoreUpdate.module.css'

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
  const prefersReducedMotion = useReducedMotion()
  const [displayedScores, setDisplayedScores] = useState<number[]>(() => items.map((e) => e.score))
  const [isPulsing, setIsPulsing] = useState(false)
  const displayedScoresRef = useRef(displayedScores)
  const prevScoreKeyRef = useRef(items.map((e) => e.score).join(','))

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

    setIsPulsing(true)

    let step = 0
    const intervalId = setInterval(() => {
      step += 1
      const progress = easeOutCubic(step / SCORE_STEPS)
      setDisplayedScores(
        startScores.map((start, i) => Math.round(start + (targetScores[i]! - start) * progress))
      )
      if (step >= SCORE_STEPS) {
        clearInterval(intervalId)
        // Ensure we land exactly on target
        setDisplayedScores([...targetScores])
      }
    }, SCORE_STEP_INTERVAL_MS)

    const pulseTimeout = setTimeout(() => setIsPulsing(false), duration)

    return () => {
      clearInterval(intervalId)
      clearTimeout(pulseTimeout)
    }
  }, [items, duration])

  const durationS = duration / 1000

  return (
    <div className="pf-realtime-data-fm" data-animation-id="realtime-data__live-score-update">
      <div className="pf-realtime-data-fm__leaderboard">
        {items.map((entry, index) => (
          <div key={entry.id} className="pf-realtime-data-fm__row">
            <div className="pf-realtime-data-fm__rank">#{index + 1}</div>
            <div className="pf-realtime-data-fm__player">{entry.label}</div>
            <m.div
              className="pf-realtime-data-fm__score"
              animate={
                prefersReducedMotion
                  ? isPulsing
                    ? {
                        opacity: [1, 0.7, 1],
                        color: ['var(--pf-base-50)', highlightColor, 'var(--pf-base-50)'],
                      }
                    : { opacity: 1, color: 'var(--pf-base-50)' }
                  : isPulsing
                    ? {
                        scale: [1, 1.2, 1],
                        color: ['var(--pf-base-50)', highlightColor, 'var(--pf-base-50)'],
                      }
                    : { scale: 1, color: 'var(--pf-base-50)' }
              }
              transition={{
                duration: prefersReducedMotion ? 0.15 : durationS,
                ease: [0.25, 0.46, 0.45, 0.94] as const,
                delay: prefersReducedMotion ? 0 : index * 0.1,
              }}
            >
              {(displayedScores[index] ?? entry.score).toLocaleString()}
            </m.div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const RealtimeDataLiveScoreUpdate = memo(RealtimeDataLiveScoreUpdateComponent)
