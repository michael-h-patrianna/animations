import { useEffect, useRef, useState } from 'react'
import './TimerEffectsPillCountdownMedium.css'

// Periodic blip: LED corner blink every 10s; subtle perimeter arc progress.
export function TimerEffectsPillCountdownMedium() {
  const START_SECONDS = 60
  const [seconds, setSeconds] = useState(START_SECONDS)
  const pillRef = useRef<HTMLDivElement>(null)
  const animRef = useRef(false)
  const lastDisplayRef = useRef<number>(seconds)

  useEffect(() => {
  let raf = 0
  const node = pillRef.current
  if (!node) return

    const start = () => {
      if (animRef.current) return
      animRef.current = true
      const t0 = Date.now()
  setSeconds(START_SECONDS)
      lastDisplayRef.current = START_SECONDS
  // immediate emphasis on mount
  node.style.animation = 'pill-led-blip 320ms ease-out'
  setTimeout(() => { if (node) node.style.animation = 'none' }, 340)

      const loop = () => {
        const elapsed = (Date.now() - t0) / 1000
        const remaining = Math.max(0, START_SECONDS - elapsed)

        const display = Math.max(0, Math.ceil(remaining))
        if (display !== lastDisplayRef.current) {
          setSeconds(display)
          // From 60: brief emphasis every 6s; under 12s, tighten to every 3s
          if (display > 12) {
            if (display % 6 === 0 && display > 0) {
              node.style.animation = 'pill-led-blip 320ms ease-out'
              setTimeout(() => { if (node) node.style.animation = 'none' }, 360)
            }
          } else if (display > 0) {
            if (display % 3 === 0) {
              node.style.animation = 'pill-led-blip 280ms ease-out'
              setTimeout(() => { if (node) node.style.animation = 'none' }, 320)
            }
          }
          lastDisplayRef.current = display
        }

        if (remaining > 0) {
          raf = requestAnimationFrame(loop)
        } else {
          // stop at 00:00 and wait for manual replay
          animRef.current = false
        }
      }

      raf = requestAnimationFrame(loop)
    }

    start()
    return () => {
      animRef.current = false
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const format = (total: number) => {
    const m = Math.floor(total / 60)
    const s = total % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="pf-pill-timer" data-animation-id="timer-effects__pill-countdown-medium">
      <div ref={pillRef} className="pf-pill-timer__pill pf-pill-timer__pill--medium">
        <div className="pf-pill-timer__time">{format(seconds)}</div>
      </div>
      <span className="pf-pill-timer__label">Pill Countdown — Medium</span>
    </div>
  )
}
