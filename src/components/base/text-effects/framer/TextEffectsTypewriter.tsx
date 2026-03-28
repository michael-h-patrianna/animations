/**
 * Standalone: Copy this file into your app.
 * Runtime deps: react, motion
 * RN: Port cursor blink with Moti useAnimatedStyle infinite loop.
 */

import * as m from 'motion/react-m'
import { memo, useMemo } from 'react'

interface TextEffectsTypewriterProps {
  /** @default 'LOADING SYSTEM...' */
  text?: string
  /** Delay between each character appearance in seconds. @default 0.08 */
  charDelay?: number
  /** Cursor character shown after typing completes. @default '|' */
  cursor?: string
  /** Text and cursor color. @default '#10b981' */
  color?: string
}

function TextEffectsTypewriterComponent({
  text = 'LOADING SYSTEM...',
  charDelay = 0.08,
  cursor = '|',
  color,
}: TextEffectsTypewriterProps) {
  const chars = useMemo(() => text.split(''), [text])

  return (
    <div
      data-animation-id="text-effects__typewriter"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 80,
        padding: 20,
        ['--pf-typewriter-color' as string]: color ?? 'var(--pf-typewriter-color, #10b981)',
      }}
    >
      <div
        style={{
          fontSize: 20,
          fontWeight: 600,
          fontFamily: "'Courier New', monospace",
          letterSpacing: 1,
          color: 'var(--pf-typewriter-color)',
        }}
      >
        {chars.map((char, index) => (
          <m.span
            key={index}
            style={{ display: 'inline-block' }}
            initial={{ opacity: 0, display: 'none' }}
            animate={{ opacity: 1, display: 'inline-block' }}
            transition={{ duration: 0, delay: index * charDelay }}
          >
            {char === ' ' ? '\u00A0' : char}
          </m.span>
        ))}

        <m.span
          style={{ display: 'inline-block', fontWeight: 300, color: 'var(--pf-typewriter-color)' }}
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 1, 0, 0] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            times: [0, 0.5, 0.5, 1],
            ease: 'linear' as const,
            delay: chars.length * charDelay,
          }}
        >
          {cursor}
        </m.span>
      </div>
    </div>
  )
}

export const TextEffectsTypewriter = memo(TextEffectsTypewriterComponent)
