/**
 * CSS variant.
 * Reduced-motion note: catalog-only data-reduced-motion mirroring supplements
 * OS @media (prefers-reduced-motion) rules; consumers do not need to copy it.
 */
import { memo } from 'react'
import styles from './TextEffectsGlitchText.module.css'

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

  /** Base text color. @default '#ffffff' */
  color?: string
}

/**
 * Standalone: Copy this file + TextEffectsGlitchText.module.css into your app.
 * Runtime deps: react
 * RN: Not applicable (CSS keyframes). Use framer variant for RN portability.
 */
function TextEffectsGlitchTextComponent({
  text = 'SYSTEM ERROR',
  children,
  className = '',
  color,
}: TextEffectsGlitchTextProps) {
  const content = children ?? text

  return (
    <div
      className={`${styles['pf-tfx-glitchtext__container']} ${className}`.trim()}
      data-animation-id="text-effects__glitch-text"
      style={
        color !== undefined
          ? ({ '--tfx-glitchtext-color': color } as React.CSSProperties)
          : undefined
      }
    >
      {/* Main text layer */}
      <div className={styles['pf-tfx-glitchtext__base']}>{content}</div>

      {/* Cyan RGB offset layer */}
      <div
        className={`${styles['pf-tfx-glitchtext__layer']} ${styles['pf-tfx-glitchtext__layer--cyan']}`}
        aria-hidden="true"
      >
        {content}
      </div>

      {/* Magenta RGB offset layer */}
      <div
        className={`${styles['pf-tfx-glitchtext__layer']} ${styles['pf-tfx-glitchtext__layer--magenta']}`}
        aria-hidden="true"
      >
        {content}
      </div>

      {/* Horizontal scan line distortion bars */}
      <div className={styles['pf-tfx-glitchtext__bars']} aria-hidden="true" />
    </div>
  )
}

export const TextEffectsGlitchText = memo(TextEffectsGlitchTextComponent)
