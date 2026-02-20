import { memo } from 'react'
import './TextEffectsTypewriter.css'

/**
 * Props for the TextEffectsTypewriter component.
 */
interface TextEffectsTypewriterProps {
  /**
   * The text content to display with typewriter effect.
   * Supports any length and preserves whitespace.
   * @default 'LOADING SYSTEM...'
   */
  text?: string
  /**
   * Delay between each character appearance in seconds.
   * Controls the typing speed.
   * @default 0.08
   */
  charDelay?: number
  /**
   * The cursor character to display after typing completes.
   * @default '|'
   */
  cursor?: string
}

/**
 * Typewriter text effect component.
 *
 * Displays text character-by-character with a typing animation,
 * followed by a blinking cursor.
 *
 * @example
 * ```tsx
 * <TextEffectsTypewriter text="Hello World!" charDelay={0.1} />
 * ```
 */
function TextEffectsTypewriterComponent({
  text = 'LOADING SYSTEM...',
  charDelay = 0.08,
  cursor = '|',
}: TextEffectsTypewriterProps) {
  return (
    <div
      className="text-effects-typewriter-container"
      data-animation-id="text-effects__typewriter"
      style={
        {
          '--text-effects-typewriter-char-delay': `${charDelay}s`,
        } as React.CSSProperties
      }
    >
      <div className="text-effects-typewriter-text">
        {text.split('').map((char, index) => (
          <span
            key={index}
            className="text-effects-typewriter-char"
            style={{ animationDelay: `${index * charDelay}s` }}
          >
            {char}
          </span>
        ))}
        <span
          className="text-effects-typewriter-cursor"
          style={{ animationDelay: `${text.length * charDelay}s` }}
        >
          {cursor}
        </span>
      </div>
    </div>
  )
}

/**
 * Memoized typewriter component to prevent unnecessary re-renders.
 * Ideal for use in grid layouts or lists where parent re-renders are frequent.
 */
export const TextEffectsTypewriter = memo(TextEffectsTypewriterComponent)

