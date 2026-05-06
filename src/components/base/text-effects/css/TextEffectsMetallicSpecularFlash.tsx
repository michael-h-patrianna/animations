/**
 * CSS variant.
 * Reduced-motion note: catalog-only data-reduced-motion mirroring supplements
 * OS @media (prefers-reduced-motion) rules; consumers do not need to copy it.
 */
import { memo, useMemo } from 'react'
import styles from './TextEffectsMetallicSpecularFlash.module.css'
import { splitGraphemes } from '@/components/base/text-effects/SharedGraphemeSplitter'

interface TextEffectsMetallicSpecularFlashProps {
  /** @default 'LOREM IPSUM DOLOR' */
  text?: string
  /** Base text color. Highlight and shadow are computed automatically. @default '#e8e4da' */
  color?: string
}

/**
 * Standalone: Copy this file + TextEffectsMetallicSpecularFlash.module.css + SharedGraphemeSplitter.ts into your app.
 * Runtime deps: react
 * RN: Not applicable (CSS keyframes). Use framer variant for RN portability.
 */
function TextEffectsMetallicSpecularFlashComponent({
  text = 'LOREM IPSUM DOLOR',
  color,
}: TextEffectsMetallicSpecularFlashProps) {
  const letters = useMemo(() => splitGraphemes(text), [text])

  return (
    <div
      className={styles['pf-tfx-metallic-specular-flash']}
      data-animation-id="text-effects__metallic-specular-flash"
      aria-label={text}
      style={
        color !== undefined ? ({ '--tfx-msf-base-color': color } as React.CSSProperties) : undefined
      }
    >
      <div className={styles['pf-tfx-metallic-specular-flash__line']} aria-hidden="true">
        {letters.map((ch, i) => (
          <span
            key={i}
            className={styles['pf-tfx-metallic-specular-flash__letter']}
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
