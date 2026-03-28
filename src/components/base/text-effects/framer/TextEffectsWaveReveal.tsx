/**
 * Standalone: Copy this file + TextEffectsWaveReveal.css into your app.
 * Runtime deps: react, motion
 * RN: Port with Moti MotiView stagger + entering animation.
 */

import * as m from 'motion/react-m'
import { easeOut, useReducedMotion } from 'motion/react'
import type { Variants } from 'motion/react'
import { memo } from 'react'

interface TextEffectsWaveRevealProps {
  /** Text for the first line. @default 'Look at' */
  line1Text?: string
  /** Color for the first line (also tints its glow). @default 'var(--pf-anim-blue)' */
  line1Color?: string
  /** Text for the second line. @default 'these' */
  line2Text?: string
  /** Color for the second line (also tints its glow). @default 'var(--pf-anim-green)' */
  line2Color?: string
  /** Text for the third line. @default 'colors' */
  line3Text?: string
  /** Color for the third line (also tints its glow). @default 'var(--pf-anim-gold)' */
  line3Color?: string
  /** Delay between character reveals in seconds. @default 0.05 */
  charDelay?: number
  /** Delay between line animations in seconds. @default 0.4 */
  lineDelay?: number
  /** Initial delay before animation starts in seconds. @default 0.2 */
  initialDelay?: number
}

function TextEffectsWaveRevealComponent({
  line1Text = 'Look at',
  line1Color = 'var(--pf-anim-blue)',
  line2Text = 'these',
  line2Color = 'var(--pf-anim-green)',
  line3Text = 'colors',
  line3Color = 'var(--pf-anim-gold)',
  charDelay = 0.05,
  lineDelay = 0.4,
  initialDelay = 0.2,
}: TextEffectsWaveRevealProps) {
  const prefersReducedMotion = useReducedMotion()
  const lines = [
    { text: line1Text, color: line1Color },
    { text: line2Text, color: line2Color },
    { text: line3Text, color: line3Color },
  ]
  const containerVariants: Variants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: lineDelay,
        delayChildren: initialDelay,
      },
    },
  }

  const lineVariants: Variants = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { duration: 0.4, ease: easeOut },
        },
      }
    : {
        hidden: { opacity: 1 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: charDelay },
        },
      }

  const letterVariants: Variants = prefersReducedMotion
    ? {
        hidden: { opacity: 1 },
        visible: { opacity: 1 },
      }
    : {
        hidden: { opacity: 0, y: 80 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { type: 'tween', ease: easeOut, duration: 0.5 },
        },
      }

  return (
    <div className="pf-wave-reveal-fm" data-animation-id="text-effects__wave-reveal">
      <m.div
        className="pf-wave-reveal-fm__wrapper"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {lines.map((line, lineIndex) => (
          <m.div
            key={lineIndex}
            className="pf-wave-reveal-fm__line"
            style={{ color: line.color }}
            variants={lineVariants}
          >
            {line.text.split('').map((char, charIndex) => (
              <m.span
                key={`${lineIndex}-${charIndex}`}
                className="pf-wave-reveal-fm__char"
                variants={letterVariants}
              >
                {char === ' ' ? '\u00A0' : char}
              </m.span>
            ))}
          </m.div>
        ))}
      </m.div>
    </div>
  )
}

export const TextEffectsWaveReveal = memo(TextEffectsWaveRevealComponent)
