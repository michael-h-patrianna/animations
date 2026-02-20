import { useEffect, useState } from 'react'
import './shared.css'
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
    if (seconds <= 10) return 'tfx-glitchsevere'
    if (seconds <= 20) return 'tfx-glitchmoderate'
    if (seconds <= 30) return 'tfx-glitchmild'
    if (seconds <= 40) return 'tfx-glitchsubtle'
    if (seconds <= 50) return 'tfx-glitchminimal'
    return ''
  }

  return (
    <div className="pill-countdown-tfx-glitchcontainer">
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

