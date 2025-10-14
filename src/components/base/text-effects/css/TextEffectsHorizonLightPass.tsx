/**
 * Standalone: Copy this file and TextEffectsHorizonLightPass.css into your app.
 * Runtime deps: react only
 * RN parity: transforms/opacity/color only; port with Reanimated/Moti.
 */
import React, { useEffect, useRef } from 'react'
import { memo } from 'react'
import './TextEffectsHorizonLightPass.css'

function TextEffectsHorizonLightPassComponent() {
  const text = 'LOREM IPSUM DOLOR'
  const containerRef = useRef<HTMLDivElement>(null)
  const lettersRef = useRef<HTMLSpanElement[]>([])

  const letters = React.useMemo(() => Array.from(text), [text])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Container animation
    const containerAnimation = container.animate(
      [
        { opacity: 0, transform: 'scaleY(0.995)' },
        { opacity: 1, transform: 'scaleY(1)' },
        { opacity: 1, transform: 'scaleY(1)' },
        { opacity: 1, transform: 'scale(1.008)' },
        { opacity: 1, transform: 'scale(1)' },
      ],
      {
        duration: 1130,
        easing: 'ease-out',
        fill: 'forwards',
      }
    )

    // Letter animations with right-to-left cascade
    const letterAnimations = lettersRef.current.map((letter, i) => {
      if (!letter) return null

      const delayPer = 30
      const count = letters.length
      const rtlIndex = count - 1 - i
      const delay = 40 + rtlIndex * delayPer

      return letter.animate(
        [
          { opacity: 0, color: 'var(--hlp-baseColor)', transform: 'scaleX(1) scaleY(1)' },
          { opacity: 1, color: 'var(--hlp-highlightColor)', transform: 'scaleX(1.2) scaleY(0.94)' },
          { opacity: 1, color: 'var(--hlp-highlightColor)', transform: 'scaleX(1.22) scaleY(0.96)' },
          { opacity: 1, color: 'var(--hlp-highlightColor)', transform: 'scaleX(1.06) scaleY(0.99)' },
          { opacity: 1, color: 'var(--hlp-baseColor)', transform: 'scaleX(1) scaleY(1)' },
        ],
        {
          duration: 1250,
          delay,
          easing: 'ease-in-out',
          fill: 'forwards',
        }
      )
    })

    return () => {
      containerAnimation.cancel()
      letterAnimations.forEach((anim) => anim?.cancel())
    }
  }, [letters.length])

  return (
    <div
      ref={containerRef}
      className="studioLogo-HorizonLightPass"
      data-animation-id="text-effects__horizon-light-pass"
      aria-label={text}
    >
      <div className="studioLogo-HorizonLightPass__line" aria-hidden="true">
        {letters.map((ch, i) => (
          <span
            key={i}
            ref={(el) => {
              if (el) lettersRef.current[i] = el
            }}
            className="studioLogo-HorizonLightPass__letter"
          >
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        ))}
      </div>
    </div>
  )
}

/**
 * Memoized TextEffectsHorizonLightPass to prevent unnecessary re-renders in grid layouts.
 */
export const TextEffectsHorizonLightPass = memo(TextEffectsHorizonLightPassComponent)


export default TextEffectsHorizonLightPass

