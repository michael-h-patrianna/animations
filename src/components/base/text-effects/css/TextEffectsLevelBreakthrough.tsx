import { memo } from 'react'
import styles from './TextEffectsLevelBreakthrough.module.css'

interface TextEffectsLevelBreakthroughProps {
  /** Text shown before breakthrough. @default 'LEVEL 1' */
  startText?: string
  /** Text shown after breakthrough. @default 'LEVEL 2' */
  endText?: string
  /** Additional CSS class for the container. */
  className?: string
  /** Text and surge ring color. @default '#ffce1a' */
  color?: string
}

/**
 * Standalone: Copy this file + TextEffectsLevelBreakthrough.module.css into your app.
 * Runtime deps: react
 * RN: Not applicable (CSS keyframes). Use framer variant for RN portability.
 */
function TextEffectsLevelBreakthroughComponent({
  startText = 'LEVEL 1',
  endText = 'LEVEL 2',
  className = '',
  color,
}: TextEffectsLevelBreakthroughProps) {
  return (
    <div
      className={`${styles['tfx-breakthrough-container']} ${className}`.trim()}
      data-animation-id="text-effects__level-breakthrough"
      data-testid="breakthrough-container"
      style={
        color !== undefined
          ? ({ '--text-effects-level-breakthrough-color': color } as React.CSSProperties)
          : undefined
      }
    >
      <div
        className={`${styles['tfx-breakthrough-surge']} ${styles['tfx-breakthrough-surge-outer']}`}
        data-testid="surge-outer"
      />
      <div
        className={`${styles['tfx-breakthrough-surge']} ${styles['tfx-breakthrough-surge-inner']}`}
        data-testid="surge-inner"
      />
      <div className={styles['tfx-breakthrough-text-wrapper']}>
        <div
          className={`${styles['tfx-breakthrough-text']} ${styles['tfx-breakthrough-text-start']}`}
          data-testid="text-start"
        >
          {startText}
        </div>
        <div
          className={`${styles['tfx-breakthrough-text']} ${styles['tfx-breakthrough-text-end']}`}
          data-testid="text-end"
        >
          {endText}
        </div>
      </div>
    </div>
  )
}

export const TextEffectsLevelBreakthrough = memo(TextEffectsLevelBreakthroughComponent)
