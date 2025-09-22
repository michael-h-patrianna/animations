import { useEffect, useRef, useState } from 'react'
import './TimerEffectsTimerColorShift.css'

export function TimerEffectsTimerColorShift() {
  const [value, setValue] = useState(10)
  const isAnimatingRef = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const underlineRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    let animationId: number
    let timeoutId: ReturnType<typeof setTimeout>

    const startAnimation = () => {
      if (isAnimatingRef.current) return

      isAnimatingRef.current = true
      setValue(10)

      const container = containerRef.current
      const underline = underlineRef.current
      const path = pathRef.current

      if (!container || !underline || !path) return

      // Reset styles
      container.style.setProperty('--timer-color', '#c6ff77')
      underline.style.transform = 'scaleX(1)'
      path.style.strokeDashoffset = '97'

      const duration = 3000 // 3 seconds
      const startTime = Date.now()

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)

        // Update countdown value
        const currentValue = Math.max(0, Math.ceil(10 * (1 - progress)))
        setValue(currentValue)

        // Update underline scale
        underline.style.transform = `scaleX(${1 - progress})`

        // Update arc progress
        const arcOffset = 97 * (1 - progress)
        path.style.strokeDashoffset = `${97 - arcOffset}`

        // Update color shift: #c6ff77 → #ffb300 → #fa114f
        let color: string
        if (progress < 0.5) {
          // First half: #c6ff77 to #ffb300
          const t = progress * 2
          color = `hsl(${79 - t * 36}, ${100 - t * 14}%, ${66 - t * 16}%)`
        } else {
          // Second half: #ffb300 to #fa114f
          const t = (progress - 0.5) * 2
          color = `hsl(${43 - t * 35}, ${86 + t * 14}%, ${50 - t * 15}%)`
        }
        container.style.setProperty('--timer-color', color)

        if (progress < 1) {
          animationId = requestAnimationFrame(animate)
        } else {
          isAnimatingRef.current = false
          // Auto-restart after a brief pause
          timeoutId = setTimeout(startAnimation, 1000)
        }
      }

      animationId = requestAnimationFrame(animate)
    }

    // Start animation immediately
    startAnimation()

    return () => {
      if (animationId) cancelAnimationFrame(animationId)
      if (timeoutId) clearTimeout(timeoutId)
      // Reset flag for StrictMode double-invocation
      isAnimatingRef.current = false
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="pf-timer"
      data-animation-id="timer-effects__timer-color-shift"
    >
      <div className="pf-timer__value-wrap">
        <div className="pf-timer__value">{value}</div>
        <div className="pf-timer__arc">
          <svg viewBox="0 0 36 36">
            <path
              ref={pathRef}
              className="pf-timer__path"
              d="M18 2.5a15.5 15.5 0 1 1 0 31 15.5 15.5 0 0 1 0-31"
            />
          </svg>
        </div>
      </div>
      <span className="pf-timer__label">Seconds left</span>
      <div ref={underlineRef} className="pf-timer__underline"></div>
    </div>
  )
}
