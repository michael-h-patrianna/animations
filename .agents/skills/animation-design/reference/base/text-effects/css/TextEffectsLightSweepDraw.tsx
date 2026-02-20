import React, { memo } from 'react'
import './TextEffectsLightSweepDraw.css'

/**
 * Props for TextEffectsLightSweepDraw component.
 */
interface TextEffectsLightSweepDrawProps {
  /** Text content to animate. Supports any length including whitespace. */
  text?: string
}

/**
 * Animated text effect with sweeping light and draw-in transition.
 *
 * Uses pure CSS animations with GPU-accelerated transforms and opacity.
 * Each letter animates in sequence with a skew effect and color transition,
 * creating a dynamic drawing/writing effect as the light sweeps across.
 *
 * @param props - Component props
 * @param props.text - Text to animate (default: 'LOREM IPSUM DOLOR')
 *
 * @returns Animated text element with CSS keyframe animations
 *
 * @example
 * ```tsx
 * <TextEffectsLightSweepDraw text="HELLO WORLD" />
 * ```
 *
 * @example
 * With default text:
 * ```tsx
 * <TextEffectsLightSweepDraw />
 * ```
 *
 * @remarks
 * - Pure CSS animations (no JavaScript animation loop)
 * - Uses 40ms delay between letters for cascade effect
 * - GPU-accelerated with will-change hints
 * - Customize colors via CSS custom properties: --tfx-lsd-base-color, --tfx-lsd-highlight-color
 * - Animation duration: 1.75s container, 0.6s per letter
 *
 * @see TextEffectsLightSweepDraw.css for keyframe definitions and styling
 */
function TextEffectsLightSweepDrawComponent({ text = 'LOREM IPSUM DOLOR' }: TextEffectsLightSweepDrawProps) {
  const letters = React.useMemo(() => Array.from(text), [text])

  return (
    <div
      className="tfx-light-sweep-draw"
      data-animation-id="text-effects__light-sweep-draw"
      aria-label={text}
    >
      <div className="tfx-light-sweep-draw__line" aria-hidden="true">
        {letters.map((ch, i) => (
          <span
            key={i}
            className="tfx-light-sweep-draw__letter"
            style={{ animationDelay: `${0.15 + i * 0.04}s` }}
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
export const TextEffectsLightSweepDraw = memo(TextEffectsLightSweepDrawComponent)

export default TextEffectsLightSweepDraw

