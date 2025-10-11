import type { AnimationMetadata } from '@/types/animation'
import { useEffect, useState } from 'react'
import './shared.css'
import './TimerEffectsPillCountdownGlitch.css'

export const metadata: AnimationMetadata = {
  id: 'timer-effects__pill-countdown-glitch',
  title: 'Pill Countdown — Glitch',
  description: 'Countdown with glitch effects that intensify as time runs out.',
  tags: ['css'],
}

export function TimerEffectsPillCountdownGlitch() {
  const [seconds, setSeconds] = useState(60)
  const [isRunning, setIsRunning] = useState(true)

  useEffect(() => {
    if (!isRunning || seconds <= 0) return

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          setIsRunning(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, seconds])

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getGlitchClass = () => {
    if (seconds === 0) return 'timer-expired'
    if (seconds <= 10) return 'glitch-severe'
    if (seconds <= 20) return 'glitch-moderate'
    if (seconds <= 30) return 'glitch-mild'
    if (seconds <= 40) return 'glitch-subtle'
    if (seconds <= 50) return 'glitch-minimal'
    return ''
  }

  return (
    <div className="pill-countdown-glitch-container">
      <div className={`pill-countdown-glitch ${getGlitchClass()}`}>
        <span className="pill-countdown-glitch__glow" aria-hidden="true" />
        <span className="pill-countdown-glitch__text">{formatTime(seconds)}</span>
        <span aria-hidden="true" className="pill-countdown-glitch__copy pill-countdown-glitch__copy--before">
          {formatTime(seconds)}
        </span>
        <span aria-hidden="true" className="pill-countdown-glitch__copy pill-countdown-glitch__copy--after">
          {formatTime(seconds)}
        </span>
      </div>
    </div>
  )
}
