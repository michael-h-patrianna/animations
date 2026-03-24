import { memo, useMemo } from 'react'
import './TextEffectsMetallicSpecularFlash.css'

interface TextEffectsMetallicSpecularFlashProps {
  /** @default 'LOREM IPSUM DOLOR' */
  text?: string
}

/**
 * Standalone: Copy this file + TextEffectsMetallicSpecularFlash.css into your app.
 * Runtime deps: react
 * RN: Not applicable (CSS keyframes). Use framer variant for RN portability.
 */
function TextEffectsMetallicSpecularFlashComponent({
  text = 'LOREM IPSUM DOLOR',
}: TextEffectsMetallicSpecularFlashProps) {
  const letters = useMemo(() => Array.from(text), [text])

  return (
    <div
      className="tfx-metallic-specular-flash"
      data-animation-id="text-effects__metallic-specular-flash"
      aria-label={text}
    >
      <div className="tfx-metallic-specular-flash__line" aria-hidden="true">
        {letters.map((ch, i) => (
          <span
            key={i}
            className="tfx-metallic-specular-flash__letter"
            style={{ animationDelay: `${0.05 + i * 0.02}s` }}
          >
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        ))}
      </div>
    </div>
  )
}

export const TextEffectsMetallicSpecularFlash = memo(TextEffectsMetallicSpecularFlashComponent)
