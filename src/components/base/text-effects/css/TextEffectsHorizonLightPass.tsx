import { memo, useEffect, useMemo, useRef } from 'react'
import './TextEffectsHorizonLightPass.css'

interface TextEffectsHorizonLightPassProps {
  /** @default 'LOREM IPSUM DOLOR' */
  text?: string
}

/**
 * Standalone: Copy this file + TextEffectsHorizonLightPass.css into your app.
 * Runtime deps: react (uses Web Animations API for per-letter cascade).
 * RN: Not applicable. Use framer variant for RN portability.
 */
function TextEffectsHorizonLightPassComponent({
  text = 'LOREM IPSUM DOLOR',
}: TextEffectsHorizonLightPassProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const lettersRef = useRef<HTMLSpanElement[]>([])

  const letters = useMemo(() => Array.from(text), [text])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Reset refs for new text length
    lettersRef.current = lettersRef.current.slice(0, letters.length)

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
      if (letter == null) return null

      const delayPer = 30
      const count = letters.length
      const rtlIndex = count - 1 - i
      const delay = 40 + rtlIndex * delayPer

      return letter.animate(
        [
          { opacity: 0, color: 'var(--tfx-hlp-base-color)', transform: 'scaleX(1) scaleY(1)' },
          {
            opacity: 1,
            color: 'var(--tfx-hlp-highlight-color)',
            transform: 'scaleX(1.2) scaleY(0.94)',
          },
          {
            opacity: 1,
            color: 'var(--tfx-hlp-highlight-color)',
            transform: 'scaleX(1.22) scaleY(0.96)',
          },
          {
            opacity: 1,
            color: 'var(--tfx-hlp-highlight-color)',
            transform: 'scaleX(1.06) scaleY(0.99)',
          },
          { opacity: 1, color: 'var(--tfx-hlp-base-color)', transform: 'scaleX(1) scaleY(1)' },
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
  }, [text, letters.length])

  return (
    <div
      ref={containerRef}
      className="tfx-horizon-light-pass"
      data-animation-id="text-effects__horizon-light-pass"
      aria-label={text}
    >
      <div className="tfx-horizon-light-pass__line" aria-hidden="true">
        {letters.map((ch, i) => (
          <span
            key={i}
            ref={(el) => {
              if (el) lettersRef.current[i] = el
            }}
            className="tfx-horizon-light-pass__letter"
          >
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        ))}
      </div>
    </div>
  )
}

export const TextEffectsHorizonLightPass = memo(TextEffectsHorizonLightPassComponent)
