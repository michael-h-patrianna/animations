import { useEffect, useRef, useState } from 'react'
import './TimerEffectsPillCountdownSoft.css'

// Quiet thresholds: mostly static. Brief pulse only at 60s, 30s, 10s and last 5s.
export function TimerEffectsPillCountdownSoft() {
  const START_SECONDS = 60
  const [seconds, setSeconds] = useState(START_SECONDS)
  const pillRef = useRef<HTMLDivElement>(null)
  const animatingRef = useRef(false)
  const lastDisplayRef = useRef<number>(seconds)

  useEffect(() => {
  let rafId = 0
  const node = pillRef.current
  if (!node) return

  const shouldPulse = (_remaining: number, display: number) => {
      // Pulse every 10 seconds from 60..10, and each of the last 5 seconds
      if (display > 0 && display <= 60 && display >= 10 && display % 10 === 0) return true
      if (display <= 5 && display > 0) return true
      return false
    }

    const start = () => {
      if (animatingRef.current) return
      animatingRef.current = true
      const startTime = Date.now()
  setSeconds(START_SECONDS)
      lastDisplayRef.current = START_SECONDS
  // kick off with an immediate pulse at start
  node.style.animation = 'pill-soft-pulse 240ms ease-out'
  setTimeout(() => { if (node) node.style.animation = 'none' }, 260)

      const animate = () => {
        const elapsed = (Date.now() - startTime) / 1000
        const remaining = Math.max(0, START_SECONDS - elapsed)

        // Update text only on second changes
        const display = Math.max(0, Math.ceil(remaining))
        if (display !== lastDisplayRef.current) {
          setSeconds(display)
          // Threshold pulses
          if (shouldPulse(remaining, display)) {
            node.style.animation = 'pill-soft-pulse 240ms ease-out'
            // restart animation property to allow retrigger
            setTimeout(() => {
              if (node) node.style.animation = 'none'
            }, 260)
          }
          lastDisplayRef.current = display
        }

        if (remaining > 0) {
          rafId = requestAnimationFrame(animate)
        } else {
          // stop at 00:00 and wait for manual replay
          animatingRef.current = false
        }
      }

      rafId = requestAnimationFrame(animate)
    }

    start()

    return () => {
      animatingRef.current = false
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  const format = (total: number) => {
    const m = Math.floor(total / 60)
    const s = total % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="pf-pill-timer" data-animation-id="timer-effects__pill-countdown-soft">
      <div ref={pillRef} className="pf-pill-timer__pill pf-pill-timer__pill--soft">
        <div className="pf-pill-timer__time">{format(seconds)}</div>
      </div>
      <span className="pf-pill-timer__label">Pill Countdown — Soft</span>
    </div>
  )
}
