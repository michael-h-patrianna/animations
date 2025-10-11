import type { AnimationMetadata } from '@/types/animation'
import { motion } from 'framer-motion'
import './TextEffectsWaveText.css'

const waveKeyframes = {
  y: [0, -20, 0, 5, 0, 0],
  scale: [1, 1.15, 1, 0.95, 1, 1],
  rotateZ: [0, -5, 0, 3, 0, 0]
}

const waveTimes = [0, 0.25, 0.5, 0.75, 1, 1]
const waveDuration = 2
const waveEase = 'linear'

const highlightKeyframes = {
  opacity: [0, 0.6, 0.3, 0, 0, 0],
  scaleY: [0.8, 1.2, 1, 0.9, 0.8, 0.8]
}

function WaveCharacter({ char, index }: { char: string; index: number }) {
  const isSpace = char === ' '
  const waveDelay = -(index * 0.05) // Negative delay to offset phase
  const wavePhase = index % 5

  return (
    <motion.span
      className={`wave-char wave-phase-${wavePhase}`}
      data-char={char}
      animate={waveKeyframes}
      transition={{
        duration: waveDuration,
        ease: waveEase,
        times: waveTimes,
        repeat: Infinity,
        repeatType: 'loop',
        delay: waveDelay
      }}
    >
      <span className="wave-char-inner">
        {isSpace ? '\u00A0' : char}

        {!isSpace && (
          <motion.span
            className="wave-highlight"
            animate={highlightKeyframes}
            transition={{
              duration: waveDuration,
              ease: waveEase,
              times: waveTimes,
              repeat: Infinity,
              repeatType: 'loop',
              delay: waveDelay
            }}
          />
        )}
      </span>
    </motion.span>
  )
}

export function TextEffectsWaveText() {
  const text = 'WAVE MOTION'

  return (
    <div className="wave-text-container" data-animation-id="text-effects__wave-text">
      <div className="wave-text-wrapper">
        {text.split('').map((char, index) => (
          <WaveCharacter key={index} char={char} index={index} />
        ))}
      </div>
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const metadata = {
  id: 'text-effects__wave-text',
  title: 'Wave Text',
  description: 'Smooth undulating wave motion through characters for fluid text animations.',
  tags: ['framer'],
  disableReplay: false
} satisfies AnimationMetadata
