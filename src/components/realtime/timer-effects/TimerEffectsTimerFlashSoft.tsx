import { useEffect, useRef, useState } from 'react'
import './TimerEffectsTimerFlashSoft.css'

export function TimerEffectsTimerFlashSoft() {
  const [seconds, setSeconds] = useState(32)
  const isAnimatingRef = useRef(false)
  const timerRef = useRef<HTMLDivElement>(null)
  const lastDisplayedRef = useRef<number>(seconds)

  useEffect(() => {
    let animationId: number
    let timeoutId: ReturnType<typeof setTimeout>
    let reminderTimeoutId: ReturnType<typeof setTimeout> | undefined
    const cleanupNode = timerRef.current

    const startAnimation = () => {
      if (isAnimatingRef.current) return

      isAnimatingRef.current = true
      setSeconds(32)

      const node = timerRef.current
      if (!node) return

      const duration = 32000 // 32 seconds total
      const startTime = Date.now()
      let lastReminderTime = 0
      const reminderInterval = 10000 // Shake reminder every 10 seconds

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)

        // Calculate remaining seconds with higher precision
        const remainingSeconds = Math.max(0, 32 - elapsed / 1000)
        const displaySeconds = Math.max(0, Math.ceil(remainingSeconds))

        // Only update state when display value actually changes
        if (displaySeconds !== lastDisplayedRef.current) {
          setSeconds(displaySeconds)
          lastDisplayedRef.current = displaySeconds
        }

        // Same color transition as original Flash Expire
        const urgencyLevel = remainingSeconds <= 30 ? (30 - remainingSeconds) / 30 : 0

        // Use easing function for smoother color transition
        const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t)
        const easedUrgency = easeInOut(urgencyLevel)

        // Same colors as original: yellow to red
        const yellow = { r: 255, g: 193, b: 7 } // #ffc107
        const red = { r: 220, g: 53, b: 69 } // #dc3545

        const r = Math.round(yellow.r + (red.r - yellow.r) * easedUrgency)
        const g = Math.round(yellow.g + (red.g - yellow.g) * easedUrgency)
        const b = Math.round(yellow.b + (red.b - yellow.b) * easedUrgency)

        node.style.backgroundColor = `rgb(${r}, ${g}, ${b})`

        // Shake animation every 10 seconds
        if (elapsed - lastReminderTime >= reminderInterval) {
          lastReminderTime = elapsed

          // Trigger a gentle shake animation
          node.style.animation = 'flash-soft-shake 600ms ease-out'

          // Reset animation after it completes
          setTimeout(() => {
            if (node) {
              node.style.animation = 'none'
            }
          }, 600)
        }

        if (progress < 1) {
          animationId = requestAnimationFrame(animate)
        } else {
          isAnimatingRef.current = false
          node.style.animation = 'none'
          // Auto-restart after a brief pause
          timeoutId = setTimeout(startAnimation, 2000)
        }
      }

      animationId = requestAnimationFrame(animate)
    }

    // Start animation immediately
    startAnimation()

    return () => {
      const node = cleanupNode
      if (animationId) cancelAnimationFrame(animationId)
      if (timeoutId) clearTimeout(timeoutId)
      if (reminderTimeoutId) clearTimeout(reminderTimeoutId)
      if (node) {
        node.style.animation = 'none'
        node.style.backgroundColor = ''
      }
      // Reset flag so a StrictMode re-mount doesn't keep us stuck as "animating"
      isAnimatingRef.current = false
    }
  }, [])

  // Format time as MM:SS
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="pf-timer-flash" data-animation-id="timer-effects__timer-flash-soft">
      <div ref={timerRef} className="pf-timer-flash__pill pf-timer-flash__pill--soft">
        <div className="pf-timer-flash__time">{formatTime(seconds)}</div>
      </div>
      <span className="pf-timer-flash__label">Flash Expire Soft</span>
    </div>
  )
}
