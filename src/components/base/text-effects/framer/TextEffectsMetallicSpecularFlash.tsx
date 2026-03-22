/**
 * Standalone: Copy this file + TextEffectsMetallicSpecularFlash.css into your app.
 * Runtime deps: react, motion
 * RN: Port variants/timing to Reanimated/Moti — transforms/opacity/color only.
 */

import * as m from 'motion/react-m'
import { easeInOut, easeOut, type Variants } from 'motion/react'
import { memo, useMemo } from 'react'

interface TextEffectsMetallicSpecularFlashProps {
  /** @default 'LOREM IPSUM DOLOR' */
  text?: string
}

function TextEffectsMetallicSpecularFlashComponent({
  text = 'LOREM IPSUM DOLOR',
}: TextEffectsMetallicSpecularFlashProps) {
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
      className="pf-metallic-flash"
      data-animation-id="text-effects__metallic-specular-flash"
      aria-label={text}
      variants={containerVariants}
      initial="hidden"
      animate={['show', 'settle']}
    >
      <div className="pf-metallic-flash__line" aria-hidden="true">
        {letters.map((ch, i) => (
          <m.span key={i} className="pf-metallic-flash__letter" variants={letterVariants}>
            {ch === ' ' ? '\u00A0' : ch}
          </m.span>
        ))}
      </div>
    </m.div>
  )
}

export const TextEffectsMetallicSpecularFlash = memo(TextEffectsMetallicSpecularFlashComponent)
