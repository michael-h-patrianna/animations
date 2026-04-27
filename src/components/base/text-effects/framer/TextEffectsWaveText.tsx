/**
 * Standalone: Copy this file + TextEffectsWaveText.module.css + SharedGraphemeSplitter.ts into your app.
 * Runtime deps: react, motion
 * RN: Port with Moti infinite loop on translateY/scale/rotate per character.
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, useMemo } from 'react'
import styles from './TextEffectsWaveText.module.css'
import { splitGraphemes } from '@/components/base/text-effects/SharedGraphemeSplitter'

const waveKeyframes = {
  y: [0, -20, 0, 5, 0, 0],
  scale: [1, 1.15, 1, 0.95, 1, 1],
  rotateZ: [0, -5, 0, 3, 0, 0],
}

const waveTimes = [0, 0.25, 0.5, 0.75, 1, 1]
const waveDuration = 2
const waveEase = 'linear'

const highlightKeyframes = {
  opacity: [0, 0.6, 0.3, 0, 0, 0],
  scaleY: [0.8, 1.2, 1, 0.9, 0.8, 0.8],
}

interface TextEffectsWaveTextProps {
  /** @default 'WAVE MOTION' */
  text?: string
  /** Delay between each character's wave cycle in seconds. @default 0.05 */
  charDelay?: number
  /** Show animated highlight effect on characters. @default true */
  showHighlight?: boolean
  /** Text color. @default '#3b82f6' */
  color?: string
}

function WaveCharacter({
  char,
  index,
  charDelay,
  showHighlight,
  reducedMotion,
}: {
  char: string
  index: number
  charDelay: number
  showHighlight: boolean
  reducedMotion: boolean
}) {
  const isSpace = char === ' '
  const waveDelay = -(index * charDelay)

  return (
    <m.span
      className={styles['pf-wave-text-fm__char']}
      data-char={char}
      animate={reducedMotion ? undefined : waveKeyframes}
      transition={
        reducedMotion
          ? undefined
          : {
              duration: waveDuration,
              ease: waveEase,
              times: waveTimes,
              repeat: Infinity,
              repeatType: 'loop',
              delay: waveDelay,
            }
      }
    >
      <span className={styles['pf-wave-text-fm__char-inner']}>
        {isSpace ? '\u00A0' : char}

        {showHighlight && !isSpace && !reducedMotion && (
          <m.span
            className={styles['pf-wave-text-fm__highlight']}
            animate={highlightKeyframes}
            transition={{
              duration: waveDuration,
              ease: waveEase,
              times: waveTimes,
              repeat: Infinity,
              repeatType: 'loop',
              delay: waveDelay,
            }}
          />
        )}
      </span>
    </m.span>
  )
}

function TextEffectsWaveTextComponent({
  text = 'WAVE MOTION',
  charDelay = 0.05,
  showHighlight = true,
  color,
}: TextEffectsWaveTextProps) {
  const prefersReducedMotion = useReducedMotion()
  const chars = useMemo(() => splitGraphemes(text), [text])

  return (
    <div
      className={styles['pf-wave-text-fm']}
      data-animation-id="text-effects__wave-text"
      style={
        color !== undefined ? ({ '--pf-wave-text-color': color } as React.CSSProperties) : undefined
      }
    >
      <div className={styles['pf-wave-text-fm__wrapper']}>
        {chars.map((char, index) => (
          <WaveCharacter
            key={index}
            char={char}
            index={index}
            charDelay={charDelay}
            showHighlight={showHighlight}
            reducedMotion={Boolean(prefersReducedMotion)}
          />
        ))}
      </div>
    </div>
  )
}

export const TextEffectsWaveText = memo(TextEffectsWaveTextComponent)
