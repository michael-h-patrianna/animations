/**
 * Standalone: Copy this file and TextEffectsLightSweepDraw.css into your app.
 * Runtime deps: react, framer-motion
 * No shared utils; all helpers are inlined here.
 * RN parity: transforms/opacity/color only; port the variants/timing to Reanimated/Moti.
 */
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import React from 'react'
import './TextEffectsLightSweepDraw.css'

export function TextEffectsLightSweepDraw() {
  const text = 'LOREM IPSUM DOLOR'
  const shouldReduceMotion = useReducedMotion()

  // Simple grapheme split that is SSR-safe for most Latin text.
  const letters = React.useMemo(() => Array.from(text), [text])

  // Container variants handle anticipation and final settle.
  const containerVariants: Variants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { duration: 0.2 },
        },
        settle: {
          opacity: 1,
          transition: { duration: 0.001 },
        },
      }
    : {
        hidden: { opacity: 0, scaleY: 0.98 },
        show: {
          opacity: 1,
          scaleY: 1,
          transition: {
            duration: 0.2,
            ease: 'easeOut',
            when: 'beforeChildren',
            // Stagger drives the left→right “sweep” feel.
            staggerChildren: 0.04,
            delayChildren: 0.15,
          },
        },
        settle: {
          scale: [1, 1.02, 1],
          transition: { duration: 0.6, ease: [0.2, 0, 0, 1], delay: 0.95 },
        },
      }

  // Per-letter highlight: brief color lift + subtle skew/scale, then return to base.
  const letterVariants: Variants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.2 } },
      }
    : {
        hidden: { opacity: 0, y: 6 },
        show: {
          opacity: [0, 1, 1] as number[],
          y: [6, 0, 0] as number[],
          // Use CSS vars for colors for easy theming; animate the color inline.
          color: [
            'var(--lsd-baseColor)',
            'var(--lsd-highlightColor)',
            'var(--lsd-baseColor)',
          ] as string[],
          skewX: [0, 1.5, 0] as number[],
          scale: [1, 1.04, 1] as number[],
          transition: {
            duration: 0.6,
            ease: 'easeInOut',
            times: [0, 0.45, 1],
          },
        },
      }

  return (
    <motion.div
      className="studioLogo-LightSweepDraw"
      data-animation-id="text-effects__light-sweep-draw"
      aria-label={text}
      variants={containerVariants}
      initial="hidden"
      animate={shouldReduceMotion ? 'show' : ['show', 'settle']}
    >
      <div className="studioLogo-LightSweepDraw__line" aria-hidden="true">
        {letters.map((ch, i) => (
          <motion.span
            key={i}
            className="studioLogo-LightSweepDraw__letter"
            variants={letterVariants}
          >
            {ch === ' ' ? '\u00A0' : ch}
          </motion.span>
        ))}
      </div>
    </motion.div>
  )
}

export default TextEffectsLightSweepDraw
