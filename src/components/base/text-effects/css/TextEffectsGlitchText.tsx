import { memo } from 'react'
import './TextEffectsGlitchText.css'

interface TextEffectsGlitchTextProps {
  /**
   * Text content to display with glitch effect.
   * Works with any length including whitespace.
   * @default 'SYSTEM ERROR'
   */
  text?: string

  /**
   * Alternative to text prop - allows JSX children.
   * Takes precedence over text prop if both are provided.
   */
  children?: React.ReactNode

  /**
   * Optional className for container customization.
   * Applied to the root container element.
   */
  className?: string
}

/**
 * Pure CSS glitch text effect with RGB chromatic aberration and scan line distortions.
 *
 * Creates a digital corruption effect using layered text with offset positioning,
 * animated transforms, and distortion bars. The effect works with any text length
 * and content, including whitespace and special characters.
 *
 * **Key Features:**
 * - Zero JavaScript animations - pure CSS keyframes
 * - GPU-accelerated transforms (translateX, skewX, scaleX, opacity)
 * - Three text layers: base (white) + cyan offset + magenta offset
 * - Horizontal scan line distortion bars
 * - Fully responsive to text length and container size
 *
 * **Performance:**
 * - Uses `transform` and `opacity` only for 60fps animations
 * - `will-change` hints for GPU optimization
 * - Memoized to prevent unnecessary re-renders
 *
 * @param props - Component props
 * @param props.text - Text to display (default: 'SYSTEM ERROR')
 * @param props.children - JSX children override for text prop
 * @param props.className - Additional CSS classes for container
 *
 * @returns Glitch text effect component
 *
 * @example
 * Basic usage with default text:
 * ```tsx
 * <TextEffectsGlitchText />
 * ```
 *
 * @example
 * Custom text with prop:
 * ```tsx
 * <TextEffectsGlitchText text="CONNECTION LOST" />
 * ```
 *
 * @example
 * Using children for complex content:
 * ```tsx
 * <TextEffectsGlitchText>
 *   <span>ERROR <strong>404</strong></span>
 * </TextEffectsGlitchText>
 * ```
 *
 * @example
 * With custom styling:
 * ```tsx
 * <TextEffectsGlitchText
 *   text="CRITICAL FAILURE"
 *   className="my-custom-class"
 * />
 * ```
 *
 * @remarks
 * - All animations are GPU-accelerated using transform properties
 * - CSS custom properties allow easy theme customization
 * - Namespaced classes prevent conflicts with other animations
 * - Works with any text length, no JavaScript measurement needed
 * - Effect duration is 4s with staggered glitch moments
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/will-change} for GPU optimization
 */
function TextEffectsGlitchTextComponent({
  text = 'SYSTEM ERROR',
  children,
  className = '',
}: TextEffectsGlitchTextProps) {
  const content = children ?? text

  return (
    <div
      className={`tfx-glitchtext__container ${className}`.trim()}
      data-animation-id="text-effects__tfx-glitchtext"
    >
      {/* Main text layer */}
      <div className="tfx-glitchtext__base">
        {content}
      </div>

      {/* Cyan RGB offset layer */}
      <div className="tfx-glitchtext__layer tfx-glitchtext__layer--cyan" aria-hidden="true">
        {content}
      </div>

      {/* Magenta RGB offset layer */}
      <div className="tfx-glitchtext__layer tfx-glitchtext__layer--magenta" aria-hidden="true">
        {content}
      </div>

      {/* Horizontal scan line distortion bars */}
      <div className="tfx-glitchtext__bars" aria-hidden="true" />
    </div>
  )
}

/**
 * Memoized glitch text effect component.
 * Prevents unnecessary re-renders in grid layouts and complex UIs.
 */
export const TextEffectsGlitchText = memo(TextEffectsGlitchTextComponent)

