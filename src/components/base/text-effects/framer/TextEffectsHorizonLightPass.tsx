/**
 * Standalone: Copy this file + TextEffectsHorizonLightPass.css into your app.
 * Runtime deps: react, motion
 * RN: Port with Reanimated/Moti — transforms/opacity/color, custom delay per index.
 */

import * as m from 'motion/react-m'
import { easeInOut, easeOut, type Variants } from 'motion/react'
import { memo, useMemo } from 'react'

interface TextEffectsHorizonLightPassProps {
  /** @default 'LOREM IPSUM DOLOR' */
  text?: string
  /** Base text color. Highlight is always white. @default '#e8e4da' */
  color?: string
}

function TextEffectsHorizonLightPassComponent({
  text = 'LOREM IPSUM DOLOR',
  color,
}: TextEffectsHorizonLightPassProps) {
  const letters = useMemo(() => Array.from(text), [text])

  const containerVariants: Variants = {
    hidden: { opacity: 0, scaleY: 0.995 },
    show: {
      opacity: 1,
      scaleY: 1,
      transition: {
        duration: 0.16,
        ease: easeOut,
        when: 'beforeChildren',
        delayChildren: 0.04,
      },
    },
    settle: {
      scale: [1, 1.008, 1],
      transition: { duration: 0.28, ease: [0.2, 0, 0, 1] as const, delay: 0.85 },
    },
  }

  const letterVariants: Variants = {
    hidden: { opacity: 0 },
    show: (i: number) => {
      const delayPer = 0.03
      const count = letters.length
      const rtlIndex = count - 1 - i
      const delay = rtlIndex * delayPer
      return {
        opacity: [0, 1, 1, 1, 1] as number[],
        color: [
          'var(--pf-hlp-base-color)',
          'var(--pf-hlp-highlight-color)',
          'var(--pf-hlp-highlight-color)',
          'var(--pf-hlp-highlight-color)',
          'var(--pf-hlp-base-color)',
        ] as string[],
        scaleX: [1, 1.2, 1.22, 1.06, 1] as number[],
        scaleY: [1, 0.94, 0.96, 0.99, 1] as number[],
        transition: {
          duration: 1.25,
          ease: easeInOut,
          times: [0, 0.2, 0.55, 0.85, 1],
          delay,
        },
      }
    },
  }

  return (
    <m.div
      className="pf-horizon-light-fm"
      data-animation-id="text-effects__horizon-light-pass"
      aria-label={text}
      variants={containerVariants}
      initial="hidden"
      animate={['show', 'settle']}
      style={
        color !== undefined ? ({ '--pf-hlp-base-color': color } as React.CSSProperties) : undefined
      }
    >
      <div className="pf-horizon-light-fm__line" aria-hidden="true">
        {letters.map((ch, i) => (
          <m.span
            key={i}
            className="pf-horizon-light-fm__letter"
            variants={letterVariants}
            custom={i}
          >
            {ch === ' ' ? '\u00A0' : ch}
          </m.span>
        ))}
      </div>
    </m.div>
  )
}

export const TextEffectsHorizonLightPass = memo(TextEffectsHorizonLightPassComponent)
