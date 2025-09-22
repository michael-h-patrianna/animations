import { useEffect, useRef, useState } from 'react'
import './TimerEffectsTimerFlip.css'

export function TimerEffectsTimerFlip() {
  const [value, setValue] = useState(10)
  const isAnimatingRef = useRef(false)
  const valueRef = useRef<HTMLDivElement>(null)
  const underlineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let animationId: number
    let timeoutId: ReturnType<typeof setTimeout>
    const flipTimeouts: Array<ReturnType<typeof setTimeout>> = []

    const startAnimation = () => {
      if (isAnimatingRef.current) return

      isAnimatingRef.current = true
      setValue(10)

      const valueEl = valueRef.current
      const underline = underlineRef.current

      if (!valueEl || !underline) return

      // Reset styles
      underline.style.transform = 'scaleX(1)'
      valueEl.style.transform = 'rotateX(0deg)'
      valueEl.style.opacity = '1'

      const duration = 3000 // 3 seconds for longer flip effect
      const startTime = Date.now()
      const step = duration / 10

      // Set up flip animations for each second
      for (let i = 0; i < 10; i++) {
        const flipTimeout = setTimeout(() => {
          // Flip animation: rotateX from 0 to -180 to -360
          valueEl.style.transition = 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out'
          valueEl.style.transform = 'rotateX(-180deg)'
          valueEl.style.opacity = '0.6'

          setTimeout(() => {
            valueEl.style.transform = 'rotateX(-360deg)'
            valueEl.style.opacity = '1'
          }, 250)

          setTimeout(() => {
            valueEl.style.transform = 'rotateX(0deg)'
          }, 500)
        }, step * i)

        flipTimeouts.push(flipTimeout)
      }

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)

        // Update countdown value
        const currentValue = Math.max(0, Math.ceil(10 * (1 - progress)))
        setValue(currentValue)

        // Update underline scale
        underline.style.transform = `scaleX(${1 - progress})`

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
      // Reset flag so StrictMode double-invocation doesn't block next start
      isAnimatingRef.current = false
      flipTimeouts.forEach(clearTimeout)
    }
  }, [])

  return (
    <div className="pf-timer" data-animation-id="timer-effects__timer-flip">
      <div ref={valueRef} className="pf-timer__value">
        {value}
      </div>
      <span className="pf-timer__label">Seconds left</span>
      <div ref={underlineRef} className="pf-timer__underline"></div>
    </div>
  )
}
