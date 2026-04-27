import { memo } from 'react'
import styles from './TextEffectsEpicWin.module.css'

/**
 * Standalone: Copy this file + TextEffectsEpicWin.module.css into your app.
 * Runtime deps: react
 * RN: Not applicable (CSS keyframes). Use framer variant for RN portability.
 */
function TextEffectsEpicWinComponent({
  text = 'EPIC WIN',
  color,
}: {
  text?: string
  color?: string
}) {
  return (
    <div
      className={`${styles['pf-tfe-epic-win']} ${styles['pf-tfe-epic-win--animate']}`}
      data-animation-id="text-effects__epic-win"
      data-testid="epic-win"
      style={
        color !== undefined
          ? ({ '--text-effects-epic-win-color': color } as React.CSSProperties)
          : undefined
      }
    >
      <div className={styles['pf-tfe-epic-win__text-container']}>
        {/* Layered shadow elements for depth */}
        <div className={styles['pf-tfe-epic-win__shadow-far']}>{text}</div>
        <div className={styles['pf-tfe-epic-win__shadow-mid']}>{text}</div>

        {/* Main metallic gradient text with per-character animation */}
        <div className={styles['pf-tfe-epic-win__main-text']}>
          {Array.from(text).map((char, index) => (
            <span
              key={index}
              className={styles['pf-tfe-epic-win__char']}
              data-testid="epic-char"
              style={{ '--char-index': index } as React.CSSProperties}
            >
              <span className={styles['pf-tfe-epic-win__char-inner']}>
                {char === ' ' ? '\u00A0' : char}
                <span
                  className={styles['pf-tfe-epic-win__char-glow']}
                  data-testid="epic-char-glow"
                />
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export const TextEffectsEpicWin = memo(TextEffectsEpicWinComponent)
