import type { AnimationMetadata } from '@/types/animation'
import { easeInOut, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import './TimerEffectsPillCountdownHeartbeat.css'

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: AnimationMetadata = {
  id: 'timer-effects__pill-countdown-heartbeat',
  title: 'Pill Countdown — Heartbeat',
  description: 'Countdown with heartbeat animation that intensifies as time runs out.',
  tags: ['framer'],
}

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

  const getGlowAnimation = () => {
    if (seconds === 0) {
      return {
        scale: [1, 1.3, 1],
        opacity: [0.45, 0.8, 0.45],
        transition: { duration: 0.6, repeat: Infinity, ease: easeInOut },
      }
    }
    if (seconds <= 10) {
      return {
        scale: [1, 1.25, 1],
        opacity: [0.4, 0.75, 0.4],
        transition: { duration: 0.5, repeat: Infinity, ease: easeInOut },
      }
    }
    if (seconds <= 20) {
      return {
        scale: [1, 1.2, 1],
        opacity: [0.35, 0.65, 0.35],
        transition: { duration: 0.7, repeat: Infinity, ease: easeInOut },
      }
    }
    if (seconds <= 30) {
      return {
        scale: [1, 1.15, 1],
        opacity: [0.3, 0.55, 0.3],
        transition: { duration: 0.9, repeat: Infinity, ease: easeInOut },
      }
    }
    if (seconds <= 40) {
      return {
        scale: [1, 1.1, 1],
        opacity: [0.25, 0.45, 0.25],
        transition: { duration: 1.2, repeat: Infinity, ease: easeInOut },
      }
    }
    if (seconds <= 50) {
      return {
        scale: [1, 1.08, 1],
        opacity: [0.2, 0.4, 0.2],
        transition: { duration: 1.5, repeat: Infinity, ease: easeInOut },
      }
    }
    return {
      scale: [1, 1.05, 1],
      opacity: [0.15, 0.35, 0.15],
      transition: { duration: 2, repeat: Infinity, ease: easeInOut },
    }
  }
  return (
    <div className="pill-countdown-heartbeat-container">
      <motion.div className={`pill-countdown-heartbeat ${getHeartbeatClass()}`}>
        <motion.span
          className="pill-countdown-heartbeat__glow"
          aria-hidden="true"
          animate={getGlowAnimation()}
        />
        <span className="pill-countdown-heartbeat__text">{formatTime(seconds)}</span>
      </motion.div>
    </div>
  )
}
