import React, { memo } from 'react'
import './TextEffectsMetallicSpecularFlash.css'

/**
 * Props for TextEffectsMetallicSpecularFlash component.
 */
interface TextEffectsMetallicSpecularFlashProps {
  /** Text content to animate. Supports any length including whitespace. */
  text?: string
}

/**
 * Animated text effect with metallic specular flash and shimmer.
 *
 * Uses pure CSS animations with GPU-accelerated transforms and opacity.
 * Each letter flashes through highlight and shadow colors with a skew effect,
 * creating a metallic sheen that sweeps across the text from left to right.
 *
 * @param props - Component props
 * @param props.text - Text to animate (default: 'LORUM IPSUM DOLOR')
 *
 * @returns Animated text element with CSS keyframe animations
 *
 * @example
 * ```tsx
 * <TextEffectsMetallicSpecularFlash text="HELLO WORLD" />
 * ```
 *
 * @example
 * With default text:
 * ```tsx
 * <TextEffectsMetallicSpecularFlash />
 * ```
 *
 * @remarks
 * - Pure CSS animations (no JavaScript animation loop)
 * - Uses 20ms delay between letters for fast cascade effect
 * - GPU-accelerated with will-change hints
 * - Customize colors via CSS custom properties: --tfx-msf-base-color, --tfx-msf-highlight-color, --tfx-msf-shadow-color
 * - Animation duration: 1s container, 0.42s per letter
 * - Three-phase color transition: base → highlight → shadow → base
 *
 * @see TextEffectsMetallicSpecularFlash.css for keyframe definitions and styling
 */
function TextEffectsMetallicSpecularFlashComponent({ text = 'LORUM IPSUM DOLOR' }: TextEffectsMetallicSpecularFlashProps) {
  const letters = React.useMemo(() => Array.from(text), [text])

  return (
    <div
      className="tfx-metallic-specular-flash"
      data-animation-id="text-effects__metallic-specular-flash"
      aria-label={text}
    >
      <div className="tfx-metallic-specular-flash__line" aria-hidden="true">
        {letters.map((ch, i) => (
          <span
            key={i}
            className="tfx-metallic-specular-flash__letter"
            style={{ animationDelay: `${0.05 + i * 0.02}s` }}
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
export const TextEffectsMetallicSpecularFlash = memo(TextEffectsMetallicSpecularFlashComponent)

export default TextEffectsMetallicSpecularFlash

