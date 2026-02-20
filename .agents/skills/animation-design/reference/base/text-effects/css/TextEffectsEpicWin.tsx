import { memo, useEffect, useRef } from 'react'
import './TextEffectsEpicWin.css'

/**
 * Epic Win text effect with metallic gradient and dramatic entrance animation.
 *
 * Features a cinematic reveal with layered shadows, 3D character entrance,
 * and synchronized glow bursts. Optimized for GPU rendering using CSS animations
 * with transform and opacity properties only. Works with any text length,
 * including whitespace characters.
 *
 * **Animation Sequence:**
 * 1. Far shadow fades in from behind (0-500ms)
 * 2. Mid shadow fades in closer (50-500ms)
 * 3. Characters flip and slide into view with stagger (100ms+ per char)
 * 4. Glow bursts pulse around each character (500ms+ per char)
 *
 * **Performance:**
 * - Pure CSS animations triggered by class toggle (minimal JS)
 * - GPU-accelerated transforms and opacity only
 * - Automatic cleanup on unmount
 *
 * @param props - Component props
 * @param props.text - Text to animate. Supports any length including spaces. Defaults to 'EPIC WIN'
 *
 * @returns A dramatic metallic text reveal with layered depth and character-by-character animation
 *
 * @example
 * Basic usage with default text:
 * ```tsx
 * <TextEffectsEpicWin />
 * ```
 *
 * @example
 * Custom text with whitespace:
 * ```tsx
 * <TextEffectsEpicWin text="LEVEL COMPLETE" />
 * <TextEffectsEpicWin text="YOU WIN!" />
 * ```
 *
 * @remarks
 * - Uses CSS custom property `--char-index` for stagger timing calculation
 * - Each character independently animated via CSS for scalability
 * - Shadow layers provide depth perception without parallax complexity
 * - Namespace prefix `tfe-epic-win-` prevents style conflicts
 *
 * @see {@link TextEffectsEpicWin.css} for animation keyframes and GPU optimization
 */
function TextEffectsEpicWinComponent({ text = 'EPIC WIN' }: { text?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Trigger all CSS animations by adding the animate class
    if (containerRef.current) {
      containerRef.current.classList.add('tfe-epic-win--animate')
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="tfe-epic-win"
      data-animation-id="text-effects__epic-win"
    >
      <div className="tfe-epic-win__text-container">
        {/* Layered shadow elements for depth */}
        <div className="tfe-epic-win__shadow-far">{text}</div>
        <div className="tfe-epic-win__shadow-mid">{text}</div>

        {/* Main metallic gradient text with per-character animation */}
        <div className="tfe-epic-win__main-text">
          {text.split('').map((char, index) => (
            <span
              key={index}
              className="tfe-epic-win__char"
              style={{ '--char-index': index } as React.CSSProperties}
            >
              <span className="tfe-epic-win__char-inner">
                {char === ' ' ? '\u00A0' : char}
                <span className="tfe-epic-win__char-glow" />
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Memoized Epic Win text effect component.
 *
 * Prevents unnecessary re-renders when used in grid layouts or frequently
 * updating parent components. Only re-renders if the `text` prop changes.
 */
export const TextEffectsEpicWin = memo(TextEffectsEpicWinComponent)

