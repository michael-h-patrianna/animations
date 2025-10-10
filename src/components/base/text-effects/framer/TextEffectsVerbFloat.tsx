/**
 * Standalone: Copy this file into your app.
 * Runtime deps: react, framer-motion
 * RN parity: Translates cleanly to Moti with MotiText and same animate/transition props.
 */
import type { AnimationMetadata } from '@/types/animation'
import { easeInOut, motion } from 'framer-motion'
import React from 'react'
import './TextEffectsVerbFloat.css'

export function TextEffectsVerbFloat() {
  const text = 'LOREM IPSUM DOLOR'
  const letters = React.useMemo(() => Array.from(text), [text])

  return (
    <div className="verbFloat" data-animation-id="text-effects__verb-floating" aria-label={text}>
      <div className="verbFloat__line" aria-hidden="true">
        {letters.map((ch, i) => (
          <motion.span
            key={i}
            className="verbFloat__char"
            initial={{ y: 0, opacity: 1 }}
            animate={{
              y: [0, -6, 0, 4, 0],
              opacity: [1, 1, 0.95, 1, 1]
            }}
            transition={{
              duration: 3,
              delay: i % 2 === 1 ? 0.15 : 0, // odd indices get delay
              ease: easeInOut,
              times: [0, 0.25, 0.5, 0.75, 1],
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
  id: 'text-effects__verb-floating',
  title: 'Floating',
  description: 'Gentle float up/down across letters with offset phases.',
  tags: ['framer'],
  disableReplay: false
}

export default TextEffectsVerbFloat
