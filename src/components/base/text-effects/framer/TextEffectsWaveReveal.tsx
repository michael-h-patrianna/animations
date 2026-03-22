/**
 * Standalone: Copy this file + TextEffectsWaveReveal.css into your app.
 * Runtime deps: react, motion
 * RN: Port with Moti MotiView stagger + entering animation.
 */

import * as m from 'motion/react-m'
import { easeOut, type Variants } from 'motion/react'
import { memo } from 'react'

interface TextLine {
  text: string
  color: string
}

interface TextEffectsWaveRevealProps {
  /** Array of text lines with colors. Each line animates sequentially. */
  lines?: TextLine[]
  /** Delay between character reveals in seconds. @default 0.05 */
  charDelay?: number
  /** Delay between line animations in seconds. @default 0.4 */
  lineDelay?: number
  /** Initial delay before animation starts in seconds. @default 0.2 */
  initialDelay?: number
}

function TextEffectsWaveRevealComponent({
  lines = [
    { text: 'Look at', color: 'var(--pf-anim-blue)' },
    { text: 'these', color: 'var(--pf-anim-green)' },
    { text: 'colors', color: 'var(--pf-anim-gold)' },
  ],
  charDelay = 0.05,
  lineDelay = 0.4,
  initialDelay = 0.2,
}: TextEffectsWaveRevealProps) {
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

  const lineVariants: Variants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: charDelay },
    },
  }

  const letterVariants: Variants = {
    hidden: { opacity: 0, y: 80 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'tween', ease: easeOut, duration: 0.5 },
    },
  }

  return (
    <div className="pf-wave-reveal" data-animation-id="text-effects__wave-reveal">
      <m.div
        className="pf-wave-reveal__wrapper"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {lines.map((line, lineIndex) => (
          <m.div
            key={lineIndex}
            className="pf-wave-reveal__line"
            style={{ color: line.color }}
            variants={lineVariants}
          >
            {line.text.split('').map((char, charIndex) => (
              <m.span
                key={`${lineIndex}-${charIndex}`}
                className="pf-wave-reveal__char"
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
