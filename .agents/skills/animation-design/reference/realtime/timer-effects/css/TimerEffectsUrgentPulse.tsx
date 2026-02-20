import { memo } from 'react'
import './TimerEffectsUrgentPulse.css'

export const TimerEffectsUrgentPulse = memo(function TimerEffectsUrgentPulse() {
  return (
    <div className="timer-urgent-pulse-demo" data-animation-id="timer-effects__urgent-pulse">
      <div className="timer-urgent-pulse">
        <span className="timer-urgent-pulse__value">0:05</span>
      </div>
      <span className="timer-urgent-pulse__label">Urgent Pulse</span>
    </div>
  )
})
