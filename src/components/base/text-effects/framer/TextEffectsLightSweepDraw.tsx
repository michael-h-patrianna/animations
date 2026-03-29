/**
 * Standalone: Copy this file + TextEffectsLightSweepDraw.module.css into your app.
 * Runtime deps: react, motion
 * RN: Port variants/timing to Reanimated/Moti — transforms/opacity/color only.
 */

import * as m from 'motion/react-m'
import { easeInOut, easeOut, type Variants } from 'motion/react'
import { memo, useMemo } from 'react'
import styles from './TextEffectsLightSweepDraw.module.css'

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
      className={styles['pf-light-sweep-draw-fm']}
      data-animation-id="text-effects__light-sweep-draw"
      aria-label={text}
      variants={containerVariants}
      initial="hidden"
      animate={['show', 'settle']}
      style={
        color !== undefined ? ({ '--pf-lsd-base-color': color } as React.CSSProperties) : undefined
      }
    >
      <div className={styles['pf-light-sweep-draw-fm__line']} aria-hidden="true">
        {letters.map((ch, i) => (
          <m.span
            key={i}
            className={styles['pf-light-sweep-draw-fm__letter']}
            variants={letterVariants}
          >
            {ch === ' ' ? '\u00A0' : ch}
          </m.span>
        ))}
      </div>
    </m.div>
  )
}

export const TextEffectsLightSweepDraw = memo(TextEffectsLightSweepDrawComponent)
