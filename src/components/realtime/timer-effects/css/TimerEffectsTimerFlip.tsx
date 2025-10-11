import type { AnimationMetadata } from '@/types/animation'
import { useEffect, useState } from 'react'
import './TimerEffectsTimerFlip.css'

export function TimerEffectsTimerFlip() {
  const [value, setValue] = useState(10)
  const [flipKey, setFlipKey] = useState(0)
  const [animationKey, setAnimationKey] = useState(0)

  useEffect(() => {
    const duration = 3000
    const startTime = Date.now()
    let lastValue = 10

    const intervalId = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const currentValue = Math.max(0, Math.ceil(10 * (1 - progress)))

      if (currentValue !== lastValue) {
        setValue(currentValue)
        setFlipKey((prev) => prev + 1)
        lastValue = currentValue
      }

      if (progress >= 1) {
        clearInterval(intervalId)
        // Auto-restart after a brief pause
        setTimeout(() => {
          setValue(10)
          setFlipKey((prev) => prev + 1)
          setAnimationKey((prev) => prev + 1)
        }, 1000)
      }
    }, 100)

    return () => clearInterval(intervalId)
  }, [animationKey])

  return (
    <div className="pf-timer-flip" data-animation-id="timer-effects__timer-flip">
      <div key={flipKey} className="pf-timer-flip__value">
        {value}
      </div>
      <span className="pf-timer-flip__label">Seconds left</span>
      <div className="pf-timer-flip__underline" style={{ '--value': value / 10 } as React.CSSProperties} />
    </div>
  )
}

export const metadata = {
  id: 'timer-effects__timer-flip',
  title: 'Timer Flip',
  description: 'Timer with flip animation on value changes.',
  tags: ['css'],
} satisfies AnimationMetadata
