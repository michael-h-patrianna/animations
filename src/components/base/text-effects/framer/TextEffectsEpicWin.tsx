/**
 * Standalone: Copy this file + TextEffectsEpicWin.module.css + SharedGraphemeSplitter.ts into your app.
 * Runtime deps: react, motion
 * RN: Port shadow layers + per-char entrance with Moti MotiView stacking.
 */

import * as m from 'motion/react-m'
import { easeOut, useReducedMotion } from 'motion/react'
import { memo, useMemo } from 'react'
import styles from './TextEffectsEpicWin.module.css'
import { splitGraphemes } from '@/components/base/text-effects/SharedGraphemeSplitter'

interface TextEffectsEpicWinProps {
  /** @default 'EPIC WIN' */
  text?: string
  /** Base color for the metallic gradient. Light/dark stops are computed. @default '#ffd700' */
  color?: string
}

function TextEffectsEpicWinComponent({ text = 'EPIC WIN', color }: TextEffectsEpicWinProps) {
  const prefersReducedMotion = useReducedMotion()
  const chars = useMemo(() => splitGraphemes(text), [text])

  return (
    <div
      className={styles['pf-epic-win-fm']}
      data-animation-id="text-effects__epic-win"
      data-testid="epic-win"
      style={
        color !== undefined ? ({ '--pf-epic-win-color': color } as React.CSSProperties) : undefined
      }
    >
      <div className={styles['pf-epic-win-fm__text-container']}>
        {/* Far shadow */}
        <m.div
          className={styles['pf-epic-win-fm__shadow-far']}
          data-testid="shadow-far"
          initial={
            prefersReducedMotion ? { opacity: 0.2, y: 6 } : { opacity: 0, scale: 1.2, y: 10 }
          }
          animate={prefersReducedMotion ? { opacity: 0.2, y: 6 } : { opacity: 0.2, scale: 1, y: 6 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }
          }
        >
          {text}
        </m.div>

        {/* Mid shadow */}
        <m.div
          className={styles['pf-epic-win-fm__shadow-mid']}
          data-testid="shadow-mid"
          initial={prefersReducedMotion ? { opacity: 0.3, y: 3 } : { opacity: 0, scale: 1.1, y: 5 }}
          animate={prefersReducedMotion ? { opacity: 0.3, y: 3 } : { opacity: 0.3, scale: 1, y: 3 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.45, delay: 0.05, ease: [0.25, 0.46, 0.45, 0.94] as const }
          }
        >
          {text}
        </m.div>

        {/* Main metallic text */}
        <m.div
          className={styles['pf-epic-win-fm__main-text']}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: prefersReducedMotion ? 0.3 : 0.2 }}
        >
          {chars.map((char, index) => (
            <m.span
              key={index}
              className={styles['pf-epic-win-fm__char']}
              data-testid="epic-char"
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 30, scale: 0.5, rotateY: -90 }
              }
              animate={
                prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1, rotateY: 0 }
              }
              transition={
                prefersReducedMotion
                  ? { duration: 0.3, delay: 0.1 }
                  : {
                      duration: 0.6,
                      delay: 0.1 + index * 0.04,
                      ease: [0.25, 0.46, 0.45, 0.94] as const,
                    }
              }
            >
              <m.span className={styles['pf-epic-win-fm__char-inner']}>
                <span className={styles['pf-epic-win-fm__char-text']}>
                  {char === ' ' ? '\xA0' : char}
                </span>
                <span aria-hidden="true" className={styles['pf-epic-win-fm__char-highlight']}>
                  {char === ' ' ? '\xA0' : char}
                </span>
                <span aria-hidden="true" className={styles['pf-epic-win-fm__char-shadow']}>
                  {char === ' ' ? '\xA0' : char}
                </span>

                {!prefersReducedMotion && (
                  <m.span
                    className={styles['pf-epic-win-fm__char-glow']}
                    data-testid="epic-char-glow"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: [0, 1, 0], scale: [0.8, 1.4, 1] }}
                    transition={{
                      duration: 0.6,
                      delay: 0.5 + index * 0.04,
                      times: [0, 0.3, 1],
                      ease: easeOut,
                    }}
                  />
                )}
              </m.span>
            </m.span>
          ))}
        </m.div>
      </div>
    </div>
  )
}

export const TextEffectsEpicWin = memo(TextEffectsEpicWinComponent)
