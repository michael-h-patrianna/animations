import { memo } from 'react'
import './TextEffectsLevelBreakthrough.css'

/**
 * @param props.startText - Initial text before breakthrough
 * @param props.endText - Final text after breakthrough
 * @param props.className - Optional additional CSS class names
 */
interface TextEffectsLevelBreakthroughProps {
  startText?: string
  endText?: string
  className?: string
}

/**
 * Level breakthrough text effect with expanding surge rings and text transition.
 *
 * @param props - Component props
 * @param props.startText - Initial text shown before breakthrough (defaults to "LEVEL 1")
 * @param props.endText - Final text shown after breakthrough (defaults to "LEVEL 2")
 * @param props.className - Optional CSS class to merge with base styles
 *
 * @returns Animated breakthrough effect container with text transition
 *
 * @example
 * Basic usage with default text:
 * ```tsx
 * <TextEffectsLevelBreakthrough />
 * ```
 *
 * @example
 * Custom level transition:
 * ```tsx
 * <TextEffectsLevelBreakthrough
 *   startText="LEVEL 5"
 *   endText="LEVEL 6"
 * />
 * ```
 *
 * @example
 * Custom text with whitespace:
 * ```tsx
 * <TextEffectsLevelBreakthrough
 *   startText="STAGE 1"
 *   endText="STAGE 2"
 * />
 * ```
 *
 * @example
 * With custom styling:
 * ```tsx
 * <TextEffectsLevelBreakthrough
 *   startText="BRONZE"
 *   endText="SILVER"
 *   className="custom-size"
 * />
 * ```
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
        <div className="tfx-breakthrough-text tfx-breakthrough-text-start">
          {startText}
        </div>
        <div className="tfx-breakthrough-text tfx-breakthrough-text-end">
          {endText}
        </div>
      </div>
    </div>
  )
}

export const TextEffectsLevelBreakthrough = memo(TextEffectsLevelBreakthroughComponent)

