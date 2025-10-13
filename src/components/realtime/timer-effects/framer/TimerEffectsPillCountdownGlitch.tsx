import { easeInOut, motion } from 'framer-motion'
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

  const getGlowAnimation = () => {
    if (seconds === 0) {
      return {
        scale: [1, 1.3, 1],
        opacity: [0.45, 0.8, 0.45],
        transition: { duration: 0.4, repeat: Infinity, ease: easeInOut },
      }
    }
    if (seconds <= 10) {
      return {
        scale: [1, 1.25, 1],
        opacity: [0.35, 0.7, 0.35],
        transition: { duration: 0.5, repeat: Infinity, ease: easeInOut },
      }
    }
    if (seconds <= 20) {
      return {
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.6, 0.3],
        transition: { duration: 0.8, repeat: Infinity, ease: easeInOut },
      }
    }
    if (seconds <= 30) {
      return {
        scale: [1, 1.15, 1],
        opacity: [0.25, 0.5, 0.25],
        transition: { duration: 1.1, repeat: Infinity, ease: easeInOut },
      }
    }
    if (seconds <= 40) {
      return {
        scale: [1, 1.1, 1],
        opacity: [0.2, 0.45, 0.2],
        transition: { duration: 1.4, repeat: Infinity, ease: easeInOut },
      }
    }
    if (seconds <= 50) {
      return {
        scale: [1, 1.08, 1],
        opacity: [0.15, 0.4, 0.15],
        transition: { duration: 1.7, repeat: Infinity, ease: easeInOut },
      }
    }
    return {
      scale: [1, 1.05, 1],
      opacity: [0.1, 0.35, 0.1],
      transition: { duration: 2, repeat: Infinity, ease: easeInOut },
    }
  }
  return (
    <div className="pill-countdown-glitch-container">
      <motion.div className={`pill-countdown-glitch ${getGlitchClass()}`}>
        <motion.span
          className="pill-countdown-glitch__glow"
          aria-hidden="true"
          animate={getGlowAnimation()}
        />
        <span className="pill-countdown-glitch__text">{formatTime(seconds)}</span>
        <span aria-hidden="true" className="pill-countdown-glitch__copy pill-countdown-glitch__copy--before">
          {formatTime(seconds)}
        </span>
        <span aria-hidden="true" className="pill-countdown-glitch__copy pill-countdown-glitch__copy--after">
          {formatTime(seconds)}
        </span>
      </motion.div>
    </div>
  )
}
