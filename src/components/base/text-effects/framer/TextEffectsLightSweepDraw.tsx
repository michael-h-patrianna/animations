/**
 * Standalone: Copy this file into your app.
 * Runtime deps: react, motion
 * RN: Port variants/timing to Reanimated/Moti — transforms/opacity/color only.
 */

import * as m from 'motion/react-m'
import { easeInOut, easeOut, useReducedMotion, type Variants } from 'motion/react'
import { memo, useMemo } from 'react'

interface TextEffectsLightSweepDrawProps {
  /** @default 'LOREM IPSUM DOLOR' */
  text?: string
  /** Base text color. Highlight is always white. @default '#e8e4da' */
  color?: string
}

function TextEffectsLightSweepDrawComponent({
  text = 'LOREM IPSUM DOLOR',
  color,
}: TextEffectsLightSweepDrawProps) {
  const prefersReducedMotion = useReducedMotion()
  const letters = useMemo(() => Array.from(text), [text])

  const containerVariants: Variants = {
    hidden: { opacity: 0, scaleY: 0.98 },
    show: {
      opacity: 1,
      scaleY: 1,
      transition: {
        duration: 0.2,
        ease: easeOut,
        when: 'beforeChildren',
        staggerChildren: 0.04,
        delayChildren: 0.15,
      },
    },
    settle: {
      scale: [1, 1.02, 1],
      transition: { duration: 0.6, ease: [0.2, 0, 0, 1] as const, delay: 0.95 },
    },
  }

  const letterVariants: Variants = {
    hidden: { opacity: 0, y: 6 },
    show: {
      opacity: [0, 1, 1] as number[],
      y: [6, 0, 0] as number[],
      color: [
        'var(--pf-lsd-base-color)',
        'var(--pf-lsd-highlight-color)',
        'var(--pf-lsd-base-color)',
      ] as string[],
      skewX: [0, 1.5, 0] as number[],
      scale: [1, 1.04, 1] as number[],
      transition: {
        duration: 0.6,
        ease: easeInOut,
        times: [0, 0.45, 1],
      },
    },
  }

  return (
    <m.div
      data-animation-id="text-effects__light-sweep-draw"
      aria-label={text}
      variants={
        prefersReducedMotion
          ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.3 } } }
          : containerVariants
      }
      initial="hidden"
      animate={prefersReducedMotion ? 'show' : ['show', 'settle']}
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        ['--pf-lsd-base-color' as string]: color ?? 'var(--pf-lsd-base-color, #e8e4da)',
        ['--pf-lsd-highlight-color' as string]: 'var(--pf-lsd-highlight-color, #fff)',
      }}
    >
      <div style={{ display: 'inline-flex', gap: '0.02em' }} aria-hidden="true">
        {letters.map((ch, i) => (
          <m.span
            key={i}
            style={{
              display: 'inline-block',
              willChange: 'transform',
              color: 'var(--pf-lsd-base-color)',
              fontWeight: 700,
              letterSpacing: '0.02em',
            }}
            variants={
              prefersReducedMotion
                ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
                : letterVariants
            }
          >
            {ch === ' ' ? '\u00A0' : ch}
          </m.span>
        ))}
      </div>
    </m.div>
  )
}

export const TextEffectsLightSweepDraw = memo(TextEffectsLightSweepDrawComponent)
