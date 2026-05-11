/**
 * Reduced-motion note: catalog-only data-reduced-motion mirroring supplements
 * OS @media (prefers-reduced-motion) rules; consumers do not need to copy it.
 * Standalone: Copy this file + TextEffectsVerbJumping.module.css + SharedGraphemeSplitter.ts into your app.
 * Runtime deps: react
 * RN: Not applicable (CSS keyframes). Use framer variant for RN portability.
 */

import { memo, useMemo } from 'react'
import styles from './TextEffectsVerbJumping.module.css'
import { splitGraphemes } from '@/components/base/text-effects/SharedGraphemeSplitter'

interface TextEffectsVerbJumpingProps {
  /** The text to animate. Supports any length and whitespace characters.
   * @default "LOREM IPSUM DOLOR"
   */
  text?: string
  /** Delay between each character's animation start in seconds.
   * @default 0.06
   */
  stepDelay?: number
  /** Text color. @default '#e8e4da' */
  color?: string
}

/**
 * Jumping text animation with sequential bounce effect and squash-and-stretch.
 * Characters jump one after another with elastic landing for dynamic motion.
 *
 * @example
 * <TextEffectsVerbJumping />
 * <TextEffectsVerbJumping text="BOUNCE!" />
 * <TextEffectsVerbJumping text="Jump High" stepDelay={0.08} />
 */
function TextEffectsVerbJumpingComponent({
  text = 'LOREM IPSUM DOLOR',
  stepDelay = 0.06,
  color,
}: TextEffectsVerbJumpingProps) {
  const letters = useMemo(() => splitGraphemes(text), [text])

  return (
    <div
      className={styles['pf-tfx-jump-container']}
      data-animation-id="text-effects__verb-jumping"
      aria-label={text}
      style={
        color !== undefined ? ({ '--pf-verb-color': color } as React.CSSProperties) : undefined
      }
    >
      <div className={styles['pf-tfx-jump-line']} aria-hidden="true">
        {letters.map((ch, i) => (
          <span
            key={i}
            className={styles['pf-tfx-jump-char']}
            style={{ animationDelay: `${i * stepDelay}s` }}
          >
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        ))}
      </div>
    </div>
  )
}

export const TextEffectsVerbJumping = memo(TextEffectsVerbJumpingComponent)
