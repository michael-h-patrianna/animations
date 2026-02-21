import { useAnimation } from 'motion/react'
import * as m from 'motion/react-m'
import { useEffect, useRef, useState, type Dispatch, type MutableRefObject, type SetStateAction } from 'react'

type TimeoutId = ReturnType<typeof setTimeout>
type IntervalId = ReturnType<typeof setInterval>

const BASE_SCORES = [1450, 1320] as const
const SCORE_INCREMENT = 120
const SCORE_STEPS = 20
const SCORE_STEP_INTERVAL_MS = 40

const scoreAnimation = {
  scale: [1, 1.2, 1],
  color: ['var(--pf-base-50)', 'var(--pf-anim-green)', 'var(--pf-base-50)'],
}

const initialScores = () => [...BASE_SCORES] as number[]
const easeOutCubic = (value: number) => 1 - Math.pow(1 - value, 3)

const useLiveScoreCycle = (
  controls1: ReturnType<typeof useAnimation>,
  controls2: ReturnType<typeof useAnimation>,
  scoresRef: MutableRefObject<number[]>,
  setScores: Dispatch<SetStateAction<number[]>>
) => {
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

    const startAnimation = async () => {
      if (!isMounted) return

      const promises = [controls1.start(scoreAnimation), controls2.start(scoreAnimation)]
      const currentScores = [...scoresRef.current]
      let step = 0
      const countInterval = scheduleInterval(() => {
        if (!isMounted) return clearTrackedInterval(countInterval)
        step += 1
        const easedProgress = easeOutCubic(step / SCORE_STEPS)
        setScores([
          Math.round(currentScores[0] + SCORE_INCREMENT * easedProgress),
          Math.round(currentScores[1] + SCORE_INCREMENT * easedProgress),
        ])
        if (step >= SCORE_STEPS) clearTrackedInterval(countInterval)
      }, SCORE_STEP_INTERVAL_MS)

      await Promise.all(promises)
      if (!isMounted) return

      scheduleTimeout(() => {
        if (!isMounted) return
        setScores(initialScores())
        scheduleTimeout(() => {
          if (isMounted) void startAnimation()
        }, 1000)
      }, 2000)
    }

    scheduleTimeout(() => {
      if (isMounted) void startAnimation()
    }, 100)

    return () => {
      isMounted = false
      timeoutIds.forEach(clearTimeout)
      timeoutIds.clear()
      intervalIds.forEach(clearInterval)
      intervalIds.clear()
    }
  }, [controls1, controls2, scoresRef, setScores])
}

type ScoreRowProps = {
  rank: string
  player: string
  score: number
  controls: ReturnType<typeof useAnimation>
  delay?: number
}

const ScoreRow = ({ rank, player, score, controls, delay = 0 }: ScoreRowProps) => (
  <div className="pf-realtime-data__row">
    <div className="pf-realtime-data__rank">{rank}</div>
    <div className="pf-realtime-data__player">{player}</div>
    <m.div
      className="pf-realtime-data__score"
      animate={controls}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const, delay }}
    >
      {score.toLocaleString()}
    </m.div>
  </div>
)

/**
 *
 */
export function RealtimeDataLiveScoreUpdate() {
  const [scores, setScores] = useState<number[]>(initialScores)
  const controls1 = useAnimation()
  const controls2 = useAnimation()
  const scoresRef = useRef(scores)

  useEffect(() => {
    scoresRef.current = scores
  }, [scores])

  useLiveScoreCycle(controls1, controls2, scoresRef, setScores)

  return (
    <div className="pf-realtime-data" data-animation-id="realtime-data__live-score-update">
      <div className="pf-realtime-data__leaderboard">
        <ScoreRow rank="#1" player="Phoenix" score={scores[0]} controls={controls1} />
        <ScoreRow rank="#2" player="Shadow" score={scores[1]} controls={controls2} delay={0.1} />
      </div>
    </div>
  )
}
