import { motion } from 'framer-motion'
import './TextEffectsCharacterReveal.css'

export function TextEffectsCharacterReveal() {
  const text = 'ACHIEVEMENT'
  const subtitle = 'UNLOCKED'

  return (
    <div className="character-reveal-container" data-animation-id="text-effects__character-reveal">
      {/* Text container */}
      <div className="text-container">
        {/* Dark shadow text that appears first */}
        <motion.div
          className="shadow-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 0.2,
            duration: 0.6,
            ease: 'easeOut',
          }}
        >
          {text.split('').map((char, index) => (
            <motion.span
              key={`shadow-${index}`}
              className="shadow-char"
              initial={{
                opacity: 0,
                filter: 'blur(8px)',
              }}
              animate={{
                opacity: 1,
                filter: 'blur(4px)',
              }}
              transition={{
                duration: 0.3,
                delay: 0.3 + index * 0.03,
                ease: 'easeOut',
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.div>

        {/* Golden text that animates on top */}
        <motion.div
          className="text-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          {text.split('').map((char, index) => (
            <motion.span
              key={index}
              className="text-char"
              initial={{
                opacity: 0,
                y: 20,
                scale: 0,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: [0, 1.2, 1],
              }}
              transition={{
                duration: 0.4,
                delay: 0.6 + index * 0.05,
                ease: [0.25, 0.46, 0.45, 0.94] as const,
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Subtitle text */}
      <motion.div
        className="subtitle-text"
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: [0, 1],
          y: [10, 0],
        }}
        transition={{
          duration: 0.5,
          delay: 1.2,
          ease: 'easeOut',
        }}
      >
        {subtitle}
      </motion.div>
    </div>
  )
}
