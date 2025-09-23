import { useEffect, useState } from 'react'
import './TimerEffectsPillCountdownHeartbeat.css'

export function TimerEffectsPillCountdownHeartbeat() {
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

  const getHeartbeatClass = () => {
    if (seconds === 0) return 'timer-expired'
    if (seconds <= 10) return 'heartbeat-critical'
    if (seconds <= 20) return 'heartbeat-rapid'
    if (seconds <= 30) return 'heartbeat-elevated'
    if (seconds <= 40) return 'heartbeat-mild'
    if (seconds <= 50) return 'heartbeat-calm'
    return 'heartbeat-normal'
  }

  return (
    <div className="pill-countdown-heartbeat-container">
      <div className={`pill-countdown-heartbeat ${getHeartbeatClass()}`}>
        {formatTime(seconds)}
      </div>
    </div>
  )
}
