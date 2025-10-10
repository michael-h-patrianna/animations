import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { AnimationMetadata } from '@/types/animation'
import './TimerEffectsTimerFlashSoft.css'

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: AnimationMetadata = {
  id: 'timer-effects__timer-flash-soft',
  title: 'Flash Expire Soft',
  description: 'Softer version with shake reminder every 10 seconds.',
  tags: ['framer'],
}

export function TimerEffectsTimerFlashSoft() {
  const [seconds, setSeconds] = useState(32)
  const [bgColor, setBgColor] = useState('#ffc107')
  const [shakeKey, setShakeKey] = useState(0)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const duration = 32000
    const startTime = Date.now()
    let lastDisplayed = 32
    let lastReminderTime = 0
    const reminderInterval = 10000

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

      // Shake animation every 10 seconds
      if (!shouldReduceMotion && elapsed - lastReminderTime >= reminderInterval) {
        lastReminderTime = elapsed
        setShakeKey((prev) => prev + 1)
      }

      if (progress >= 1) {
        clearInterval(intervalId)
        // Auto-restart after a brief pause
        setTimeout(() => {
          setSeconds(32)
          setBgColor('#ffc107')
        }, 2000)
      }
    }, 100)

    return () => clearInterval(intervalId)
  }, [shouldReduceMotion])

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const shakeVariants = {
    idle: { x: 0, rotate: 0 },
    shake: {
      x: [0, -4, 4, -3, 3, -2, 2, 0],
      rotate: [0, -1, 1, -0.5, 0.5, 0],
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  const glowVariants = {
    idle: { scale: 0.95, opacity: 0 },
    shake: {
      scale: [0.95, 1.2, 0.95],
      opacity: [0, 0.6, 0],
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  if (shouldReduceMotion) {
    return (
      <div className="pf-timer-flash" data-animation-id="timer-effects__timer-flash-soft">
        <div className="pf-timer-flash__pill pf-timer-flash__pill--soft" style={{ backgroundColor: bgColor }}>
          <span className="pf-timer-flash__glow" aria-hidden="true" />
          <div className="pf-timer-flash__time">{formatTime(seconds)}</div>
        </div>
        <span className="pf-timer-flash__label">Flash Expire Soft</span>
      </div>
    )
  }

  return (
    <div className="pf-timer-flash" data-animation-id="timer-effects__timer-flash-soft">
      <motion.div
        key={shakeKey}
        className="pf-timer-flash__pill pf-timer-flash__pill--soft"
        style={{ backgroundColor: bgColor }}
        variants={shakeVariants}
        initial="idle"
        animate="shake"
      >
        <motion.span
          className="pf-timer-flash__glow"
          aria-hidden="true"
          variants={glowVariants}
          initial="idle"
          animate="shake"
        />
        <div className="pf-timer-flash__time">{formatTime(seconds)}</div>
      </motion.div>
      <span className="pf-timer-flash__label">Flash Expire Soft</span>
    </div>
  )
}
