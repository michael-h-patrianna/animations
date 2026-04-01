/**
 * Floating number that pops in, drifts upward, and fades out — CSS variant.
 * Color is determined by the numeric value and configurable thresholds.
 *
 * Copy-paste files: this file + TextEffectsFloatingCombatText.module.css
 * Runtime deps: react
 * RN: Not applicable (CSS keyframes). Use framer variant for RN portability.
 */

import { memo, useMemo } from 'react'
import styles from './TextEffectsFloatingCombatText.module.css'

type ColorBand = 'positive-high' | 'positive' | 'negative' | 'negative-high'

interface TextEffectsFloatingCombatTextProps {
  /** Text to display (parsed as number for color band). @default '-42' */
  value?: string
  /** Color for values >= positiveHighLimit. */
  colorPositiveHigh?: string
  /** Color for values >= 0 (below positiveHighLimit). */
  colorPositive?: string
  /** Color for values < 0 (above -negativeHighLimit). */
  colorNegative?: string
  /** Color for values <= -negativeHighLimit. */
  colorNegativeHigh?: string
  /** Absolute value threshold for the positive-high band. @default 100 */
  positiveHighLimit?: number
  /** Absolute value threshold for the negative-high band. @default 100 */
  negativeHighLimit?: number
  /** Base font size in px. @default 24 */
  fontSize?: number
  /** How far the number floats upward in px. @default 60 */
  floatDistance?: number
  /** Total float + fade duration in ms. @default 800 */
  duration?: number
  /** Max horizontal drift range in px (randomized). @default 20 */
  spread?: number
  /** Font family. @default 'inherit' */
  fontFamily?: string
  /** Font weight. @default '700' */
  fontWeight?: string
  /** Fires after the animation completes (not supported in CSS variant — use framer). */
  onComplete?: () => void
}

function resolveColorBand(
  value: string,
  positiveHighLimit: number,
  negativeHighLimit: number
): ColorBand {
  const num = parseFloat(value)
  if (Number.isNaN(num) || num >= 0) {
    return num >= positiveHighLimit ? 'positive-high' : 'positive'
  }
  return num <= -negativeHighLimit ? 'negative-high' : 'negative'
}

function TextEffectsFloatingCombatTextComponent({
  value = '-42',
  colorPositiveHigh,
  colorPositive,
  colorNegative,
  colorNegativeHigh,
  positiveHighLimit = 100,
  negativeHighLimit = 100,
  fontSize = 24,
  floatDistance = 60,
  duration = 800,
  spread = 20,
  fontFamily = 'inherit',
  fontWeight = '700',
}: TextEffectsFloatingCombatTextProps) {
  const driftX = useMemo(() => (Math.random() - 0.5) * 2 * spread, [spread])

  const band = resolveColorBand(value, positiveHighLimit, negativeHighLimit)

  const colorMap: Record<ColorBand, string | undefined> = {
    'positive-high': colorPositiveHigh,
    positive: colorPositive,
    negative: colorNegative,
    'negative-high': colorNegativeHigh,
  }
  const overrideColor = colorMap[band]

  const isHigh = band === 'positive-high' || band === 'negative-high'
  const popScale = isHigh ? 1.3 : 1.1

  return (
    <div
      className={styles['tfx-combattext__container']}
      data-animation-id="text-effects__floating-combat-text"
      data-testid="combat-text"
      data-band={band}
      style={
        overrideColor !== undefined
          ? ({ '--tfx-combattext-color': overrideColor } as React.CSSProperties)
          : undefined
      }
    >
      <div
        className={styles['tfx-combattext__text']}
        data-testid="combat-text-value"
        style={
          {
            '--tfx-combattext-drift-x': `${driftX}px`,
            '--tfx-combattext-float-distance': `${floatDistance}px`,
            '--tfx-combattext-pop-scale': popScale,
            fontSize,
            fontWeight,
            fontFamily,
            animationDuration: `${duration}ms`,
          } as React.CSSProperties
        }
        aria-live="polite"
      >
        {value}
      </div>
    </div>
  )
}

export const TextEffectsFloatingCombatText = memo(TextEffectsFloatingCombatTextComponent)
