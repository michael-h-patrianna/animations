import type { AnimationMetadata } from '@/types/animation'
import { easeInOut, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import './TimerEffectsTimerFlash.css'

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: AnimationMetadata = {
  id: 'timer-effects__timer-flash',
  title: 'Flash Expire',
  description: 'Timer with color transition from yellow to red and increasing pulse urgency.',
  tags: ['framer'],
}

export function TimerEffectsTimerFlash() {
  const [seconds, setSeconds] = useState(32)
  const [bgColor, setBgColor] = useState('#ffc107')
  const [pulseSpeed, setPulseSpeed] = useState(1000)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const duration = 32000
    const startTime = Date.now()
    let lastDisplayed = 32

    const intervalId = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const remainingSeconds = Math.max(0, 32 - elapsed / 1000)
      const displaySeconds = Math.max(0, Math.ceil(remainingSeconds))

      if (displaySeconds !== lastDisplayed) {
        setSeconds(displaySeconds)
        lastDisplayed = displaySeconds
      }

      // Color transition from yellow (#ffc107) to red (#dc3545)
      const urgencyLevel = remainingSeconds <= 30 ? (30 - remainingSeconds) / 30 : 0
      const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t)
      const easedUrgency = easeInOut(urgencyLevel)

      const yellow = { r: 255, g: 193, b: 7 }
      const red = { r: 220, g: 53, b: 69 }

      const r = Math.round(yellow.r + (red.r - yellow.r) * easedUrgency)
      const g = Math.round(yellow.g + (red.g - yellow.g) * easedUrgency)
      const b = Math.round(yellow.b + (red.b - yellow.b) * easedUrgency)

      setBgColor(`rgb(${r}, ${g}, ${b})`)

      if (remainingSeconds <= 30) {
        const speed = Math.max(300, 1000 - urgencyLevel * 700)
        setPulseSpeed(speed)
      }

      if (progress >= 1) {
        clearInterval(intervalId)
        // Auto-restart after a brief pause
        setTimeout(() => {
          setSeconds(32)
          setBgColor('#ffc107')
          setPulseSpeed(1000)
        }, 2000)
      }
    }, 100)

    return () => clearInterval(intervalId)
  }, [])

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (shouldReduceMotion) {
    return (
      <div className="pf-timer-flash" data-animation-id="timer-effects__timer-flash">
        <div className="pf-timer-flash__pill" style={{ backgroundColor: bgColor }}>
          <span className="pf-timer-flash__glow" aria-hidden="true" />
          <div className="pf-timer-flash__time">{formatTime(seconds)}</div>
        </div>
        <span className="pf-timer-flash__label">Flash Expire</span>
      </div>
    )
  }

  const getGlowAnimation = () => {
    if (seconds > 30) {
      return { scale: 0.95, opacity: 0 }
    }
    const intensity = (30 - seconds) / 30
    return {
      scale: [0.95, 0.95 + intensity * 0.5, 0.95],
      opacity: [0, 0.4 + intensity * 0.4, 0],
    }
  }

  return (
    <div className="pf-timer-flash" data-animation-id="timer-effects__timer-flash">
      <motion.div
        className="pf-timer-flash__pill"
        style={{ backgroundColor: bgColor }}
        animate={
          seconds <= 30
            ? {
                scale: [1, 1 + (30 - seconds) / 200, 1],
              }
            : {}
        }
        transition={{
          duration: pulseSpeed / 1000,
          repeat: Infinity,
          ease: easeInOut,
        }}
      >
        <motion.span
          className="pf-timer-flash__glow"
          aria-hidden="true"
          animate={getGlowAnimation()}
          transition={{
            duration: pulseSpeed / 1000,
            repeat: Infinity,
            ease: easeInOut,
          }}
        />
        <div className="pf-timer-flash__time">{formatTime(seconds)}</div>
      </motion.div>
      <span className="pf-timer-flash__label">Flash Expire</span>
    </div>
  )
}
