/**
 * Standalone: Copy this file + TextEffectsCharacterReveal.module.css into your app.
 * Runtime deps: react, motion
 * RN: Port shadow/main layers with Moti MotiView stacking + stagger.
 */

import * as m from 'motion/react-m'
import { easeOut, useReducedMotion } from 'motion/react'
import { memo, useMemo } from 'react'
import styles from './TextEffectsCharacterReveal.module.css'

interface TextEffectsCharacterRevealProps {
  /** Main text to reveal. @default 'ACHIEVEMENT' */
  text?: string
  /** Subtitle text below the main reveal. @default 'UNLOCKED' */
  subtitle?: string
  /** Base color for the metallic text gradient. Light/dark stops are computed. @default '#ffd700' */
  color?: string
  /** Subtitle text color. @default derived from color at 80% opacity */
  subtitleColor?: string
}

function TextEffectsCharacterRevealComponent({
  text = 'ACHIEVEMENT',
  subtitle = 'UNLOCKED',
  color,
  subtitleColor,
}: TextEffectsCharacterRevealProps) {
  const prefersReducedMotion = useReducedMotion()
  const chars = useMemo(() => Array.from(text), [text])

  return (
    <div
      className={styles['pf-char-reveal-fm']}
      data-animation-id="text-effects__character-reveal"
      style={
        {
          ...(color !== undefined ? { '--pf-char-reveal-color': color } : {}),
          ...(subtitleColor !== undefined
            ? { '--pf-char-reveal-subtitle-color': subtitleColor }
            : {}),
        } as React.CSSProperties
      }
    >
      <div className={styles['pf-char-reveal-fm__text-container']}>
        {/* Shadow text layer */}
        <m.div
          className={styles['pf-char-reveal-fm__shadow-text']}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={
            prefersReducedMotion ? { duration: 0.3 } : { delay: 0.2, duration: 0.6, ease: easeOut }
          }
        >
          {chars.map((char, index) => (
            <m.span
              key={`shadow-${index}`}
              className={styles['pf-char-reveal-fm__shadow-char']}
              initial={prefersReducedMotion ? { opacity: 0.5 } : { opacity: 0, scale: 0.8 }}
              animate={prefersReducedMotion ? { opacity: 0.5 } : { opacity: 0.5, scale: 1 }}
              transition={
                prefersReducedMotion
                  ? { duration: 0.1 }
                  : { duration: 0.3, delay: 0.3 + index * 0.03, ease: easeOut }
              }
            >
              {char}
            </m.span>
          ))}
        </m.div>

        {/* Main golden text */}
        <m.div
          className={styles['pf-char-reveal-fm__main-text']}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={
            prefersReducedMotion ? { duration: 0.3, delay: 0.1 } : { delay: 0.5, duration: 0.3 }
          }
        >
          {chars.map((char, index) => (
            <m.span
              key={index}
              className={styles['pf-char-reveal-fm__main-char']}
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0 }}
              animate={
                prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: [0, 1.2, 1] }
              }
              transition={
                prefersReducedMotion
                  ? { duration: 0.3, delay: 0.2 }
                  : {
                      duration: 0.4,
                      delay: 0.6 + index * 0.05,
                      ease: [0.25, 0.46, 0.45, 0.94] as const,
                    }
              }
            >
              <span className={styles['pf-char-reveal-fm__main-char-text']}>{char}</span>
              <span aria-hidden="true" className={styles['pf-char-reveal-fm__main-char-glow']}>
                {char}
              </span>
            </m.span>
          ))}
        </m.div>
      </div>

      {/* Subtitle */}
      <m.div
        className={styles['pf-char-reveal-fm__subtitle']}
        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
        animate={prefersReducedMotion ? { opacity: 1 } : { opacity: [0, 1], y: [10, 0] }}
        transition={
          prefersReducedMotion
            ? { duration: 0.3, delay: 0.4 }
            : { duration: 0.5, delay: 1.2, ease: easeOut }
        }
      >
        <span className={styles['pf-char-reveal-fm__subtitle-main']}>{subtitle}</span>
        <span aria-hidden="true" className={styles['pf-char-reveal-fm__subtitle-shadow']}>
          {subtitle}
        </span>
      </m.div>
    </div>
  )
}

export const TextEffectsCharacterReveal = memo(TextEffectsCharacterRevealComponent)
