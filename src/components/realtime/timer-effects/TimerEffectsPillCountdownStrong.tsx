import { useEffect, useRef, useState } from 'react'
import './TimerEffectsPillCountdownStrong.css'

// Strong: segmented bar + brief snap ticks under 15s. No continuous looping.
export function TimerEffectsPillCountdownStrong() {
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
  // immediate single snap to convey urgency
  node.style.animation = 'pill-snap 160ms ease-out'
  setTimeout(() => node && (node.style.animation = 'none'), 180)

      const loop = () => {
        const elapsed = (Date.now() - t0) / 1000
        const remaining = Math.max(0, START_SECONDS - elapsed)

        const display = Math.max(0, Math.ceil(remaining))
        if (display !== lastDisplayRef.current) {
          setSeconds(display)
          // early single-snap cues to differentiate from Extreme buzz cadence
          // stronger mechanical beats at these thresholds
          if ([55, 50, 45, 40, 35, 30, 25, 20].includes(display)) {
            node.style.animation = 'pill-snap 160ms ease-out'
            setTimeout(() => node && (node.style.animation = 'none'), 180)
          }

          // color steps at 30s (caution) and 10s (danger)
          if (display === 30) {
            node.classList.add('is-caution')
            node.classList.remove('is-danger')
          }

          if (display <= 10 && display > 0) {
            node.classList.add('is-danger')
            // targeted double-tap on odd countdowns to avoid every-second buzz
            if ([9, 7, 5, 3, 1].includes(display)) {
              node.style.animation = 'pill-snap 120ms ease-out'
              setTimeout(() => { if (node) node.style.animation = 'none' }, 130)
              setTimeout(() => {
                if (node) {
                  node.style.animation = 'pill-snap 120ms ease-out'
                  setTimeout(() => { if (node) node.style.animation = 'none' }, 130)
                }
              }, 160)
            }
          } else if (display <= 15) {
            // single snap at a couple of beats for moderate urgency
            if ([15, 12].includes(display)) {
              node.style.animation = 'pill-snap 160ms ease-out'
              setTimeout(() => node && (node.style.animation = 'none'), 180)
            }
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
    <div className="pf-pill-timer" data-animation-id="timer-effects__pill-countdown-strong">
      <div ref={pillRef} className="pf-pill-timer__pill pf-pill-timer__pill--strong">
        <div className="pf-pill-timer__time">{format(seconds)}</div>
      </div>
      <span className="pf-pill-timer__label">Pill Countdown — Strong</span>
    </div>
  )
}
