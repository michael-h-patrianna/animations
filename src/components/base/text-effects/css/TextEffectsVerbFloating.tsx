/**
 * Reduced-motion note: catalog-only data-reduced-motion mirroring supplements
 * OS @media (prefers-reduced-motion) rules; consumers do not need to copy it.
 * Standalone: Copy this file + TextEffectsVerbFloating.module.css + SharedGraphemeSplitter.ts into your app.
 * Runtime deps: react
 * RN: Not applicable (CSS keyframes). Use framer variant for RN portability.
 */

import { memo, useMemo } from 'react'
import styles from './TextEffectsVerbFloating.module.css'
import { splitGraphemes } from '@/components/base/text-effects/SharedGraphemeSplitter'

interface TextEffectsVerbFloatingProps {
  /** The text to animate. Supports any length and whitespace characters.
   * @default "LOREM IPSUM DOLOR"
   */
  text?: string
  /** Text color. @default '#e8e4da' */
  color?: string
}

/**
 * Floating text animation with smooth up-and-down wave motion.
 * Each character floats independently with alternating delays for a wave effect.
 *
 * @example
 * <TextEffectsVerbFloating />
 * <TextEffectsVerbFloating text="HELLO WORLD" />
 * <TextEffectsVerbFloating text="A B C" />
 */
function TextEffectsVerbFloatingComponent({
  text = 'LOREM IPSUM DOLOR',
  color,
}: TextEffectsVerbFloatingProps) {
  const letters = useMemo(() => splitGraphemes(text), [text])

  return (
    <div
      className={styles['pf-tfx-float-container']}
      data-animation-id="text-effects__verb-floating"
      aria-label={text}
      style={
        color !== undefined ? ({ '--pf-verb-color': color } as React.CSSProperties) : undefined
      }
    >
      <div className={styles['pf-tfx-float-line']} aria-hidden="true">
        {letters.map((ch, i) => (
          <span
            key={i}
            className={[
              styles['pf-tfx-float-char'],
              i % 2 === 1 ? styles['pf-tfx-float-char--delayed'] : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        ))}
      </div>
    </div>
  )
}

export const TextEffectsVerbFloating = memo(TextEffectsVerbFloatingComponent)
