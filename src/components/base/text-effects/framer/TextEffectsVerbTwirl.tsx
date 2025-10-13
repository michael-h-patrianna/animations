/**
 * Standalone: Copy this file into your app.
 * Runtime deps: react, framer-motion
 * RN parity: Translates cleanly to Moti with MotiText and same animate/transition props.
 */

import { easeInOut, motion } from 'framer-motion'
import React from 'react'
import './TextEffectsVerbTwirl.css'
import '../shared.css'

export function TextEffectsVerbTwirl() {
  const text = 'LOREM IPSUM DOLOR'
  const letters = React.useMemo(() => Array.from(text), [text])

  return (
    <div className="verbTwirl" data-animation-id="text-effects__verb-twirling" aria-label={text}>
      <div className="verbTwirl__line" aria-hidden="true">
        {letters.map((ch, i) => (
          <motion.span
            key={i}
            className="verbTwirl__char"
            initial={{ rotate: 0, scale: 1 }}
            animate={{
              rotate: [0, 90, 180, 270, 360],
              scale: [1, 1.05, 1, 0.98, 1]
            }}
            transition={{
              duration: 1.8,
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



export default TextEffectsVerbTwirl
