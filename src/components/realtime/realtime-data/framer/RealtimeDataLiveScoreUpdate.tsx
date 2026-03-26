/**
 * Animated score display that counts up with a scale+color pulse on each update.
 * Demonstrates animating numeric value changes in a list.
 *
 * Copy-paste files: this file + ../SharedTypes.ts + ../shared.css +
 * RealtimeDataLiveScoreUpdate.css
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, useEffect, useMemo, useRef, useState } from 'react'

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
  const prefersReducedMotion = useReducedMotion()
  const initialScores = useMemo(() => items.map((e) => e.score), [items])
  const [scores, setScores] = useState<number[]>(() => [...initialScores])
  const [isPulsing, setIsPulsing] = useState(false)
  const scoresRef = useRef(scores)

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
      setIsPulsing(true)

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
        setIsPulsing(false)

        schedule(() => {
          if (!mounted) return
          setScores([...initialScores])
          schedule(cycle, 1000)
        }, pauseDuration)
      }, duration)
    }

    cycle()

    return () => {
      mounted = false
      timeouts.forEach(clearTimeout)
      timeouts.clear()
      intervals.forEach(clearInterval)
      intervals.clear()
    }
  }, [duration, increment, initialScores, pauseDuration])

  const durationS = duration / 1000

  return (
    <div className="pf-realtime-data" data-animation-id="realtime-data__live-score-update">
      <div className="pf-realtime-data__leaderboard">
        {items.map((entry, index) => (
          <div key={entry.id} className="pf-realtime-data__row">
            <div className="pf-realtime-data__rank">#{index + 1}</div>
            <div className="pf-realtime-data__player">{entry.label}</div>
            <m.div
              className="pf-realtime-data__score"
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
              style={{ animation: 'none' }}
            >
              {(scores[index] ?? entry.score).toLocaleString()}
            </m.div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const RealtimeDataLiveScoreUpdate = memo(RealtimeDataLiveScoreUpdateComponent)
