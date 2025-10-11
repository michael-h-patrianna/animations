import type { AnimationMetadata } from '@/types/animation'
import { useEffect, useRef, useState } from 'react'
import './TextEffectsComboCounter.css'

export function TextEffectsComboCounter() {
  const finalValue = 25
  const comboText = 'COMBO'
  const [count, setCount] = useState(0)
  const numberWrapperRef = useRef<HTMLDivElement>(null)
  const hitMarkerRef = useRef<HTMLDivElement>(null)
  const comboTextRef = useRef<HTMLDivElement>(null)
  const perfectRef = useRef<HTMLDivElement>(null)
  const lettersRef = useRef<HTMLSpanElement[]>([])
  const particlesRef = useRef<HTMLDivElement[]>([])
  const digitRef = useRef<HTMLSpanElement>(null)

  // Milestones: [triggerValue, particleValue]
  const milestones = [
    { trigger: 1, value: 1 },
    { trigger: 6, value: 5 },
    { trigger: 15, value: 9 },
    { trigger: 25, value: 10 },
  ]

  useEffect(() => {
    // Start counting animation
    const startTime = performance.now()
    const duration = 1200
    const delay = 350

    const animateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime - delay
      if (elapsed < 0) {
        requestAnimationFrame(animateCount)
        return
      }

      const progress = Math.min(elapsed / duration, 1)
      // Custom easing [0.25, 0.1, 0.25, 1] approximation
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2

      const newCount = Math.round(eased * finalValue)
      setCount(newCount)

      if (progress < 1) {
        requestAnimationFrame(animateCount)
      }
    }

    requestAnimationFrame(animateCount)

    // Number wrapper animation
    if (numberWrapperRef.current) {
      numberWrapperRef.current.animate(
        [
          { transform: 'scale(0) rotate(-180deg)', opacity: 1 },
          { transform: 'scale(1.2) rotate(10deg)', opacity: 1 },
          { transform: 'scale(0.95) rotate(-5deg)', opacity: 1 },
          { transform: 'scale(1) rotate(0deg)', opacity: 1 },
        ],
        {
          duration: 500,
          easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          fill: 'forwards',
        }
      )
    }

    // Digit fade in animation
    if (digitRef.current) {
      digitRef.current.animate(
        [
          { opacity: 0 },
          { opacity: 1 },
        ],
        {
          duration: 200,
          delay: 250,
          fill: 'forwards',
        }
      )
    }

    // Hit marker animation
    if (hitMarkerRef.current) {
      hitMarkerRef.current.animate(
        [
          { transform: 'scale(0)', opacity: 0 },
          { transform: 'scale(1.3)', opacity: 1 },
          { transform: 'scale(1)', opacity: 0.9 },
        ],
        {
          duration: 300,
          delay: 150,
          easing: 'ease-out',
          fill: 'forwards',
        }
      )
    }

    // Combo text wrapper fade
    if (comboTextRef.current) {
      comboTextRef.current.animate(
        [
          { opacity: 0 },
          { opacity: 1 },
        ],
        {
          duration: 200,
          delay: 100,
          fill: 'forwards',
        }
      )
    }

    // Combo text letters animation
    lettersRef.current.forEach((letter, index) => {
      if (!letter) return
      letter.animate(
        [
          { opacity: 0, transform: 'scale(0) rotate(180deg)' },
          { opacity: 1, transform: 'scale(1.2) rotate(-10deg)' },
          { opacity: 1, transform: 'scale(1) rotate(0deg)' },
        ],
        {
          duration: 400,
          delay: 200 + index * 40,
          easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          fill: 'forwards',
        }
      )
    })

    // Milestone particles
    particlesRef.current.forEach((particle, i) => {
      if (!particle) return

      const milestone = milestones[i]
      const angle = -90 + i * 30 - 45
      const distance = 70 + i * 12
      const xOffset = Math.cos((angle * Math.PI) / 180) * distance
      const yOffset = Math.sin((angle * Math.PI) / 180) * distance

      const triggerProgress = milestone.trigger / finalValue
      const adjustedDelay = 350 + triggerProgress * 800

      particle.animate(
        [
          { opacity: 0, transform: 'translate(0, 0) scale(0)' },
          { opacity: 1, transform: `translate(${xOffset}px, ${yOffset}px) scale(1.4)` },
          { opacity: 1, transform: `translate(${xOffset}px, ${yOffset}px) scale(1)` },
          { opacity: 0, transform: `translate(${xOffset}px, ${yOffset}px) scale(0.5)` },
        ],
        {
          duration: 1000,
          delay: adjustedDelay,
          easing: 'ease-out',
          fill: 'forwards',
        }
      )
    })

    // Perfect text animation
    if (perfectRef.current) {
      perfectRef.current.animate(
        [
          { opacity: 0, transform: 'scale(0.5)' },
          { opacity: 1, transform: 'scale(1.1)' },
          { opacity: 1, transform: 'scale(1)' },
        ],
        {
          duration: 400,
          delay: 1600,
          easing: 'ease-out',
          fill: 'forwards',
        }
      )
    }
  }, [finalValue])

  return (
    <div className="combo-counter-container" data-animation-id="text-effects__combo-counter">
      <div className="combo-main-container">
        <div ref={numberWrapperRef} className="combo-number-wrapper" style={{ opacity: 0 }}>
          <div className="combo-number-container">
            <div className="combo-current-number">
              <span ref={digitRef} className="combo-digit" style={{ opacity: 0 }}>
                <span>{count}</span>
              </span>
            </div>

            {milestones.map((milestone, i) => (
              <div
                key={i}
                ref={(el) => {
                  if (el) particlesRef.current[i] = el
                }}
                className="combo-milestone-particle"
                data-value={milestone.value}
                style={{
                  opacity: 0,
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                +{milestone.value}
              </div>
            ))}
          </div>

          <div ref={hitMarkerRef} className="combo-hit-marker" style={{ opacity: 0 }}>
            ×
          </div>
        </div>

        <div ref={comboTextRef} className="combo-text-wrapper" style={{ opacity: 0 }}>
          {comboText.split('').map((char, index) => (
            <span
              key={index}
              ref={(el) => {
                if (el) lettersRef.current[index] = el
              }}
              className="combo-text-char"
              style={{ opacity: 0 }}
            >
              {char}
            </span>
          ))}
        </div>
      </div>

      <div ref={perfectRef} className="combo-bonus" style={{ opacity: 0 }}>
        PERFECT!
      </div>
    </div>
  )
}

export const metadata: AnimationMetadata = {
  id: 'text-effects__combo-counter',
  title: 'Combo Counter',
  description: 'Dynamic counting animation with milestone particles and perfect combo celebration.',
  tags: ['css'],
  disableReplay: false
}
