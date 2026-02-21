import { useEffect, useRef, useState, type RefObject } from 'react'
import './RealtimeDataLiveScoreUpdate.css'

type TimeoutId = ReturnType<typeof setTimeout>
type IntervalId = ReturnType<typeof setInterval>

const BASE_SCORES = [1450, 1320] as const
const SCORE_INCREMENT = 120
const SCORE_STEPS = 20
const SCORE_STEP_INTERVAL_MS = 40

const SCORE_KEYFRAMES = [
  { transform: 'scale(1)', color: 'var(--pf-base-50)' },
  { transform: 'scale(1.2)', color: 'var(--pf-anim-green)' },
  { transform: 'scale(1)', color: 'var(--pf-base-50)' },
]

const easeOutCubic = (value: number) => 1 - Math.pow(1 - value, 3)

const animateScoreElement = (element: HTMLDivElement | null, delayMs = 0) => {
  if (!element) return
  element.animate(SCORE_KEYFRAMES, {
    duration: 800,
    delay: delayMs,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  })
}

const initialScores = () => [...BASE_SCORES] as number[]

type ScoreRowProps = {
  rank: string
  player: string
  scoreRef: RefObject<HTMLDivElement | null>
  score: number
}

const ScoreRow = ({ rank, player, scoreRef, score }: ScoreRowProps) => (
  <div className="pf-realtime-data__row">
    <div className="pf-realtime-data__rank">{rank}</div>
    <div className="pf-realtime-data__player">{player}</div>
    <div ref={scoreRef} className="pf-realtime-data__score">
      {score.toLocaleString()}
    </div>
  </div>
)

/**
 *
 */
export function RealtimeDataLiveScoreUpdate() {
  const [scores, setScores] = useState<number[]>(initialScores)
  const scoresRef = useRef(scores)
  const score1Ref = useRef<HTMLDivElement>(null)
  const score2Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scoresRef.current = scores
  }, [scores])

  useEffect(() => {
    const timeoutIds = new Set<TimeoutId>()
    const intervalIds = new Set<IntervalId>()
    let isMounted = true

    const scheduleTimeout = (callback: () => void, delayMs: number) => {
      const timeoutId = setTimeout(() => {
        timeoutIds.delete(timeoutId)
        callback()
      }, delayMs)
      timeoutIds.add(timeoutId)
      return timeoutId
    }

    const scheduleInterval = (callback: () => void, delayMs: number) => {
      const intervalId = setInterval(callback, delayMs)
      intervalIds.add(intervalId)
      return intervalId
    }

    const clearTrackedInterval = (intervalId: IntervalId) => {
      clearInterval(intervalId)
      intervalIds.delete(intervalId)
    }

    const startAnimation = () => {
      if (!isMounted) return

      animateScoreElement(score1Ref.current)
      animateScoreElement(score2Ref.current, 100)

      const currentScores = [...scoresRef.current]
      let step = 0
      const countInterval = scheduleInterval(() => {
        if (!isMounted) {
          clearTrackedInterval(countInterval)
          return
        }

        step += 1
        const progress = step / SCORE_STEPS
        const easedProgress = easeOutCubic(progress)
        setScores([
          Math.round(currentScores[0] + SCORE_INCREMENT * easedProgress),
          Math.round(currentScores[1] + SCORE_INCREMENT * easedProgress),
        ])

        if (step >= SCORE_STEPS) {
          clearTrackedInterval(countInterval)
        }
      }, SCORE_STEP_INTERVAL_MS)

      scheduleTimeout(() => {
        if (!isMounted) return
        setScores(initialScores())
        scheduleTimeout(startAnimation, 1000)
      }, 2000)
    }

    startAnimation()

    return () => {
      isMounted = false
      timeoutIds.forEach(clearTimeout)
      timeoutIds.clear()
      intervalIds.forEach(clearInterval)
      intervalIds.clear()
    }
  }, [])

  return (
    <div className="pf-realtime-data" data-animation-id="realtime-data__live-score-update">
      <div className="pf-realtime-data__leaderboard">
        <ScoreRow rank="#1" player="Phoenix" scoreRef={score1Ref} score={scores[0]} />
        <ScoreRow rank="#2" player="Shadow" scoreRef={score2Ref} score={scores[1]} />
      </div>
    </div>
  )
}
