import { memo, useMemo } from 'react'
import './TextEffectsLightSweepDraw.css'

interface TextEffectsLightSweepDrawProps {
  /** @default 'LOREM IPSUM DOLOR' */
  text?: string
  /** Base text color. Highlight is always white. @default '#e8e4da' */
  color?: string
}

/**
 * Standalone: Copy this file + TextEffectsLightSweepDraw.css into your app.
 * Runtime deps: react
 * RN: Not applicable (CSS keyframes). Use framer variant for RN portability.
 */
function TextEffectsLightSweepDrawComponent({
  text = 'LOREM IPSUM DOLOR',
  color,
}: TextEffectsLightSweepDrawProps) {
  const letters = useMemo(() => Array.from(text), [text])

  return (
    <div
      className="tfx-light-sweep-draw"
      data-animation-id="text-effects__light-sweep-draw"
      aria-label={text}
      style={color !== undefined ? { '--tfx-lsd-base-color': color } as React.CSSProperties : undefined}
    >
      <div className="tfx-light-sweep-draw__line" aria-hidden="true">
        {letters.map((ch, i) => (
          <span
            key={i}
            className="tfx-light-sweep-draw__letter"
            style={{ animationDelay: `${0.15 + i * 0.04}s` }}
          >
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        ))}
      </div>
    </div>
  )
}

export const TextEffectsLightSweepDraw = memo(TextEffectsLightSweepDrawComponent)
