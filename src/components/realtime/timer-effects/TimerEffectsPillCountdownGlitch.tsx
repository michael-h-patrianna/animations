import { useEffect, useState } from 'react'
import './TimerEffectsPillCountdownGlitch.css'

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
      <div className={`pill-countdown-glitch ${getGlitchClass()}`} data-text={formatTime(seconds)}>
        {formatTime(seconds)}
      </div>
    </div>
  )
}