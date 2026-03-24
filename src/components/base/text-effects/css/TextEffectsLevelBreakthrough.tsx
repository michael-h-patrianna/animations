import { memo } from 'react'
import './TextEffectsLevelBreakthrough.css'

interface TextEffectsLevelBreakthroughProps {
  /** Text shown before breakthrough. @default 'LEVEL 1' */
  startText?: string
  /** Text shown after breakthrough. @default 'LEVEL 2' */
  endText?: string
  /** Additional CSS class for the container. */
  className?: string
}

/**
 * Standalone: Copy this file + TextEffectsLevelBreakthrough.css into your app.
 * Runtime deps: react
 * RN: Not applicable (CSS keyframes). Use framer variant for RN portability.
 */
function TextEffectsLevelBreakthroughComponent({
  startText = 'LEVEL 1',
  endText = 'LEVEL 2',
  className = '',
}: TextEffectsLevelBreakthroughProps) {
  return (
    <div
      className={`tfx-breakthrough-container ${className}`.trim()}
      data-animation-id="text-effects__level-breakthrough"
    >
      <div className="tfx-breakthrough-surge tfx-breakthrough-surge-outer" />
      <div className="tfx-breakthrough-surge tfx-breakthrough-surge-inner" />
      <div className="tfx-breakthrough-text-wrapper">
        <div className="tfx-breakthrough-text tfx-breakthrough-text-start">{startText}</div>
        <div className="tfx-breakthrough-text tfx-breakthrough-text-end">{endText}</div>
      </div>
    </div>
  )
}

export const TextEffectsLevelBreakthrough = memo(TextEffectsLevelBreakthroughComponent)
