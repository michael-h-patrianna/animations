/**
 * Reduced-motion note: catalog-only data-reduced-motion mirroring supplements
 * OS @media (prefers-reduced-motion) rules; consumers do not need to copy it.
 * Standalone: Copy this file + TextEffectsVerbFalling.module.css + SharedGraphemeSplitter.ts into your app.
 * Runtime deps: react
 * RN: Not applicable (CSS keyframes). Use framer variant for RN portability.
 */

import { memo, useMemo } from 'react'
import styles from './TextEffectsVerbFalling.module.css'
import { splitGraphemes } from '@/components/base/text-effects/SharedGraphemeSplitter'

interface TextEffectsVerbFallingProps {
  /** The text to animate. Supports any length and whitespace characters.
   * @default "LOREM IPSUM DOLOR"
   */
  text?: string
  /** Delay between each character's animation start in seconds.
   * @default 0.05
   */
  stepDelay?: number
  /** Text color. @default '#e8e4da' */
  color?: string
}

/**
 * Falling text animation with sequential drop effect and elastic landing.
 * Characters fall into place one after another with bounce and fade-in.
 *
 * @example
 * <TextEffectsVerbFalling />
 * <TextEffectsVerbFalling text="DROP DOWN" />
 * <TextEffectsVerbFalling text="Falling Leaves" stepDelay={0.08} />
 */
function TextEffectsVerbFallingComponent({
  text = 'LOREM IPSUM DOLOR',
  stepDelay = 0.05,
  color,
}: TextEffectsVerbFallingProps) {
  const letters = useMemo(() => splitGraphemes(text), [text])

  return (
    <div
      className={styles['pf-tfx-fall-container']}
      data-animation-id="text-effects__verb-falling"
      aria-label={text}
      style={
        color !== undefined ? ({ '--pf-verb-color': color } as React.CSSProperties) : undefined
      }
    >
      <div className={styles['pf-tfx-fall-line']} aria-hidden="true">
        {letters.map((ch, i) => (
          <span
            key={i}
            className={styles['pf-tfx-fall-char']}
            style={{ animationDelay: `${i * stepDelay}s` }}
          >
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        ))}
      </div>
    </div>
  )
}

export const TextEffectsVerbFalling = memo(TextEffectsVerbFallingComponent)
