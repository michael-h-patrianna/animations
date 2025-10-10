/**
 * Standalone: Copy this file into your app.
 * Runtime deps: react, framer-motion
 * RN parity: Translates cleanly to Moti with MotiText and same animate/transition props.
 */
import type { AnimationMetadata } from '@/types/animation'
import { easeInOut, motion } from 'framer-motion'
import React from 'react'
import './TextEffectsVerbJog.css'

export function TextEffectsVerbJog() {
  const text = 'LOREM IPSUM DOLOR'
  const letters = React.useMemo(() => Array.from(text), [text])

  return (
    <div className="verbJog" data-animation-id="text-effects__verb-jogging" aria-label={text}>
      <div className="verbJog__line" aria-hidden="true">
        {letters.map((ch, i) => (
          <motion.span
            key={i}
            className="verbJog__char"
            initial={{ y: 0, rotate: 0 }}
            animate={{
              y: [0, -6, 0, -2, 0],
              rotate: [0, -4, 2, -2, 0]
            }}
            transition={{
              duration: 1.2,
              delay: i % 2 === 0 ? 0.15 : 0, // even indices get delay (alternating legs)
              ease: easeInOut,
              times: [0, 0.2, 0.4, 0.6, 1],
            }}
          >
            {ch === ' ' ? '\u00A0' : ch}
          </motion.span>
        ))}
      </div>
    </div>
  )
}

export const metadata: AnimationMetadata = {
  id: 'text-effects__verb-jogging',
  title: 'Jogging',
  description: 'Energetic jog rhythm alternating between letters.',
  tags: ['framer'],
  disableReplay: false
}

export default TextEffectsVerbJog
