import React, { memo, useEffect, useRef } from 'react'
import './TextEffectsHorizonLightPass.css'

/**
 * Props for TextEffectsHorizonLightPass component.
 */
interface TextEffectsHorizonLightPassProps {
  /** Text content to animate. Supports any length including whitespace. */
  text?: string
}

/**
 * Animated text effect with horizontal light pass and right-to-left cascade.
 *
 * Uses Web Animations API for GPU-accelerated transforms and opacity changes.
 * Each letter scales and changes color in sequence from right to left, creating
 * a sweeping highlight effect. Container fades in and scales simultaneously.
 *
 * @param props - Component props
 * @param props.text - Text to animate (default: 'LOREM IPSUM DOLOR')
 *
 * @returns Animated text element with individual letter animations
 *
 * @example
 * ```tsx
 * <TextEffectsHorizonLightPass text="HELLO WORLD" />
 * ```
 *
 * @example
 * With default text:
 * ```tsx
 * <TextEffectsHorizonLightPass />
 * ```
 *
 * @remarks
 * - Animations start automatically on mount
 * - Uses 30ms delay between letters for cascade effect
 * - GPU-accelerated with will-change hints
 * - Customize colors via CSS custom properties: --tfx-hlp-base-color, --tfx-hlp-highlight-color
 * - Animations are cancelled on unmount to prevent memory leaks
 *
 * @see TextEffectsHorizonLightPass.css for styling and performance optimizations
 */
function TextEffectsHorizonLightPassComponent({ text = 'LOREM IPSUM DOLOR' }: TextEffectsHorizonLightPassProps) {
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
          { opacity: 0, color: 'var(--tfx-hlp-base-color)', transform: 'scaleX(1) scaleY(1)' },
          { opacity: 1, color: 'var(--tfx-hlp-highlight-color)', transform: 'scaleX(1.2) scaleY(0.94)' },
          { opacity: 1, color: 'var(--tfx-hlp-highlight-color)', transform: 'scaleX(1.22) scaleY(0.96)' },
          { opacity: 1, color: 'var(--tfx-hlp-highlight-color)', transform: 'scaleX(1.06) scaleY(0.99)' },
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
  }, [letters.length])

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

/**
 * Memoized version to prevent unnecessary re-renders in grid layouts.
 * Component only re-renders when text prop changes.
 */
export const TextEffectsHorizonLightPass = memo(TextEffectsHorizonLightPassComponent)

export default TextEffectsHorizonLightPass

