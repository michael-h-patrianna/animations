/**
 * Standalone: Copy this file into your app.
 * Runtime deps: react, framer-motion
 * RN parity: Translates cleanly to Moti with MotiText and same animate/transition props.
 */
import React from 'react'
import { motion } from 'framer-motion'
import type { AnimationMetadata } from '@/types/animation'
import './TextEffectsVerbFall.css'

export function TextEffectsVerbFall() {
  const text = 'LOREM IPSUM DOLOR'
  const letters = React.useMemo(() => Array.from(text), [text])

  const STEP_DELAY = 0.05 // 50ms stagger per character

  return (
    <div className="verbFall" data-animation-id="text-effects__verb-falling" aria-label={text}>
      <div className="verbFall__line" aria-hidden="true">
        {letters.map((ch, i) => (
          <motion.span
            key={i}
            className="verbFall__char"
            initial={{ y: -12, scaleY: 0.96, opacity: 0.9 }}
            animate={{
              y: [-12, 0, 4, 0],
              scaleY: [0.96, 1.02, 0.98, 1],
              opacity: [0.9, 1, 1, 1]
            }}
            transition={{
              duration: 1.6,
              delay: i * STEP_DELAY,
              ease: 'easeInOut',
              times: [0, 0.3, 0.6, 1],
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
  id: 'text-effects__verb-falling',
  title: 'Falling',
  description: 'Letters drop and settle with a soft bounce.',
  tags: ['framer'],
  disableReplay: false
}

export default TextEffectsVerbFall
