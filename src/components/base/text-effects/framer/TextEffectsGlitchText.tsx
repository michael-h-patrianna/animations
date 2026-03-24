/**
 * Standalone: Copy this file + TextEffectsGlitchText.css into your app.
 * Runtime deps: react, motion
 * RN: Port RGB layers with Moti absolute-positioned MotiText views.
 */

import * as m from 'motion/react-m'
import { memo } from 'react'

interface TextEffectsGlitchTextProps {
  /** @default 'SYSTEM ERROR' */
  text?: string
  /** Alternative to text — allows JSX children. Takes precedence over text. */
  children?: React.ReactNode
  /** Additional CSS class for the container. */
  className?: string
  /** Base text color. @default '#ffffff' */
  color?: string
}

function TextEffectsGlitchTextComponent({
  text = 'SYSTEM ERROR',
  children,
  className = '',
  color,
}: TextEffectsGlitchTextProps) {
  const content = children ?? text

  return (
    <div
      className={`pf-glitch ${className}`.trim()}
      data-animation-id="text-effects__tfx-glitchtext"
      style={color !== undefined ? { '--pf-glitch-color-base': color } as React.CSSProperties : undefined}
    >
      {/* Main text */}
      <m.div
        className="pf-glitch__base"
        animate={{ x: [0, -2, 0, 2, 0, -1, 0, 1, 0], scaleX: [1, 1, 1.02, 1, 0.98, 1, 1.01, 1, 1] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 2,
          ease: 'linear' as const,
          times: [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 1],
        }}
      >
        {content}
      </m.div>

      {/* Cyan RGB offset layer */}
      <m.div
        className="pf-glitch__layer pf-glitch__layer--cyan"
        aria-hidden="true"
        animate={{
          x: [0, -1, 0, 1, 0],
          skewX: [0, 3, 0, -2, 0],
          opacity: [0.6, 0.8, 0.4, 0.7, 0.6],
        }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 2, ease: 'linear' as const }}
      >
        {content}
      </m.div>

      {/* Magenta RGB offset layer */}
      <m.div
        className="pf-glitch__layer pf-glitch__layer--magenta"
        aria-hidden="true"
        animate={{
          x: [0, 1, 0, -1, 0],
          skewX: [0, -2, 0, 3, 0],
          opacity: [0.6, 0.7, 0.5, 0.8, 0.6],
        }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 2, ease: 'linear' as const }}
      >
        {content}
      </m.div>

      {/* Distortion bars */}
      <m.div
        className="pf-glitch__bars"
        aria-hidden="true"
        animate={{ opacity: [0, 0.8, 0, 0.9, 0, 0.6, 0], scaleY: [1, 1.5, 1, 2, 1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 2, ease: 'linear' as const }}
      />
    </div>
  )
}

export const TextEffectsGlitchText = memo(TextEffectsGlitchTextComponent)
