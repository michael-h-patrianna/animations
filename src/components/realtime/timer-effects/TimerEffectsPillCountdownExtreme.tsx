import { useEffect, useRef, useState } from 'react'
import './TimerEffectsPillCountdownExtreme.css'

// Extreme: quiet until last 10s. Stepwise color; 3-2-1 buzz; flash on zero.
export function TimerEffectsPillCountdownExtreme() {
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

      // subtle immediate cue at start
      node.classList.remove('is-warning', 'is-danger', 'is-flash')
      node.style.animation = 'pill-buzz 180ms ease-out'
      setTimeout(() => { if (node) node.style.animation = 'none' }, 200)

      const loop = () => {
        const elapsed = (Date.now() - t0) / 1000
        const remaining = Math.max(0, START_SECONDS - elapsed)
        const display = Math.max(0, Math.ceil(remaining))

        if (display !== lastDisplayRef.current) {
          setSeconds(display)

          // Color bands: >30 calm, 30..11 warning, <=10 danger
          if (display > 30) {
            node.classList.remove('is-warning', 'is-danger')
          } else if (display > 10) {
            node.classList.add('is-warning')
            node.classList.remove('is-danger')
          } else if (display > 0) {
            node.classList.add('is-danger')
          }

          // Escalating cues from 60s
          if (display === 60 || display === 50 || display === 40) {
            node.style.animation = 'pill-buzz 180ms ease-out'
            setTimeout(() => { if (node) node.style.animation = 'none' }, 200)
          }
          // Every 5s from 30..15
          if (display <= 30 && display >= 15 && display % 5 === 0) {
            node.style.animation = 'pill-buzz 200ms ease-out'
            setTimeout(() => { if (node) node.style.animation = 'none' }, 220)
          }
          // Every second under 10
          if (display <= 10 && display > 0) {
            node.style.animation = 'pill-buzz 220ms ease-out'
            setTimeout(() => { if (node) node.style.animation = 'none' }, 240)
          }

          // Flash on zero
          if (display === 0) {
            node.classList.add('is-flash')
            setTimeout(() => { if (node) node.classList.remove('is-flash') }, 220)
          }

          lastDisplayRef.current = display
        }

        if (remaining > 0) raf = requestAnimationFrame(loop)
        else {
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
    <div className="pf-pill-timer" data-animation-id="timer-effects__pill-countdown-extreme">
      <div ref={pillRef} className="pf-pill-timer__pill pf-pill-timer__pill--extreme">
        <div className="pf-pill-timer__time">{format(seconds)}</div>
      </div>
      <span className="pf-pill-timer__label">Pill Countdown — Extreme</span>
    </div>
  )
}
