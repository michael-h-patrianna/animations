/**
 * Standalone: Copy this file into your app.
 * Runtime deps: react, motion
 * RN: Port variants/timing to Reanimated/Moti — transforms/opacity/color only.
 */

import * as m from 'motion/react-m'
import { easeInOut, easeOut, useReducedMotion, type Variants } from 'motion/react'
import { memo, useMemo } from 'react'

interface TextEffectsMetallicSpecularFlashProps {
  /** @default 'LOREM IPSUM DOLOR' */
  text?: string
  /** Base text color. Highlight and shadow are computed automatically. @default '#e8e4da' */
  color?: string
}

function TextEffectsMetallicSpecularFlashComponent({
  text = 'LOREM IPSUM DOLOR',
  color,
}: TextEffectsMetallicSpecularFlashProps) {
  const prefersReducedMotion = useReducedMotion()
  const letters = useMemo(() => Array.from(text), [text])

  const containerVariants: Variants = {
    hidden: { opacity: 0, scaleX: 0.995 },
    show: {
      opacity: 1,
      scaleX: 1,
      transition: {
        duration: 0.14,
        ease: easeOut,
        when: 'beforeChildren',
        staggerChildren: 0.02,
        delayChildren: 0.05,
      },
    },
    settle: {
      scale: [1, 1.01, 1],
      transition: { duration: 0.32, ease: [0.2, 0, 0, 1] as const, delay: 0.55 },
    },
  }

  const letterVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: [0, 1, 1, 1] as number[],
      color: [
        'var(--pf-msf-base-color)',
        'var(--pf-msf-highlight-color)',
        'var(--pf-msf-shadow-color)',
        'var(--pf-msf-base-color)',
      ] as string[],
      skewX: [0, 4, -1, 0] as number[],
      scaleX: [1, 1.08, 0.995, 1] as number[],
      transition: {
        duration: 0.42,
        ease: easeInOut,
        times: [0, 0.25, 0.55, 1],
      },
    },
  }

  return (
    <m.div
      data-animation-id="text-effects__metallic-specular-flash"
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
        ['--pf-msf-base-color' as string]: color ?? 'var(--pf-msf-base-color, #e8e4da)',
        ['--pf-msf-highlight-color' as string]: 'var(--pf-msf-highlight-color, #fff)',
      }}
    >
      <div style={{ display: 'inline-flex', gap: '0.02em' }} aria-hidden="true">
        {letters.map((ch, i) => (
          <m.span
            key={i}
            style={{
              display: 'inline-block',
              willChange: 'transform',
              color: 'var(--pf-msf-base-color)',
              fontWeight: 700,
              letterSpacing: '0.02em',
              transformOrigin: 'center',
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

export const TextEffectsMetallicSpecularFlash = memo(TextEffectsMetallicSpecularFlashComponent)
