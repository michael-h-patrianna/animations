/**
 * Standalone: Copy this file + TextEffectsVerbJogging.module.css + SharedGraphemeSplitter.ts into your app.
 * Runtime deps: react
 * RN: Not applicable (CSS keyframes). Use framer variant for RN portability.
 */

import { memo, useMemo } from 'react'
import styles from './TextEffectsVerbJogging.module.css'
import { splitGraphemes } from '@/components/base/text-effects/SharedGraphemeSplitter'

interface TextEffectsVerbJoggingProps {
  /** The text to animate. Supports any length and whitespace characters.
   * @default "LOREM IPSUM DOLOR"
   */
  text?: string
  /** Text color. @default '#e8e4da' */
  color?: string
}

/**
 * Jogging text animation with bouncy up-down motion and subtle rotation.
 * Characters bounce with alternating delays creating a rhythmic jogging effect.
 *
 * @example
 * <TextEffectsVerbJogging />
 * <TextEffectsVerbJogging text="RUN FAST" />
 * <TextEffectsVerbJogging text="Quick Brown Fox" />
 */
function TextEffectsVerbJoggingComponent({
  text = 'LOREM IPSUM DOLOR',
  color,
}: TextEffectsVerbJoggingProps) {
  const letters = useMemo(() => splitGraphemes(text), [text])

  return (
    <div
      className={styles['pf-tfx-jog-container']}
      data-animation-id="text-effects__verb-jogging"
      aria-label={text}
      style={
        color !== undefined ? ({ '--pf-verb-color': color } as React.CSSProperties) : undefined
      }
    >
      <div className={styles['pf-tfx-jog-line']} aria-hidden="true">
        {letters.map((ch, i) => (
          <span
            key={i}
            className={`${styles['pf-tfx-jog-char']} ${i % 2 === 0 ? styles['pf-tfx-jog-char--delayed'] : ''}`}
          >
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        ))}
      </div>
    </div>
  )
}

export const TextEffectsVerbJogging = memo(TextEffectsVerbJoggingComponent)
