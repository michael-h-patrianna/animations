import { useEffect, useRef, useState } from 'react'
import type { AnimationMetadata } from '@/types/animation'
import './RealtimeDataLiveScoreUpdate.css'

export const metadata: AnimationMetadata = {
  id: 'realtime-data__live-score-update',
  title: 'Live Score Update',
  description: 'Real-time data pattern: Live Score Update',
  tags: ['css']
}

export function RealtimeDataLiveScoreUpdate() {
  const [scores, setScores] = useState([1450, 1320])
  const scoresRef = useRef(scores)
  const score1Ref = useRef<HTMLDivElement>(null)
  const score2Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scoresRef.current = scores
  }, [scores])

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>
    let countInterval: ReturnType<typeof setInterval>

    const startAnimation = () => {
      // Animate both scores
      if (score1Ref.current) {
        score1Ref.current.animate(
          [
            { transform: 'scale(1)', color: '#ecc3ff' },
            { transform: 'scale(1.2)', color: '#c6ff77' },
            { transform: 'scale(1)', color: '#ecc3ff' },
          ],
          {
            duration: 800,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }
        )
      }

      if (score2Ref.current) {
        score2Ref.current.animate(
          [
            { transform: 'scale(1)', color: '#ecc3ff' },
            { transform: 'scale(1.2)', color: '#c6ff77' },
            { transform: 'scale(1)', color: '#ecc3ff' },
          ],
          {
            duration: 800,
            delay: 100,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }
        )
      }

      // Count up the numbers
      const currentScores = [...scoresRef.current]
      const increment = 120
      let step = 0
      const steps = 20

      countInterval = setInterval(() => {
        step++
        const progress = step / steps
        const easeProgress = 1 - Math.pow(1 - progress, 3) // ease-out cubic

        setScores([
          Math.round(currentScores[0] + increment * easeProgress),
          Math.round(currentScores[1] + increment * easeProgress),
        ])

        if (step >= steps) {
          clearInterval(countInterval)
        }
      }, 40)

      // Reset after delay
      timeoutId = setTimeout(() => {
        setScores([1450, 1320])
        setTimeout(startAnimation, 1000)
      }, 2000)
    }

    startAnimation()

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      if (countInterval) clearInterval(countInterval)
    }
  }, [])

  return (
    <div className="pf-realtime-data" data-animation-id="realtime-data__live-score-update">
      <div className="pf-realtime-data__leaderboard">
        <div className="pf-realtime-data__row">
          <div className="pf-realtime-data__rank">#1</div>
          <div className="pf-realtime-data__player">Phoenix</div>
          <div ref={score1Ref} className="pf-realtime-data__score">
            {scores[0].toLocaleString()}
          </div>
        </div>
        <div className="pf-realtime-data__row">
          <div className="pf-realtime-data__rank">#2</div>
          <div className="pf-realtime-data__player">Shadow</div>
          <div ref={score2Ref} className="pf-realtime-data__score">
            {scores[1].toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  )
}
